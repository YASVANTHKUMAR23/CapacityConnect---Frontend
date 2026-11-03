import React, { useState } from 'react';
import { TraineeTab } from '../../types';
import { useTraineeData } from '../../context/TraineeDataContext';
import {
  BookOpen,
  FileCheck,
  Award,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Flame,
  CheckCircle2,
  Calendar,
  X,
} from 'lucide-react';

interface TraineeDashboardPageProps {
  onSelectTab: (tab: TraineeTab) => void;
  showToast: (msg: string) => void;
}

export const TraineeDashboardPage: React.FC<TraineeDashboardPageProps> = ({
  onSelectTab,
  showToast,
}) => {
  const { courses, assessments, earnedCertificates } = useTraineeData();
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [hoveredProgressMonth, setHoveredProgressMonth] = useState<number | null>(5); // Oct default
  const [hoveredStudyDay, setHoveredStudyDay] = useState<number | null>(3); // Thu default

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2333] tracking-tight">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-[#5b6478] mt-1">
          Welcome back, Asha. Here is your learning overview
        </p>
      </div>

      {/* Admin Announcement Banner (Matches 05-dashboard) */}
      <div className="p-5 sm:p-6 rounded-[14px] bg-[#e8efff]/70 border border-[#1f5eff]/30 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-[#1d4ed8] uppercase block mb-1">
            ADMIN ANNOUNCEMENT
          </span>
          <h2 className="text-base sm:text-lg font-bold text-[#1c2333]">
            Cyclone season training begins 1 Nov
          </h2>
          <p className="text-xs sm:text-sm text-[#5b6478] mt-0.5">
            Complete pending modules before the season briefing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAnnouncementModalOpen(true)}
          className="h-10 px-5 bg-[#1f5eff] hover:bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs shrink-0 self-start sm:self-center"
        >
          View full announcement
        </button>
      </div>

      {/* 3 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* My courses */}
        <div
          onClick={() => onSelectTab('my-courses')}
          className="p-5 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all group"
        >
          <div>
            <span className="text-xs font-medium text-[#5b6478] block">My courses</span>
            <span className="text-2xl sm:text-3xl font-bold text-[#1c2333] mt-1 block">
              3
            </span>
            <span className="text-xs text-[#5b6478] mt-0.5 block">in progress</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#e8efff] flex items-center justify-center text-[#1f5eff] group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Assessments due */}
        <div
          onClick={() => onSelectTab('assessments')}
          className="p-5 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs flex items-center justify-between cursor-pointer hover:border-amber-300 transition-all group"
        >
          <div>
            <span className="text-xs font-medium text-[#5b6478] block">Assessments due</span>
            <span className="text-2xl sm:text-3xl font-bold text-[#1c2333] mt-1 block">
              2
            </span>
            <span className="text-xs text-[#5b6478] mt-0.5 block">next: 24 Oct</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#fff1e0] flex items-center justify-center text-[#b45309] group-hover:scale-105 transition-transform">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Certificates */}
        <div
          onClick={() => onSelectTab('certificates')}
          className="p-5 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-all group"
        >
          <div>
            <span className="text-xs font-medium text-[#5b6478] block">Certificates</span>
            <span className="text-2xl sm:text-3xl font-bold text-[#1c2333] mt-1 block">
              4
            </span>
            <span className="text-xs text-[#5b6478] mt-0.5 block">earned</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#e7f7ee] flex items-center justify-center text-[#15803d] group-hover:scale-105 transition-transform">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completion */}
        <div className="p-4 sm:p-5 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs">
          <span className="text-xs font-medium text-[#5b6478] block">Completion</span>
          <span className="text-xl sm:text-2xl font-bold text-[#1c2333] mt-1 block">
            53%
          </span>
          <span className="text-[11px] font-semibold text-[#15803d] mt-1 flex items-center gap-1">
            <span>↗ 4.1% vs last 30 days</span>
          </span>
        </div>

        {/* Average score */}
        <div className="p-4 sm:p-5 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs">
          <span className="text-xs font-medium text-[#5b6478] block">Average score</span>
          <span className="text-xl sm:text-2xl font-bold text-[#1c2333] mt-1 block">
            71%
          </span>
          <span className="text-[11px] font-semibold text-[#15803d] mt-1 flex items-center gap-1">
            <span>↗ 2.8% vs last 30 days</span>
          </span>
        </div>

        {/* Competency level */}
        <div
          onClick={() => onSelectTab('my-competency')}
          className="p-4 sm:p-5 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs cursor-pointer hover:border-blue-200 transition-colors"
        >
          <span className="text-xs font-medium text-[#5b6478] block">Competency level</span>
          <span className="text-xl sm:text-2xl font-bold text-[#1c2333] mt-1 block">
            66%
          </span>
          <span className="text-[11px] font-semibold text-[#15803d] mt-1 flex items-center gap-1">
            <span>↗ 5.2% vs last 30 days</span>
          </span>
        </div>

        {/* Study streak */}
        <div className="p-4 sm:p-5 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs">
          <span className="text-xs font-medium text-[#5b6478] block">Study streak</span>
          <span className="text-xl sm:text-2xl font-bold text-[#1c2333] mt-1 block">
            9 days
          </span>
          <span className="text-[11px] font-semibold text-[#15803d] mt-1 flex items-center gap-1">
            <span>↗ 3 days</span>
          </span>
        </div>
      </div>

      {/* Middle Row: Two High-Modern Visual Graphs (Max 2 graphs per requirement) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graph 1: High Modern Visual Spline Line Chart */}
        <div className="p-5 sm:p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1c2333]">
                  Learning progress & module mastery
                </h3>
                <p className="text-xs text-[#5b6478] mt-0.5">
                  Cumulative modules completed across 2026 cycles
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#15803d] bg-[#e7f7ee] px-2.5 py-1 rounded-full border border-[#15803d]/20">
                ↗ +38% velocity
              </span>
            </div>

            {/* Active Hover Month Status Pill */}
            {hoveredProgressMonth !== null && (
              <div className="mt-3.5 flex items-center justify-between bg-blue-50/60 border border-blue-100 rounded-xl px-3 py-1.5 text-xs">
                <span className="font-semibold text-slate-700">
                  {[
                    { m: 'May', mod: 2, score: '68%' },
                    { m: 'Jun', mod: 4, score: '72%' },
                    { m: 'Jul', mod: 6, score: '74%' },
                    { m: 'Aug', mod: 9, score: '76%' },
                    { m: 'Sep', mod: 12, score: '79%' },
                    { m: 'Oct', mod: 16, score: '84%' },
                  ][hoveredProgressMonth]?.m} 2026
                </span>
                <span className="font-bold text-[#1f5eff]">
                  {[
                    { m: 'May', mod: 2, score: '68%' },
                    { m: 'Jun', mod: 4, score: '72%' },
                    { m: 'Jul', mod: 6, score: '74%' },
                    { m: 'Aug', mod: 9, score: '76%' },
                    { m: 'Sep', mod: 12, score: '79%' },
                    { m: 'Oct', mod: 16, score: '84%' },
                  ][hoveredProgressMonth]?.mod} Modules Cleared
                </span>
                <span className="text-emerald-700 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded text-[10.5px]">
                  Avg Score: {[
                    { m: 'May', mod: 2, score: '68%' },
                    { m: 'Jun', mod: 4, score: '72%' },
                    { m: 'Jul', mod: 6, score: '74%' },
                    { m: 'Aug', mod: 9, score: '76%' },
                    { m: 'Sep', mod: 12, score: '79%' },
                    { m: 'Oct', mod: 16, score: '84%' },
                  ][hoveredProgressMonth]?.score}
                </span>
              </div>
            )}
          </div>

          {/* High-Modern Visual Curved Spline SVG */}
          <div className="mt-4 pt-1">
            <div className="h-44 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 520 140">
                <defs>
                  <linearGradient id="traineeLineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#1f5eff" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                  <linearGradient id="traineeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1f5eff" stopOpacity="0.22" />
                    <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Horizontal Dashed Guidelines */}
                {[0, 4, 8, 12, 16].map((val) => {
                  const y = 120 - (val / 16) * 100;
                  return (
                    <g key={val}>
                      <line
                        x1="30"
                        y1={y}
                        x2="500"
                        y2={y}
                        stroke="#f1f5f9"
                        strokeDasharray={val === 0 ? '0' : '3 3'}
                        strokeWidth="1"
                      />
                      <text x="24" y={y + 3.5} fill="#94a3b8" fontSize="9" textAnchor="end" className="font-mono">
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Spline Area Fill */}
                <path
                  d="M 40,110 C 100,102 140,88 200,80 C 260,72 300,54 360,42 C 410,32 450,22 480,14 L 480,120 L 40,120 Z"
                  fill="url(#traineeAreaGrad)"
                />

                {/* Main Curved Spline Line */}
                <path
                  d="M 40,110 C 100,102 140,88 200,80 C 260,72 300,54 360,42 C 410,32 450,22 480,14"
                  fill="none"
                  stroke="url(#traineeLineGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />

                {/* Glowing Nodes & Interaction Circles */}
                {[
                  { cx: 40, cy: 110, m: 'May', mod: 2, idx: 0 },
                  { cx: 128, cy: 98, m: 'Jun', mod: 4, idx: 1 },
                  { cx: 216, cy: 78, m: 'Jul', mod: 6, idx: 2 },
                  { cx: 304, cy: 62, m: 'Aug', mod: 9, idx: 3 },
                  { cx: 392, cy: 40, m: 'Sep', mod: 12, idx: 4 },
                  { cx: 480, cy: 14, m: 'Oct', mod: 16, idx: 5 },
                ].map((pt) => {
                  const isHovered = hoveredProgressMonth === pt.idx;
                  return (
                    <g
                      key={pt.m}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredProgressMonth(pt.idx)}
                    >
                      {/* Pulse on active last node */}
                      {pt.idx === 5 && (
                        <circle cx={pt.cx} cy={pt.cy} r="10" fill="#1f5eff" fillOpacity="0.2" className="animate-ping" />
                      )}
                      <circle
                        cx={pt.cx}
                        cy={pt.cy}
                        r={isHovered ? 6 : 4}
                        fill="#ffffff"
                        stroke="#1f5eff"
                        strokeWidth={isHovered ? 3.5 : 2.5}
                        className="transition-all duration-150"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* X-Axis Months */}
            <div className="flex items-center justify-between text-[11px] font-medium text-[#5b6478] mt-2 px-3">
              {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((month, idx) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => setHoveredProgressMonth(idx)}
                  className={`hover:text-[#1f5eff] transition-colors cursor-pointer ${
                    hoveredProgressMonth === idx ? 'text-[#1f5eff] font-bold' : ''
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Graph 2: Weekly Study Hours & Learning Velocity (Requested second graph) */}
        <div className="p-5 sm:p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1c2333]">
                  Weekly study hours & velocity
                </h3>
                <p className="text-xs text-[#5b6478] mt-0.5">
                  Daily active learning engagement (target: 2.0 hrs/day)
                </p>
              </div>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                14.2 hrs total (118%)
              </span>
            </div>

            {/* Hover Day Detail Info */}
            {hoveredStudyDay !== null && (
              <div className="mt-3.5 flex items-center justify-between bg-emerald-50/70 border border-emerald-100 rounded-xl px-3 py-1.5 text-xs">
                <span className="font-semibold text-slate-700">
                  {[
                    { d: 'Mon', h: 1.8, topic: 'Atmospheric Physics Video' },
                    { d: 'Tue', h: 2.4, topic: 'Cyclone Track Simulator' },
                    { d: 'Wed', h: 2.8, topic: 'Dvorak Technique Practice' },
                    { d: 'Thu', h: 2.1, topic: 'Doppler Radar Assessment' },
                    { d: 'Fri', h: 1.9, topic: 'Monsoon Synoptic Case Study' },
                    { d: 'Sat', h: 2.2, topic: 'Satellite Data Analysis' },
                    { d: 'Sun', h: 1.0, topic: 'Weekly Practice Quiz' },
                  ][hoveredStudyDay]?.d}:
                </span>
                <span className="font-bold text-emerald-700">
                  {[
                    { d: 'Mon', h: 1.8, topic: 'Atmospheric Physics Video' },
                    { d: 'Tue', h: 2.4, topic: 'Cyclone Track Simulator' },
                    { d: 'Wed', h: 2.8, topic: 'Dvorak Technique Practice' },
                    { d: 'Thu', h: 2.1, topic: 'Doppler Radar Assessment' },
                    { d: 'Fri', h: 1.9, topic: 'Monsoon Synoptic Case Study' },
                    { d: 'Sat', h: 2.2, topic: 'Satellite Data Analysis' },
                    { d: 'Sun', h: 1.0, topic: 'Weekly Practice Quiz' },
                  ][hoveredStudyDay]?.h} Hours
                </span>
                <span className="text-slate-500 text-[11px] truncate max-w-[170px]">
                  {[
                    { d: 'Mon', h: 1.8, topic: 'Atmospheric Physics Video' },
                    { d: 'Tue', h: 2.4, topic: 'Cyclone Track Simulator' },
                    { d: 'Wed', h: 2.8, topic: 'Dvorak Technique Practice' },
                    { d: 'Thu', h: 2.1, topic: 'Doppler Radar Assessment' },
                    { d: 'Fri', h: 1.9, topic: 'Monsoon Synoptic Case Study' },
                    { d: 'Sat', h: 2.2, topic: 'Satellite Data Analysis' },
                    { d: 'Sun', h: 1.0, topic: 'Weekly Practice Quiz' },
                  ][hoveredStudyDay]?.topic}
                </span>
              </div>
            )}
          </div>

          {/* SVG Bar Chart with Target Line */}
          <div className="mt-4 pt-1">
            <div className="h-44 w-full relative">
              <svg className="w-full h-full select-none" viewBox="0 0 520 140">
                <defs>
                  <linearGradient id="studyBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="studyBarGradActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1f5eff" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>

                {/* Target dashed line at 2.0 hrs */}
                <line
                  x1="30"
                  y1="56"
                  x2="500"
                  y2="56"
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                />
                <text x="502" y="59" fill="#d97706" fontSize="9" fontWeight="600" textAnchor="start">
                  2h Target
                </text>

                {/* Daily Bar Capsules */}
                {[
                  { d: 'Mon', h: 1.8, idx: 0 },
                  { d: 'Tue', h: 2.4, idx: 1 },
                  { d: 'Wed', h: 2.8, idx: 2 },
                  { d: 'Thu', h: 2.1, idx: 3 },
                  { d: 'Fri', h: 1.9, idx: 4 },
                  { d: 'Sat', h: 2.2, idx: 5 },
                  { d: 'Sun', h: 1.0, idx: 6 },
                ].map((item) => {
                  const barX = 45 + item.idx * 66;
                  const barH = (item.h / 3.2) * 105;
                  const barY = 120 - barH;
                  const isHovered = hoveredStudyDay === item.idx;

                  return (
                    <g
                      key={item.d}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredStudyDay(item.idx)}
                    >
                      {/* Hover column backdrop */}
                      {isHovered && (
                        <rect x={barX - 6} y="15" width="38" height="110" rx="8" fill="#f8fafc" />
                      )}

                      {/* Bar Pillar */}
                      <rect
                        x={barX}
                        y={barY}
                        width="26"
                        height={barH}
                        rx="6"
                        fill={isHovered ? 'url(#studyBarGradActive)' : 'url(#studyBarGrad)'}
                        className="transition-all duration-200"
                      />

                      {/* Top value */}
                      <text
                        x={barX + 13}
                        y={barY - 5}
                        fill={isHovered ? '#1e293b' : '#64748b'}
                        fontSize="9.5"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {item.h}h
                      </text>

                      {/* Day Label */}
                      <text
                        x={barX + 13}
                        y="134"
                        fill={isHovered ? '#1f5eff' : '#64748b'}
                        fontWeight={isHovered ? '700' : '500'}
                        fontSize="10"
                        textAnchor="middle"
                      >
                        {item.d}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#5b6478]">
              <span>Streak: <strong className="text-slate-800">9 active days</strong></span>
              <span className="text-emerald-600 font-semibold">Exceeding weekly benchmark by 1.7 hrs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended for You + Mentor Recommendation Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Courses based on skill gaps */}
        <div className="p-5 sm:p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1c2333]">
              Recommended for you
            </h3>
            <p className="text-xs text-[#5b6478] mt-0.5">
              Targeted courses to close priority skill gaps
            </p>
          </div>

          <div className="space-y-3 mt-4">
            {/* Storm Surge Basics */}
            <div
              onClick={() => {
                onSelectTab('course-catalog');
                showToast('Opening Storm Surge Basics in catalog');
              }}
              className="p-3.5 rounded-xl border border-[#e6e9f2] hover:border-blue-300 hover:bg-slate-50/50 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-200">
                  SS
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1c2333] group-hover:text-blue-600 transition-colors">
                    Storm Surge Basics & Coastal Modeling
                  </h4>
                  <p className="text-[11px] text-[#5b6478]">Oceanography · 4.8★ · 16 hrs</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff1e0] text-[#b45309]">
                Gap match
              </span>
            </div>

            {/* Numerical Weather Models */}
            <div
              onClick={() => {
                onSelectTab('course-catalog');
                showToast('Opening Numerical Weather Models in catalog');
              }}
              className="p-3.5 rounded-xl border border-[#e6e9f2] hover:border-blue-300 hover:bg-slate-50/50 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200">
                  NW
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1c2333] group-hover:text-blue-600 transition-colors">
                    Numerical Weather Models & Ensembles
                  </h4>
                  <p className="text-[11px] text-[#5b6478]">Forecasting · 4.9★ · 24 hrs</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#e8efff] text-[#1d4ed8]">
                Priority
              </span>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="button"
              onClick={() => onSelectTab('course-catalog')}
              className="text-xs font-semibold text-[#1f5eff] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore all courses in catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* AI Mentor Recommendation Card */}
        <div className="p-5 sm:p-6 rounded-[14px] bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/40 border border-[#e6e9f2] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1c2333] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#1f5eff]" />
                  <span>Mentor recommendation</span>
                </h3>
                <p className="text-xs text-[#5b6478] mt-0.5">
                  AI-mapped senior scientist based on your Cyclone Track domain
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                98% Niche Match
              </span>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-white border border-blue-100 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Dr. Anita Rao"
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-100 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1c2333] truncate">Dr. Anita Rao</h4>
                    <span className="text-xs font-semibold text-amber-600 flex items-center gap-0.5">
                      ★ 4.9 <span className="text-slate-400 font-normal">(42 reviews)</span>
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 font-medium">Head of NWP Division · RMC Chennai</p>
                  <p className="text-[11px] text-[#5b6478] mt-1 leading-relaxed">
                    Specialized in Tropical Cyclone Dynamics & WRF Grid simulations. Available for 1-on-1 guidance on your Module 3 track analysis.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 flex-wrap">
                <span className="text-[10.5px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                  Cyclone Dynamics
                </span>
                <span className="text-[10.5px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                  Dvorak Analysis
                </span>
                <span className="text-[10.5px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                  Next slot: Tomorrow, 3:30 PM
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onSelectTab('mentors')}
              className="text-xs font-semibold text-[#1f5eff] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore all mentors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('mentors')}
              className="px-3.5 py-1.5 bg-[#1f5eff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Book 1-on-1 session
            </button>
          </div>
        </div>
      </div>

      {/* Continue learning Table */}
      <div className="p-5 sm:p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-[#1c2333]">Continue learning</h3>
          <p className="text-xs text-[#5b6478] mt-0.5">Pick up where you left off</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#5b6478] border-b border-slate-100 font-medium">
                <th className="pb-3 font-medium">Course</th>
                <th className="pb-3 font-medium">Next module</th>
                <th className="pb-3 font-medium">Progress</th>
                <th className="pb-3 font-medium">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Cyclone Track Analysis */}
              <tr
                onClick={() => onSelectTab('course-player')}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
              >
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 font-bold text-[11px] flex items-center justify-center shrink-0 border border-amber-200">
                      CT
                    </div>
                    <div>
                      <span className="font-bold text-[#1c2333] group-hover:text-blue-600 block">
                        Cyclone Track Analysis
                      </span>
                      <span className="text-[11px] text-[#5b6478]">Meteorology</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-[#1c2333] font-medium">
                  M3 · Track forecasting
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5 w-32">
                    <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#1f5eff] h-2 rounded-full" style={{ width: '38%' }} />
                    </div>
                    <span className="text-[11px] text-[#5b6478] font-semibold w-7">
                      38%
                    </span>
                  </div>
                </td>
                <td className="py-3.5 pl-4 text-[#1c2333] font-medium">30 Nov</td>
              </tr>

              {/* Climate Data Handling */}
              <tr
                onClick={() => onSelectTab('course-player')}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
              >
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0 border border-blue-200">
                      CD
                    </div>
                    <div>
                      <span className="font-bold text-[#1c2333] group-hover:text-blue-600 block">
                        Climate Data Handling
                      </span>
                      <span className="text-[11px] text-[#5b6478]">Climatology</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-[#1c2333] font-medium">
                  M5 · Final quiz
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5 w-32">
                    <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#1f5eff] h-2 rounded-full" style={{ width: '76%' }} />
                    </div>
                    <span className="text-[11px] text-[#5b6478] font-semibold w-7">
                      76%
                    </span>
                  </div>
                </td>
                <td className="py-3.5 pl-4 text-[#1c2333] font-medium">05 Nov</td>
              </tr>

              {/* Radar Data Quality */}
              <tr
                onClick={() => onSelectTab('course-player')}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
              >
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 font-bold text-[11px] flex items-center justify-center shrink-0 border border-amber-200">
                      RD
                    </div>
                    <div>
                      <span className="font-bold text-[#1c2333] group-hover:text-blue-600 block">
                        Radar Data Quality
                      </span>
                      <span className="text-[11px] text-[#5b6478]">Instrumentation</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-[#1c2333] font-medium">
                  M2 · QC methods
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5 w-32">
                    <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#1f5eff] h-2 rounded-full" style={{ width: '44%' }} />
                    </div>
                    <span className="text-[11px] text-[#5b6478] font-semibold w-7">
                      44%
                    </span>
                  </div>
                </td>
                <td className="py-3.5 pl-4 text-[#1c2333] font-medium">20 Nov</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Announcement Modal */}
      {announcementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e8efff] text-[#1d4ed8]">
                  ADMIN ANNOUNCEMENT
                </span>
                <h3 className="text-lg font-bold text-[#1c2333] mt-2">
                  Cyclone Season Operational Training 2026
                </h3>
                <p className="text-xs text-[#5b6478] mt-0.5">
                  Published by IMD HQ Training Directorate · 24 Oct 2026
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAnnouncementModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed border-t border-slate-100 pt-4">
              <p>
                In preparation for the Post-Monsoon Cyclone Season (North Indian Ocean, Bay of Bengal and Arabian Sea), all regional meteorologists, duty officers, and radar technicians must complete:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Cyclone Track Analysis — Module 3 (Track forecasting methods)</li>
                <li>Radar Data Quality — Velocity dealiasing and clutter QC</li>
                <li>Mandatory mid-term assessment before 24 Oct deadline</li>
              </ul>
              <p>
                Dr. Ravi Menon will host an interactive Doppler Radar session for operational staff on Thursday at 15:00 IST.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setAnnouncementModalOpen(false);
                  onSelectTab('course-player');
                }}
                className="px-4 py-2 bg-[#1f5eff] hover:bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Open Cyclone Module
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
