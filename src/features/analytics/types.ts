export interface AnalyticsFilters {
  dateFrom: string;
  dateTo:   string;
  tripId:   string;
  country:  string;
}

export const DEFAULT_ANALYTICS_FILTERS: AnalyticsFilters = {
  dateFrom: '',
  dateTo:   '',
  tripId:   '',
  country:  '',
};
