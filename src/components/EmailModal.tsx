import React from 'react';
import { X, Mail, ExternalLink, ShieldCheck } from 'lucide-react';
import { Screen } from '../types';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  resetEmail: string;
  onNavigate: (screen: Screen) => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  resetEmail,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const emailTo = resetEmail || 'asha.verma@imd.gov.in';

  const handleResetClick = () => {
    onClose();
    onNavigate('reset-password');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Email Client Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold tracking-wide">Government Webmail Service · Inbox</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close email"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Metadata */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/60 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-800 text-sm">Reset your Capacity Connect Password</span>
            <span className="text-slate-400">Just now</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">From:</span>
            <span className="text-slate-700 font-medium">Capacity Connect Security &lt;auth-noreply@imd.gov.in&gt;</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">To:</span>
            <span className="text-slate-700 font-medium">{emailTo}</span>
          </div>
        </div>

        {/* Message Body */}
        <div className="p-6 space-y-4 text-sm text-slate-700">
          <p className="font-medium text-slate-900">
            Hello,
          </p>
          <p className="leading-relaxed">
            We received a request to reset your password for your Capacity Connect account at India Meteorological Department (MoES).
          </p>
          <p className="text-slate-600 leading-relaxed text-xs">
            If you requested this password reset, please click the secure link below to proceed. This link will expire in 30 minutes.
          </p>

          <div className="pt-2 pb-1">
            <button
              type="button"
              onClick={handleResetClick}
              className="inline-flex items-center gap-2 bg-[#181c24] hover:bg-[#252c38] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-xs cursor-pointer"
            >
              <span>Set new password</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified official dispatch from IMD Information Security Division.</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5"
          >
            Close mail
          </button>
        </div>
      </div>
    </div>
  );
};
