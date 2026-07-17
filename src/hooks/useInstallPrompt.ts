import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt:     () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface InstallPromptState {
  canInstall:  boolean;
  isInstalled: boolean;
  install:     () => Promise<void>;
}

export function useInstallPrompt(): InstallPromptState {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check whether the app is already running in standalone (installed) mode
    const mq         = window.matchMedia('(display-mode: standalone)');
    const iosStandalone = (
      window.navigator as Navigator & { standalone?: boolean }
    ).standalone;
    if (mq.matches || iosStandalone === true) {
      setIsInstalled(true);
    }

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    }

    function handleAppInstalled() {
      setIsInstalled(true);
      setPromptEvent(null);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled',        handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled',        handleAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setPromptEvent(null);
  }, [promptEvent]);

  return {
    canInstall:  !!promptEvent && !isInstalled,
    isInstalled,
    install,
  };
}
