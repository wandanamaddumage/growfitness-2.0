import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormSubmitError } from '@/components/ui/form-submit-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authService } from '@/services/auth';
import SharedButton from '../common/SharedButton';

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('This reset link is invalid or has expired. Request a new one from the login page.');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match. Please enter the same password in both fields.");
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      await authService.resetPassword(token, password);

      setIsSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError('This reset link is invalid or has expired. Request a new one from the login page.');
      console.error('Password reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#fbf8ed]">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            This reset link is invalid or has expired. Request a new one from the login page.
          </AlertDescription>
        </Alert>
      </div>
    );
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
          <Link
            to="/login"
            className="inline-flex items-center text-[#243e36] hover:text-[#23b685] transition-colors duration-300 mb-6 font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>

          <div className="mb-3">
            <span className="inline-block text-[#23b685] font-bold text-sm tracking-wider uppercase bg-[#e8f7f0] px-4 py-1 rounded-full">
              Reset Password
            </span>
          </div>

          <h1 className="text-4xl font-bold text-[#243e36] mb-2 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Set New <span className="text-[#23b685]">Password</span>
          </h1>

          <p className="text-[#4a6359] text-sm">
            Enter your new password below
          </p>
        </div>

        <Card className="shadow-2xl bg-white border border-[#d8e6dd] rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#23b685] via-[#afe27d] to-[#23b685]" />
          
          <CardHeader className="pb-2">
            <CardTitle className="text-[#243e36] text-xl font-semibold">
              Set New Password
            </CardTitle>
            <CardDescription className="text-[#88a297] text-sm">
              Your password should be secure and unique
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4">
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && <FormSubmitError message={error} className="bg-[#ff6b35]/10 border border-[#ff6b35]/30 text-[#ff6b35] rounded-xl p-3 text-sm" />}

                <div>
                  <Label className="text-[#243e36] text-sm font-medium">New Password</Label>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="mt-1.5 bg-[#f1faea] border-[#d8e6dd] text-[#243e36] placeholder:text-[#88a297] focus:border-[#23b685] focus:ring-[#23b685]/30 transition-all duration-300 rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-[#243e36] text-sm font-medium">Confirm Password</Label>
                  <Input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="mt-1.5 bg-[#f1faea] border-[#d8e6dd] text-[#243e36] placeholder:text-[#88a297] focus:border-[#23b685] focus:ring-[#23b685]/30 transition-all duration-300 rounded-xl"
                  />
                </div>

                <SharedButton
                  text={isLoading ? 'Resetting...' : 'Reset Password'}
                  type="submit"
                  backgroundColor="#23b685"
                  color="white"
                  className="justify-center text-center w-full text-md font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-[#243e36]/20 transition-all duration-300 transform hover:scale-[1.02]"
                  icon={null}
                  size="md"
                  disabled={isLoading}
                />

              </form>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-[#23b685] font-medium text-lg">
                  ✅ Password reset successful!
                </p>

                <p className="text-sm text-[#4a6359]">
                  Redirecting to login...
                </p>

                <Link
                  to="/login"
                  className="text-[#23b685] hover:text-[#243e36] transition-colors duration-300 font-semibold"
                >
                  Back to Login
                </Link>
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

