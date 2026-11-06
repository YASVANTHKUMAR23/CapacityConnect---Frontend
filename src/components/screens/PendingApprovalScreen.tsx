import React from 'react';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Screen, UserAccount } from '../../types';
import { useUnifiedData } from '../../context/UnifiedDataContext';

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
  const unified = useUnifiedData();
  const email = currentUser?.email || 'asha.verma@imd.gov.in';
  const liveRecord = unified.getUserByEmail(email);
  const isApproved = liveRecord ? liveRecord.status === 'approved' : currentUser?.status === 'approved';

  const name = currentUser 
    ? `${currentUser.firstName} ${currentUser.lastName}`.trim() || 'Asha Verma' 
    : (liveRecord ? `${liveRecord.firstName} ${liveRecord.lastName}`.trim() : 'Asha Verma');
  
  const role = currentUser?.role || liveRecord?.role || 'trainee';
  const roleDisplay = role ? (role.charAt(0).toUpperCase() + role.slice(1)) : 'Trainee';

  const submittedDate = currentUser?.submittedDate || liveRecord?.submittedDate || '19 Oct 2026';

  const handleSignOut = () => {
    showToast('Signed out successfully.');
    onNavigate('login');
  };

  const handleEnterDashboard = () => {
    if (role === 'trainer') {
      showToast(`Welcome to Trainer Portal, ${name}!`);
      onNavigate('trainer-portal');
    } else {
      showToast(`Welcome to Trainee Portal, ${name}!`);
      onNavigate('trainee-portal');
    }
  };

  const handleSimulateApproval = () => {
    unified.approveProfileRequest(email);
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        status: 'approved',
      });
    } else {
      setCurrentUser({
        firstName: liveRecord?.firstName || 'Asha',
        lastName: liveRecord?.lastName || 'Verma',
        email,
        organization: liveRecord?.organization || 'Regional Meteorological Centre',
        role,
        status: 'approved',
        submittedDate,
      });
    }
    showToast(`Account approved by Administrator! You can now enter your ${roleDisplay} dashboard.`);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto px-4">
      {/* Icon */}
      {isApproved ? (
        <div className="w-10 h-10 rounded-lg border border-emerald-200 bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-xs mb-6">
          <CheckCircle2 className="w-5 h-5 stroke-[2]" />
        </div>
      ) : (
        <div className="w-10 h-10 rounded-lg border border-slate-200/90 bg-white flex items-center justify-center text-slate-800 shadow-xs mb-6">
          <Clock className="w-4 h-4 stroke-[1.8]" />
        </div>
      )}

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
          {isApproved ? 'Your account has been approved!' : 'Your account is awaiting approval'}
        </h1>
        <p className="text-[15px] text-slate-500 mt-2 font-normal leading-relaxed">
          {isApproved
            ? 'An administrator has approved your profile. You can now access your dashboard and explore all learning resources.'
            : 'An admin is reviewing your request. When the administrator approves your profile, you will be granted access to the dashboard and learning resources.'}
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
          {isApproved ? (
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Approved
            </span>
          ) : (
            <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-[#eef2ff] text-[#4338ca]">
              Pending review
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-2.5">
        {isApproved ? (
          <button
            type="button"
            onClick={handleEnterDashboard}
            className="w-full bg-slate-900 hover:bg-slate-800 active:bg-black text-white py-2.5 rounded-lg font-medium text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Enter {roleDisplay} Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : null}

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 border border-slate-200/90 py-2.5 rounded-lg font-medium text-sm transition-all shadow-xs cursor-pointer"
        >
          Sign out
        </button>
      </div>

      {/* Admin Demo Actions */}
      <div className="mt-8 pt-5 border-t border-slate-100 text-center space-y-2">
        {!isApproved && (
          <button
            type="button"
            onClick={handleSimulateApproval}
            className="block w-full text-xs text-blue-600 hover:underline cursor-pointer"
          >
            Admin demo: Approve this {roleDisplay} account now
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            showToast('Switching to Admin Portal to view pending approval queue...');
            onNavigate('admin-portal');
          }}
          className="block w-full text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          Switch to Admin Portal to approve from requests table
        </button>
      </div>
    </div>
  );
};
