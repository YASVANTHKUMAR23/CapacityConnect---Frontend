import React from 'react';
import { Lock } from 'lucide-react';
import { Screen, UserAccount } from '../../types';

interface AccessDeniedScreenProps {
  onNavigate: (screen: Screen) => void;
  currentUser: UserAccount | null;
  setCurrentUser: (user: UserAccount | null) => void;
  showToast: (msg: string) => void;
}

export const AccessDeniedScreen: React.FC<AccessDeniedScreenProps> = ({
  onNavigate,
  currentUser,
  setCurrentUser,
  showToast,
}) => {
  const userRole = currentUser?.role || 'trainee';

  const handleGoToDashboard = () => {
    onNavigate('admin-portal');
  };

  const handleSwitchAccount = () => {
    setCurrentUser(null);
    showToast('Signed out. Please sign in with an authorized account.');
    onNavigate('login');
  };

  const handleElevateToTrainer = () => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        role: 'trainer',
      });
    } else {
      setCurrentUser({
        firstName: 'Dr. Rajesh',
        lastName: 'Sharma',
        email: 'rajesh.sharma@imd.gov.in',
        organization: 'India Meteorological Department',
        role: 'trainer',
        status: 'approved',
        submittedDate: '19 Oct 2026',
      });
    }
    showToast('Elevated to Trainer role! Access granted.');
    onNavigate('admin-portal');
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4">
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg border border-slate-200/90 bg-white flex items-center justify-center text-slate-800 shadow-xs mb-6">
        <Lock className="w-4 h-4 stroke-[1.8]" />
      </div>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
          You don't have access to this page
        </h1>
        <p className="text-[15px] text-slate-500 mt-2 font-normal leading-relaxed">
          This page is only available to trainers and admins. Your account is signed in as a {userRole}.
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGoToDashboard}
          className="w-full bg-[#181c24] hover:bg-[#242b38] active:bg-[#12151b] text-white py-3 rounded-lg font-medium text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center"
        >
          Go to my dashboard
        </button>

        <button
          type="button"
          onClick={handleSwitchAccount}
          className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 border border-slate-200/90 py-2.5 rounded-lg font-medium text-sm transition-all shadow-xs cursor-pointer"
        >
          Switch account
        </button>
      </div>

      {/* Simulation demo helper */}
      <div className="mt-8 pt-5 border-t border-slate-100 text-center">
        <button
          type="button"
          onClick={handleElevateToTrainer}
          className="text-xs text-blue-600 hover:underline"
        >
          Demo: Upgrade role to Trainer to grant access
        </button>
      </div>
    </div>
  );
};
