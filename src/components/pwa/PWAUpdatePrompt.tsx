import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'sonner';

export function PWAUpdatePrompt() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | undefined>();

  const {
    needRefresh:         [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, reg) {
      setRegistration(reg);
    },
  });

  useEffect(() => {
    if (!registration) return;
    const id = setInterval(() => void registration.update(), 60 * 60 * 1_000);
    return () => clearInterval(id);
  }, [registration]);

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
