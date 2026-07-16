import { Link } from 'react-router-dom';
import { PlusCircle, Receipt, Map } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Action {
  label: string;
  icon: LucideIcon;
  to: string;
  variant: 'default' | 'outline';
}

const ACTIONS: Action[] = [
  { label: 'Create Trip', icon: PlusCircle, to: '/trips/new', variant: 'default' },
  { label: 'Add Expense', icon: Receipt, to: '/trips', variant: 'outline' },
  { label: 'View Trips', icon: Map, to: '/trips', variant: 'outline' },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {ACTIONS.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            className="w-full justify-start gap-2"
            asChild
          >
            <Link to={action.to}>
              <action.icon className="h-4 w-4" />
              {action.label}
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
