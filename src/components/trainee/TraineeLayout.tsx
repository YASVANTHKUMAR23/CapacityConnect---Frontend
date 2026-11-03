import React, { useState } from 'react';
import {
  Menu,
  LayoutDashboard,
  BookOpen,
  Compass,
  FileCheck,
  Target,
  Users,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  Sparkles,
  ArrowRight,
  X,
  MessageSquare,
  Award,
  User,
  Globe,
  BookMarked,
} from 'lucide-react';
import { Screen, TraineeTab } from '../../types';
import { useTraineeData } from '../../context/TraineeDataContext';
import { TraineeChatbotDrawer } from './TraineeChatbotDrawer';

interface TraineeLayoutProps {
  currentTab: TraineeTab;
  onSelectTab: (tab: TraineeTab) => void;
  onNavigateScreen: (screen: Screen) => void;
  showToast: (msg: string) => void;
  children: React.ReactNode;
}

export const TraineeLayout: React.FC<TraineeLayoutProps> = ({
  currentTab,
  onSelectTab,
  onNavigateScreen,
  showToast,
  children,
}) => {
  const {
    profile,
    notifications,
    markAllNotificationsAsRead,
    activeLanguage,
    setActiveLanguage,
    isChatbotOpen,
    setIsChatbotOpen,
  } = useTraineeData();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.read);

  const handleSignOut = () => {
    setProfileDropdownOpen(false);
    showToast('Signed out of Capacity Connect.');
    onNavigateScreen('login');
  };

  const navItems: {
    section: string;
    items: {
      id: TraineeTab;
      label: string;
      icon: React.ElementType;
      badge?: string | number;
    }[];
  }[] = [
    {
      section: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'my-courses', label: 'My courses', icon: BookOpen },
        { id: 'course-catalog', label: 'Course catalog', icon: Compass },
      ],
    },
    {
      section: 'LEARN',
      items: [
        { id: 'assessments', label: 'Assessments', icon: FileCheck },
        { id: 'my-competency', label: 'My competency', icon: Target },
        { id: 'mentors', label: 'Mentors', icon: Users },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex text-[#1c2333] antialiased selection:bg-[#1f5eff] selection:text-white relative">
      {/* Mobile backdrop when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Matching Capacity Connect Portal Design */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#e6e9f2] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1f5eff] flex items-center justify-center text-white shadow-xs">
                <span className="font-bold text-sm tracking-wider">CC</span>
              </div>
              <div>
                <h1 className="font-bold text-sm text-[#1c2333] leading-tight">
                  Capacity Connect
                </h1>
                <p className="text-[11px] text-[#5b6478]">IMD Training Portal</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-6">
            {navItems.map((group) => (
              <div key={group.section}>
                <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  {group.section}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectTab(item.id);
                          if (window.innerWidth < 1024) {
                            setIsSidebarOpen(false);
                          }
                        }}
                        className={`w-full h-10 flex items-center justify-between px-3.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#1f5eff] text-white shadow-xs font-semibold'
                            : 'text-[#5b6478] hover:text-[#1c2333] hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-white' : 'text-[#5b6478]'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Dark Ask Assistant Card (#0b1220) */}
        <div className="p-4 pt-0">
          <div className="rounded-2xl bg-[#0b1220] p-4 text-white border border-slate-800 shadow-md relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-white">Ask Assistant</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#15803d]/30 text-[#4ade80] border border-[#15803d]/40">
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              Ask about your courses, deadlines and skills.
            </p>
            <div>
              <button
                type="button"
                onClick={() => setIsChatbotOpen(true)}
                className="w-full h-9 flex items-center justify-between px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-slate-300 hover:text-white transition-all cursor-pointer text-left shadow-xs"
              >
                <span className="text-[11px] text-slate-400">Ask question...</span>
                <MessageSquare className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 max-w-full w-full overflow-x-hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        {/* Backdrop for closing popups when clicking anywhere on screen */}
        {(notificationsOpen || profileDropdownOpen || languageDropdownOpen) && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => {
              setNotificationsOpen(false);
              setProfileDropdownOpen(false);
              setLanguageDropdownOpen(false);
            }}
          />
        )}

        {/* Top Header Navbar */}
        <header className="sticky top-0 z-40 bg-[#f4f6fb]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 border-b border-[#e6e9f2]">
          <div className="flex items-center justify-between">
            {/* Left Hamburger for Mobile */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:block">
                <span className="text-xs font-semibold text-[#5b6478]">
                  India Meteorological Department · Ministry of Earth Sciences
                </span>
              </div>
            </div>

            {/* Right Controls: Language, Notification Bell with Dropdown, User Profile Pill */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setLanguageDropdownOpen(!languageDropdownOpen);
                    setNotificationsOpen(false);
                    setProfileDropdownOpen(false);
                  }}
                  className="h-9 px-3 rounded-xl bg-white border border-[#e6e9f2] text-xs font-semibold text-[#1c2333] hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>{activeLanguage}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {languageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-slate-200 p-1 z-50 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveLanguage('English');
                        setLanguageDropdownOpen(false);
                        showToast('Language changed to English');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg font-medium hover:bg-slate-50 text-slate-800"
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveLanguage('Hindi');
                        setLanguageDropdownOpen(false);
                        showToast('भाषा बदलकर हिन्दी कर दी गई है');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg font-medium hover:bg-slate-50 text-slate-800"
                    >
                      हिन्दी (Hindi)
                    </button>
                  </div>
                )}
              </div>

              {/* Notification Bell Button (with red 3 badge) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (window.innerWidth < 640) {
                      onSelectTab('notifications');
                    } else {
                      setNotificationsOpen(!notificationsOpen);
                      setProfileDropdownOpen(false);
                      setLanguageDropdownOpen(false);
                    }
                  }}
                  className="w-9 h-9 rounded-xl bg-white border border-[#e6e9f2] flex items-center justify-center text-[#1c2333] hover:bg-slate-50 transition-colors cursor-pointer relative shadow-2xs"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 text-slate-600" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#b91c1c] text-white text-[9.5px] font-bold flex items-center justify-center shadow-xs">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown (Matches 16-notification-dropdown_f3ed86d3.png) */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs animate-in fade-in duration-100">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <span className="font-bold text-sm text-[#1c2333]">
                        Notifications
                      </span>
                      <button
                        type="button"
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-blue-600 hover:underline font-medium"
                      >
                        Mark read
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-2.5 cursor-pointer">
                        <span className="w-2 h-2 rounded-full bg-[#1f5eff] mt-1 shrink-0" />
                        <div>
                          <p className="font-bold text-[#1c2333] leading-snug">
                            Cyclone Track mid-term closes in 2 days
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Today</p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-2.5 cursor-pointer">
                        <span className="w-2 h-2 rounded-full bg-[#1f5eff] mt-1 shrink-0" />
                        <div>
                          <p className="font-bold text-[#1c2333] leading-snug">
                            New content: Track forecast handbook
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Today</p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-2.5 cursor-pointer">
                        <span className="w-2 h-2 rounded-full bg-[#1f5eff] mt-1 shrink-0" />
                        <div>
                          <p className="font-bold text-[#1c2333] leading-snug">
                            Admin: Cyclone season training begins
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Yesterday</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 mt-2 border-t border-slate-100 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('notifications');
                          setNotificationsOpen(false);
                        }}
                        className="text-xs font-bold text-[#1f5eff] hover:underline"
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Pill (Matches 18-profile-dropdown_f83a5975.png) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setNotificationsOpen(false);
                    setLanguageDropdownOpen(false);
                  }}
                  className="h-9 px-2.5 rounded-xl bg-white border border-[#e6e9f2] flex items-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-[#e8efff] text-[#1d4ed8] font-bold text-[11px] flex items-center justify-center shrink-0">
                    AV
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="text-xs font-bold text-[#1c2333] block leading-none">
                      Asha Verma
                    </span>
                    <span className="text-[9.5px] text-[#5b6478] leading-none mt-0.5 block">
                      Trainee · New Delhi
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in duration-100">
                    <div className="p-3 border-b border-slate-100 flex items-center gap-2.5 mb-1">
                      <div className="w-8 h-8 rounded-full bg-[#e8efff] text-[#1d4ed8] font-bold text-xs flex items-center justify-center shrink-0">
                        AV
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#1c2333] truncate">Asha Verma</p>
                        <p className="text-[10.5px] text-[#5b6478] truncate">
                          {profile.email}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectTab('profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1c2333] hover:bg-slate-50 font-medium transition-colors text-left cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectTab('certificates');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1c2333] hover:bg-slate-50 font-medium transition-colors text-left cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-slate-400" />
                      <span>Certificates</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#b91c1c] hover:bg-[#fde8ea] font-medium transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-[#b91c1c]" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 pb-24 sm:pb-16 flex-1 w-full max-w-full overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>

      {/* Floating Action Button (Matches the bright blue circle in bottom-right of mockups!) */}
      <button
        type="button"
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-6 right-6 w-13 h-13 rounded-full bg-[#1f5eff] hover:bg-blue-600 active:scale-95 text-white shadow-xl flex items-center justify-center z-30 transition-all cursor-pointer group"
        title="Ask Assistant"
        aria-label="Ask Assistant"
      >
        <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Trainee Chatbot Drawer */}
      <TraineeChatbotDrawer onSelectTab={onSelectTab} showToast={showToast} />
    </div>
  );
};
