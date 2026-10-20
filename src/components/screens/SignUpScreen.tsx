import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Screen, UserAccount, UserRole } from '../../types';

interface SignUpScreenProps {
  onNavigate: (screen: Screen) => void;
  setCurrentUser: (user: UserAccount | null) => void;
  showToast: (msg: string) => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onNavigate,
  setCurrentUser,
  showToast,
}) => {
  const [role, setRole] = useState<UserRole>('trainee');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!email.trim()) {
      setError('Please provide your work email address');
      return;
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the terms of use and privacy policy');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const newUser: UserAccount = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        organization: organization.trim() || 'Regional Meteorological Centre',
        role: role,
        status: 'pending',
        submittedDate: '19 Oct 2026',
      };

      setCurrentUser(newUser);
      showToast('Registration submitted. Admin approval is pending.');
      onNavigate('pending-approval');
    }, 450);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4">
      {/* Title block */}
      <div className="mb-6">
        <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
          Create your account
        </h1>
        <p className="text-[15px] text-slate-500 mt-2 font-normal leading-relaxed">
          Choose how you will use the portal. An admin reviews every new account.
        </p>
      </div>

      {/* Role Segmented Control */}
      <div className="bg-[#eceef1] p-1 rounded-lg flex mb-6">
        <button
          type="button"
          onClick={() => setRole('trainee')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
            role === 'trainee'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Trainee
        </button>
        <button
          type="button"
          onClick={() => setRole('trainer')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all cursor-pointer ${
            role === 'trainer'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Trainer
        </button>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label 
              htmlFor="firstName" 
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              First name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Asha"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-xs"
            />
          </div>
          <div>
            <label 
              htmlFor="lastName" 
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Verma"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Work email */}
        <div>
          <label 
            htmlFor="workEmail" 
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            Work email
          </label>
          <input
            id="workEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@organization.gov.in"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-xs"
          />
        </div>

        {/* Organization */}
        <div>
          <label 
            htmlFor="organization" 
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            Organization or division
          </label>
          <input
            id="organization"
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            placeholder="e.g. Regional Meteorological Centre"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-xs"
          />
        </div>

        {/* Password */}
        <div>
          <label 
            htmlFor="signupPassword" 
            className="block text-sm font-medium text-slate-800 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="signupPassword"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-3.5 py-2.5 pr-10 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-xs"
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

        {/* Terms checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-slate-900 bg-white border-slate-300 focus:ring-slate-900 focus:ring-offset-0 accent-slate-900 cursor-pointer"
            />
            <span className="text-sm text-slate-600 leading-snug">
              I agree to the terms of use and privacy policy
            </span>
          </label>
        </div>

        {/* Create account button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#181c24] hover:bg-[#242b38] active:bg-[#12151b] text-white py-3 rounded-lg font-medium text-sm transition-all shadow-xs cursor-pointer disabled:opacity-60 flex items-center justify-center"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Create account'
            )}
          </button>
        </div>
      </form>

      {/* Footer link */}
      <div className="text-center mt-7 text-sm text-slate-600 font-normal">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="text-blue-600 hover:text-blue-700 font-medium hover:underline focus:outline-hidden transition-colors"
        >
          Sign in
        </button>
      </div>

      {/* Preset sample autofill */}
      <div className="mt-8 pt-5 border-t border-slate-100 text-center">
        <button
          type="button"
          onClick={() => {
            setRole('trainee');
            setFirstName('Asha');
            setLastName('Verma');
            setEmail('asha.verma@imd.gov.in');
            setOrganization('Regional Meteorological Centre');
            setPassword('WeatherSec@2026');
            setAgreeTerms(true);
          }}
          className="text-xs text-blue-600 hover:underline"
        >
          Autofill with Asha Verma sample data
        </button>
      </div>
    </div>
  );
};
