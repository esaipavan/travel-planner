import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { ReminderRow } from '../types';
import { isReminderDueNow } from '../types';

export function useNotifications(reminders: ReminderRow[]) {
  const notifiedRef = useRef<Set<string>>(new Set());
  const permissionRequested = useRef(false);

  useEffect(() => {
    if (
      !permissionRequested.current &&
      'Notification' in window &&
      Notification.permission === 'default'
    ) {
      permissionRequested.current = true;
      void Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const check = () => {
      for (const r of reminders) {
        if (notifiedRef.current.has(r.id)) continue;
        if (!isReminderDueNow(r)) continue;

        notifiedRef.current.add(r.id);

        toast(`⏰ ${r.title}`, {
          description: r.description ?? 'Your reminder is due now',
          duration:    8000,
        });

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`⏰ ${r.title}`, {
            body: r.description ?? 'Your reminder is due now',
            tag:  r.id,
          });
        }
      }
    };

    check();
    const id = window.setInterval(check, 60_000);
    return () => window.clearInterval(id);
  }, [reminders]);
}
