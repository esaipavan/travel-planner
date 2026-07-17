import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function WelcomeCard() {
  const user = useAuthStore((s) => s.user);
  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? '';
  const firstName = fullName.split(' ')[0] || 'Traveller';

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
      <CardContent className="relative p-6 sm:p-8">
        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-widest text-primary-foreground/60">
              {format(new Date(), 'EEEE, MMMM d')}
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {greeting}, {firstName}!
            </h2>
            <p className="text-sm text-primary-foreground/70">
              Ready to plan your next adventure?
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="shrink-0 bg-white/15 text-primary-foreground hover:bg-white/25 border-white/20"
            asChild
          >
            <Link to="/trips/new">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New trip
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
