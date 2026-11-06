import React, { useState, useEffect } from 'react';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Pin,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

interface DashboardAnnouncementCardProps {
  onViewAnnouncement?: () => void;
  showToast: (msg: string) => void;
  className?: string;
  hidePinnedBadge?: boolean;
  targetRole?: 'trainer' | 'trainee' | 'admin';
}

export const DashboardAnnouncementCard: React.FC<DashboardAnnouncementCardProps> = ({
  onViewAnnouncement,
  showToast,
  className = '',
  hidePinnedBadge = false,
  targetRole,
}) => {
  const { announcements, pinnedAnnouncement } = useAdminData();
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  const activeAnnouncements =
    announcements.length > 0
      ? announcements
      : pinnedAnnouncement
      ? [pinnedAnnouncement]
      : [];

  const currentAnn =
    activeAnnouncements.length > 0
      ? activeAnnouncements[announcementIndex % activeAnnouncements.length]
      : pinnedAnnouncement || {
          id: 'default',
          title: 'Severe Cyclone Early Warning Protocol: Specialized Doppler Radar Simulation',
          type: 'Announcement',
          status: 'Published',
          date: '19 Oct',
          message:
            'Comprehensive operational training deployed across Coastal & Regional Meteorological Centers. Specialized modules cover high-resolution wind-shear detection, automated coastal storm-surge alerts, and emergency advisory dissemination.',
          publishOn: '19 Oct 2026',
          isPinned: true,
          imageUrl: '',
        };

  const handleNextAnnouncement = () => {
    if (activeAnnouncements.length <= 1) return;
    setAnnouncementIndex((prev) => (prev + 1) % activeAnnouncements.length);
  };

  const handlePrevAnnouncement = () => {
    if (activeAnnouncements.length <= 1) return;
    setAnnouncementIndex(
      (prev) => (prev - 1 + activeAnnouncements.length) % activeAnnouncements.length
    );
  };

  // Auto-advance loop every 7 seconds
  useEffect(() => {
    if (activeAnnouncements.length <= 1) return;
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeAnnouncements.length]);

  return (
    <div
      className={`bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs flex flex-col justify-between relative overflow-hidden group ${className}`}
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-blue-50/80 via-indigo-50/30 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none" />

      <div>
        {/* Top Badge, Carousel Indicator & Date Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-3.5 sm:mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Official Announcement
            </span>
            {!hidePinnedBadge && targetRole !== 'trainer' && targetRole !== 'trainee' && currentAnn?.isPinned && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                <Pin className="w-3 h-3 fill-amber-500 text-amber-600" />
                Pinned
              </span>
            )}
            {/* Carousel counter pill */}
            {activeAnnouncements.length > 1 && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60">
                <RotateCw className="w-3 h-3 text-blue-600 animate-spin-slow" />
                <span>
                  {(announcementIndex % activeAnnouncements.length) + 1} of{' '}
                  {activeAnnouncements.length}
                </span>
              </div>
            )}
          </div>

          {/* Prev / Next loop buttons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevAnnouncement}
                className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Previous announcement"
                aria-label="Previous announcement"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextAnnouncement}
                className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Next announcement (loops)"
                aria-label="Next announcement"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium ml-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Published {currentAnn?.publishOn || currentAnn?.date || 'Today'}</span>
            </div>
          </div>
        </div>

        {/* Optional Attached Media Thumbnail */}
        {currentAnn?.imageUrl && (
          <div className="mb-3.5 rounded-xl overflow-hidden aspect-[21/9] max-h-40 w-full relative border border-slate-200/80 bg-slate-900 group/img">
            <img
              src={currentAnn.imageUrl}
              alt={currentAnn.title}
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-3">
              <span className="text-[11px] text-white/90 font-medium">
                National Weather & Radar Operational Network
              </span>
            </div>
          </div>
        )}

        {/* Announcement Headline */}
        <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug mb-2.5 sm:mb-3">
          {currentAnn?.title || 'Severe Cyclone Early Warning Protocol: Specialized Doppler Radar Simulation'}
        </h2>

        {/* Message Body */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4 sm:mb-5">
          {currentAnn?.message ||
            'Comprehensive operational training deployed across Coastal & Regional Meteorological Centers. Specialized modules cover high-resolution wind-shear detection, automated coastal storm-surge alerts, and emergency advisory dissemination.'}
        </p>

        {/* Quick Metrics / Key Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-5 sm:mb-6 text-xs">
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
              142
            </div>
            <div>
              <span className="font-semibold text-slate-800 block">Duty Officers Enrolled</span>
              <span className="text-[11px] text-slate-400">Class-I & II Meteorologists</span>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
              98%
            </div>
            <div>
              <span className="font-semibold text-slate-800 block">Divisional Readiness</span>
              <span className="text-[11px] text-slate-400">National Radar Network</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions with Loop Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pt-3.5 sm:pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onViewAnnouncement}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>View full announcement</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Loop to next announcement button */}
          <button
            type="button"
            onClick={handleNextAnnouncement}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold border border-blue-200/80 transition-colors cursor-pointer"
            title="Cycles to next announcement on a loop"
          >
            <span>Next announcement</span>
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            showToast('Official meteorology bulletin downloaded as PDF.');
          }}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium border border-slate-200/80 transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span>Operational Bulletin (PDF)</span>
        </button>
      </div>
    </div>
  );
};
