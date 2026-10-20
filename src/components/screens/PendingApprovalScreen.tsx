import React from 'react';
import { Clock } from 'lucide-react';
import { Screen, UserAccount } from '../../types';

interface PendingApprovalScreenProps {
  onNavigate: (screen: Screen) => void;
  currentUser: UserAccount | null;
  setCurrentUser: (user: UserAccount | null) => void;
  showToast: (msg: string) => void;
}

export const PendingApprovalScreen: React.FC<PendingApprovalScreenProps> = ({
  onNavigate,
  currentUser,
  setCurrentUser,
  showToast,
}) => {
  const name = currentUser 
    ? `${currentUser.firstName} ${currentUser.lastName}`.trim() || 'Asha Verma' 
    : 'Asha Verma';
  
  const roleDisplay = currentUser?.role 
    ? (currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)) 
    : 'Trainee';

  const submittedDate = currentUser?.submittedDate || '19 Oct 2026';

  const handleSignOut = () => {
    showToast('Signed out successfully.');
    onNavigate('login');
  };

  const handleSimulateApproval = () => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        status: 'approved',
      });
    } else {
      setCurrentUser({
        firstName: 'Asha',
        lastName: 'Verma',
        email: 'asha.verma@imd.gov.in',
        organization: 'Regional Meteorological Centre',
        role: 'trainee',
        status: 'approved',
        submittedDate: '19 Oct 2026',
      });
    }
    showToast('Account approved by Administrator! Welcome to the portal.');
    onNavigate('admin-portal');
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4">
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg border border-slate-200/90 bg-white flex items-center justify-center text-slate-800 shadow-xs mb-6">
        <Clock className="w-4 h-4 stroke-[1.8]" />
      </div>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
          Your account is awaiting approval
        </h1>
        <p className="text-[15px] text-slate-500 mt-2 font-normal leading-relaxed">
          An admin is reviewing your request. We will email you as soon as you can sign in. This usually takes one to two working days.
        </p>
      </div>

      {/* Info Card */}
      <div className="border border-slate-200/90 rounded-xl bg-white shadow-xs overflow-hidden mb-6 divide-y divide-slate-100">
        <div className="flex items-center justify-between px-4 py-3 text-sm">
          <span className="text-slate-500">Name</span>
          <span className="font-medium text-slate-900">{name}</span>
        </div>

        <div className="flex items-center justify-between px-4 py-3 text-sm">
          <span className="text-slate-500">Role requested</span>
          <span className="font-medium text-slate-900">{roleDisplay}</span>
        </div>

        <div className="flex items-center justify-between px-4 py-3 text-sm">
          <span className="text-slate-500">Submitted</span>
          <span className="font-medium text-slate-900">{submittedDate}</span>
        </div>

        <div className="flex items-center justify-between px-4 py-3 text-sm">
          <span className="text-slate-500">Status</span>
          <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-[#eef2ff] text-[#4338ca]">
            Pending review
          </span>
        </div>
      </div>

      {/* Sign out button */}
      <div>
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 border border-slate-200/90 py-2.5 rounded-lg font-medium text-sm transition-all shadow-xs cursor-pointer"
        >
          Sign out
        </button>
      </div>

      {/* UX Demo Action: Simulate Admin Approval */}
      <div className="mt-8 pt-5 border-t border-slate-100 text-center">
        <button
          type="button"
          onClick={handleSimulateApproval}
          className="text-xs text-blue-600 hover:underline"
        >
          Admin demo: Approve this account now & enter portal
        </button>
      </div>
    </div>
  );
};
