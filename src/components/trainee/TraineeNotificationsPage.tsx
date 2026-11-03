import React, { useState } from 'react';
import { useTraineeData } from '../../context/TraineeDataContext';
import { TraineeTab } from '../../types';
import { Bell, CheckCheck, Clock, BookOpen, AlertCircle, Calendar } from 'lucide-react';

interface TraineeNotificationsPageProps {
  onSelectTab: (tab: TraineeTab) => void;
  showToast: (msg: string) => void;
}

export const TraineeNotificationsPage: React.FC<TraineeNotificationsPageProps> = ({
  onSelectTab,
  showToast,
}) => {
  const { notifications, markAllNotificationsAsRead, markNotificationAsRead } = useTraineeData();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Announcements' | 'Deadlines' | 'Content'>('All');

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'All') return true;
    return n.category === activeFilter;
  });

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Announcement':
      case 'Assessment':
        return 'bg-[#e8efff] text-[#1d4ed8]';
      case 'Deadline':
        return 'bg-[#fff1e0] text-[#b45309]';
      case 'New content':
      case 'Session':
        return 'bg-[#e7f7ee] text-[#15803d]';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2333] tracking-tight">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-[#5b6478] mt-1">
            Announcements and alerts
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            markAllNotificationsAsRead();
            showToast('All notifications marked as read');
          }}
          className="h-10 px-4 rounded-xl bg-white border border-[#e6e9f2] text-xs font-semibold text-[#1c2333] hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
        >
          <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Filter Tabs matching 17-notifications */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveFilter('All')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeFilter === 'All'
              ? 'bg-[#1f5eff] text-white shadow-xs'
              : 'bg-white text-[#5b6478] hover:bg-slate-50 border border-[#e6e9f2]'
          }`}
        >
          All {notifications.length}
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('Announcements')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeFilter === 'Announcements'
              ? 'bg-[#1f5eff] text-white shadow-xs'
              : 'bg-white text-[#5b6478] hover:bg-slate-50 border border-[#e6e9f2]'
          }`}
        >
          Announcements
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('Deadlines')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeFilter === 'Deadlines'
              ? 'bg-[#1f5eff] text-white shadow-xs'
              : 'bg-white text-[#5b6478] hover:bg-slate-50 border border-[#e6e9f2]'
          }`}
        >
          Deadlines
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('Content')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeFilter === 'Content'
              ? 'bg-[#1f5eff] text-white shadow-xs'
              : 'bg-white text-[#5b6478] hover:bg-slate-50 border border-[#e6e9f2]'
          }`}
        >
          Content
        </button>
      </div>

      {/* Notifications List matching 17-notifications */}
      <div className="p-5 sm:p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs divide-y divide-slate-100">
        {filteredNotifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => markNotificationAsRead(notif.id)}
            className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 hover:bg-slate-50/50 px-2 rounded-xl transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              {/* Light square icon placeholder */}
              <div className="w-10 h-10 rounded-xl bg-[#e8efff]/60 text-[#1f5eff] flex items-center justify-center shrink-0 border border-[#1f5eff]/15">
                <Bell className="w-5 h-5 opacity-70" />
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#1c2333] group-hover:text-blue-600 transition-colors">
                  {notif.title}
                </h3>
                <p className="text-[11px] text-[#5b6478] mt-0.5">
                  {notif.meta}
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${getTagColor(
                notif.tag
              )}`}
            >
              {notif.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
