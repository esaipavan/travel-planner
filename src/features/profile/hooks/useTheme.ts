import { useState, useLayoutEffect, useCallback } from 'react';
import type { ThemeValue } from '../types';

const STORAGE_KEY = 'travel-planner-theme';

export function applyTheme(theme: ThemeValue): void {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', isDark);
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeValue>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as ThemeValue) ?? 'system';
  });

  useLayoutEffect(() => {
    applyTheme(theme);

    if (theme === 'system') {
      const mq      = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
    return undefined;
  }, [theme]);

  const setTheme = useCallback((next: ThemeValue) => {
    localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
    applyTheme(next);
  }, []);

  return { theme, setTheme };
}
