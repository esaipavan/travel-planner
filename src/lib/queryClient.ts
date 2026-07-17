import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            1000 * 60 * 5,  // 5 minutes
      gcTime:               1000 * 60 * 30, // 30 minutes
      retry:                1,
      retryDelay:           attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10_000),
      refetchOnWindowFocus: false,
      // With the PWA service worker caching Supabase REST responses, queries must
      // serve cached data even when navigator.onLine is false. Without this flag
      // TanStack Query pauses (never resolves) all queries while offline.
      networkMode:          'offlineFirst',
      throwOnError:         false,
    },
    mutations: {
      retry:        0,
      networkMode:  'offlineFirst',
      throwOnError: false,
    },
  },
});

// Exported so features can reference the same client instance for
// manual invalidation, prefetching, or cache manipulation.
export { queryClient as appQueryClient };
