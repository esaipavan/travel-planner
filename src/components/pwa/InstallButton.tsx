import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export function InstallButton() {
  const { canInstall, install } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 gap-1.5 text-xs"
      onClick={() => void install()}
    >
      <Download className="h-3.5 w-3.5" />
      Install App
    </Button>
  );
}
