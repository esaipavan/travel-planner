import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth.store';
import { TripForm } from '../components/TripForm';
import { useCreateTrip } from '../hooks/useTrips';
import type { TripFormValues } from '../types';

export default function TripNewPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { mutateAsync, isPending } = useCreateTrip();

  async function handleSubmit(values: TripFormValues) {
    if (!user) return;
    try {
      const trip = await mutateAsync({
        user_id: user.id,
        title: values.title,
        destination: values.destination,
        start_date: values.start_date,
        end_date: values.end_date,
        total_budget: values.total_budget ?? null,
        currency: values.currency,
        status: values.status,
        notes: values.notes || null,
        is_public: values.is_public,
      });
      toast.success('Trip created!');
      navigate(`/trips/${trip.id}`, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create trip.');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/trips">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title="New Trip"
          description="Tell us about your upcoming adventure."
        />
      </div>

      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <TripForm
              onSubmit={handleSubmit}
              isSubmitting={isPending}
              submitLabel="Create trip"
              onCancel={() => navigate('/trips')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
