import type { CurrencyMap, ExchangeRate } from '../types';

const BASE = 'https://api.frankfurter.dev/v1';

export async function fetchCurrencies(): Promise<CurrencyMap> {
  const res = await fetch(`${BASE}/currencies`);
  if (!res.ok) throw new Error('Failed to load currency list');
  return res.json() as Promise<CurrencyMap>;
}

export async function fetchRate(from: string, to: string): Promise<ExchangeRate> {
  if (from === to) {
    return { from, to, rate: 1, updatedAt: new Date().toISOString().split('T')[0] };
  }

  const res = await fetch(
    `${BASE}/latest?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
  );
  if (!res.ok) throw new Error('Failed to fetch exchange rate');

  const data = await res.json() as {
    date:  string;
    rates: Record<string, number>;
  };

  const rate = data.rates[to];
  if (rate == null) throw new Error(`No rate found for ${from} → ${to}`);

  return { from, to, rate, updatedAt: data.date };
}
