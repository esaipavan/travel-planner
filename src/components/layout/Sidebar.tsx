import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Map,
  Cloud, DollarSign, MapPin, Globe, FileText,
  MessageSquare, BarChart2, User, Settings, Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/auth.store';
import { APP_NAME } from '@/utils/constants';

interface SidebarProps {
  className?: string;
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trips', icon: Map, label: 'My Trips' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
];

const toolItems = [
  { to: '/weather', icon: Cloud, label: 'Weather' },
  { to: '/currency', icon: DollarSign, label: 'Currency' },
  { to: '/nearby', icon: MapPin, label: 'Nearby Places' },
  { to: '/destination', icon: Globe, label: 'Destination Guide' },
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/assistant', icon: MessageSquare, label: 'AI Assistant' },
];

export function Sidebar({ className }: SidebarProps) {
  const { isAdmin } = useAuthStore();

  return (
    <aside
      className={cn(
        'w-60 shrink-0 flex-col border-r bg-card',
        className,
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
          ✈
        </div>
        <span className="font-semibold tracking-tight">{APP_NAME}</span>
      </div>

      <ScrollArea className="flex-1 py-2">
        {/* Main nav */}
        <div className="px-2 py-1">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Overview
          </p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>

        <Separator className="my-2" />

        {/* Tools */}
        <div className="px-2 py-1">
          <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tools
          </p>
          {toolItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>

        {isAdmin && (
          <>
            <Separator className="my-2" />
            <div className="px-2 py-1">
              <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Admin
              </p>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                  )
                }
              >
                <Shield className="h-4 w-4" />
                Admin Panel
              </NavLink>
            </div>
          </>
        )}

        <Separator className="my-2" />

        {/* Account */}
        <div className="px-2 py-1">
          {[
            { to: '/profile', icon: User, label: 'Profile' },
            { to: '/settings', icon: Settings, label: 'Settings' },
          ].map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
