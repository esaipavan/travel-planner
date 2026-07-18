import type { NearbyPlace, NearbyResult, PlaceCategory } from '../types';

const NOMINATIM = 'https://nominatim.openstreetmap.org';
const OVERPASS  = 'https://overpass-api.de/api/interpreter';
const RADIUS_M  = 3000;
const MAX_RESULTS = 300;

async function geocode(query: string): Promise<{ lat: number; lon: number; displayName: string }> {
  const params = new URLSearchParams({ q: query, format: 'json', limit: '1' });
  const res = await fetch(`${NOMINATIM}/search?${params}`, {
    headers: { 'Accept-Language': 'en' },
  });
  if (!res.ok) throw new Error('Geocoding request failed');
  const results = await res.json() as Array<{ lat: string; lon: string; display_name: string }>;
  if (!results.length) throw new Error(`No location found for "${query}"`);
  return {
    lat:         parseFloat(results[0].lat),
    lon:         parseFloat(results[0].lon),
    displayName: results[0].display_name,
  };
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R    = 6371000; // metres
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildAddress(tags: Record<string, string>): string {
  if (tags['addr:full']) return tags['addr:full'];
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:suburb'],
    tags['addr:city'],
  ].filter(Boolean);
  return parts.join(', ');
}

function resolveCategory(tags: Record<string, string>): PlaceCategory | null {
  const amenity = tags['amenity'];
  const tourism = tags['tourism'];
  if (amenity === 'restaurant' || amenity === 'cafe' || amenity === 'fast_food') return 'restaurants';
  if (tourism === 'hotel' || tourism === 'hostel' || tourism === 'guest_house' || amenity === 'hotel') return 'hotels';
  if (amenity === 'hospital' || amenity === 'clinic') return 'hospitals';
  if (amenity === 'atm' || amenity === 'bank') return 'atms';
  if (amenity === 'fuel') return 'fuel';
  if (tourism === 'attraction' || tourism === 'museum' || tourism === 'artwork' || tourism === 'viewpoint') return 'attractions';
  if (amenity === 'pharmacy' || amenity === 'chemist') return 'pharmacies';
  return null;
}

function buildQuery(lat: number, lon: number): string {
  const around = `(around:${RADIUS_M},${lat},${lon})`;
  const amenities = '"amenity"~"restaurant|cafe|fast_food|hospital|clinic|atm|bank|fuel|pharmacy"';
  const tourisms  = '"tourism"~"hotel|hostel|guest_house|attraction|museum|artwork|viewpoint"';
  return `
[out:json][timeout:30];
(
  node[${amenities}]${around};
  node[${tourisms}]${around};
  node["amenity"="hotel"]${around};
  way[${amenities}]${around};
  way[${tourisms}]${around};
);
out center ${MAX_RESULTS};
  `.trim();
}

interface OverpassElement {
  type:   'node' | 'way' | 'relation';
  id:     number;
  lat?:   number;
  lon?:   number;
  center?: { lat: number; lon: number };
  tags?:  Record<string, string>;
}

export async function fetchNearbyPlaces(destination: string): Promise<NearbyResult> {
  const geo = await geocode(destination);

  const query = buildQuery(geo.lat, geo.lon);
  const body  = new URLSearchParams({ data: query });

  const res = await fetch(OVERPASS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    body.toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Overpass API error ${res.status}${text ? ': ' + text.slice(0, 120) : ''}`);
  }

  const data = await res.json() as { elements: OverpassElement[] };

  const seen = new Set<string>();
  const places: NearbyPlace[] = [];

  for (const el of data.elements) {
    const tags = el.tags ?? {};
    const name = tags['name'];
    if (!name) continue;

    const category = resolveCategory(tags);
    if (!category) continue;

    const lat = el.type === 'node' ? el.lat : el.center?.lat;
    const lon = el.type === 'node' ? el.lon : el.center?.lon;
    if (lat == null || lon == null) continue;

    const key = `${name}|${lat.toFixed(4)}|${lon.toFixed(4)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    places.push({
      id:       `${el.type}-${el.id}`,
      name,
      address:  buildAddress(tags),
      category,
      lat,
      lon,
      distance: Math.round(haversine(geo.lat, geo.lon, lat, lon)),
    });
  }

  places.sort((a, b) => a.distance - b.distance);

  return {
    location: geo.displayName,
    lat:      geo.lat,
    lon:      geo.lon,
    places,
  };
}
