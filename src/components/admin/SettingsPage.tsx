import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

interface SettingsPageProps {
  showToast: (msg: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ showToast }) => {
  const { settings, updateSettings } = useAdminData();
  const [activeSideTab, setActiveSideTab] = useState<
    'General' | 'Registration' | 'Assessments' | 'Notifications' | 'Languages' | 'Security'
  >('General');

  const [portalName, setPortalName] = useState(settings.portalName);
  const [defaultLanguage, setDefaultLanguage] = useState(settings.defaultLanguage);
  const [timeZone, setTimeZone] = useState(settings.timeZone);
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail);
  const [requireAdminApproval, setRequireAdminApproval] = useState(settings.requireAdminApproval);
  const [restrictOrgEmails, setRestrictOrgEmails] = useState(settings.restrictOrgEmails);
  const [detectTabSwitching, setDetectTabSwitching] = useState(settings.detectTabSwitching);
  const [allowRetakes, setAllowRetakes] = useState(settings.allowRetakes);
  const [sendDeadlineReminders, setSendDeadlineReminders] = useState(settings.sendDeadlineReminders);

  const handleSave = () => {
    updateSettings({
      portalName,
      defaultLanguage,
      timeZone,
      supportEmail,
      requireAdminApproval,
      restrictOrgEmails,
      detectTabSwitching,
      allowRetakes,
      sendDeadlineReminders,
    });
    showToast('Portal configuration saved successfully.');
  };

  const handleCancel = () => {
    setPortalName(settings.portalName);
    setDefaultLanguage(settings.defaultLanguage);
    setTimeZone(settings.timeZone);
    setSupportEmail(settings.supportEmail);
    setRequireAdminApproval(settings.requireAdminApproval);
    setRestrictOrgEmails(settings.restrictOrgEmails);
    setDetectTabSwitching(settings.detectTabSwitching);
    setAllowRetakes(settings.allowRetakes);
    setSendDeadlineReminders(settings.sendDeadlineReminders);
    showToast('Changes discarded.');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Settings Navigation Tabs (3 cols) matching 10-settings.png */}
        <div className="lg:col-span-3 space-y-1">
          {(
            [
              'General',
              'Registration',
              'Assessments',
              'Notifications',
              'Languages',
              'Security',
            ] as const
          ).map((tab) => {
            const isActive = activeSideTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveSideTab(tab)}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-medium text-xs transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Right Settings Form (9 cols) matching 10-settings.png */}
        <div className="lg:col-span-9 space-y-6">
          {/* General Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
            <h3 className="font-bold text-slate-900 text-sm">General</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Portal name
                </label>
                <input
                  type="text"
                  value={portalName}
                  onChange={(e) => setPortalName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Default language
                </label>
                <div className="relative">
                  <select
                    value={defaultLanguage}
                    onChange={(e) => setDefaultLanguage(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिंदी)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Time zone
                </label>
                <div className="relative">
                  <select
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 cursor-pointer"
                  >
                    <option value="India Standard Time (UTC+5:30)">
                      India Standard Time (UTC+5:30)
                    </option>
                    <option value="UTC (Coordinated Universal Time)">
                      UTC (Coordinated Universal Time)
                    </option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Support email
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                />
              </div>
            </div>
          </div>

          {/* Registration Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Registration</h3>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="flex items-center justify-between py-3">
                <div>
                  <span className="block font-semibold text-slate-800">
                    Require admin approval
                  </span>
                  <span className="text-[11px] text-slate-400">
                    New accounts stay pending until you approve them
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setRequireAdminApproval(!requireAdminApproval)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    requireAdminApproval ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      requireAdminApproval ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <span className="block font-semibold text-slate-800">
                    Restrict to organization emails
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Only allow addresses ending in @imd.gov.in
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setRestrictOrgEmails(!restrictOrgEmails)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    restrictOrgEmails ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      restrictOrgEmails ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Assessments Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Assessments</h3>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="flex items-center justify-between py-3">
                <div>
                  <span className="block font-semibold text-slate-800">
                    Detect tab switching
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Flag attempts that leave the assessment tab
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDetectTabSwitching(!detectTabSwitching)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    detectTabSwitching ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      detectTabSwitching ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <span className="block font-semibold text-slate-800">Allow retakes</span>
                  <span className="text-[11px] text-slate-400">
                    Trainees can retake a failed assessment once
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowRetakes(!allowRetakes)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    allowRetakes ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      allowRetakes ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <span className="block font-semibold text-slate-800">
                    Send deadline reminders
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Email trainees 2 days before a deadline
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSendDeadlineReminders(!sendDeadlineReminders)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    sendDeadlineReminders ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      sendDeadlineReminders ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons matching 10-settings.png */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
