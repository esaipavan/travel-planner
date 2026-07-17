import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Map,
  Cloud, DollarSign, MapPin, Globe, FileText, Bell,
  MessageSquare, BarChart2, User, Settings, Shield, Plane,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthStore } from '@/store/auth.store';
import { APP_NAME } from '@/utils/constants';

interface SidebarProps { className?: string }

const mainNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trips',     icon: Map,             label: 'My Trips'  },
  { to: '/analytics', icon: BarChart2,       label: 'Analytics' },
];

const toolNav = [
  { to: '/weather',     icon: Cloud,          label: 'Weather'         },
  { to: '/currency',    icon: DollarSign,     label: 'Currency'        },
  { to: '/nearby',      icon: MapPin,         label: 'Nearby Places'   },
  { to: '/destination', icon: Globe,          label: 'Destination Guide'},
  { to: '/documents',   icon: FileText,       label: 'Documents'       },
  { to: '/reminders',   icon: Bell,           label: 'Reminders'       },
  { to: '/assistant',   icon: MessageSquare,  label: 'AI Assistant'    },
];

const accountNav = [
  { to: '/profile',  icon: User,     label: 'Profile'  },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

function NavSection({
  label,
  items,
}: {
  label: string;
  items: { to: string; icon: React.ElementType; label: string }[];
}) {
  return (
    <div className="space-y-0.5">
      <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        {label}
      </p>
      {items.map(({ to, icon: Icon, label: itemLabel }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {itemLabel}
        </NavLink>
      ))}
    </div>
  );
}

export function Sidebar({ className }: SidebarProps) {
  const { isAdmin } = useAuthStore();

  return (
    <aside aria-label="Main navigation" className={cn('flex w-60 shrink-0 flex-col border-r bg-card', className)}>
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Plane className="h-3.5 w-3.5" aria-hidden="true" />
        </div>
        <span className="font-semibold tracking-tight text-foreground">{APP_NAME}</span>
      </div>

      <ScrollArea className="flex-1 px-2">
        <NavSection label="Overview" items={mainNav} />
        <NavSection label="Tools"    items={toolNav} />

        {isAdmin && (
          <div className="space-y-0.5">
            <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              Admin
            </p>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )
              }
            >
              <Shield className="h-4 w-4 shrink-0" aria-hidden="true" />
              Admin Panel
            </NavLink>
          </div>
        )}

        <NavSection label="Account" items={accountNav} />
        <div className="pb-4" />
      </ScrollArea>
    </aside>
  );
}
