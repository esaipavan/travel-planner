import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  className?: string;
}

const mobileItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home'    },
  { to: '/trips',     icon: Map,             label: 'Trips'   },
  { to: '/assistant', icon: MessageSquare,   label: 'AI'      },
  { to: '/profile',   icon: User,            label: 'Profile' },
];

export function MobileNav({ className }: MobileNavProps) {
  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-10 border-t bg-card/95 pb-safe backdrop-blur-sm',
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
                'relative flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span aria-hidden="true" className="absolute left-1/2 top-0 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
                )}
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
