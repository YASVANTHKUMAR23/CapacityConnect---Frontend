import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  Calendar,
  Settings,
  Mail,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { useTrainerData } from '../../context/TrainerDataContext';
import { TrainerTab } from '../../types';

interface TrainerNotificationsPageProps {
  onSelectTab: (tab: TrainerTab) => void;
  showToast: (msg: string) => void;
}

export const TrainerNotificationsPage: React.FC<TrainerNotificationsPageProps> = ({
  onSelectTab,
  showToast,
}) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useTrainerData();
  const [filterTab, setFilterTab] = useState<'All' | 'Announcements' | 'Trainee Activity' | 'System Alerts'>('All');

  // Preferences toggles
  const [prefEmailUrgent, setPrefEmailUrgent] = useState(true);
  const [prefDailyDigest, setPrefDailyDigest] = useState(true);
  const [prefDirectorateAlerts, setPrefDirectorateAlerts] = useState(true);

  const filteredNotifications = notifications.filter((n) => {
    if (filterTab !== 'All' && n.type !== filterTab) return false;
    return true;
  });

  const handleMarkAll = () => {
    markAllNotificationsAsRead();
    showToast('All notifications marked as read.');
  };

  const handleNotificationClick = (n: typeof notifications[0]) => {
    markNotificationAsRead(n.id);
    if (n.title.toLowerCase().includes('assessment') || n.title.toLowerCase().includes('cyclone mid-term')) {
      onSelectTab('assessments');
    } else if (n.title.toLowerCase().includes('trainee') || n.title.toLowerCase().includes('scored below')) {
      onSelectTab('trainees');
    } else if (n.title.toLowerCase().includes('material') || n.title.toLowerCase().includes('sop')) {
      onSelectTab('trainer-library');
    } else if (n.title.toLowerCase().includes('feedback')) {
      onSelectTab('feedback');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header (t19-notifications) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stay updated on trainee submissions, system announcements, and assessment windows.
          </p>
        </div>
        <button
          type="button"
          onClick={handleMarkAll}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Mark all as read</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Notifications Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-1.5 overflow-x-auto text-xs">
            {[
              { id: 'All', label: 'All', count: notifications.length },
              { id: 'Announcements', label: 'Announcements', count: notifications.filter((n) => n.type === 'Announcements').length },
              { id: 'Trainee Activity', label: 'Trainee Activity', count: notifications.filter((n) => n.type === 'Trainee Activity').length },
              { id: 'System Alerts', label: 'System Alerts', count: notifications.filter((n) => n.type === 'System Alerts').length },
            ].map((tab) => {
              const isActive = filterTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feed List */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No notifications in this category.
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 sm:p-5 flex items-start gap-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer ${
                    !notif.read ? 'bg-blue-50/20' : ''
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      notif.type === 'Announcements'
                        ? 'bg-blue-50 text-blue-700'
                        : notif.type === 'Trainee Activity'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {notif.type === 'Announcements' && <Bell className="w-4 h-4" />}
                    {notif.type === 'Trainee Activity' && <Users className="w-4 h-4" />}
                    {notif.type === 'System Alerts' && <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            !notif.read ? 'text-slate-950 font-bold' : 'text-slate-800'
                          }`}
                        >
                          {notif.title}
                        </h3>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.description}
                    </p>

                    <div className="mt-2.5 flex items-center gap-3 text-[11px]">
                      <span className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1">
                        <span>Review details</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-400">{notif.type}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Upcoming Deadlines & Notification Preferences (t19) */}
        <div className="space-y-6">
          {/* Upcoming Academic Deadlines Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Academic Calendar</h2>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3 pt-1">
              {[
                { date: '28 Oct', title: 'Doppler Velocity Quiz 2 Closes', time: '18:00' },
                { date: '31 Oct', title: 'Cyclone Mid-Term Test Closes', time: '23:59' },
                { date: '31 Oct', title: 'Cycle 4 Question Bank Review', time: '17:00' },
                { date: '01 Nov', title: 'National Assessment Window Opens', time: '09:00' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs">
                  <div className="w-12 py-1.5 px-1 rounded-lg bg-slate-50 border border-slate-200 text-center shrink-0">
                    <span className="block font-bold text-slate-900 leading-tight">
                      {item.date.split(' ')[0]}
                    </span>
                    <span className="block text-[9px] uppercase text-slate-500 font-semibold">
                      {item.date.split(' ')[1]}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block leading-tight">{item.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{item.time} IST</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences Toggles */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Settings className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm font-bold text-slate-900">Notification Preferences</h2>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-semibold text-slate-900 block">Trainee Interventions</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Alert when a forecaster fails a quiz twice
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={prefEmailUrgent}
                  onChange={(e) => setPrefEmailUrgent(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0 mt-0.5 cursor-pointer"
                />
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-semibold text-slate-900 block">Daily Digest Email</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Morning summary of submitted answers
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={prefDailyDigest}
                  onChange={(e) => setPrefDailyDigest(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0 mt-0.5 cursor-pointer"
                />
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-semibold text-slate-900 block">Directorate Directives</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Official syllabus updates & calendar revisions
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={prefDirectorateAlerts}
                  onChange={(e) => setPrefDirectorateAlerts(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0 mt-0.5 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <p className="text-[10px] text-slate-400">
                Dispatches routed to verified IMD Gov email: <strong className="text-slate-600">ravi.menon@imd.gov.in</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
