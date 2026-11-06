import React, { useState, useEffect } from 'react';
import {
  Pin,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ArrowRight,
  FileText,
  X,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

interface LibraryAnnouncementBannerProps {
  showToast: (msg: string) => void;
  targetRole?: 'trainer' | 'trainee';
}

export const LibraryAnnouncementBanner: React.FC<LibraryAnnouncementBannerProps> = ({
  showToast,
  targetRole = 'trainer',
}) => {
  const { announcements, pinnedAnnouncement } = useAdminData();
  const [announcementIndex, setAnnouncementIndex] = useState(1); // Default to index 1 which is "Radar course update released" matching screenshot
  const [selectedAnnouncementForModal, setSelectedAnnouncementForModal] = useState<any | null>(null);

  const activeAnnouncements =
    announcements.length > 0 ? announcements : pinnedAnnouncement ? [pinnedAnnouncement] : [];
  
  const total = activeAnnouncements.length;
  const currentAnn =
    total > 0
      ? activeAnnouncements[announcementIndex % total]
      : pinnedAnnouncement || announcements[0];

  const handleNext = () => {
    if (total <= 1) return;
    setAnnouncementIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    if (total <= 1) return;
    setAnnouncementIndex((prev) => (prev - 1 + total) % total);
  };

  // Automated one-to-one loop interval
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % total);
    }, 9000);
    return () => clearInterval(timer);
  }, [total]);

  if (!currentAnn) return null;

  return (
    <>
      {/* Large-Width Announcement Card matching image_99434a4f.png */}
      <div className="w-full max-w-full bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs relative overflow-hidden group">
        {/* Subtle background gradient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-50/70 via-indigo-50/20 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

        {/* Top Header Row: Badge, Index pill, Arrows, Date */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Official Announcement
            </span>

            {currentAnn.isPinned && targetRole !== 'trainer' && targetRole !== 'trainee' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 shadow-2xs">
                <Pin className="w-3 h-3 fill-amber-500 text-amber-600" />
                Pinned
              </span>
            )}

            {total > 1 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/60 shadow-2xs">
                <RotateCw className="w-3 h-3 text-blue-600" />
                <span>
                  {(announcementIndex % total) + 1} of {total}
                </span>
              </span>
            )}
          </div>

          {/* Navigation Arrows + Published Date */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                className="w-7 h-7 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                title="Previous announcement"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-7 h-7 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                title="Next announcement"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium ml-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Published {currentAnn.date || '16 Oct'}</span>
            </div>
          </div>
        </div>

        {/* Media Thumbnail Banner */}
        {currentAnn.imageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden aspect-[21/7] max-h-48 w-full relative border border-slate-200/80 bg-slate-900 group/img shadow-2xs">
            <img
              src={currentAnn.imageUrl}
              alt={currentAnn.title}
              className="w-full h-full object-cover group-hover/img:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-4">
              <span className="text-xs sm:text-sm text-white/95 font-semibold tracking-wide drop-shadow-xs">
                National Weather & Radar Operational Network
              </span>
            </div>
          </div>
        )}

        {/* Headline */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug mb-2">
          {currentAnn.title}
        </h2>

        {/* Message */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 max-w-4xl">
          {currentAnn.message}
        </p>

        {/* Metrics Row matching image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-xs max-w-2xl">
          <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
              142
            </div>
            <div>
              <span className="font-semibold text-slate-800 block text-xs">
                Duty Officers Enrolled
              </span>
              <span className="text-[11px] text-slate-400">
                Class-I & II Meteorologists
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/90 border border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
              98%
            </div>
            <div>
              <span className="font-semibold text-slate-800 block text-xs">
                Divisional Readiness
              </span>
              <span className="text-[11px] text-slate-400">
                National Radar Network
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedAnnouncementForModal(currentAnn)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>View full announcement</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold border border-blue-200/80 transition-colors cursor-pointer"
              title="Cycles to next announcement on a loop"
            >
              <span>Next announcement</span>
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              showToast(
                `Official Operational Bulletin "${currentAnn.title}.pdf" downloaded successfully.`
              );
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium border border-slate-200/80 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Operational Bulletin (PDF)</span>
          </button>
        </div>
      </div>

      {/* Modal for View Full Announcement */}
      {selectedAnnouncementForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  IMD Directorate Official Dispatch
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAnnouncementForModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedAnnouncementForModal.imageUrl && (
              <div className="w-full aspect-[21/9] rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                <img
                  src={selectedAnnouncementForModal.imageUrl}
                  alt={selectedAnnouncementForModal.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Published {selectedAnnouncementForModal.date}</span>
                <span>·</span>
                <span>Status: {selectedAnnouncementForModal.status}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 leading-snug">
                {selectedAnnouncementForModal.title}
              </h3>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
              <p>{selectedAnnouncementForModal.message}</p>
              <p>
                All officers designated in regional forecast divisions are instructed to reference
                the linked course materials and update their local shift rotation handovers.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  showToast('Official Bulletin PDF downloaded.');
                  setSelectedAnnouncementForModal(null);
                }}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Bulletin</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedAnnouncementForModal(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
