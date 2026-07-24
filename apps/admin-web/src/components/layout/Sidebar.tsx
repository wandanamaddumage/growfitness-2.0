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
  ChevronLeft,
  ChevronRight,
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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ 
  className, 
  onClose, 
  isCollapsed = false, 
  onToggleCollapse 
}: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col h-full border-r border-[var(--line)] bg-[var(--gf-cream)] shadow-2xl transition-all duration-300 overflow-x-hidden',
        isCollapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        'p-6 border-b-2 border-[var(--gf-green-deep)]/30 pt-10 text-center transition-all duration-300 flex-shrink-0',
        isCollapsed && 'p-4 pt-20'
      )}>
        <div className={cn(
          'flex flex-col items-center transition-all duration-300',
          isCollapsed && 'scale-75'
        )}>
          <img 
            src="/New%20logo%20dark%20green.png" 
            alt="Grow Fitness Logo" 
            className={cn(
              'mb-4 mx-auto transition-all duration-300',
              isCollapsed ? 'w-12 h-12' : 'w-24 h-24'
            )}
          />
          <h1 className={cn(
            'text-xl font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)] transition-all duration-300 font-display',
            isCollapsed && 'hidden'
          )}>
            Grow Fitness
          </h1>
          <p className={cn(
            'text-sm text-[var(--gf-green-deep)]/70 font-semibold mt-1 transition-all duration-300',
            isCollapsed && 'hidden'
          )}>
            Admin Portal
          </p>
        </div>
      </div>

      {/* Navigation - Keep vertical scroll, remove horizontal */}
      <nav className="flex-1 p-4 space-y-1 sm:space-y-2 lg:space-y-3 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose?.()}
              className={({ isActive }) => {
                const baseClasses = cn(
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer relative group',
                  'hover:bg-[var(--fg-6)] hover:text-[var(--gf-green-deep)]',
                  isActive && 'border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-green-deep)] !text-white hover:bg-[var(--gf-green-deep)] hover:text-white'
                );
                return baseClasses;
              }}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-colors flex-shrink-0',
                      isActive ? 'text-white' : 'text-[var(--gf-green-deep)]'
                    )}
                  />
                  <span className={cn(
                    'transition-all duration-300 whitespace-nowrap',
                    isCollapsed && 'hidden'
                  )}>
                    {item.label}
                  </span>
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle at bottom */}
      {onToggleCollapse && (
        <div className="p-4 border-t border-[var(--line)] flex-shrink-0">
          <button
            onClick={onToggleCollapse}
            className={cn(
              'w-full flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-[var(--gf-green-deep)]/10 transition-all duration-200 text-[var(--gf-green-deep)]',
              isCollapsed && 'px-2'
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm font-semibold">Collapse</span>
              </>
            )}
          </button>
        </div>
      )}
    </aside>
  );
}