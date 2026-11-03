import React, { useState } from 'react';
import {
  Menu,
  LayoutDashboard,
  BookOpen,
  FileCheck,
  GraduationCap,
  FolderGit2,
  MessageSquareText,
  UserCircle2,
  Settings,
  MessageSquare,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  ChevronsLeft,
  Compass,
  Sparkles,
  ArrowRight,
  X,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { Screen, TrainerTab } from '../../types';
import { useTrainerData } from '../../context/TrainerDataContext';
import { TrainerChatbotDrawer } from './TrainerChatbotDrawer';

interface TrainerLayoutProps {
  currentTab: TrainerTab;
  onSelectTab: (tab: TrainerTab) => void;
  onNavigateScreen: (screen: Screen) => void;
  showToast: (msg: string) => void;
  children: React.ReactNode;
}

export const TrainerLayout: React.FC<TrainerLayoutProps> = ({
  currentTab,
  onSelectTab,
  onNavigateScreen,
  showToast,
  children,
}) => {
  const { profile, notifications, markAllNotificationsAsRead, isChatbotOpen, setIsChatbotOpen } = useTrainerData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadNotifications = notifications.filter((n) => !n.read);

  const handleSignOut = () => {
    setProfileDropdownOpen(false);
    showToast('Signed out of Trainer Portal.');
    onNavigateScreen('login');
  };

  const navItems: {
    section: string;
    items: {
      id: TrainerTab;
      label: string;
      icon: React.ElementType;
      badge?: string | number;
    }[];
  }[] = [
    {
      section: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'my-courses', label: 'My Courses', icon: BookOpen, badge: 4 },
        { id: 'assessments', label: 'Assessments', icon: FileCheck, badge: '2 live' },
        { id: 'trainees', label: 'Trainees', icon: GraduationCap, badge: 542 },
      ],
    },
    {
      section: 'TEACHING',
      items: [
        { id: 'trainer-library', label: 'Trainer Library', icon: FolderGit2, badge: 48 },
        { id: 'feedback', label: 'Feedback & Insights', icon: MessageSquareText, badge: '4.6★' },
      ],
    },
  ];

  const handleSearchNavigate = (tab: TrainerTab) => {
    onSelectTab(tab);
    setSearchModalOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#f3f4f8] flex text-slate-800 antialiased selection:bg-blue-600 selection:text-white relative">
      {/* Mobile backdrop when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-25 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar with Open / Close transition matching Admin Tailgrids styling */}
      <aside
        className={`w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 fixed top-0 bottom-0 left-0 z-30 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Tailgrids-styled Sidebar Header */}
          <div className="p-4 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex aspect-square size-10 h-[40px] w-[40px] items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xs shrink-0">
                <Compass className="w-5.5 h-5.5 text-white" />
              </span>
              <div className="min-w-0">
                <span className="font-bold text-slate-900 text-sm tracking-tight block truncate">
                  Capacity Connect
                </span>
                <span className="text-[10.5px] text-slate-400 font-medium block truncate">
                  IMD Trainer Portal
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              title="Collapse sidebar"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Nav list: strictly NO notification and NO signout in sidebar */}
          <nav className="p-4 space-y-5">
            {navItems.map((group) => (
              <div key={group.section}>
                <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5 select-none">
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
                        onClick={() => {
                          onSelectTab(item.id);
                          if (window.innerWidth < 1024) {
                            setIsSidebarOpen(false);
                          }
                        }}
                        className={`w-full h-[40px] flex items-center justify-between px-3.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              isActive ? 'text-white' : 'text-slate-400'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                              isActive
                                ? 'bg-white/25 text-white'
                                : 'bg-slate-100 text-slate-600'
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

        {/* Tailgrids-styled Ask Assistant Box in Sidebar */}
        <div className="p-4 pt-0">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-4 text-white border border-slate-800 shadow-md relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Sparkles className="size-3.5" />
              </span>
              <span className="font-bold text-xs text-white">Ask Assistant</span>
              <span className="ml-auto text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              Instant answers on meteorology courses, trainees and competency gaps.
            </p>
            <div>
              <button
                type="button"
                onClick={() => setIsChatbotOpen(true)}
                className="w-full h-[40px] flex items-center justify-between px-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-slate-300 hover:text-white transition-all cursor-pointer text-left shadow-xs"
              >
                <span className="text-[11px] truncate">Ask question...</span>
                <MessageSquare className="w-4 h-4 text-blue-400 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container - overflow-x-hidden strictly prevents mobile page horizontal scroll */}
      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 max-w-full w-full overflow-x-hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:ml-64' : 'ml-0'
        }`}
      >
        {/* Backdrop for closing popups when clicking anywhere on screen */}
        {(notificationsOpen || profileDropdownOpen) && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => {
              setNotificationsOpen(false);
              setProfileDropdownOpen(false);
            }}
          />
        )}

        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#f3f4f8]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 border-b border-slate-200/40">
          {/* Mobile Header (sm:hidden) */}
          <div className="flex sm:hidden items-center justify-between w-full">
            {/* Left Controls: Hamburger Menu + Bell with dot */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Open menu"
              >
                <Menu className="w-5 h-5 text-slate-700" />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setProfileDropdownOpen(false);
                  }}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5 text-slate-700" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
                  )}
                </button>

                {/* Mobile Notification Popover */}
                {notificationsOpen && (
                  <div className="sm:hidden absolute left-0 mt-2 w-76 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800 text-xs">Notifications</span>
                        {unreadNotifications.length > 0 && (
                          <span className="px-1.5 py-0.2 bg-blue-50 text-blue-600 font-bold text-[10px] rounded-full">
                            {unreadNotifications.length} new
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          markAllNotificationsAsRead();
                          showToast('All notifications marked as read.');
                        }}
                        className="text-[10px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                      >
                        Mark read
                      </button>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {notifications.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className={`p-2 rounded-lg transition-colors ${
                            !item.read ? 'bg-blue-50/70 border border-blue-100' : 'bg-slate-50/60'
                          }`}
                        >
                          <p className="font-semibold text-slate-800 text-xs leading-snug">{item.title}</p>
                          <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{item.timestamp}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('notifications');
                          setNotificationsOpen(false);
                        }}
                        className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs text-center transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>View all notifications</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Dr. Ravi Menon Profile Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 bg-white border border-slate-200/90 rounded-2xl py-1.5 px-2.5 shadow-2xs hover:border-slate-300 transition-all cursor-pointer select-none"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  RM
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">
                    Dr. Ravi Menon
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal leading-tight">
                    Trainer · IMD
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 shrink-0" />
              </button>

              {/* Mobile Profile Dropdown Popover */}
              {profileDropdownOpen && (
                <div className="sm:hidden absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <p className="font-semibold text-slate-800 text-xs">{profile.name}</p>
                    <p className="text-slate-400 text-[10px] truncate">{profile.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                      Senior Trainer
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('profile');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium transition-colors text-left cursor-pointer"
                  >
                    <UserCircle2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Profile & Credentials</span>
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Header matching AdminLayout */}
          <div className="hidden sm:flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {/* Sidebar Open/Close Toggle Trigger with ChevronsLeft */}
              <button
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-xl bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer flex items-center justify-center"
                title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                <ChevronsLeft
                  className={`w-4 h-4 transition-transform duration-300 ${
                    !isSidebarOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div>
                {currentTab === 'dashboard' && (
                  <>
                    <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
                      Good morning, Dr. Menon
                    </h1>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium truncate">
                      Monday, 19 October 2026 · IMD Training Directorate
                    </p>
                  </>
                )}
                {currentTab === 'my-courses' && (
                  <>
                    <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
                      My courses & curriculum
                    </h1>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium truncate">
                      Manage course modules, batches, lesson plans and enrolled officers
                    </p>
                  </>
                )}
                {currentTab === 'assessments' && (
                  <>
                    <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
                      Assessments & evaluations
                    </h1>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium truncate">
                      Formative assessments, grading rubrics, radar simulations and question banks
                    </p>
                  </>
                )}
                {currentTab === 'trainees' && (
                  <>
                    <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
                      Trainee cohorts & rosters
                    </h1>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium truncate">
                      Active duty officers, regional center trainees, competencies and dispatch reminders
                    </p>
                  </>
                )}
                {currentTab === 'trainer-library' && (
                  <>
                    <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
                      Trainer library
                    </h1>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium truncate">
                      Standard operating manuals, Doppler radar recordings and presentation slides
                    </p>
                  </>
                )}
                {currentTab === 'feedback' && (
                  <>
                    <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
                      Feedback & insights
                    </h1>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium truncate">
                      Trainee evaluations, module sentiment ratings and curriculum improvements
                    </p>
                  </>
                )}
                {currentTab === 'profile' && (
                  <>
                    <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
                      Trainer profile & credentials
                    </h1>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium truncate">
                      Meteorological specializations, certifications, publication records and teaching bio
                    </p>
                  </>
                )}
                {currentTab === 'notifications' && (
                  <>
                    <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
                      Directorate notifications
                    </h1>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-medium truncate">
                      Official training dispatches, question bank approvals and circulars
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Right Header Controls */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">

              {/* Search Icon Button */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 shadow-xs transition-colors cursor-pointer shrink-0"
                title="Search portal"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Notification Bell with red dot and dropdown preview */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setProfileDropdownOpen(false);
                  }}
                  className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200/90 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 shadow-xs transition-colors cursor-pointer relative shrink-0"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
                  )}
                </button>

                {/* Desktop Notification Popover */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-40 text-xs animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                        {unreadNotifications.length > 0 && (
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded-full">
                            {unreadNotifications.length} unread
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          markAllNotificationsAsRead();
                          showToast('All notifications marked as read.');
                        }}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                      >
                        Mark read
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-64 overflow-y-auto">
                      {notifications.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded-xl transition-colors ${
                            !item.read ? 'bg-blue-50/70 border border-blue-100' : 'bg-slate-50/70 hover:bg-slate-100/60'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <p className="font-semibold text-slate-900 text-xs">{item.title}</p>
                            <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* View all notifications button */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('notifications');
                          setNotificationsOpen(false);
                        }}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span>View all notifications</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Pill with Dropdown containing Profile & Sign out */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-1.5 sm:gap-2.5 bg-white border border-slate-200/90 rounded-full py-1 sm:py-1.5 pl-1.5 sm:pl-2 pr-2.5 sm:pr-3.5 shadow-xs hover:border-slate-300 transition-all cursor-pointer select-none"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    RM
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-semibold text-slate-900 leading-tight">
                      Dr. Ravi Menon
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal leading-tight">
                      Senior Trainer · IMD HQ
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 shrink-0" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="font-semibold text-slate-800 text-sm">Dr. Ravi Menon</p>
                      <p className="text-slate-400 text-[11px] truncate">{profile.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                        Employee ID: {profile.employeeId}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectTab('profile');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 font-medium transition-colors text-left cursor-pointer"
                    >
                      <UserCircle2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Profile & Credentials</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

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
          </div>
        </header>

        {/* Page Content: min-w-0 max-w-full w-full overflow-x-hidden strictly enforces no page horizontal scrollbar */}
        <main className="p-4 sm:p-6 lg:p-8 pb-28 sm:pb-16 flex-1 w-full max-w-full overflow-x-hidden min-w-0">
          {/* Mobile Page Title */}
          <div className="sm:hidden mb-4">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {currentTab === 'dashboard'
                ? 'Dashboard'
                : currentTab === 'my-courses'
                ? 'My Courses'
                : currentTab === 'assessments'
                ? 'Assessments'
                : currentTab === 'trainees'
                ? 'Trainees'
                : currentTab === 'trainer-library'
                ? 'Trainer Library'
                : currentTab === 'feedback'
                ? 'Feedback'
                : currentTab === 'profile'
                ? 'Profile'
                : 'Notifications'}
            </h1>
          </div>

          {children}
        </main>
      </div>

      {/* Floating Chatbot Bubble at bottom-right (strictly matching AdminLayout floating button) */}
      {!isChatbotOpen && (
        <button
          type="button"
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Open Capacity Assistant"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      )}

      {/* Chatbot Drawer */}
      <TrainerChatbotDrawer onSelectTab={onSelectTab} showToast={showToast} />

      {/* Quick Search Dialog */}
      {searchModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setSearchModalOpen(false)}
        >
          <div
            className="w-full max-w-md sm:max-w-lg max-h-[85vh] flex flex-col bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, trainees, assessments, library..."
                autoFocus
                className="flex-1 text-sm bg-transparent border-none outline-hidden text-slate-800 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 overflow-y-auto space-y-3 text-xs">
              <div>
                <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                  Quick Navigation
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSearchNavigate('my-courses')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium text-left transition-colors flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>My Courses</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSearchNavigate('assessments')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium text-left transition-colors flex items-center gap-2"
                  >
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Assessments</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSearchNavigate('trainees')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium text-left transition-colors flex items-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <span>Trainee Roster</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSearchNavigate('trainer-library')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-medium text-left transition-colors flex items-center gap-2"
                  >
                    <FolderGit2 className="w-4 h-4 text-amber-600" />
                    <span>Trainer Library</span>
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                  Recent Directives
                </p>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleSearchNavigate('notifications')}
                    className="w-full p-2 rounded-lg hover:bg-slate-50 text-left flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 group-hover:text-blue-600">
                        Severe Cyclone Early Warning Protocol
                      </p>
                      <p className="text-[10px] text-slate-400">Doppler Radar Simulation & Question Bank</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
