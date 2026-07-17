export type PlaceCategory =
  | 'restaurants'
  | 'hotels'
  | 'hospitals'
  | 'atms'
  | 'fuel'
  | 'attractions'
  | 'pharmacies';

export const PLACE_CATEGORIES: {
  value: PlaceCategory;
  label: string;
  emoji: string;
}[] = [
  { value: 'restaurants',  label: 'Restaurants',        emoji: '🍽️' },
  { value: 'hotels',       label: 'Hotels',             emoji: '🏨' },
  { value: 'hospitals',    label: 'Hospitals',          emoji: '🏥' },
  { value: 'atms',         label: 'ATMs',               emoji: '🏧' },
  { value: 'fuel',         label: 'Fuel Stations',      emoji: '⛽' },
  { value: 'attractions',  label: 'Attractions',        emoji: '🎯' },
  { value: 'pharmacies',   label: 'Pharmacies',         emoji: '💊' },
];

export interface NearbyPlace {
  id:       string;
  name:     string;
  address:  string;
  category: PlaceCategory;
  lat:      number;
  lon:      number;
  distance: number;
}

export interface NearbyResult {
  location:    string;
  lat:         number;
  lon:         number;
  places:      NearbyPlace[];
}
