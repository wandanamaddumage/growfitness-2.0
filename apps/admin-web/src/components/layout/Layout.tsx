import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

export function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen bg-[var(--gf-cream)] gf-scope overflow-hidden">
      {/* Desktop Sidebar */}
      <div className={cn(
        'hidden lg:block transition-all duration-300 flex-shrink-0',
        isCollapsed ? 'w-20' : 'w-64'
      )}>
        <Sidebar 
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden transition-opacity duration-300',
          isMobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        {/* Overlay */}
        <div
          className={cn(
            'fixed inset-0 bg-black/50 transition-opacity duration-300 backdrop-blur-sm',
            isMobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setIsMobileOpen(false)}
        />
        
        {/* Sidebar container */}
        <div
          className={cn(
            'relative z-50 flex h-full w-72 transform transition-transform duration-300 ease-in-out',
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <Sidebar 
            className="h-full border-r-0 shadow-2xl" 
            onClose={() => setIsMobileOpen(false)} 
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Your existing Header - no changes needed */}
        <Header onMenuClick={() => setIsMobileOpen(true)} />
        
        <main className={cn(
          'flex-1 overflow-y-auto p-4 md:p-6',
          'lg:pl-6'
        )}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}