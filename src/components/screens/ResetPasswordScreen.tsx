import React, { useState, useId } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Screen } from '../../types';

interface ResetPasswordScreenProps {
  onNavigate: (screen: Screen) => void;
  showToast: (msg: string) => void;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  onNavigate,
  showToast,
}) => {
  // Pre-seed with sample matching screenshot state
  const [newPassword, setNewPassword] = useState('Password123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const newPasswordId = useId();
  const confirmPasswordId = useId();

  // Requirements checks
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  // Compute strength bars (0 to 4)
  const strengthScore = [
    hasMinLength,
    hasNumber,
    hasSymbol,
    newPassword.length >= 10 && /[A-Z]/.test(newPassword),
  ].filter(Boolean).length;

  // In the screenshot, 3 bars are dark blue and 1 is gray
  const activeBars = Math.max(strengthScore, newPassword ? (hasMinLength && hasNumber && !hasSymbol ? 3 : strengthScore) : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasMinLength || !hasNumber) {
      setError('Please fulfill the password criteria requirements');
      return;
    }

    if (!confirmPassword) {
      setError('Please re-enter your password to confirm');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      showToast('Password updated successfully. You can now sign in.');
      onNavigate('login');
    }, 450);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4">
      {/* Title block */}
      <div className="mb-7">
        <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
          Set a new password
        </h1>
        <p className="text-[15px] text-slate-500 mt-2 font-normal leading-relaxed">
          Choose a password you have not used before on this portal.
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
            htmlFor={newPasswordId} 
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            New password
          </label>
          <div className="relative">
            <input
              id={newPasswordId}
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 pr-10 bg-white border border-blue-600/80 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-xs"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-hidden"
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
            >
              {showNewPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Segmented Strength Bar (4 segments) */}
          <div className="grid grid-cols-4 gap-1.5 mt-2.5">
            {[1, 2, 3, 4].map((segIndex) => {
              const isFilled = segIndex <= (activeBars || 3);
              return (
                <div
                  key={segIndex}
                  className={`h-1 rounded-full transition-colors ${
                    isFilled ? 'bg-[#1e3a8a]' : 'bg-slate-200'
                  }`}
                />
              );
            })}
          </div>

          {/* Criteria Checklist */}
          <div className="mt-3.5 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2.5 h-2.5 rounded-full flex items-center justify-center shrink-0 ${
                  hasMinLength
                    ? 'bg-[#1e3a8a]'
                    : 'border border-slate-300 bg-transparent'
                }`}
              />
              <span className={hasMinLength ? 'text-slate-700 font-medium' : 'text-slate-500'}>
                At least 8 characters
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span
                className={`w-2.5 h-2.5 rounded-full flex items-center justify-center shrink-0 ${
                  hasNumber
                    ? 'bg-[#1e3a8a]'
                    : 'border border-slate-300 bg-transparent'
                }`}
              />
              <span className={hasNumber ? 'text-slate-700 font-medium' : 'text-slate-500'}>
                One number
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span
                className={`w-2.5 h-2.5 rounded-full flex items-center justify-center shrink-0 ${
                  hasSymbol
                    ? 'bg-[#1e3a8a]'
                    : 'border border-slate-300 bg-transparent'
                }`}
              />
              <span className={hasSymbol ? 'text-slate-700 font-medium' : 'text-slate-500'}>
                One symbol
              </span>
            </div>
          </div>
        </div>

        {/* Confirm password */}
        <div>
          <label 
            htmlFor={confirmPasswordId} 
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            Confirm password
          </label>
          <div className="relative">
            <input
              id={confirmPasswordId}
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full px-3.5 py-2.5 pr-10 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-xs"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-hidden"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
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
            'Update password'
          )}
        </button>
      </form>
    </div>
  );
};
