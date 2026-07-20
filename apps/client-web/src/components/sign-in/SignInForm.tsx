import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormMessage } from '@/components/ui/form-message';
import { FormSubmitError } from '@/components/ui/form-submit-error';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@grow-fitness/shared-schemas';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/useAuth';
import SharedButton from '../common/SharedButton';

export default function LoginPage() {
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
    formState: { errors, isSubmitting },
  } = useForm<{ email: string; password: string }>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      setError(null);
      await login(data.email, data.password);
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "We couldn't sign you in. Check your email and password and try again.";
      setError(message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbf8ed]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fbf8ed] py-12 px-4 sm:px-6 lg:px-8 pt-36 relative overflow-hidden">
      <img
        src="/images/Grow VI Elements/Icons/Yellow abs.png"
        alt="flower"
        className="absolute w-[360px] opacity-70 pointer-events-none animate-spin-slow"
        style={{ right: -60, top: -80 }}
      />
      <img
        src="/images/Grow VI Elements/Icons/Yellow abs.png"
        alt="flower"
        className="absolute w-[360px] opacity-70 pointer-events-none animate-spin-slow"
        style={{ left: -60, bottom: -80 }}
      />
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-[#afe27d]/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#23b685]/10 to-transparent rounded-full blur-3xl" />
      
      <div className="max-w-md mx-auto relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-[#243e36] hover:text-[#23b685] transition-colors duration-300 mb-6 mt-6 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-3">
            <span className="inline-block text-[#23b685] font-bold text-sm tracking-wider uppercase bg-[#e8f7f0] px-4 py-1 rounded-full">
              Welcome Back
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-[#243e36] mb-2 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Sign In to <span className="text-[#23b685]">GROW Fitness</span>
          </h1>
          <p className="text-[#4a6359] text-sm">Access your account and track your progress</p>
        </div>

        <Card className="shadow-2xl bg-white border border-[#d8e6dd] rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#23b685] via-[#afe27d] to-[#23b685]" />
          
          <CardHeader className="pb-2">
            <CardTitle className="text-[#243e36] text-xl font-semibold">Sign In</CardTitle>
            <CardDescription className="text-[#88a297] text-sm">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-[#243e36] text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className="mt-1.5 bg-[#f1faea] border-[#d8e6dd] text-[#243e36] placeholder:text-[#88a297] focus:border-[#23b685] focus:ring-[#23b685]/30 transition-all duration-300 rounded-xl"
                  {...register('email')}
                />
                <FormMessage id="email-error" variant="error" className="text-[#ff6b35] text-xs mt-1">
                  {errors.email?.message}
                </FormMessage>
              </div>

              <div>
                <Label htmlFor="password" className="text-[#243e36] text-sm font-medium">
                  Password
                </Label>

                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    className="pr-10 bg-[#f1faea] border-[#d8e6dd] text-[#243e36] placeholder:text-[#88a297] focus:border-[#23b685] focus:ring-[#23b685]/30 transition-all duration-300 rounded-xl"
                    {...register('password')}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#88a297] hover:text-[#23b685] transition-colors duration-200 focus:outline-none bg-transparent border-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <FormMessage id="password-error" variant="error" className="text-[#ff6b35] text-xs mt-1">
                  {errors.password?.message}
                </FormMessage>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link to="/forgot-password" className="text-sm text-[#23b685] hover:text-[#243e36] transition-colors duration-300 font-medium">
                  Forgot password?
                </Link>
              </div>

              <SharedButton
                text={isSubmitting ? 'Signing In...' : 'Sign In'}
                onClick={handleSubmit(onSubmit)}
                backgroundColor="#23b685"
                color="white"
                className="justify-center text-center w-full text-md font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-[#243e36]/20 transition-all duration-300 transform hover:scale-[1.02]"
                icon={null}
                size="md"
              />

              <div className="text-center pt-2">
                <span className="text-[#4a6359] text-sm">Don't have an account? </span>
                <Link to="/sign-up" className="text-[#23b685] hover:text-[#243e36] transition-colors duration-300 font-semibold text-sm">
                  Sign up
                </Link>
              </div>
            </form>
            
            {error && (
              <div className="mt-4">
                <FormSubmitError 
                  message={error} 
                  className="bg-[#ff6b35]/10 border border-[#ff6b35]/30 text-[#ff6b35] rounded-xl p-3 text-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Footer note */}
        <div className="text-center mt-6">
          <p className="text-[#88a297] text-xs">
            © 2026 Grow Fitness. All rights reserved.
          </p>
        </div>
      </div>
      
    </div>
  );
}