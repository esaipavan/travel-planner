import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  className?: string;
}

const mobileItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/trips', icon: Map, label: 'Trips' },
  { to: '/assistant', icon: MessageSquare, label: 'AI' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function MobileNav({ className }: MobileNavProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-10 border-t bg-card pb-safe',
        className,
      )}
    >
      <div className="grid grid-cols-4">
        {mobileItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
