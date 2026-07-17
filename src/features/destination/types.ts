export interface CountryInfo {
  name:         string;
  officialName: string;
  flagUrl:      string;
  capital:      string;
  region:       string;
  subregion:    string;
  population:   number;
  area:         number;
  languages:    string[];
  currencies:   { code: string; name: string; symbol: string }[];
  timezones:    string[];
  callingCode:  string;
  borders:      string[];
}

export interface WikiInfo {
  title:        string;
  extract:      string;
  thumbnailUrl: string | null;
  wikiUrl:      string;
}

export interface DestinationData {
  query:       string;
  country:     CountryInfo | null;
  wiki:        WikiInfo | null;
  attractions: WikiInfo | null;
}
