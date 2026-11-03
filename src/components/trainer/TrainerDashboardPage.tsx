import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  BookOpen,
  Star,
  ArrowUpRight,
  Clock,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Bell,
  CheckCircle2,
  X,
  Send,
  Pin,
  TrendingUp,
  FileCheck,
  Radio,
} from 'lucide-react';
import { useTrainerData } from '../../context/TrainerDataContext';
import { TrainerTab } from '../../types';

interface TrainerDashboardPageProps {
  onSelectTab: (tab: TrainerTab) => void;
  showToast: (msg: string) => void;
}

const TRAINER_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    badge: 'Official Directorate Notification',
    isPinned: true,
    date: 'Published 19 October 2026',
    title: 'Severe Cyclone Early Warning Protocol: Specialized Doppler Radar Simulation',
    body: 'Comprehensive operational training deployed across Coastal & Regional Meteorological Centers. Specialized modules cover high-resolution wind-shear detection, automated coastal storm-surge alerts, and emergency advisory dissemination. Trainee assessment window opens on 1 November.',
    dispatchedBy: 'Training Directorate (IMD New Delhi)',
    highlights: [
      { num: '142', label: 'Duty Officers Enrolled', sub: 'Class-I & II Meteorologists' },
      { num: '98%', label: 'DWR Lab Availability', sub: '32 Coastal Radar Stations' },
      { num: '31 Oct', label: 'Question Bank Deadline', sub: 'Cycle 4 Winter Intake' },
    ],
    actionLabel: 'Review question bank',
    actionTab: 'assessments' as TrainerTab,
  },
  {
    id: 'ann-2',
    badge: 'Operational NWP Directive',
    isPinned: true,
    date: 'Published 24 October 2026',
    title: 'Numerical Weather Prediction (NWP) Operational Update: ECMWF & GFS Ensemble Grid Integration',
    body: 'New high-resolution ensemble forecasting training modules are now live. Trainers are requested to review the updated synoptic chart interpretations and verify that all Level-2 forecasting officers complete the grid variance exercises before the pre-monsoon evaluation cycle.',
    dispatchedBy: 'Central Forecasting Division (Mausam Bhawan)',
    highlights: [
      { num: '286', label: 'Active Trainees', sub: 'Regional Met Centers' },
      { num: '4.8★', label: 'Curriculum Rating', sub: 'NWP Faculty Review' },
      { num: '05 Nov', label: 'Simulation Deadline', sub: 'Grid Analysis Module' },
    ],
    actionLabel: 'Inspect course curriculum',
    actionTab: 'my-courses' as TrainerTab,
  },
  {
    id: 'ann-3',
    badge: 'Radar Meteorology Workshop',
    isPinned: false,
    date: 'Published 27 October 2026',
    title: 'Radar Calibration & Dual-Polarization Nowcasting: RMC Chennai & Kolkata Faculty Briefing',
    body: 'Technical workshop materials and calibration checklists for S-band and C-band Doppler radars have been uploaded to the Trainer Library. Please sync trainee assignments with the latest hydrometeor classification algorithms.',
    dispatchedBy: 'Instruments & Radar Division (IMD Pune)',
    highlights: [
      { num: '34', label: 'Radar Stations', sub: 'Real-time telemetry feeds' },
      { num: '94%', label: 'Calibration Passed', sub: 'Standard target reflection' },
      { num: '10 Nov', label: 'Field Submission', sub: 'Logbook verification' },
    ],
    actionLabel: 'Access trainer library',
    actionTab: 'trainer-library' as TrainerTab,
  },
  {
    id: 'ann-4',
    badge: 'Competency Assessment Cycle',
    isPinned: false,
    date: 'Published 29 October 2026',
    title: 'Q4 National Competency Benchmark Assessments: Evaluation Guidelines for Instructors',
    body: 'All course trainers must publish rubric scores and formative feedback for trainees scoring below 65%. Automated remediation tracks can be assigned directly from the Trainee Roster page.',
    dispatchedBy: 'National Meteorological Training Institute (Pune)',
    highlights: [
      { num: '542', label: 'Candidates Registered', sub: 'All 6 RMCs participating' },
      { num: '76%', label: 'Average Score', sub: 'Preliminary mock tests' },
      { num: '15 Nov', label: 'Final Certification', sub: 'Gazetted Officer status' },
    ],
    actionLabel: 'View trainee roster',
    actionTab: 'trainees' as TrainerTab,
  },
];

export const TrainerDashboardPage: React.FC<TrainerDashboardPageProps> = ({
  onSelectTab,
  showToast,
}) => {
  const { trainees, courses, setSelectedTraineeId, sendReminder, setIsChatbotOpen, notifications } = useTrainerData();
  const [showNotice, setShowNotice] = useState(true);

  // Multi-announcement carousel with automated looping
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const currentAnnouncement = TRAINER_ANNOUNCEMENTS[announcementIndex % TRAINER_ANNOUNCEMENTS.length];

  const handleNextAnnouncement = () => {
    setAnnouncementIndex((prev) => (prev + 1) % TRAINER_ANNOUNCEMENTS.length);
  };

  const handlePrevAnnouncement = () => {
    setAnnouncementIndex((prev) => (prev - 1 + TRAINER_ANNOUNCEMENTS.length) % TRAINER_ANNOUNCEMENTS.length);
  };

  // Auto-advance loop every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % TRAINER_ANNOUNCEMENTS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Hover state for interactive SVG chart tooltip
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(4); // default Oct

  // Quick reminder modal state (t13-reminder-popup with bounded responsive sizing)
  const [reminderModalTrainee, setReminderModalTrainee] = useState<{ id: string; name: string; course: string } | null>(null);
  const [reminderSubject, setReminderSubject] = useState('Urgent: Complete your Cyclone Track module before 31 Oct');
  const [reminderMessage, setReminderMessage] = useState(
    'Dear Trainee,\n\nYou are currently behind schedule on Module 2 assessments. Please complete the Dvorak pattern practice questions before the deadline.'
  );

  const attentionTrainees = trainees.filter((t) => t.status === 'Needs attention').slice(0, 3);

  const handleOpenRemind = (t: typeof trainees[0]) => {
    setReminderModalTrainee({ id: t.id, name: t.name, course: t.enrolledCourseTitle });
    setReminderSubject(`Action Required: Complete ${t.enrolledCourseTitle} assessment`);
  };

  const handleSendSingleReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderModalTrainee) return;
    sendReminder([reminderModalTrainee.id], reminderSubject, reminderMessage, { email: true, inApp: true });
    showToast(`Reminder dispatched to ${reminderModalTrainee.name} via Email & In-App notification.`);
    setReminderModalTrainee(null);
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-4 sm:space-y-6">
      {/* ======================================================== */}
      {/* 1. TOP SECTION: Notification Card matching Admin Dashboard */}
      {/* ======================================================== */}
      {showNotice && (
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs flex flex-col justify-between relative overflow-hidden group">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-blue-50/80 via-indigo-50/30 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none" />

          <div>
            {/* Top Badge, Carousel Navigator & Date Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-3.5 sm:mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  {currentAnnouncement.badge}
                </span>
                {currentAnnouncement.isPinned && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                    <Pin className="w-3 h-3 fill-amber-500 text-amber-600" />
                    Pinned Directive
                  </span>
                )}
                {/* Active index pill */}
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full tabular-nums">
                  {announcementIndex + 1} of {TRAINER_ANNOUNCEMENTS.length}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* Prev / Next Carousel Controls with one-to-one loop */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={handlePrevAnnouncement}
                    className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
                    title="Previous announcement"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1 px-1">
                    {TRAINER_ANNOUNCEMENTS.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAnnouncementIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          idx === announcementIndex ? 'w-5 bg-blue-600' : 'bg-slate-300 hover:bg-slate-400'
                        }`}
                        title={`Go to announcement ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleNextAnnouncement}
                    className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
                    title="Next announcement"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{currentAnnouncement.date}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNotice(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                  title="Dismiss announcement card"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Announcement Headline */}
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug mb-2 sm:mb-3">
              {currentAnnouncement.title}
            </h2>

            {/* Message Body */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 sm:mb-5 max-w-4xl">
              {currentAnnouncement.body}
            </p>

            {/* Quick Metrics / Key Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-5 sm:mb-6 text-xs">
              {currentAnnouncement.highlights.map((h, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    i === 0 ? 'bg-blue-100 text-blue-700' : i === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {h.num}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block">{h.label}</span>
                    <span className="text-[11px] text-slate-400">{h.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3.5 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Dispatched by <strong className="text-slate-800 font-medium">{currentAnnouncement.dispatchedBy}</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectTab('notifications')}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer text-center"
              >
                View all notifications
              </button>
              <button
                type="button"
                onClick={() => onSelectTab(currentAnnouncement.actionTab)}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>{currentAnnouncement.actionLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Greeting Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Good morning, Dr. Menon
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Overview of your 4 active courses, 542 trainees and upcoming assessment cycles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelectTab('my-courses')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            Create course
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('assessments')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>New assessment</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total enrollments</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">742</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              +12% <span className="font-normal text-slate-400">mo/mo</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 4 active training curriculums</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Completion rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">61%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              +4.1% <span className="font-normal text-slate-400">vs target</span>
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '61%' }} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Avg. assessment score</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">74%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              +3.2% <span className="font-normal text-slate-400">vs benchmark</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Passing standard benchmark: 60%</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Feedback rating</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">4.6</span>
            <span className="text-xs text-slate-500">/ 5.0</span>
            <span className="text-[11px] font-semibold text-emerald-600 ml-auto">92% positive</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Based on 184 trainee evaluations</p>
        </div>
      </div>

      {/* Middle Grid: Enrollments vs Completions Chart & Performance by Course */}
      {/* Cards expand cleanly on desktop without internal vertical scrollbars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        {/* Enrollments vs Completions Bar Visualizer (2 Cols on desktop) */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between min-w-0">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Enrollments vs. Completions</h2>
                <p className="text-xs text-slate-500 mt-0.5">Monthly progress across 2026 academic quarters</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
                  <span className="text-slate-600">Enrollments</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                  <span className="text-slate-600">Completions</span>
                </span>
              </div>
            </div>

            {/* Enhanced High-Modern Visual SVG Chart */}
            <div className="mt-5 relative">
              {/* Active hover info badge */}
              {hoveredMonthIndex !== null && (
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 mb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">
                      {[
                        { month: 'Jun', enr: 120, comp: 72 },
                        { month: 'Jul', enr: 145, comp: 94 },
                        { month: 'Aug', enr: 180, comp: 110 },
                        { month: 'Sep', enr: 195, comp: 135 },
                        { month: 'Oct', enr: 214, comp: 148 },
                        { month: 'Nov (Proj)', enr: 238, comp: 172 },
                      ][hoveredMonthIndex]?.month} 2026:
                    </span>
                    <span className="text-blue-600 font-semibold">
                      {[
                        { month: 'Jun', enr: 120, comp: 72 },
                        { month: 'Jul', enr: 145, comp: 94 },
                        { month: 'Aug', enr: 180, comp: 110 },
                        { month: 'Sep', enr: 195, comp: 135 },
                        { month: 'Oct', enr: 214, comp: 148 },
                        { month: 'Nov (Proj)', enr: 238, comp: 172 },
                      ][hoveredMonthIndex]?.enr} Enrolled
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-emerald-600 font-semibold">
                      {[
                        { month: 'Jun', enr: 120, comp: 72 },
                        { month: 'Jul', enr: 145, comp: 94 },
                        { month: 'Aug', enr: 180, comp: 110 },
                        { month: 'Sep', enr: 195, comp: 135 },
                        { month: 'Oct', enr: 214, comp: 148 },
                        { month: 'Nov (Proj)', enr: 238, comp: 172 },
                      ][hoveredMonthIndex]?.comp} Completed
                    </span>
                  </div>
                  <span className="font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md text-[11px]">
                    {Math.round(
                      (([
                        { month: 'Jun', enr: 120, comp: 72 },
                        { month: 'Jul', enr: 145, comp: 94 },
                        { month: 'Aug', enr: 180, comp: 110 },
                        { month: 'Sep', enr: 195, comp: 135 },
                        { month: 'Oct', enr: 214, comp: 148 },
                        { month: 'Nov (Proj)', enr: 238, comp: 172 },
                      ][hoveredMonthIndex]?.comp || 0) /
                        ([
                          { month: 'Jun', enr: 120, comp: 72 },
                          { month: 'Jul', enr: 145, comp: 94 },
                          { month: 'Aug', enr: 180, comp: 110 },
                          { month: 'Sep', enr: 195, comp: 135 },
                          { month: 'Oct', enr: 214, comp: 148 },
                          { month: 'Nov (Proj)', enr: 238, comp: 172 },
                        ][hoveredMonthIndex]?.enr || 1)) *
                        100
                    )}
                    % Completion Rate
                  </span>
                </div>
              )}

              <div className="w-full overflow-x-auto">
                <svg
                  viewBox="0 0 580 200"
                  className="w-full h-48 sm:h-56 min-w-[340px] select-none"
                >
                  <defs>
                    <linearGradient id="trainerEnrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#1d4ed8" />
                    </linearGradient>
                    <linearGradient id="trainerCompGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="trainerCurveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid Lines */}
                  {[0, 60, 120, 180, 240].map((val) => {
                    const y = 170 - (val / 240) * 140;
                    return (
                      <g key={val}>
                        <line
                          x1="35"
                          y1={y}
                          x2="565"
                          y2={y}
                          stroke="#f1f5f9"
                          strokeDasharray={val === 0 ? '0' : '4 4'}
                          strokeWidth="1"
                        />
                        <text
                          x="28"
                          y={y + 3.5}
                          fill="#94a3b8"
                          fontSize="9.5"
                          textAnchor="end"
                          className="font-mono"
                        >
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Monthly Dual Columns & Smooth Interpolations */}
                  {[
                    { month: 'Jun', enr: 120, comp: 72 },
                    { month: 'Jul', enr: 145, comp: 94 },
                    { month: 'Aug', enr: 180, comp: 110 },
                    { month: 'Sep', enr: 195, comp: 135 },
                    { month: 'Oct', enr: 214, comp: 148 },
                    { month: 'Nov (Proj)', enr: 238, comp: 172 },
                  ].map((d, i) => {
                    const colX = 55 + i * 85;
                    const enrH = (d.enr / 240) * 140;
                    const compH = (d.comp / 240) * 140;
                    const isHovered = hoveredMonthIndex === i;

                    return (
                      <g
                        key={d.month}
                        className="cursor-pointer transition-all duration-200"
                        onMouseEnter={() => setHoveredMonthIndex(i)}
                      >
                        {/* Hover Column Background Shading */}
                        {isHovered && (
                          <rect
                            x={colX - 8}
                            y="25"
                            width="52"
                            height="150"
                            rx="8"
                            fill="#f8fafc"
                          />
                        )}

                        {/* Enrollments Bar */}
                        <rect
                          x={colX}
                          y={170 - enrH}
                          width="16"
                          height={enrH}
                          rx="4"
                          fill="url(#trainerEnrGrad)"
                          className={`transition-all duration-200 ${
                            isHovered ? 'filter drop-shadow(0 4px 6px rgba(37,99,235,0.3))' : ''
                          }`}
                        />

                        {/* Completions Bar */}
                        <rect
                          x={colX + 20}
                          y={170 - compH}
                          width="16"
                          height={compH}
                          rx="4"
                          fill="url(#trainerCompGrad)"
                          className={`transition-all duration-200 ${
                            isHovered ? 'filter drop-shadow(0 4px 6px rgba(16,185,129,0.3))' : ''
                          }`}
                        />

                        {/* Month Label */}
                        <text
                          x={colX + 18}
                          y="188"
                          fill={isHovered ? '#1e293b' : '#64748b'}
                          fontWeight={isHovered ? '600' : '500'}
                          fontSize="10"
                          textAnchor="middle"
                        >
                          {d.month}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-4">
            <span>Overall completion velocity: <strong className="text-slate-800 font-semibold">+14%</strong> since Q2</span>
            <button
              type="button"
              onClick={() => onSelectTab('my-courses')}
              className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
            >
              Course analytics →
            </button>
          </div>
        </div>

        {/* Performance by Course (1 Col on desktop) - naturally expanded */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Performance by Course</h2>
              <p className="text-xs text-slate-500 mt-0.5">Average score & passing compliance</p>
            </div>

            <div className="mt-4 space-y-4">
              {[
                { name: 'Cyclone Track Analysis', progress: 78, enrolled: 214, color: 'bg-blue-600' },
                { name: 'Radar Meteorology & Nowcasting', progress: 64, enrolled: 186, color: 'bg-indigo-600' },
                { name: 'Monsoon Synoptic Dynamics', progress: 82, enrolled: 142, color: 'bg-emerald-600' },
                { name: 'Satellite Imagery Interpretation', progress: 58, enrolled: 198, color: 'bg-amber-500' },
              ].map((c) => (
                <div key={c.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 truncate max-w-[190px]">{c.name}</span>
                    <span className="font-bold text-slate-900 tabular-nums">{c.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`${c.color} h-full rounded-full`} style={{ width: `${c.progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{c.enrolled} trainees</span>
                    <span>{c.progress >= 70 ? 'Satisfactory' : 'Needs boost'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onSelectTab('assessments')}
              className="w-full py-2 text-center text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              View detailed assessment logs
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Trainees Who Need Attention & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        {/* Trainees Needing Attention (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">Trainees who need attention</h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    {attentionTrainees.length} pending intervention
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Scoring below 60% or delayed on Module 2 exercises</p>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab('trainees')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer hidden sm:block"
              >
                View all 542 trainees →
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {attentionTrainees.map((trainee) => (
                <div
                  key={trainee.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl ${trainee.avatarBg} flex items-center justify-center font-bold text-xs shrink-0`}
                    >
                      {trainee.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-slate-900">{trainee.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-medium">
                          Score: {trainee.avgScore}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {trainee.division} · {trainee.enrolledCourseTitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTraineeId(trainee.id);
                        onSelectTab('trainees');
                      }}
                      className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg font-medium cursor-pointer transition-colors"
                    >
                      View profile
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenRemind(trainee)}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Remind</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sm:hidden pt-3 border-t border-slate-100 text-center mt-3">
            <button
              type="button"
              onClick={() => onSelectTab('trainees')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              View all 542 trainees →
            </button>
          </div>
        </div>

        {/* Upcoming Deadlines (1 col) - expanded */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Upcoming Deadlines</h2>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            <div className="mt-4 space-y-3.5">
              {[
                {
                  date: '28 Oct',
                  time: '18:00',
                  title: 'Doppler Velocity Analysis Quiz 2',
                  desc: 'Scheduled test closes for Batch B',
                  urgent: true,
                },
                {
                  date: '31 Oct',
                  time: '23:59',
                  title: 'Cyclone Mid-Term Test',
                  desc: '168 / 214 submissions received',
                  urgent: true,
                },
                {
                  date: '31 Oct',
                  time: '17:00',
                  title: 'Cycle 4 Question Bank Review',
                  desc: 'Direct submission to Training Directorate',
                  urgent: false,
                },
                {
                  date: '01 Nov',
                  time: '09:00',
                  title: 'National Assessment Window Opens',
                  desc: 'All 6 RMCs initiate Winter Cycle',
                  urgent: false,
                },
              ].map((dl, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div
                    className={`p-2 rounded-xl text-center shrink-0 w-12 ${
                      dl.urgent ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="block font-bold text-xs">{dl.date.split(' ')[0]}</span>
                    <span className="block text-[9px] uppercase tracking-wider">{dl.date.split(' ')[1]}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block leading-tight">{dl.title}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{dl.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              type="button"
              onClick={() => setIsChatbotOpen(true)}
              className="w-full py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Ask Assistant about deadlines</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK REMINDER POPUP (t13-reminder-popup) - Perfectly bounded mobile sizing */}
      {reminderModalTrainee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[calc(100vw-2rem)] sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Send className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Send Direct Reminder</h3>
                  <p className="text-[11px] text-slate-500">To {reminderModalTrainee.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReminderModalTrainee(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendSingleReminder} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject</label>
                <input
                  type="text"
                  value={reminderSubject}
                  onChange={(e) => setReminderSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Message</label>
                <textarea
                  rows={4}
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span>Enrolled Course:</span>
                  <span className="font-semibold text-slate-800">{reminderModalTrainee.course}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Channels:</span>
                  <span className="font-medium text-blue-700">Official Gov Email + Push Alert</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReminderModalTrainee(null)}
                  className="px-3 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send reminder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
