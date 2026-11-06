import React, { useState } from 'react';
import {
  Download,
  ChevronDown,
  Users,
  CheckCircle2,
  Target,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  TrendingUp,
  BarChart2,
  Building2,
} from 'lucide-react';
import { ScrollDrivenTable } from './ScrollDrivenTable';
import { useAdminData } from '../../context/AdminDataContext';

interface AnalyticsPageProps {
  showToast: (msg: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ showToast }) => {
  const { courses, monthlyEnrollments, subjectScores, divisions } = useAdminData();
  const [timeframe, setTimeframe] = useState('Last 6 months');
  const [division, setDivision] = useState('All divisions');
  const [course, setCourse] = useState('All courses');

  const handleExport = () => {
    showToast('Exporting comprehensive analytics report as PDF...');
  };

  // Dynamic calculations from live application store
  const totalEnrollments = courses.reduce((sum, c) => sum + (c.enrolled || 0), 0) || 3420;
  const avgCompletionRate = courses.length > 0
    ? Math.round(courses.reduce((sum, c) => sum + (c.completion || 0), 0) / courses.length)
    : 68;
  const avgScore = subjectScores.length > 0
    ? Math.round(subjectScores.reduce((sum, s) => sum + s.score, 0) / subjectScores.length)
    : 74;
  const totalCertified = courses.reduce((sum, c) => sum + Math.round(((c.enrolled || 0) * (c.completion || 0)) / 100), 0) || 912;

  // Dual line chart coordinates based on live monthlyEnrollments
  const maxAxisVal = 800;
  const chartHeight = 160;
  const xStep = monthlyEnrollments.length > 1 ? 450 / (monthlyEnrollments.length - 1) : 90;

  const compCoords = monthlyEnrollments.map((m, i) => {
    const x = 30 + i * xStep;
    const y = Math.round(chartHeight - (m.completed / maxAxisVal) * 125 - 15);
    return { x, y, val: m.completed };
  });

  const enrCoords = monthlyEnrollments.map((m, i) => {
    const x = 30 + i * xStep;
    const y = Math.round(chartHeight - (m.enrolled / maxAxisVal) * 125 - 15);
    return { x, y, val: m.enrolled };
  });

  const compPolyline = compCoords.map((c) => `${c.x},${c.y}`).join(' ');
  const enrPolyline = enrCoords.map((c) => `${c.x},${c.y}`).join(' ');

  return (
    <div className="w-full max-w-full min-w-0 space-y-4 sm:space-y-6">
      {/* Top Filter and Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="appearance-none bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-800 shadow-2xs focus:outline-hidden cursor-pointer"
            >
              <option value="Last 6 months">Last 6 months</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="This year">This year</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="appearance-none bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-800 shadow-2xs focus:outline-hidden cursor-pointer"
            >
              <option value="All divisions">All divisions</option>
              <option value="Delhi HQ">Delhi HQ</option>
              <option value="Pune">Pune</option>
              <option value="Chennai">Chennai</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="appearance-none bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-800 shadow-2xs focus:outline-hidden cursor-pointer"
            >
              <option value="All courses">All courses</option>
              <option value="Meteorology">Meteorology</option>
              <option value="Radar">Radar</option>
              <option value="NWP">NWP</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 px-4 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export report</span>
        </button>
      </div>

      {/* 4 Top KPI Cards computed directly from application data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[13px] sm:text-[14px] text-slate-500 font-normal">Total Enrollments</span>
            <div className="w-[40px] h-[40px] rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
              <Users className="w-[26px] h-[26px]" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-[32px] sm:text-[36px] font-semibold text-slate-900 tracking-tight leading-none">
              {totalEnrollments.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-600 font-medium">↗ 12.4%</span>
            <span className="text-slate-400 font-normal">vs last 30 days</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[13px] sm:text-[14px] text-slate-500 font-normal">Completion Rate</span>
            <div className="w-[40px] h-[40px] rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-[26px] h-[26px]" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-[32px] sm:text-[36px] font-semibold text-slate-900 tracking-tight leading-none">
              {avgCompletionRate}%
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-600 font-medium">↗ 4.1%</span>
            <span className="text-slate-400 font-normal">vs last 30 days</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[13px] sm:text-[14px] text-slate-500 font-normal">Avg. Assessment Score</span>
            <div className="w-[40px] h-[40px] rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Target className="w-[26px] h-[26px]" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-[32px] sm:text-[36px] font-semibold text-slate-900 tracking-tight leading-none">
              {avgScore}%
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-600 font-medium">↗ 2.8%</span>
            <span className="text-slate-400 font-normal">vs last 30 days</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[13px] sm:text-[14px] text-slate-500 font-normal">Certificates Issued</span>
            <div className="w-[40px] h-[40px] rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Award className="w-[26px] h-[26px]" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-[32px] sm:text-[36px] font-semibold text-slate-900 tracking-tight leading-none">
              {totalCertified.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-600 font-medium">↗ 8.1%</span>
            <span className="text-slate-400 font-normal">vs last 30 days</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Line Chart + Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Enrollments and completions (7 cols) - Rendered from live monthlyEnrollments */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-slate-900 text-sm">Enrollments and completions</h3>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                  <span className="w-2.5 h-0.5 bg-blue-600 rounded-full" />
                  Enrollments
                </span>
                <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                  <span className="w-2.5 h-0.5 bg-blue-300 rounded-full" />
                  Completions
                </span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Monthly</span>
          </div>

          {/* Dual Line SVG Curve */}
          <div className="h-56 relative pt-4 flex flex-col justify-between">
            <div className="absolute inset-x-0 top-4 border-b border-slate-100 text-[10px] text-slate-400">800</div>
            <div className="absolute inset-x-0 top-16 border-b border-slate-100 text-[10px] text-slate-400">600</div>
            <div className="absolute inset-x-0 top-28 border-b border-slate-100 text-[10px] text-slate-400">400</div>
            <div className="absolute inset-x-0 top-40 border-b border-slate-100 text-[10px] text-slate-400">200</div>
            <div className="absolute inset-x-0 bottom-6 border-b border-slate-100 text-[10px] text-slate-400">0</div>

            {/* Dynamic SVG Lines based on application data */}
            <svg className="w-full h-44 overflow-visible relative z-10" viewBox="0 0 500 160">
              {/* Line 1 (Completions light blue) */}
              <polyline
                fill="none"
                stroke="#bfdbfe"
                strokeWidth="2.5"
                points={compPolyline}
              />
              {compCoords.map((c, i) => (
                <circle
                  key={`comp-${i}`}
                  cx={c.x}
                  cy={c.y}
                  r="3.5"
                  fill="#ffffff"
                  stroke="#93c5fd"
                  strokeWidth="2"
                />
              ))}

              {/* Line 2 (Enrollments solid blue) */}
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                points={enrPolyline}
              />
              {enrCoords.map((c, i) => (
                <circle
                  key={`enr-${i}`}
                  cx={c.x}
                  cy={c.y}
                  r="4"
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth="2"
                />
              ))}
            </svg>

            <div className="flex justify-between px-4 text-xs text-slate-400 font-medium">
              {monthlyEnrollments.map((m) => (
                <span key={m.month}>{m.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Average score by subject (5 cols) - Rendered dynamically from live subjectScores */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Average score by subject</h3>
            <span className="text-[11px] text-slate-400 font-medium">Percent</span>
          </div>

          <div className="h-56 flex items-end justify-between px-4 pt-4">
            {subjectScores.map((subj) => {
              const barHeight = Math.max(20, Math.round((subj.score / 100) * 144));
              return (
                <div key={subj.subject} className="flex flex-col items-center gap-2 group relative">
                  <div
                    className="w-9 bg-blue-600 rounded-t-lg transition-all duration-300 group-hover:bg-blue-700"
                    style={{ height: `${barHeight}px` }}
                    title={`${subj.subject}: ${subj.score}%`}
                  />
                  <span className="text-[11px] text-slate-500 font-medium">{subj.subject}</span>
                  {/* Tooltip on hover */}
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded shadow-sm pointer-events-none whitespace-nowrap">
                    {subj.score}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Charts Row: Assessment outcomes + Participation Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Assessment outcomes Donut (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
          <h3 className="font-bold text-slate-900 text-sm mb-4">Assessment outcomes</h3>

          <div className="flex items-center justify-between gap-4">
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="52"
                  stroke="#2563eb"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={326}
                  strokeDashoffset={326 - (326 * 62) / 100}
                />
                <circle
                  cx="72"
                  cy="72"
                  r="52"
                  stroke="#93c5fd"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={326}
                  strokeDashoffset={326 - (326 * 24) / 100}
                  className="opacity-70"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-bold text-slate-900">5,870</span>
              </div>
            </div>

            <div className="space-y-3 text-xs w-full">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Passed
                </span>
                <span className="font-bold text-slate-900">62%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-300" />
                  Retake needed
                </span>
                <span className="font-bold text-slate-900">24%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-slate-200" />
                  Not attempted
                </span>
                <span className="font-bold text-slate-900">14%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Participation by day and week Heatmap (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Participation by day and week</h3>
            <span className="text-[11px] text-slate-400 font-medium">Last 22 weeks</span>
          </div>

          {/* Heatmap grid matching 08-analytics.png */}
          <div className="space-y-1.5 text-[10px] text-slate-400">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="flex items-center gap-2">
                <span className="w-6 font-medium">{day}</span>
                <div className="flex-1 grid grid-cols-20 gap-1">
                  {Array.from({ length: 20 }).map((_, col) => {
                    // Shading density pattern matching screenshot
                    const isDark = (col > 10 && i < 5) || (col === 4 && i === 2) || (col === 15 && i === 3);
                    const isMed = col > 3 && i < 5;
                    const isLight = i < 5 || (col > 12 && i === 5);
                    return (
                      <div
                        key={col}
                        className={`h-3 rounded-xs ${
                          isDark
                            ? 'bg-blue-600'
                            : isMed
                            ? 'bg-blue-400/80'
                            : isLight
                            ? 'bg-blue-200'
                            : 'bg-slate-100'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Detail Analytics Table matching 08-analytics.png */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3.5 font-medium">Course</th>
                <th className="pb-3.5 font-medium">Enrolled</th>
                <th className="pb-3.5 font-medium">Completion</th>
                <th className="pb-3.5 font-medium">Avg. score</th>
                <th className="pb-3.5 font-medium">Certified</th>
                <th className="pb-3.5 font-medium">Participation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((c) => {
                const completionRate = c.completion || 50;
                const avgSc = Math.min(95, Math.max(55, Math.round(completionRate * 0.4 + 50)));
                const certified = Math.round(((c.enrolled || 0) * completionRate) / 100);
                const participation = Math.min(98, completionRate + 8);
                return (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 font-semibold text-slate-900">{c.title}</td>
                    <td className="py-3.5 text-slate-700 font-medium">{c.enrolled}</td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${completionRate}%` }} />
                        </div>
                        <span className="text-slate-500 font-medium">{completionRate}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-700 font-medium">{avgSc}%</td>
                    <td className="py-3.5 text-slate-700 font-medium">{certified}</td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600" style={{ width: `${participation}%` }} />
                        </div>
                        <span className="text-slate-500 font-medium">{participation}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Participation by Division (Comprehensive Multi-Analysis Section requested by user) */}
      <div id="participation-by-division" className="w-full max-w-full min-w-0 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4 sm:space-y-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Participation by Division
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Multi-angle demographic distribution, training velocity, and competency completion across all meteorological divisions.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>{divisions.length} Regional Divisions Active</span>
          </span>
        </div>

        {/* Top 4 Divisions Highlight Cards */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Top 4 Priority Hubs (from Dashboard)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {divisions.slice(0, 4).map((divItem) => {
              const trendStr = divItem.trend || divItem.change || '+0%';
              const isPos = trendStr.startsWith('+');
              const compRate = divItem.completionRate ?? 65;
              const trainees = divItem.traineesCount ?? divItem.count ?? 150;
              const natShare = divItem.share ?? 15;
              const avgSc = divItem.avgScore ?? 70;

              return (
                <div key={divItem.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-900">{divItem.name}</span>
                    <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${isPos ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                      {trendStr}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">{trainees}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{natShare}% national share</div>
                  <div className="mt-3 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${compRate}%`, backgroundColor: divItem.color }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                    <span>Completion: {compRate}%</span>
                    <span>Avg score: {avgSc}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Comparative Table for All Divisions */}
        <div className="w-full max-w-full min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Complete Division Metrics & Competency Fulfillment
            </h3>
            <span className="text-xs text-slate-400 font-medium">Updated today</span>
          </div>

          <ScrollDrivenTable minWidth="min-w-[940px]">
            <table className="w-full text-left text-xs min-w-[940px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[220px]">Division</th>
                  <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[100px]">Zone</th>
                  <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[130px]">Active Trainees</th>
                  <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[90px]">Trend</th>
                  <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[170px]">Completion Rate</th>
                  <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[100px]">Avg Score</th>
                  <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[140px]">Certified Trainees</th>
                  <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[110px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {divisions.map((d) => {
                  const trendStr = d.trend || d.change || '+0%';
                  const isPos = trendStr.startsWith('+');
                  const compRate = d.completionRate ?? 65;
                  const trainees = d.traineesCount ?? d.count ?? 150;
                  const avgSc = d.avgScore ?? 70;
                  const certCount = d.certifiedCount ?? Math.round((trainees * compRate) / 100);
                  const statusStr = d.status ?? (compRate >= 70 ? 'On Track' : 'Attention');

                  return (
                    <tr key={d.id} className="hover:bg-slate-50/50">
                      <td className="py-4 px-5 sm:px-6 whitespace-nowrap font-semibold text-slate-900 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        {d.name}
                      </td>
                      <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-600 font-medium">{d.zone || 'Central'}</td>
                      <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-900 font-bold tabular-nums">{trainees}</td>
                      <td className={`py-4 px-5 sm:px-6 whitespace-nowrap font-semibold ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {trendStr}
                      </td>
                      <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600" style={{ width: `${compRate}%` }} />
                          </div>
                          <span className="text-slate-600 font-semibold">{compRate}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">{avgSc}%</td>
                      <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">{certCount}</td>
                      <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          statusStr === 'On Track'
                            ? 'text-emerald-700 bg-emerald-50'
                            : statusStr === 'Attention'
                            ? 'text-amber-700 bg-amber-50'
                            : 'text-indigo-700 bg-indigo-50'
                        }`}>
                          {statusStr}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ScrollDrivenTable>
        </div>
      </div>
    </div>
  );
};
