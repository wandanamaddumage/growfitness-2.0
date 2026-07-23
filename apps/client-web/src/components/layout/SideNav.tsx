import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, User, type LucideIcon } from 'lucide-react';

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/payments', icon: FileText, label: 'Invoices' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function SideNav() {

  return (
    <aside className="fixed left-0 top-20 hidden h-[calc(100vh-5rem)] w-64 border-r border-[var(--line)] p-4 lg:block gf-scope shadow-2xl">
      <div className="my-8 px-2">
        <h2
          className="text-xl font-extrabold uppercase tracking-tight text-[var(--gf-green-deep)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Grow Fitness
        </h2>
        <p className="text-xs text-[var(--fg-2)] font-semibold uppercase tracking-wider">
          Parent Portal
        </p>
      </div>

      <nav className="flex flex-col gap-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
              key={to}
              to={to}
             className={({ isActive }) => {
              const baseClasses = 'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer';
              const activeClasses = 'border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-green)] !text-white hover:bg-[var(--fg-4)] hover:text-white uppercase tracking-wider transition-all duration-200';
              const inactiveClasses = 'text-[var(--fg-2)] hover:bg-[var(--fg-6)] hover:text-[var(--gf-green-deep)] uppercase tracking-wider transition-all duration-200 hover:bg-[var(--line)]';

              return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
            }}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className="h-5 w-5 transition-colors hover:text-white"
                    color={isActive ? 'white' : 'var(--gf-green-deep)'}
                  />
                  {label}
                </>
              )}
            </NavLink>
        ))}
      </nav>
    </aside>
  );
}