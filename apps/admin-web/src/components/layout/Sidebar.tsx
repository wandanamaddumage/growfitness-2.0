import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  Baby,
  Calendar,
  FileText,
  Banknote,
  MapPin,
  Image,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type MenuItem = {
  path: string;
  label: string;
  icon: LucideIcon;
};

const menuItems: MenuItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/users', label: 'Users', icon: Users },
  { path: '/kids', label: 'Kids', icon: Baby },
  { path: '/sessions', label: 'Sessions', icon: Calendar },
  { path: '/requests', label: 'Requests', icon: FileText },
  { path: '/invoices', label: 'Invoices', icon: Banknote },
  { path: '/locations', label: 'Locations', icon: MapPin },
  { path: '/banners', label: 'Banners', icon: Image },
  { path: '/testimonials', label: 'Testimonials', icon: MessageCircle },
];

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 hidden h-[calc(200vh-5rem)] w-64 border-r border-[var(--line)] p-4 lg:block gf-scope shadow-2xl bg-[var(--gf-green-deep-50)]',
        className
      )}
    >
      {/* Header */}
      <div className="p-6 border-b-2 border-[var(--gf-green-deep)]/30 pt-10 text-center">
        <img src="/New%20logo%20dark%20green.png" alt="Grow Fitness Logo" className="w-24 h-24 mb-4 mx-auto" />
        <h1 className="text-xl font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Grow Fitness</h1>
        <p className="text-sm text-[var(--gf-green-deep)]/70 font-semibold mt-1">Admin Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 sm:space-y-2 lg:space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
               <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose?.()}
             className={({ isActive }) => {
              const baseClasses = 'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer';
              const activeClasses = 'border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-green-deep)] !text-white hover:bg-[var(--gf-green-deep)] hover:text-white uppercase tracking-wider transition-all duration-200';
              const inactiveClasses = 'text-[var(--fg-2)] hover:bg-[var(--fg-6)] hover:text-[var(--gf-green-deep)] uppercase tracking-wider transition-all duration-200';

              return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
            }}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className="h-5 w-5 transition-colors"
                    color={isActive ? 'white' : 'var(--gf-green-deep)'}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

