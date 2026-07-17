import { useQuery } from '@tanstack/react-query';
import { fetchCurrencies, fetchRate } from '../services/currency.service';

export function useCurrencies() {
  return useQuery({
    queryKey: ['currencies'],
    queryFn:  fetchCurrencies,
    staleTime: Infinity,
    gcTime:    Infinity,
  });
}

export function useExchangeRate(from: string, to: string) {
  return useQuery({
    queryKey: ['exchange-rate', from, to],
    queryFn:  () => fetchRate(from, to),
    staleTime: 10 * 60 * 1000,
    enabled:   !!from && !!to,
  });
}
