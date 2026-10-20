import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  UserCheck,
  GraduationCap,
  ShieldCheck,
  Megaphone,
  BarChart3,
  Target,
  Settings,
  MessageSquare,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  PanelLeft,
  PanelLeftClose,
} from 'lucide-react';
import { AdminTab, Screen } from '../../types';
import { useAdminData } from '../../context/AdminDataContext';
import { ChatbotDrawer } from './ChatbotDrawer';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onNavigateScreen: (screen: Screen) => void;
  showToast: (msg: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onNavigateScreen,
  showToast,
  children,
}) => {
  const { pendingApprovals, isChatbotOpen, setIsChatbotOpen } = useAdminData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = () => {
    setProfileDropdownOpen(false);
    showToast('Signed out of Administrator Portal.');
    onNavigateScreen('login');
  };

  const navItems: {
    section: string;
    items: {
      id: AdminTab;
      label: string;
      icon: React.ElementType;
      badge?: number;
    }[];
  }[] = [
    {
      section: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'courses', label: 'Courses', icon: BookOpen },
        { id: 'trainers', label: 'Trainers', icon: UserCheck },
        { id: 'trainees', label: 'Trainees', icon: GraduationCap },
      ],
    },
    {
      section: 'MANAGE',
      items: [
        {
          id: 'role-management',
          label: 'Role management',
          icon: ShieldCheck,
          badge: pendingApprovals.length > 0 ? pendingApprovals.length : undefined,
        },
        { id: 'announcements', label: 'Announcements', icon: Megaphone },
      ],
    },
    {
      section: 'INSIGHTS',
      items: [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'competency', label: 'Competency', icon: Target },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f8] flex text-slate-800 antialiased selection:bg-blue-600 selection:text-white relative">
      {/* Mobile backdrop when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-25 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar with Open / Close transition */}
      <aside
        className={`w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 fixed top-0 bottom-0 left-0 z-30 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5">
          {/* Logo with Close button */}
          <div className="pt-2 pb-5 px-2 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 select-none">
                Capacity Connect
              </h1>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                India Meteorological Dept.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>

          {/* Nav list */}
          <nav className="space-y-6">
            {navItems.map((group) => (
              <div key={group.section}>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 select-none">
                  {group.section}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = currentTab === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onSelectTab(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-4 h-4 ${
                              isActive ? 'text-white' : 'text-slate-400'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              isActive
                                ? 'bg-white/25 text-white'
                                : 'bg-red-500 text-white'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Ask the Assistant Promo Box at bottom of sidebar */}
        <div className="p-5 pt-0">
          <div className="bg-[#181c24] text-white p-4 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-3">
              <MessageSquare className="w-4 h-4 text-blue-400" />
            </div>
            <h4 className="text-sm font-semibold text-white mb-1">
              Ask the assistant
            </h4>
            <p className="text-xs text-slate-400 mb-3.5 leading-relaxed">
              Get quick answers on courses, trainees and competency gaps.
            </p>
            <button
              type="button"
              onClick={() => setIsChatbotOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Open assistant</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-[#f3f4f8]/90 backdrop-blur-md px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-slate-200/40">
          <div className="flex items-center gap-3">
            {/* Sidebar Open/Close Toggle Button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeft className="w-4 h-4" />
              )}
            </button>

            <div>
              {currentTab === 'dashboard' && (
                <>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Good morning, Admin
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Monday, 19 October 2026
                  </p>
                </>
              )}
            {currentTab === 'courses' && (
              <>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Course management
                </h1>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  All courses with trainer, enrollment and status
                </p>
              </>
            )}
            {currentTab === 'trainers' && (
              <>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Trainer management
                </h1>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Review trainers and their activity status
                </p>
              </>
            )}
            {currentTab === 'trainees' && (
              <>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Trainee management
                </h1>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Review trainees, progress and activity status
                </p>
              </>
            )}
            {currentTab === 'role-management' && (
              <>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Role management
                </h1>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Approve new accounts and update user roles
                </p>
              </>
            )}
            {currentTab === 'announcements' && (
              <>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Homepage updates
                </h1>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Publish notifications, announcements, achievements and new content
                </p>
              </>
            )}
            {currentTab === 'analytics' && (
              <>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Analytics
                </h1>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Detailed enrollment, assessment and participation results
                </p>
              </>
            )}
            {currentTab === 'competency' && (
              <>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Competency
                </h1>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Skill gaps, trainer coverage and capacity building progress
                </p>
              </>
            )}
            {currentTab === 'settings' && (
              <>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Settings
                </h1>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Configure how the portal behaves for everyone
                </p>
              </>
            )}
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-3">
            {/* Export report button (matching 01-dashboard.png & 08-analytics.png) */}
            {(currentTab === 'dashboard' || currentTab === 'analytics') && (
              <button
                type="button"
                onClick={() => showToast('Exporting executive report summary as PDF...')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer hidden sm:flex items-center gap-1.5"
              >
                <span>Export report</span>
              </button>
            )}

            {/* Search Icon Button */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="w-9 h-9 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 shadow-xs transition-colors cursor-pointer"
              title="Search portal"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Bell with red dot */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-9 h-9 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 shadow-xs transition-colors cursor-pointer relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-40 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-800 text-sm">Notifications</span>
                    <span className="text-[10px] text-blue-600 cursor-pointer font-medium">Mark read</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-2 rounded-lg bg-blue-50/60">
                      <p className="font-semibold text-slate-800">4 New Account Requests</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Kiran Joshi, Sana Ahmed and 2 others awaiting approval.</p>
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('role-management');
                          setNotificationsOpen(false);
                        }}
                        className="text-blue-600 font-semibold mt-1 inline-block"
                      >
                        Review requests →
                      </button>
                    </div>
                    <div className="p-2 rounded-lg hover:bg-slate-50">
                      <p className="font-semibold text-slate-800">Cyclone Training Announcement Pinned</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">Active on learner homepages.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Pill with Dropdown containing Settings & Sign out */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 bg-white border border-slate-200/90 rounded-full py-1.5 pl-2 pr-3.5 shadow-xs hover:border-slate-300 transition-all cursor-pointer select-none"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  AU
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">
                    Admin
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal leading-tight">
                    IMD Headquarters
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="font-semibold text-slate-800 text-sm">Administrator</p>
                    <p className="text-slate-400 text-[11px]">admin@imd.gov.in</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Full Privileges
                    </span>
                  </div>

                  {/* Settings button before Sign out per instruction */}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('settings');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-medium transition-colors text-left cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>Settings</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  {/* Sign out button */}
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 pb-16 flex-1">{children}</main>
      </div>

      {/* Floating Chatbot Bubble at bottom-right */}
      {!isChatbotOpen && (
        <button
          type="button"
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Open Capacity Assistant"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      )}

      {/* Chatbot Drawer matching 02-chatbot.png */}
      <ChatbotDrawer
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onNavigateTab={onSelectTab}
      />

      {/* Quick Search Dialog */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, trainers, trainees, announcements..."
                className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 bg-slate-100 rounded-md"
              >
                ESC
              </button>
            </div>
            <div className="p-4 max-h-72 overflow-y-auto space-y-2 text-xs">
              <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Quick Destinations
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelectTab('courses');
                  setSearchModalOpen(false);
                }}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-50 flex items-center justify-between"
              >
                <span className="font-medium text-slate-800">Courses Directory</span>
                <span className="text-slate-400">36 active</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectTab('role-management');
                  setSearchModalOpen(false);
                }}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-50 flex items-center justify-between"
              >
                <span className="font-medium text-slate-800">Pending Approvals</span>
                <span className="text-red-500 font-semibold">14 waiting</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectTab('announcements');
                  setSearchModalOpen(false);
                }}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-50 flex items-center justify-between"
              >
                <span className="font-medium text-slate-800">Homepage Updates & Announcements</span>
                <span className="text-slate-400">Manage banner</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
