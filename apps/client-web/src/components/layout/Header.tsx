import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/useAuth';
import { useParentProfile } from '@/contexts/parent-profile/ParentProfileProvider';
import { useCoachProfile } from '@/contexts/coach-profile/CoachProfileProvider';
import { UserAvatar } from '@/components/common/UserAvatar';
import { useConfirm } from '@/hooks/useConfirm';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Menu, X, LogOut } from 'lucide-react';
import { NotificationBell } from '../notifications/NotificationBell';
import { Container } from './Container';

const logo = '/images/Grow VI Elements/Logos/New logo dark green.png';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Programs', href: '/programs' },
  { label: 'Preschool', href: '/preschool' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '#blog' },
];

type HeaderProps = {
  forceSolid?: boolean;
};

export default function Header({ forceSolid = false }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const parentProfile = useParentProfile();
  const coachProfile = useCoachProfile();

  const navigate = useNavigate();
  const location = useLocation();

  const { confirm: requestConfirm, confirmState } = useConfirm();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);

  const isHomePage = location.pathname === '/';
  const isSolid = !isHomePage || scrolled || forceSolid;

  const headerPhotoUrl =
    user?.role === 'PARENT'
      ? parentProfile.photoUrl
      : user?.role === 'COACH'
        ? coachProfile.photoUrl
        : undefined;

  const headerDisplayName =
    user?.role === 'PARENT'
      ? parentProfile.displayName
      : user?.role === 'COACH'
        ? coachProfile.displayName
        : undefined;

  // ----------------------------
  // Scroll detection
  // ----------------------------
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ----------------------------
  // Handle hash scrolling on route change
  // ----------------------------
  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace('#', '');

    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }, [location]);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // ----------------------------
  // Navigation click handler
  // ----------------------------
  const handleNavClick = (href: string) => {
    // Close mobile menu
    setMenuOpen(false);
    setActiveLink(href);
    
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate(`/${href}`);
      } else {
        const id = href.replace('#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  const handleLogout = useCallback(async () => {
    const confirmed = await requestConfirm({
      title: 'Logout',
      description: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
    });

    if (confirmed) {
      await logout();
      navigate('/login');
    }
  }, [requestConfirm, logout, navigate]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-2"
        style={{
          background: isSolid
            ? 'rgba(251, 248, 237, 0.95)'
            : 'rgba(251, 248, 237, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: isSolid
            ? '1.5px solid var(--line)'
            : '1px solid transparent',
          boxShadow: isSolid
            ? '0 4px 20px rgba(36, 62, 54, 0.08)'
            : 'none',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <Container>
          <div className="flex items-center justify-between h-16 md:h-[72px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src={logo}
                alt="Grow Fitness"
                className="h-14 md:h-20 w-auto transition-transform duration-300 group-hover:scale-110"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              
              {navLinks.map(link =>
                link.href.startsWith('#') ? (
                  <Button
                    key={link.label}
                    variant="ghost"
                    className="gf-nav-a px-4 py-2 text-lg font-semibold flex items-center gap-2 transition-all duration-200 bg-transparent hover:bg-transparent hover:text-[var(--gf-green)] focus-visible:ring-0 focus-visible:ring-offset-0"
                    style={{
                      color: activeLink === link.href ? 'var(--gf-green)' : 'var(--fg-1)',
                      fontFamily: 'var(--font-sans)',
                      border: 'none',
                      boxShadow: 'none',
                      outline: 'none',
                    }}
                    onClick={() => handleNavClick(link.href)}
                  >
                    {link.label}
                  </Button>
                ) : (
                  <Link key={link.label} to={link.href} onClick={() => setActiveLink(link.href)}>
                    <Button
                      variant="ghost"
                      className="gf-nav-a px-4 py-2 text-lg font-semibold flex items-center gap-2 transition-all duration-200 bg-transparent hover:bg-transparent hover:text-[var(--gf-green)] focus-visible:ring-0 focus-visible:ring-offset-0"
                      style={{
                        color: activeLink === link.href ? 'var(--gf-green)' : 'var(--fg-1)',
                        fontFamily: 'var(--font-sans)',
                        border: 'none',
                        boxShadow: 'none',
                        outline: 'none',
                      }}
                    >
                      {link.label}
                    </Button>
                  </Link>
                )
              )}

              {!isAuthenticated && (
                <>
                  <Button
                    variant="ghost"
                    size="default"
                    className="ml-3 font-semibold transition-all rounded-full px-6 py-5 bg-transparent hover:bg-transparent hover:border-none gf-btn-pop"
                    style={{
                      color: 'var(--gf-green-deep)',
                      border: '3px solid var(--gf-green-deep)',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>

                  <Button
                    size="default"
                    className="ml-3 font-semibold shadow-lg transition-all rounded-full px-6 py-6 gf-btn-pop"
                    style={{
                      color: 'white',
                      background: 'var(--gf-green)',
                      boxShadow: '0 5px 0 var(--gf-green-deep)',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onClick={() => navigate('/free-session')}
                  >
                    Enroll Your Child
                  </Button>
                </>
              )}

              {isAuthenticated && (
                <div className="flex items-center gap-3 ml-3">
                  <NotificationBell />

                  <button
                    onClick={() => navigate('/dashboard')}
                    className="rounded-full p-1 transition-transform hover:scale-105"
                    style={{ background: 'transparent' }}
                  >
                    <UserAvatar
                      photoUrl={headerPhotoUrl}
                      displayName={headerDisplayName}
                      email={user?.email}
                      className="size-9 cursor-pointer border-2 border-solid border-[var(--gf-green)]"
                    />
                  </button>

                  <Button
                    variant="ghost"
                    size="default"
                    className="ml-3 font-semibold transition-all rounded-full px-6 py-5 bg-transparent hover:bg-transparent hover:border-none gf-btn-pop"
                    style={{
                      color: 'var(--gf-green-deep)',
                      border: '3px solid var(--gf-green-deep)',
                      fontFamily: 'var(--font-sans)',
                    }}
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile - Show Sign In button or User Avatar in header */}
            <div className="flex items-center gap-3 md:hidden">
              {isAuthenticated ? (
                <>
                  <NotificationBell />
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="rounded-full p-1 transition-transform hover:scale-105"
                    style={{ background: 'transparent' }}
                  >
                    <UserAvatar
                      photoUrl={headerPhotoUrl}
                      displayName={headerDisplayName}
                      email={user?.email}
                      className="size-8 cursor-pointer border-2 border-solid border-[var(--gf-green)]"
                    />
                  </button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-semibold transition-all rounded-full px-4 py-2 bg-transparent hover:bg-transparent hover:border-none"
                  style={{
                    color: 'var(--gf-green-deep)',
                    border: '2px solid var(--gf-green-deep)',
                    fontFamily: 'var(--font-sans)',
                  }}
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              )}
              
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  color: isSolid ? 'var(--fg-1)' : 'var(--gf-green)',
                  background: 'transparent',
                }}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="md:hidden border-b"
            style={{
              background: 'var(--gf-cream)',
              borderColor: 'var(--line)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <div className="px-4 py-4 space-y-1">

              {navLinks.map(link => {
                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-all duration-200 hover:text-[var(--gf-green)]"
                    style={{
                      color: 'var(--fg-1)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {link.label}
                  </button>
                );
              })}

              {isAuthenticated ? (
                <div className="pt-3 border-t mt-3 flex flex-col gap-2" style={{ borderColor: 'var(--line)' }}>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/dashboard');
                    }}
                    className="rounded-full"
                    style={{
                      borderColor: 'var(--line)',
                      color: 'var(--fg-1)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Dashboard
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="rounded-full"
                    style={{
                      borderColor: 'var(--line)',
                      color: 'var(--fg-1)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Profile
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="rounded-full"
                    style={{
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="pt-3 border-t mt-3 flex flex-col gap-2" style={{ borderColor: 'var(--line)' }}>
                  <Button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/login');
                    }}
                    className="rounded-full"
                    style={{
                      background: 'var(--gf-green)',
                      color: 'white',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Sign In
                  </Button>

                  <Button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/free-session');
                    }}
                    className="rounded-full"
                    style={{
                      background: 'var(--gf-green-deep)',
                      color: 'white',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Enroll Your Child
                  </Button>
                </div>
              )}

            </div>
          </div>
        )}
      </nav>

      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={open => !open && confirmState.onCancel()}
        title={confirmState.options?.title || ''}
        description={confirmState.options?.description || ''}
        confirmText={confirmState.options?.confirmText}
        cancelText={confirmState.options?.cancelText}
        onConfirm={confirmState.onConfirm}
      />
    </>
  );
}