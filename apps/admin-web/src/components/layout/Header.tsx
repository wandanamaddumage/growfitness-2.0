import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Menu, UserCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useConfirm } from '@/hooks/useConfirm';
import { NotificationBell } from '../notifications/NotificationBell';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { confirm, confirmState } = useConfirm();

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: 'Logout',
      description: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
      variant: 'default',
    });

    if (confirmed) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <>
      <header className="h-16 px-4 md:px-6 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 text-[var(--fg-2)] hover:text-[var(--gf-green-deep)] transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* <h2 className="text-lg font-extrabold uppercase tracking-wider text-[var(--gf-green-deep)] truncate" style={{ fontFamily: 'var(--font-display)' }}>
            Admin Portal
          </h2> */}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 md:gap-4 mr-5">
          <NotificationBell />

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-[var(--gf-green-deep)] font-extrabold tracking-wider">
              {user?.email}
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--gf-green-deep)] font-extrabold uppercase tracking-wider hover:bg-[var(--fg-6)] transition-all duration-200 border-2 border-[var(--gf-green-deep)] shadow-[2px_2px_0_0_var(--gf-green-deep)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_var(--gf-green-deep)] active:translate-y-[1px] active:shadow-[0_0_0_0_var(--gf-green-deep)]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full p-1 hover:bg-[var(--gf-green-50)] transition-colors">
                  <UserCircle2 className="h-8 w-8 text-[var(--gf-green-deep)]" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64 bg-[var(--gf-paper)] border-2 border-[var(--gf-green-deep)] shadow-xl">
                <DropdownMenuLabel className="break-all text-xs font-extrabold tracking-wider text-[var(--gf-green-deep)]">
                  {user?.email}
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-[var(--gf-green-deep)]/20" />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-[var(--gf-green-deep)] font-semibold hover:bg-[var(--fg-6)]"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={(open) => {
          if (!open) confirmState.onCancel();
        }}
        title={confirmState.options?.title || ''}
        description={confirmState.options?.description || ''}
        confirmText={confirmState.options?.confirmText}
        cancelText={confirmState.options?.cancelText}
        variant={confirmState.options?.variant}
        onConfirm={confirmState.onConfirm}
      />
    </>
  );
}