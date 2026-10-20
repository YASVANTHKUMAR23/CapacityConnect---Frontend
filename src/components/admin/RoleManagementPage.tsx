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
  GraduationCap,
  Info,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { PendingApprovalItem, UserDirectoryItem } from '../../types';
import { MobileStatCards } from './MobileStatCards';
import { ScrollDrivenTable } from './ScrollDrivenTable';

interface RoleManagementPageProps {
  showToast: (msg: string) => void;
}

export const RoleManagementPage: React.FC<RoleManagementPageProps> = ({ showToast }) => {
  const { pendingApprovals, approveUser, rejectUser, userDirectory, updateUserRole } =
    useAdminData();

  const [searchQuery, setSearchQuery] = useState('');

  // Tailgrids-style Approval Dialog
  const [selectedApprovalUser, setSelectedApprovalUser] = useState<PendingApprovalItem | null>(null);

  // Role Change Drawer state
  const [roleDrawerUser, setRoleDrawerUser] = useState<UserDirectoryItem | null>(null);
  const [drawerTargetRole, setDrawerTargetRole] = useState<'Trainee' | 'Trainer' | null>(null);
  const [drawerConfirmed, setDrawerConfirmed] = useState(false);
  const [drawerReason, setDrawerReason] = useState('Routine departmental reassignment');

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

  const handleConfirmDrawerRoleChange = () => {
    if (!roleDrawerUser || !drawerTargetRole) return;
    updateUserRole(roleDrawerUser.id, drawerTargetRole);
    showToast(`Role updated: ${roleDrawerUser.name} is now assigned as ${drawerTargetRole}.`);
    setRoleDrawerUser(null);
    setDrawerTargetRole(null);
    setDrawerConfirmed(false);
  };

  const filteredDirectory = userDirectory.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-full min-w-0 space-y-4 sm:space-y-6">
      {/* Mobile Stat Cards at top strictly matching reference images */}
      <MobileStatCards />

      {/* 1. Pending Approvals Card */}
      <div className="w-full max-w-full min-w-0 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
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
          <ScrollDrivenTable minWidth="min-w-[720px]">
            <table className="w-full text-left text-xs min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[220px]">User</th>
                  <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[150px]">Division</th>
                  <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[150px]">Role requested</th>
                  <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[130px]">Submitted</th>
                  <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[170px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingApprovals.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                      <div>
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        <div className="text-slate-400 text-[11px] font-normal">
                          {p.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">{p.division}</td>
                    <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700">
                        {p.roleRequested}
                      </span>
                    </td>
                    <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-500 font-medium">{p.submitted}</td>
                    <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-right">
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
          </ScrollDrivenTable>
        )}
      </div>

      {/* 2. All Users / Members list Card (Scroll-Driven Table on mobile) */}
      <div className="w-full max-w-full min-w-0 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Mobile Heading and Search+Filter row strictly matching reference image */}
        <div className="sm:hidden mb-3">
          <h2 className="font-bold text-slate-900 text-base mb-3">Members list</h2>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 shadow-2xs"
              />
            </div>
            <button
              type="button"
              className="px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-white text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs shrink-0 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-600" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Desktop Title & Search bar preserved for non-mobile views */}
        <div className="hidden sm:flex items-center justify-between gap-4 mb-5">
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

        {/* Scroll-Driven Users Table */}
        <ScrollDrivenTable minWidth="min-w-[840px]">
          <table className="w-full text-left text-[13px] min-w-[840px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[13px]">
                <th className="py-3.5 pl-3 pr-2 w-10">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[240px]">Client</th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[140px]">Role</th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[120px]">Status</th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[130px]">Joined</th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[160px] text-right">Change role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDirectory.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="py-4 pl-3 pr-2">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                        {u.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-[13px]">{u.name}</div>
                        <div className="text-slate-400 text-xs font-normal">
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    {u.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-xs bg-emerald-50 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-rose-700 font-semibold text-xs bg-rose-50 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Suspended
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-500 font-medium text-xs">{u.joined}</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setRoleDrawerUser(u);
                        setDrawerTargetRole(u.role === 'Trainer' ? 'Trainee' : 'Trainer');
                        setDrawerConfirmed(false);
                        setDrawerReason('Routine departmental role reassignment');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/70 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                      title="Open role change drawer"
                    >
                      <Shield className="w-3.5 h-3.5 text-blue-600" />
                      <span>Change role</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollDrivenTable>

        {/* Mobile Pagination strictly matching reference image */}
        <div className="sm:hidden flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
          <button
            type="button"
            className="w-9 h-9 rounded-xl border border-slate-200/90 bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 shadow-2xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <button
              type="button"
              className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-xs cursor-pointer"
            >
              1
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              2
            </button>
            <span className="text-slate-400 px-1">...</span>
            <button
              type="button"
              className="w-8 h-8 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              10
            </button>
          </div>
          <button
            type="button"
            className="w-9 h-9 rounded-xl border border-slate-200/90 bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop Pagination (preserved for non-mobile views) */}
        <div className="hidden sm:flex items-center justify-between pt-5 border-t border-slate-100 text-xs text-slate-500">
          <span>Showing 1-{filteredDirectory.length} of 1,346</span>
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
      {/* 1. TAILGRIDS-STYLE APPROVAL DIALOG (on User Approval)     */}
      {/* ======================================================== */}
      {selectedApprovalUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Dialog Header */}
            <div className="p-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Approve User Profile</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    A new account request is pending. Review profile details before granting portal access.
                  </p>
                </div>
              </div>
            </div>

            {/* Dialog Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* Profile Card */}
              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
                <div className="flex items-center gap-3.5 mb-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      selectedApprovalUser.avatarBg || 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {selectedApprovalUser.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm truncate">
                        {selectedApprovalUser.name}
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                        Requested: {selectedApprovalUser.roleRequested}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{selectedApprovalUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/60 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Division</span>
                    <span className="font-semibold text-slate-700">{selectedApprovalUser.division}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Submitted</span>
                    <span className="font-semibold text-slate-700">{selectedApprovalUser.submitted}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Employee ID</span>
                    <span className="font-semibold text-slate-700">
                      IMD-2026-{selectedApprovalUser.id.replace('app-', '').toUpperCase().padStart(4, '0')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Security Clearance</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Level 2 Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Tailgrids-styled Summary Checklist */}
              <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-4">
                <h4 className="mb-2 text-sm font-semibold text-slate-900">
                  Profile Details & Verification Checklist
                </h4>
                <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-600">
                  <li>Official Government email domain verified (<b>@imd.gov.in</b>)</li>
                  <li>Scientific Officer credential verified by Head of Division</li>
                  <li>National Meteorology Center security clearance completed</li>
                  <li>Orientation and data compliance acknowledgement signed</li>
                </ul>
              </div>
            </div>

            {/* Dialog Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <button
                type="button"
                onClick={() => setSelectedApprovalUser(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Remind Me Later
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => confirmReject(selectedApprovalUser)}
                  className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => confirmApprove(selectedApprovalUser)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Update & Approve Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ROLE CHANGE DRAWER (2 Options: Trainee / Trainer)     */}
      {/* ======================================================== */}
      {roleDrawerUser && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setRoleDrawerUser(null)}
          />

          {/* Sliding Drawer */}
          <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-white shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200 z-50">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <Shield className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Change User Role</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Modify portal authorization and role permissions
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRoleDrawerUser(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              {/* User Profile Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${
                    roleDrawerUser.avatarBg || 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {roleDrawerUser.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{roleDrawerUser.name}</h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200/80 text-slate-700">
                      Current: {roleDrawerUser.role}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs truncate mt-0.5">{roleDrawerUser.email}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Joined: {roleDrawerUser.joined}</p>
                </div>
              </div>

              {/* 2 Role Options: Trainee and Trainer only */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Select New Role (2 Options)
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Trainee / Trainer</span>
                </div>

                {/* Option 1: Trainee */}
                <button
                  type="button"
                  onClick={() => {
                    setDrawerTargetRole('Trainee');
                    setDrawerConfirmed(false);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                    drawerTargetRole === 'Trainee'
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      drawerTargetRole === 'Trainee'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-sm">Trainee</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        Learner Track
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Access training modules, radar & synoptic weather quizzes, track competency gaps, and participate in divisional sessions.
                    </p>
                  </div>
                </button>

                {/* Option 2: Trainer */}
                <button
                  type="button"
                  onClick={() => {
                    setDrawerTargetRole('Trainer');
                    setDrawerConfirmed(false);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                    drawerTargetRole === 'Trainer'
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      drawerTargetRole === 'Trainer'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-sm">Trainer</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Instructor Track
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Manage course curriculums, organize live simulations, score assignments, evaluate trainees, and oversee competency metrics.
                    </p>
                  </div>
                </button>
              </div>

              {/* Confirmation Step */}
              {drawerTargetRole && (
                <div className="space-y-3 pt-3 border-t border-slate-200/80 animate-in fade-in duration-150">
                  {/* Transition visual */}
                  <div className="p-3.5 bg-blue-50/60 border border-blue-200/80 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">From</span>
                      <span className="font-bold text-slate-800 text-xs">{roleDrawerUser.role}</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 font-bold text-xs">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-blue-600 block">To</span>
                      <span className="font-bold text-blue-700 text-xs">{drawerTargetRole}</span>
                    </div>
                  </div>

                  {/* Justification input */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Administrative Reason (Audit Log Reference)
                    </label>
                    <input
                      type="text"
                      value={drawerReason}
                      onChange={(e) => setDrawerReason(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                      placeholder="e.g., Routine departmental role reassignment"
                    />
                  </div>

                  {/* Verification Checkbox */}
                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={drawerConfirmed}
                      onChange={(e) => setDrawerConfirmed(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-[11.5px] font-medium text-slate-700 leading-snug">
                      I confirm that as an Administrator, I have verified the credentials and authorization to modify <b>{roleDrawerUser.name}</b>'s role to <b>{drawerTargetRole}</b>.
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-2.5 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setRoleDrawerUser(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!drawerTargetRole || !drawerConfirmed}
                onClick={handleConfirmDrawerRoleChange}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Change Role</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
