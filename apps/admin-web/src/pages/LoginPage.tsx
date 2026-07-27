import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@grow-fitness/shared-schemas';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ email: string; password: string }>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      setError(null);
      await login(data.email, data.password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--gf-cream)] gf-scope">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Login Form (45% on desktop, full width on mobile) */}
      <div className="w-full lg:w-[45%] bg-[var(--gf-paper)] flex flex-col min-h-screen lg:min-h-0">
        {/* Logo/Branding */}
        <div className="p-8">
          <div className="flex items-center gap-4">
            <img src="/New logo dark green.png" alt="Grow Fitness Logo" className="w-16 h-16" />
            <span className="text-3xl font-extrabold text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Grow Fitness Admin</span>
          </div>
        </div>

        {/* Form Container - Centered Vertically */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-8 lg:py-0">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-extrabold mb-2 text-[var(--gf-green-deep)]" style={{ fontFamily: 'var(--font-display)' }}>Sign in to your account</h1>
            <p className="text-[var(--fg-2)] font-semibold mb-8">
              Enter your email and password to access the admin dashboard
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-xl border-2 border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-extrabold mb-2 text-[var(--gf-green-deep)] uppercase tracking-wider">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="growfitnesslk@gmail.com"
                  className="w-full px-4 py-3 border-2 border-[var(--line)] rounded-xl bg-[var(--gf-green-50)]/40 text-[var(--gf-green-deep)] placeholder:text-[var(--fg-3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gf-green)] focus-visible:border-[var(--gf-green-deep)] transition-colors font-semibold"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-extrabold mb-2 text-[var(--gf-green-deep)] uppercase tracking-wider"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className="w-full px-4 py-3 pr-12 border-2 border-[var(--line)] rounded-xl bg-[var(--gf-green-50)]/40 text-[var(--gf-green-deep)] placeholder:text-[var(--fg-3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gf-green)] focus-visible:border-[var(--gf-green-deep)] transition-colors font-semibold"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-2)] hover:text-[var(--gf-green-deep)] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

             <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[var(--gf-green-deep)] text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-50 font-extrabold uppercase tracking-wider border-2 border-black shadow-[2px_2px_0_0_black] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_0_black] active:translate-y-[1px] active:shadow-[0_0_0_0_black]"
            >
              {isSubmitting ? 'Logging in...' : 'Sign in'}
            </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration (55% on desktop, hidden on mobile) */}
      <div className="hidden lg:block lg:w-[55%] bg-[var(--gf-green-deep)] relative overflow-hidden">
        {/* Illustration Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Abstract people/community illustration pattern */}
            <circle cx="100" cy="150" r="30" fill="white" opacity="0.8" />
            <circle cx="200" cy="120" r="25" fill="white" opacity="0.7" />
            <circle cx="300" cy="180" r="28" fill="white" opacity="0.6" />
            <circle cx="150" cy="250" r="22" fill="white" opacity="0.8" />
            <circle cx="250" cy="280" r="26" fill="white" opacity="0.7" />
            <circle cx="350" cy="220" r="24" fill="white" opacity="0.6" />
            <circle cx="400" cy="150" r="30" fill="white" opacity="0.8" />
            <circle cx="500" cy="120" r="25" fill="white" opacity="0.7" />
            <circle cx="600" cy="180" r="28" fill="white" opacity="0.6" />
            <circle cx="450" cy="250" r="22" fill="white" opacity="0.8" />
            <circle cx="550" cy="280" r="26" fill="white" opacity="0.7" />
            <circle cx="650" cy="220" r="24" fill="white" opacity="0.6" />
            <circle cx="700" cy="150" r="30" fill="white" opacity="0.8" />
            <circle cx="200" cy="350" r="25" fill="white" opacity="0.7" />
            <circle cx="300" cy="380" r="28" fill="white" opacity="0.6" />
            <circle cx="400" cy="320" r="30" fill="white" opacity="0.8" />
            <circle cx="500" cy="350" r="25" fill="white" opacity="0.7" />
            <circle cx="600" cy="380" r="28" fill="white" opacity="0.6" />
            <circle cx="150" cy="450" r="22" fill="white" opacity="0.8" />
            <circle cx="250" cy="480" r="26" fill="white" opacity="0.7" />
            <circle cx="350" cy="420" r="24" fill="white" opacity="0.6" />
            <circle cx="450" cy="450" r="22" fill="white" opacity="0.8" />
            <circle cx="550" cy="480" r="26" fill="white" opacity="0.7" />
            <circle cx="650" cy="420" r="24" fill="white" opacity="0.6" />
            {/* Additional decorative elements */}
            <rect x="120" y="200" width="40" height="60" rx="20" fill="white" opacity="0.5" />
            <rect x="320" y="230" width="40" height="60" rx="20" fill="white" opacity="0.5" />
            <rect x="520" y="200" width="40" height="60" rx="20" fill="white" opacity="0.5" />
            <rect x="220" y="400" width="40" height="60" rx="20" fill="white" opacity="0.5" />
            <rect x="420" y="430" width="40" height="60" rx="20" fill="white" opacity="0.5" />
            <rect x="620" y="400" width="40" height="60" rx="20" fill="white" opacity="0.5" />
          </svg>
        </div>

        {/* Welcome Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-8xl font-extrabold text-white mix-blend-screen select-none opacity-90" style={{ fontFamily: 'var(--font-display)' }}>
            Welcome
          </h2>
        </div>
      </div>
    </div>
  );
}
