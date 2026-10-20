import React, { useState } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { Screen, UserAccount } from '../../types';

interface SignInScreenProps {
  onNavigate: (screen: Screen) => void;
  currentUser: UserAccount | null;
  setCurrentUser: (user: UserAccount | null) => void;
  showToast: (msg: string) => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({
  onNavigate,
  currentUser,
  setCurrentUser,
  showToast,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Check if Admin sign in
      if (email.toLowerCase().includes('admin')) {
        const adminUser: UserAccount = {
          firstName: 'Admin',
          lastName: 'Headquarters',
          email: email || 'admin@imd.gov.in',
          organization: 'IMD Headquarters',
          role: 'admin',
          status: 'approved',
          submittedDate: '19 Oct 2026',
        };
        setCurrentUser(adminUser);
        showToast('Welcome, Administrator. Logged into Admin Portal.');
        onNavigate('admin-portal');
        return;
      }

      // Check if pending trainee
      if (email.toLowerCase().includes('asha') || email.toLowerCase().includes('pending')) {
        if (!currentUser) {
          setCurrentUser({
            firstName: 'Asha',
            lastName: 'Verma',
            email: email || 'asha.verma@imd.gov.in',
            organization: 'Regional Meteorological Centre',
            role: 'trainee',
            status: 'pending',
            submittedDate: '19 Oct 2026',
          });
        }
        showToast('Your account is currently awaiting administrative approval.');
        onNavigate('pending-approval');
        return;
      }

      // Default approved trainer/user
      const isTrainer = email.toLowerCase().includes('trainer') || email.toLowerCase().includes('sharma');
      const approvedUser: UserAccount = {
        firstName: isTrainer ? 'Dr. Ravi' : 'Divya',
        lastName: isTrainer ? 'Menon' : 'Pillai',
        email: email,
        organization: 'India Meteorological Department',
        role: isTrainer ? 'trainer' : 'trainee',
        status: 'approved',
        submittedDate: '19 Oct 2026',
      };

      setCurrentUser(approvedUser);
      showToast('Signed in successfully.');
      onNavigate('admin-portal');
    }, 350);
  };

  const handleAdminQuickFill = () => {
    setEmail('admin@imd.gov.in');
    setPassword('AdminSecure@2026');
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4">
      {/* Title block */}
      <div className="mb-7">
        <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
          Sign in
        </h1>
        <p className="text-[15px] text-slate-500 mt-2 font-normal">
          Welcome back. Enter your details to continue learning.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@organization.gov.in"
            className="w-full px-3.5 py-2.5 bg-white border border-blue-600/80 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-xs"
            autoComplete="email"
          />
        </div>

        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3.5 py-2.5 pr-10 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-xs"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-hidden"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Checkbox and Forgot password */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
              className="w-4 h-4 rounded text-slate-900 bg-white border-slate-300 focus:ring-slate-900 focus:ring-offset-0 accent-slate-900 cursor-pointer"
            />
            <span className="text-sm text-slate-700">Keep me signed in</span>
          </label>

          <button
            type="button"
            onClick={() => onNavigate('forgot-password')}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-hidden hover:underline transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#181c24] hover:bg-[#242b38] active:bg-[#12151b] text-white py-3 rounded-lg font-medium text-sm transition-all shadow-xs cursor-pointer disabled:opacity-60 flex items-center justify-center"
        >
          {isLoading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      {/* Footer link */}
      <div className="text-center mt-7 text-sm text-slate-600 font-normal">
        New to Capacity Connect?{' '}
        <button
          type="button"
          onClick={() => onNavigate('signup')}
          className="text-blue-600 hover:text-blue-700 font-medium hover:underline focus:outline-hidden transition-colors"
        >
          Create an account
        </button>
      </div>

      {/* Admin Quick Fill (Prominently featured per user instruction) */}
      <div className="mt-8 pt-5 border-t border-slate-200/80 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={handleAdminQuickFill}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
        >
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span>Quick fill: Admin Portal (admin@imd.gov.in)</span>
        </button>
      </div>
    </div>
  );
};
