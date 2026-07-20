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
  const linkClasses = 'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200';

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

      <nav className="flex flex-col gap-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => {
              const baseClasses = linkClasses;
              const activeClasses = 'border-2 border-[var(--gf-green-deep)] shadow-[4px_4px_0_0_var(--gf-green-deep)] bg-[var(--gf-green)] !text-white hover:bg-[var(--gf-green-deep)]/90 hover:text-white';
              const inactiveClasses = 'text-[var(--fg-2)] hover:bg-[var(--gf-green-50)] hover:text-[var(--gf-green-deep)]';

              return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
            }}
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}