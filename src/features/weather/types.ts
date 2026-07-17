export interface GeoLocation {
  lat:         number;
  lon:         number;
  displayName: string;
}

export interface CurrentWeather {
  temperature:  number;
  feelsLike:    number;
  weathercode:  number;
  windspeed:    number;
  humidity:     number;
  uvIndex:      number;
  sunrise:      string;
  sunset:       string;
  isDay:        boolean;
}

export interface ForecastDay {
  date:                string;
  weathercode:         number;
  tempMax:             number;
  tempMin:             number;
  uvIndexMax:          number;
  precipProbabilityMax: number;
  sunrise:             string;
  sunset:              string;
}

export interface WeatherResult {
  location: GeoLocation;
  current:  CurrentWeather;
  forecast: ForecastDay[];
}
