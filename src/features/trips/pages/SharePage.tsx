import { useParams } from 'react-router-dom';

export default function SharePage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Shared Trip</h1>
        <p className="text-muted-foreground text-sm">Trip ID: {id} — Phase 18</p>
      </div>
    </div>
  );
}
