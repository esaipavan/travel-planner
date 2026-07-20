import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useIsFetching } from '@tanstack/react-query';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function SyncIndicator() {
  const { isOnline } = useNetworkStatus();
  const isFetching = useIsFetching();
  const [showSyncing, setShowSyncing] = useState(false);

  // Debounce: show "Syncing…" only after 400ms of continuous fetching.
  // Avoids flashing for instant cache-hits and brief background refreshes.
  useEffect(() => {
    if (isFetching > 0) {
      const timer = setTimeout(() => setShowSyncing(true), 400);
      return () => clearTimeout(timer);
    }
    setShowSyncing(false);
  }, [isFetching]);

  if (!isOnline || !showSyncing) return null;

  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <RefreshCw className="h-3 w-3 animate-spin" aria-hidden="true" />
      Syncing…
    </span>
  );
}
