import React, { useState } from 'react';
import {
  Check,
  X,
  Search,
  ChevronDown,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  Shield,
  FileText,
  CheckCircle2,
  Building,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { PendingApprovalItem, UserDirectoryItem } from '../../types';

interface RoleManagementPageProps {
  showToast: (msg: string) => void;
}

interface PendingRoleChangeState {
  user: UserDirectoryItem;
  targetRole: 'Trainer' | 'Trainee' | 'Admin';
  verificationChecked: boolean;
  reason: string;
}

export const RoleManagementPage: React.FC<RoleManagementPageProps> = ({ showToast }) => {
  const { pendingApprovals, approveUser, rejectUser, userDirectory, updateUserRole } =
    useAdminData();

  const [searchQuery, setSearchQuery] = useState('');

  // Modal 1: User Profile Approval Summary Pop-up
  const [selectedApprovalUser, setSelectedApprovalUser] = useState<PendingApprovalItem | null>(null);

  // Modal 2: Administrative Verification Pop-up before changing user role
  const [pendingRoleChange, setPendingRoleChange] = useState<PendingRoleChangeState | null>(null);

  const confirmApprove = (p: PendingApprovalItem) => {
    approveUser(p.id);
    showToast(`Approved ${p.name} as ${p.roleRequested}. Portal access granted.`);
    setSelectedApprovalUser(null);
  };

  const confirmReject = (p: PendingApprovalItem) => {
    rejectUser(p.id);
    showToast(`Rejected account request for ${p.name}.`);
    setSelectedApprovalUser(null);
  };

  const confirmRoleChange = () => {
    if (!pendingRoleChange) return;
    const { user, targetRole } = pendingRoleChange;
    updateUserRole(user.id, targetRole);
    showToast(`Administrative verification complete: Updated ${user.name}'s role to ${targetRole}.`);
    setPendingRoleChange(null);
  };

  const filteredDirectory = userDirectory.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 1. Pending Approvals Card matching 06-role-management.png */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-slate-900 text-base">Pending approvals</h2>
          <span className="text-xs font-semibold text-slate-500">
            {pendingApprovals.length > 0
              ? `${pendingApprovals.length} waiting`
              : '0 waiting'}
          </span>
        </div>

        {pendingApprovals.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            All pending account approvals have been reviewed.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="pb-3.5 font-medium">User</th>
                  <th className="pb-3.5 font-medium">Division</th>
                  <th className="pb-3.5 font-medium">Role requested</th>
                  <th className="pb-3.5 font-medium">Submitted</th>
                  <th className="pb-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingApprovals.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 pr-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            p.avatarBg || 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {p.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{p.name}</div>
                          <div className="text-slate-400 text-[11px] font-normal">
                            {p.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-700 font-medium">{p.division}</td>
                    <td className="py-3.5">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700">
                        {p.roleRequested}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500 font-medium">{p.submitted}</td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Clicking Approve triggers the Profile Summary Pop-up */}
                        <button
                          type="button"
                          onClick={() => setSelectedApprovalUser(p)}
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer shadow-2xs"
                          title="Review profile summary and approve"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmReject(p)}
                          className="text-rose-600 hover:text-rose-700 font-semibold px-3 py-1.5 rounded-xl text-xs hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. All Users Section matching 06-role-management.png */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-bold text-slate-900 text-base">All users</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Role transitions require administrative verification before taking effect.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users"
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3.5 font-medium">User</th>
                <th className="pb-3.5 font-medium">Current role</th>
                <th className="pb-3.5 font-medium">Status</th>
                <th className="pb-3.5 font-medium">Joined</th>
                <th className="pb-3.5 font-medium text-right">Change role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDirectory.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          u.avatarBg || 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{u.name}</div>
                        <div className="text-slate-400 text-[11px] font-normal">
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5">
                    {u.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-rose-700 font-semibold text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Suspended
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-slate-500 font-medium">{u.joined}</td>
                  <td className="py-3.5 text-right">
                    <div className="inline-flex items-center">
                      <select
                        value={u.role}
                        onChange={(e) => {
                          const newRole = e.target.value as 'Trainer' | 'Trainee' | 'Admin';
                          if (newRole !== u.role) {
                            // Triggers Admin Verification Pop-up before changing role
                            setPendingRoleChange({
                              user: u,
                              targetRole: newRole,
                              verificationChecked: false,
                              reason: 'Routine departmental role reassignment',
                            });
                          }
                        }}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 cursor-pointer hover:border-blue-300 transition-colors"
                      >
                        <option value="Trainee">Trainee</option>
                        <option value="Trainer">Trainer</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination matching 06-role-management.png */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-100 text-xs text-slate-500">
          <span>Showing 1-4 of 1,346</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              className="px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* POP-UP 1: Profile Details & Summary on User Approval      */}
      {/* ======================================================== */}
      {selectedApprovalUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">User Profile Approval Summary</h3>
                  <p className="text-[11px] text-slate-400">Review profile details before granting portal access</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApprovalUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* Profile Card Header */}
              <div className="flex items-start gap-3.5 p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shrink-0 shadow-2xs ${
                    selectedApprovalUser.avatarBg || 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {selectedApprovalUser.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm truncate">
                      {selectedApprovalUser.name}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                      Requested: {selectedApprovalUser.roleRequested}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{selectedApprovalUser.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      {selectedApprovalUser.division}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Submitted {selectedApprovalUser.submitted}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Details Grid */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Employee ID
                  </span>
                  <span className="font-bold text-slate-800 text-xs">
                    IMD-2026-{selectedApprovalUser.id.replace('app-', '').toUpperCase().padStart(4, '0')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Official Phone
                  </span>
                  <span className="font-semibold text-slate-700 text-xs">
                    +91 98201 44820
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Assigned Region
                  </span>
                  <span className="font-semibold text-slate-700 text-xs">
                    {selectedApprovalUser.division} Station
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Clearance Status
                  </span>
                  <span className="font-semibold text-emerald-600 text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Level 2 Verified
                  </span>
                </div>
              </div>

              {/* Simple Profile Summary */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Profile Summary & Endorsement
                </span>
                <p className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-600 leading-relaxed text-[11.5px]">
                  Scientific officer candidate stationed at <b>{selectedApprovalUser.division}</b>. Specializes in synoptic weather analysis, observational telemetry, and early warning radar interpretation. Completed preliminary background checks and holds departmental endorsement for <b>{selectedApprovalUser.roleRequested}</b> portal credentials.
                </p>
              </div>

              {/* Verification Checklist */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Automated Verification Checks
                </span>
                <div className="flex items-center gap-2 text-[11px] text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Official Government email domain verified (<b>@imd.gov.in</b>)</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Head of Division recommendation document verified</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Orientation and data compliance acknowledgement signed</span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <button
                type="button"
                onClick={() => confirmReject(selectedApprovalUser)}
                className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Reject Request
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedApprovalUser(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100 font-semibold text-slate-600 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => confirmApprove(selectedApprovalUser)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Grant Access</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* POP-UP 2: Admin Verification Pop-up for User Role Change */}
      {/* ======================================================== */}
      {pendingRoleChange && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Administrative Verification Required
                  </h3>
                  <p className="text-[11px] text-amber-800/80">Secondary confirmation for role modification</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingRoleChange(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* User details */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    pendingRoleChange.user.avatarBg || 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {pendingRoleChange.user.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 text-xs">
                    {pendingRoleChange.user.name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {pendingRoleChange.user.email}
                  </div>
                </div>
              </div>

              {/* Role Transition Visual */}
              <div className="flex items-center justify-between p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl">
                <div className="text-center">
                  <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                    Current Role
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200/80 text-slate-700 inline-block">
                    {pendingRoleChange.user.role}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-blue-600 px-2">
                  <ArrowRight className="w-4 h-4" />
                  <span className="text-[9px] font-bold uppercase mt-0.5">Switching to</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-semibold text-blue-600 block mb-1">
                    New Target Role
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white inline-block shadow-2xs">
                    {pendingRoleChange.targetRole}
                  </span>
                </div>
              </div>

              {/* Permission Impact Description */}
              <div className="p-3 bg-amber-50/80 border border-amber-200/70 rounded-xl space-y-1 text-amber-900">
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Access & Security Impact</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900/90">
                  {pendingRoleChange.targetRole === 'Admin'
                    ? 'Granting Administrator privileges provides full system governance, role elevation, data modification, and emergency broadcast publishing.'
                    : pendingRoleChange.targetRole === 'Trainer'
                    ? 'Granting Trainer credentials allows curriculum authoring, scoring assignments, publishing grades, and evaluating trainees.'
                    : 'Switching to Trainee restricts access to standard learner modules, self-enrollment, and personal progress tracking.'}
                </p>
              </div>

              {/* Justification note */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Reason for Role Change (Audit Log Reference)
                </label>
                <input
                  type="text"
                  value={pendingRoleChange.reason}
                  onChange={(e) =>
                    setPendingRoleChange({ ...pendingRoleChange, reason: e.target.value })
                  }
                  placeholder="e.g., Annual promotion, inter-division transfer"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                />
              </div>

              {/* Mandatory Verification Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={pendingRoleChange.verificationChecked}
                  onChange={(e) =>
                    setPendingRoleChange({
                      ...pendingRoleChange,
                      verificationChecked: e.target.checked,
                    })
                  }
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-[11px] font-medium text-slate-700 leading-snug">
                  I confirm that as an Administrator, I have verified the credentials and authorization to modify <b>{pendingRoleChange.user.name}</b>'s role to <b>{pendingRoleChange.targetRole}</b>.
                </span>
              </label>
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setPendingRoleChange(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 font-semibold text-slate-600 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!pendingRoleChange.verificationChecked}
                onClick={confirmRoleChange}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Update Role</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
