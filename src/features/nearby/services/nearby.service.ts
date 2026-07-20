import type { NearbyPlace, NearbyResult, PlaceCategory } from '../types';

const NOMINATIM = 'https://nominatim.openstreetmap.org';
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];
const RADIUS_M   = 5000;
const MAX_RESULTS = 500;

async function geocode(query: string): Promise<{ lat: number; lon: number; displayName: string }> {
  const params = new URLSearchParams({ q: query, format: 'json', limit: '1' });
  const res = await fetch(`${NOMINATIM}/search?${params}`, {
    headers: {
      'Accept-Language': 'en',
      'User-Agent': 'TravelPlanner/1.0',
    },
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
  const R    = 6371000;
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
  if (
    amenity === 'restaurant' || amenity === 'cafe' || amenity === 'fast_food' ||
    amenity === 'bar' || amenity === 'pub' || amenity === 'food_court' || amenity === 'ice_cream'
  ) return 'restaurants';
  if (
    tourism === 'hotel' || tourism === 'hostel' || tourism === 'motel' ||
    tourism === 'guest_house' || amenity === 'hotel'
  ) return 'hotels';
  if (amenity === 'hospital' || amenity === 'clinic') return 'hospitals';
  if (amenity === 'atm' || amenity === 'bank') return 'atms';
  if (amenity === 'fuel') return 'fuel';
  if (
    tourism === 'attraction' || tourism === 'museum' || tourism === 'artwork' ||
    tourism === 'viewpoint' || tourism === 'theme_park' || tourism === 'zoo'
  ) return 'attractions';
  if (amenity === 'pharmacy' || amenity === 'chemist') return 'pharmacies';
  return null;
}

// Requiring ["name"] in the query ensures only named places are returned,
// preventing unnamed OSM ways from exhausting the result limit.
function buildQuery(lat: number, lon: number): string {
  const around    = `(around:${RADIUS_M},${lat},${lon})`;
  const amenities = '"amenity"~"restaurant|cafe|fast_food|bar|pub|food_court|hospital|clinic|atm|bank|fuel|pharmacy"';
  const tourisms  = '"tourism"~"hotel|hostel|motel|guest_house|attraction|museum|artwork|viewpoint|theme_park|zoo"';
  return `
[out:json][timeout:60];
(
  node[${amenities}]["name"]${around};
  node[${tourisms}]["name"]${around};
  node["amenity"="hotel"]["name"]${around};
  way[${amenities}]["name"]${around};
  way[${tourisms}]["name"]${around};
);
out center ${MAX_RESULTS};
  `.trim();
}

interface OverpassElement {
  type:    'node' | 'way' | 'relation';
  id:      number;
  lat?:    number;
  lon?:    number;
  center?: { lat: number; lon: number };
  tags?:   Record<string, string>;
}

async function fetchFromOverpass(query: string): Promise<{ elements: OverpassElement[] }> {
  let lastError: Error = new Error('Overpass query failed');
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(`${endpoint}?data=${encodeURIComponent(query)}`);
      if (res.ok) {
        return await res.json() as { elements: OverpassElement[] };
      }
      const text = await res.text().catch(() => '');
      lastError = new Error(`Overpass error ${res.status}${text ? ': ' + text.slice(0, 100) : ''}`);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Network error');
    }
  }
  throw lastError;
}

export async function fetchNearbyPlaces(destination: string): Promise<NearbyResult> {
  const geo   = await geocode(destination);
  const query = buildQuery(geo.lat, geo.lon);
  const data  = await fetchFromOverpass(query);

  const seen   = new Set<string>();
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
