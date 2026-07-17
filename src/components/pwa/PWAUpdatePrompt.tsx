import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'sonner';

export function PWAUpdatePrompt() {
  const {
    needRefresh:         [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        // Check for updates every 60 minutes
        setInterval(() => void registration.update(), 60 * 60 * 1_000);
      }
    },
  });

  useEffect(() => {
    if (needRefresh) {
      toast('Update available', {
        description: 'A new version of TravelPlanner is ready.',
        action: {
          label: 'Refresh',
          onClick: () => void updateServiceWorker(true),
        },
        duration: Infinity,
        id:       'pwa-update',
      });
    }
  }, [needRefresh, updateServiceWorker]);

  return null;
}
