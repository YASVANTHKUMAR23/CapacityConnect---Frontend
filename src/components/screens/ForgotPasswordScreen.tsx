import React, { useState } from 'react';
import { Screen } from '../../types';

interface ForgotPasswordScreenProps {
  onNavigate: (screen: Screen) => void;
  resetEmail: string;
  setResetEmail: (email: string) => void;
  showToast: (msg: string) => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onNavigate,
  resetEmail,
  setResetEmail,
  showToast,
}) => {
  const [email, setEmail] = useState(resetEmail || '');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setResetEmail(email.trim());
      showToast('Reset link sent to ' + email.trim());
      onNavigate('check-email');
    }, 400);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4">
      {/* Title block */}
      <div className="mb-7">
        <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
          Forgot your password?
        </h1>
        <p className="text-[15px] text-slate-500 mt-2 font-normal leading-relaxed">
          Enter the email linked to your account and we will send you a reset link.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="forgotEmail" 
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            Email
          </label>
          <input
            id="forgotEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@organization.gov.in"
            className="w-full px-3.5 py-2.5 bg-white border border-blue-600/80 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-xs"
            autoComplete="email"
          />
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
            'Send reset link'
          )}
        </button>
      </form>

      {/* Back to sign in link */}
      <div className="text-center mt-6">
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors focus:outline-hidden"
        >
          Back to sign in
        </button>
      </div>

      {/* Demo sample click */}
      <div className="mt-8 pt-5 border-t border-slate-100 text-center">
        <button
          type="button"
          onClick={() => setEmail('asha.verma@imd.gov.in')}
          className="text-xs text-blue-600 hover:underline"
        >
          Use sample email: asha.verma@imd.gov.in
        </button>
      </div>
    </div>
  );
};
