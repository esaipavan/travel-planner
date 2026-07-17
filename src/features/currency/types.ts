export type CurrencyMap = Record<string, string>;

export interface ExchangeRate {
  from:      string;
  to:        string;
  rate:      number;
  updatedAt: string;
}
