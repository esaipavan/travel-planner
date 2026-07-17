import { WifiOff, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function OfflineBanner() {
  const { isOnline, lastUpdated, reconnect } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div
      role="alert"
      className="flex shrink-0 items-center justify-between gap-2 bg-amber-500 px-4 py-2 text-sm text-white"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          You&apos;re offline — showing cached data
          {lastUpdated ? `. Last synced at ${format(lastUpdated, 'HH:mm')}` : ''}.
        </span>
      </div>
      <button
        type="button"
        onClick={reconnect}
        className="flex shrink-0 items-center gap-1 rounded bg-white/20 px-2 py-0.5 text-xs hover:bg-white/30 transition-colors"
      >
        <RefreshCw className="h-3 w-3" />
        Retry
      </button>
    </div>
  );
}
