import { useLayoutEffect } from 'react';
import { applyTheme } from '@/features/profile/hooks/useTheme';
import type { ThemeValue } from '@/features/profile/types';

const STORAGE_KEY = 'travel-planner-theme';

export function ThemeInitializer() {
  useLayoutEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeValue) ?? 'system';
    applyTheme(stored);

    if (stored === 'system') {
      const mq      = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
    return undefined;
  }, []);

  return null;
}
