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

interface AnalyticsPageProps {
  showToast: (msg: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ showToast }) => {
  const [timeframe, setTimeframe] = useState('Last 6 months');
  const [division, setDivision] = useState('All divisions');
  const [course, setCourse] = useState('All courses');

  const handleExport = () => {
    showToast('Exporting comprehensive analytics report as PDF...');
  };

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

      {/* 4 Top KPI Cards matching image_a88f9ff2.png */}
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
              3,420
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
              68%
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
              74%
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
              912
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
        {/* Enrollments and completions (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Enrollments and completions</h3>
            <span className="text-[11px] text-slate-400 font-medium">Monthly</span>
          </div>

          {/* Dual Line SVG Curve */}
          <div className="h-56 relative pt-4 flex flex-col justify-between">
            <div className="absolute inset-x-0 top-4 border-b border-slate-100 text-[10px] text-slate-400">800</div>
            <div className="absolute inset-x-0 top-16 border-b border-slate-100 text-[10px] text-slate-400">600</div>
            <div className="absolute inset-x-0 top-28 border-b border-slate-100 text-[10px] text-slate-400">400</div>
            <div className="absolute inset-x-0 top-40 border-b border-slate-100 text-[10px] text-slate-400">200</div>
            <div className="absolute inset-x-0 bottom-6 border-b border-slate-100 text-[10px] text-slate-400">0</div>

            {/* SVG Lines */}
            <svg className="w-full h-44 overflow-visible relative z-10" viewBox="0 0 500 160">
              {/* Line 1 (Completions light blue) */}
              <polyline
                fill="none"
                stroke="#bfdbfe"
                strokeWidth="2.5"
                points="30,110 120,95 210,105 300,75 390,65 480,55"
              />
              <circle cx="30" cy="110" r="3.5" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" />
              <circle cx="120" cy="95" r="3.5" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" />
              <circle cx="210" cy="105" r="3.5" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" />
              <circle cx="300" cy="75" r="3.5" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" />
              <circle cx="390" cy="65" r="3.5" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" />
              <circle cx="480" cy="55" r="3.5" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" />

              {/* Line 2 (Enrollments solid blue) */}
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                points="30,75 120,60 210,65 300,45 390,35 480,25"
              />
              <circle cx="30" cy="75" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <circle cx="120" cy="60" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <circle cx="210" cy="65" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <circle cx="300" cy="45" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <circle cx="390" cy="35" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
              <circle cx="480" cy="25" r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
            </svg>

            <div className="flex justify-between px-4 text-xs text-slate-400 font-medium">
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
            </div>
          </div>
        </div>

        {/* Average score by subject (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Average score by subject</h3>
            <span className="text-[11px] text-slate-400 font-medium">Percent</span>
          </div>

          <div className="h-56 flex items-end justify-between px-4 pt-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 bg-blue-600 rounded-t-lg h-36" />
              <span className="text-[11px] text-slate-500 font-medium">Forecast</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 bg-blue-600 rounded-t-lg h-32" />
              <span className="text-[11px] text-slate-500 font-medium">Climate</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 bg-blue-600 rounded-t-lg h-30" />
              <span className="text-[11px] text-slate-500 font-medium">Radar</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 bg-blue-600 rounded-t-lg h-24" />
              <span className="text-[11px] text-slate-500 font-medium">Cyclone</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 bg-blue-600 rounded-t-lg h-38" />
              <span className="text-[11px] text-slate-500 font-medium">Instru.</span>
            </div>
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
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 font-semibold text-slate-900">Climate Data Handling</td>
                <td className="py-3.5 text-slate-700 font-medium">298</td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[76%]" />
                    </div>
                    <span className="text-slate-500 font-medium">76%</span>
                  </div>
                </td>
                <td className="py-3.5 text-slate-700 font-medium">81%</td>
                <td className="py-3.5 text-slate-700 font-medium">204</td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[84%]" />
                    </div>
                    <span className="text-slate-500 font-medium">84%</span>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 font-semibold text-slate-900">Satellite Imagery Basics</td>
                <td className="py-3.5 text-slate-700 font-medium">242</td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[61%]" />
                    </div>
                    <span className="text-slate-500 font-medium">61%</span>
                  </div>
                </td>
                <td className="py-3.5 text-slate-700 font-medium">77%</td>
                <td className="py-3.5 text-slate-700 font-medium">131</td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[72%]" />
                    </div>
                    <span className="text-slate-500 font-medium">72%</span>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 font-semibold text-slate-900">Numerical Weather Models</td>
                <td className="py-3.5 text-slate-700 font-medium">356</td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[47%]" />
                    </div>
                    <span className="text-slate-500 font-medium">47%</span>
                  </div>
                </td>
                <td className="py-3.5 text-slate-700 font-medium">69%</td>
                <td className="py-3.5 text-slate-700 font-medium">121</td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[65%]" />
                    </div>
                    <span className="text-slate-500 font-medium">65%</span>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 font-semibold text-slate-900">Cyclone Track Analysis</td>
                <td className="py-3.5 text-slate-700 font-medium">214</td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[38%]" />
                    </div>
                    <span className="text-slate-500 font-medium">38%</span>
                  </div>
                </td>
                <td className="py-3.5 text-slate-700 font-medium">58%</td>
                <td className="py-3.5 text-slate-700 font-medium">62</td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[51%]" />
                    </div>
                    <span className="text-slate-500 font-medium">51%</span>
                  </div>
                </td>
              </tr>
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
            <span>8 Regional Divisions Active</span>
          </span>
        </div>

        {/* Top 4 Divisions Highlight Cards */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Top 4 Priority Hubs (from Dashboard)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-900">Delhi HQ</span>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+8%</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">417</div>
              <div className="text-[11px] text-slate-400 mt-0.5">38.6% national share</div>
              <div className="mt-3 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#3b41e3] h-full rounded-full" style={{ width: '82%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                <span>Completion: 82%</span>
                <span>Avg score: 79%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-900">Pune</span>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+5%</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">281</div>
              <div className="text-[11px] text-slate-400 mt-0.5">26.0% national share</div>
              <div className="mt-3 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#5157ea] h-full rounded-full" style={{ width: '74%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                <span>Completion: 74%</span>
                <span>Avg score: 75%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-900">Chennai</span>
                <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">-2%</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">212</div>
              <div className="text-[11px] text-slate-400 mt-0.5">19.6% national share</div>
              <div className="mt-3 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#8e93f3] h-full rounded-full" style={{ width: '68%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                <span>Completion: 68%</span>
                <span>Avg score: 71%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-900">Regional Satellites</span>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+4%</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums">168</div>
              <div className="text-[11px] text-slate-400 mt-0.5">15.8% national share</div>
              <div className="mt-3 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#a3a8f6] h-full rounded-full" style={{ width: '65%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                <span>Completion: 65%</span>
                <span>Avg score: 68%</span>
              </div>
            </div>
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
                <tr className="hover:bg-slate-50/50">
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3b41e3]" />
                    Delhi HQ
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-600 font-medium">North</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-900 font-bold tabular-nums">417</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-emerald-600 font-semibold">+8%</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-[82%]" />
                      </div>
                      <span className="text-slate-600 font-semibold">82%</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">79%</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">342</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      On Track
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5157ea]" />
                    Pune Met Centre
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-600 font-medium">West</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-900 font-bold tabular-nums">281</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-emerald-600 font-semibold">+5%</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-[74%]" />
                      </div>
                      <span className="text-slate-600 font-semibold">74%</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">75%</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">208</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      On Track
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8e93f3]" />
                    Chennai Coastal
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-600 font-medium">South</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-900 font-bold tabular-nums">212</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-rose-600 font-semibold">-2%</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-[68%]" />
                      </div>
                      <span className="text-slate-600 font-semibold">68%</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">71%</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">144</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                      Attention
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#a3a8f6]" />
                    Regional Satellites
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-600 font-medium">Central</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-900 font-bold tabular-nums">168</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-emerald-600 font-semibold">+4%</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-[65%]" />
                      </div>
                      <span className="text-slate-600 font-semibold">65%</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">68%</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">109</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      On Track
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />
                    Kolkata Doppler Unit
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-600 font-medium">East</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-900 font-bold tabular-nums">310</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-emerald-600 font-semibold">+6%</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-[78%]" />
                      </div>
                      <span className="text-slate-600 font-semibold">78%</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">76%</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">241</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      On Track
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4338ca]" />
                    Mumbai Western Met Hub
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-600 font-medium">West</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-900 font-bold tabular-nums">350</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-emerald-600 font-semibold">+9%</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-[80%]" />
                      </div>
                      <span className="text-slate-600 font-semibold">80%</span>
                    </div>
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">78%</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">280</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      On Track
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </ScrollDrivenTable>
        </div>
      </div>
    </div>
  );
};
