import { useState, useEffect, useCallback } from 'react';
import { queryClient } from '@/lib/queryClient';

export interface NetworkStatus {
  isOnline:    boolean;
  lastUpdated: Date | null;
  reconnect:   () => void;
}

export function useNetworkStatus(): NetworkStatus {
  const [isOnline,    setIsOnline]    = useState(() => navigator.onLine);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(() =>
    navigator.onLine ? new Date() : null,
  );

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      setLastUpdated(new Date());
      // Refetch all stale queries now that connectivity is restored
      void queryClient.invalidateQueries();
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const reconnect = useCallback(() => {
    if (navigator.onLine) {
      setLastUpdated(new Date());
      void queryClient.invalidateQueries();
    }
  }, []);

  return { isOnline, lastUpdated, reconnect };
}
