import { CheckCircle2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useIsFetching } from '@tanstack/react-query';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function SyncIndicator() {
  const { isOnline, lastUpdated } = useNetworkStatus();
  const isFetching = useIsFetching();

  if (!isOnline) return null;

  if (isFetching > 0) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <RefreshCw className="h-3 w-3 animate-spin" aria-hidden="true" />
        Syncing…
      </span>
    );
  }

  if (lastUpdated) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <CheckCircle2 className="h-3 w-3 text-emerald-500" aria-hidden="true" />
        {format(lastUpdated, 'HH:mm')}
      </span>
    );
  }

  return null;
}
