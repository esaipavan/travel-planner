import type { NearbyPlace, NearbyResult, PlaceCategory } from '../types';

const NOMINATIM   = 'https://nominatim.openstreetmap.org';
const GEOAPIFY    = 'https://api.geoapify.com/v2/places';
const RADIUS_M    = 5_000;
const MAX_RESULTS = 200;

// Valid Geoapify category strings — verified against https://apidocs.geoapify.com/docs/places/#categories
const ALL_CATEGORIES = [
  'catering.restaurant',
  'catering.fast_food',
  'catering.cafe',
  'catering.bar',
  'catering.pub',
  'accommodation.hotel',
  'accommodation.hostel',
  'accommodation.motel',
  'accommodation.guest_house',
  'healthcare.hospital',
  'healthcare.clinic_or_praxis',
  'healthcare.pharmacy',
  'service.financial.atm',
  'service.financial.bank',
  'service.vehicle.fuel',
  'tourism.attraction',
  'tourism.sights',
  'entertainment.museum',
  'entertainment.zoo',
  'entertainment.theme_park',
  'leisure.park',
].join(',');

// Prefix-ordered: more-specific prefixes before parents
const CATEGORY_MAP: Array<{ prefix: string; category: PlaceCategory }> = [
  { prefix: 'healthcare.hospital',        category: 'hospitals'   },
  { prefix: 'healthcare.clinic_or_praxis',category: 'hospitals'   },
  { prefix: 'healthcare.pharmacy',        category: 'pharmacies'  },
  { prefix: 'service.financial.atm',      category: 'atms'        },
  { prefix: 'service.financial.bank',     category: 'atms'        },
  { prefix: 'service.vehicle.fuel',       category: 'fuel'        },
  { prefix: 'catering',                   category: 'restaurants' },
  { prefix: 'accommodation',              category: 'hotels'      },
  { prefix: 'tourism',                    category: 'attractions' },
  { prefix: 'entertainment',              category: 'attractions' },
  { prefix: 'leisure.park',              category: 'attractions' },
];

function resolveCategory(categories: string[]): PlaceCategory | null {
  for (const cat of categories) {
    for (const { prefix, category } of CATEGORY_MAP) {
      if (cat.startsWith(prefix)) return category;
    }
  }
  return null;
}

// Dev assertion: every requested category must map to a PlaceCategory
if (import.meta.env.DEV) {
  const unmapped = ALL_CATEGORIES.split(',').filter(c => resolveCategory([c]) === null);
  if (unmapped.length > 0) {
    console.warn('[nearby] Categories requested but not in CATEGORY_MAP (results will be silently dropped):', unmapped);
  }
}

async function geocode(query: string): Promise<{ lat: number; lon: number; displayName: string }> {
  const params = new URLSearchParams({ q: query, format: 'json', limit: '1' });
  const res = await fetch(`${NOMINATIM}/search?${params}`, {
    headers: { 'Accept-Language': 'en', 'User-Agent': 'TravelPlanner/1.0' },
  });
  if (!res.ok) throw new Error('Geocoding request failed');
  const results = (await res.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
  }>;
  if (!results.length) throw new Error(`No location found for "${query}"`);
  return {
    lat:         parseFloat(results[0].lat),
    lon:         parseFloat(results[0].lon),
    displayName: results[0].display_name,
  };
}

interface GeoapifyFeature {
  properties: {
    place_id?: string;
    name?: string;
    address_line1?: string;
    address_line2?: string;
    categories?: string[];
    distance?: number;
    lat?: number;
    lon?: number;
  };
  geometry: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
}

interface GeoapifyResponse {
  features: GeoapifyFeature[];
}

async function fetchGeoapifyPlaces(lat: number, lon: number): Promise<GeoapifyResponse> {
  const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error('Nearby Places service is unavailable. Please try again later.');
  }

  const params = new URLSearchParams({
    categories: ALL_CATEGORIES,
    filter:     `circle:${lon},${lat},${RADIUS_M}`,
    limit:      String(MAX_RESULTS),
    apiKey,
  });

  if (import.meta.env.DEV) {
    console.debug('[nearby] Geoapify request:', `${GEOAPIFY}?${params.toString()}`);
  }

  const res = await fetch(`${GEOAPIFY}?${params}`);
  if (!res.ok) {
    throw new Error(`Places API error ${res.status}. Please try again.`);
  }
  return res.json() as Promise<GeoapifyResponse>;
}

export async function fetchNearbyPlaces(destination: string): Promise<NearbyResult> {
  const geo  = await geocode(destination);
  const data = await fetchGeoapifyPlaces(geo.lat, geo.lon);

  const seen   = new Set<string>();
  const places: NearbyPlace[] = [];

  for (const feature of data.features) {
    const p    = feature.properties;
    const name = p.name?.trim();
    if (!name) continue;

    const category = resolveCategory(p.categories ?? []);
    if (!category) continue;

    // Prefer property lat/lon; fall back to GeoJSON geometry (coordinates are [lon, lat])
    const lat = p.lat ?? feature.geometry.coordinates[1];
    const lon = p.lon ?? feature.geometry.coordinates[0];
    if (!lat || !lon) continue;

    const key = `${name}|${lat.toFixed(4)}|${lon.toFixed(4)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const address = [p.address_line1, p.address_line2].filter(Boolean).join(', ');

    places.push({
      id:       p.place_id ?? key,
      name,
      address,
      category,
      lat,
      lon,
      distance: Math.round(p.distance ?? 0),
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
