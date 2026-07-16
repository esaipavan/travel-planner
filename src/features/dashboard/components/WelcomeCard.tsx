import { format } from 'date-fns';
import { Plane } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent } from '@/components/ui/card';

export function WelcomeCard() {
  const user = useAuthStore((s) => s.user);
  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? '';
  const firstName = fullName.split(' ')[0] || 'Traveller';

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      <CardContent className="flex items-center justify-between p-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            {format(new Date(), 'EEEE, MMMM d')}
          </p>
          <h2 className="text-2xl font-bold tracking-tight">
            {greeting}, {firstName}!
          </h2>
          <p className="text-sm text-muted-foreground">
            Ready to plan your next adventure?
          </p>
        </div>
        <div className="hidden h-16 w-16 items-center justify-center rounded-full bg-primary/10 sm:flex">
          <Plane className="h-8 w-8 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
