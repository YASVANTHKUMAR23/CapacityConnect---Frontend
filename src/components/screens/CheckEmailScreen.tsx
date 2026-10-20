import React from 'react';
import { Mail } from 'lucide-react';
import { Screen } from '../../types';

interface CheckEmailScreenProps {
  onNavigate: (screen: Screen) => void;
  resetEmail: string;
  setEmailModalOpen: (open: boolean) => void;
  showToast: (msg: string) => void;
}

export const CheckEmailScreen: React.FC<CheckEmailScreenProps> = ({
  onNavigate,
  resetEmail,
  setEmailModalOpen,
  showToast,
}) => {
  const displayEmail = resetEmail || 'asha.verma@imd.gov.in';

  const handleOpenEmailApp = () => {
    // Open simulated inbox preview modal
    setEmailModalOpen(true);
  };

  const handleResend = () => {
    showToast(`New reset link has been dispatched to ${displayEmail}`);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4">
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg border border-slate-200/90 bg-white flex items-center justify-center text-slate-800 shadow-xs mb-6">
        <Mail className="w-4 h-4 stroke-[1.8]" />
      </div>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
          Check your email
        </h1>
        <p className="text-[15px] text-slate-500 mt-2 font-normal leading-relaxed">
          We sent a reset link to <span className="font-semibold text-slate-800">{displayEmail}</span>. The link expires in 30 minutes.
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleOpenEmailApp}
          className="w-full bg-[#181c24] hover:bg-[#242b38] active:bg-[#12151b] text-white py-3 rounded-lg font-medium text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center"
        >
          Open email app
        </button>

        <button
          type="button"
          onClick={handleResend}
          className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 border border-slate-200/90 py-2.5 rounded-lg font-medium text-sm transition-all shadow-xs cursor-pointer"
        >
          Resend link
        </button>
      </div>

      {/* Back to sign in */}
      <div className="text-center mt-6">
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors focus:outline-hidden"
        >
          Back to sign in
        </button>
      </div>

      {/* Demo Direct Link to Reset Password */}
      <div className="mt-8 pt-5 border-t border-slate-100 text-center">
        <button
          type="button"
          onClick={() => onNavigate('reset-password')}
          className="text-xs text-slate-400 hover:text-blue-600 underline"
        >
          Simulation: Click here to simulate following the reset link directly
        </button>
      </div>
    </div>
  );
};
