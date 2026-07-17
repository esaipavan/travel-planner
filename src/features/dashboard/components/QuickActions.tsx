import { memo } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Receipt, Map } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Action {
  label: string;
  icon: LucideIcon;
  to: string;
  variant: 'default' | 'outline';
}

const ACTIONS: Action[] = [
  { label: 'Create Trip',  icon: PlusCircle, to: '/trips/new', variant: 'default' },
  { label: 'Add Expense',  icon: Receipt,    to: '/trips',     variant: 'outline' },
  { label: 'View Trips',   icon: Map,        to: '/trips',     variant: 'outline' },
];

export const QuickActions = memo(function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2">
      {ACTIONS.map((action) => (
        <Button
          key={action.label}
          variant={action.variant}
          size="sm"
          className="gap-2"
          asChild
        >
          <Link to={action.to}>
            <action.icon className="h-3.5 w-3.5" />
            {action.label}
          </Link>
        </Button>
      ))}
    </div>
  );
});
