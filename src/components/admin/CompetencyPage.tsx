import React from 'react';
import { Target, X, LayoutGrid, Award } from 'lucide-react';
import { ScrollDrivenTable } from './ScrollDrivenTable';

export const CompetencyPage: React.FC = () => {
  return (
    <div className="w-full max-w-full min-w-0 space-y-4 sm:space-y-6">
      {/* 4 Top KPI Cards matching 09-competency.png */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[13px] sm:text-[14px] text-slate-500 font-normal">Organizational Capacity</span>
            <div className="w-[40px] h-[40px] rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Target className="w-[26px] h-[26px]" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-[32px] sm:text-[36px] font-semibold text-slate-900 tracking-tight leading-none">
              68%
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-600 font-medium">↗ 5.2%</span>
            <span className="text-slate-400 font-normal">vs last 30 days</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[13px] sm:text-[14px] text-slate-500 font-normal">Skill Gaps Open</span>
            <div className="w-[40px] h-[40px] rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
              <X className="w-[26px] h-[26px]" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-[32px] sm:text-[36px] font-semibold text-slate-900 tracking-tight leading-none">
              23
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-600 font-medium">↘ 4 gaps</span>
            <span className="text-slate-400 font-normal">vs last 30 days</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[13px] sm:text-[14px] text-slate-500 font-normal">Subjects With Trainer</span>
            <div className="w-[40px] h-[40px] rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <LayoutGrid className="w-[26px] h-[26px]" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-[32px] sm:text-[36px] font-semibold text-slate-900 tracking-tight leading-none">
              31 <span className="text-sm font-normal text-slate-400">/ 36</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-600 font-medium">↗ +2</span>
            <span className="text-slate-400 font-normal">vs last 30 days</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-[13px] sm:text-[14px] text-slate-500 font-normal">Trainees Assessed</span>
            <div className="w-[40px] h-[40px] rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Award className="w-[26px] h-[26px]" />
            </div>
          </div>
          <div className="my-2">
            <div className="text-[32px] sm:text-[36px] font-semibold text-slate-900 tracking-tight leading-none">
              1,042
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-emerald-600 font-medium">↗ 9.6%</span>
            <span className="text-slate-400 font-normal">vs last 30 days</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Competency by subject + Skill gap donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Competency level by subject (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-900 text-sm">Competency level by subject</h3>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                Current
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-slate-900 rounded-xs" />
                Target
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Forecasting */}
            <div className="flex items-center justify-between gap-4">
              <span className="w-32 font-medium text-slate-700">Forecasting</span>
              <div className="flex-1 relative h-3 bg-slate-100 rounded-full">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '72%' }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-900" style={{ left: '75%' }} />
              </div>
              <span className="w-10 text-right font-semibold text-slate-700 tabular-nums">72%</span>
            </div>

            {/* Radar analysis */}
            <div className="flex items-center justify-between gap-4">
              <span className="w-32 font-medium text-slate-700">Radar analysis</span>
              <div className="flex-1 relative h-3 bg-slate-100 rounded-full">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '58%' }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-900" style={{ left: '70%' }} />
              </div>
              <span className="w-10 text-right font-semibold text-slate-700 tabular-nums">58%</span>
            </div>

            {/* Climate data */}
            <div className="flex items-center justify-between gap-4">
              <span className="w-32 font-medium text-slate-700">Climate data</span>
              <div className="flex-1 relative h-3 bg-slate-100 rounded-full">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '66%' }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-900" style={{ left: '68%' }} />
              </div>
              <span className="w-10 text-right font-semibold text-slate-700 tabular-nums">66%</span>
            </div>

            {/* Cyclone tracking */}
            <div className="flex items-center justify-between gap-4">
              <span className="w-32 font-medium text-slate-700">Cyclone tracking</span>
              <div className="flex-1 relative h-3 bg-slate-100 rounded-full">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '49%' }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-900" style={{ left: '70%' }} />
              </div>
              <span className="w-10 text-right font-semibold text-slate-700 tabular-nums">49%</span>
            </div>

            {/* Instrumentation */}
            <div className="flex items-center justify-between gap-4">
              <span className="w-32 font-medium text-slate-700">Instrumentation</span>
              <div className="flex-1 relative h-3 bg-slate-100 rounded-full">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '81%' }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-900" style={{ left: '75%' }} />
              </div>
              <span className="w-10 text-right font-semibold text-slate-700 tabular-nums">81%</span>
            </div>

            {/* Agrometeorology */}
            <div className="flex items-center justify-between gap-4">
              <span className="w-32 font-medium text-slate-700">Agrometeorology</span>
              <div className="flex-1 relative h-3 bg-slate-100 rounded-full">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '63%' }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-900" style={{ left: '65%' }} />
              </div>
              <span className="w-10 text-right font-semibold text-slate-700 tabular-nums">63%</span>
            </div>

            {/* Remote sensing */}
            <div className="flex items-center justify-between gap-4">
              <span className="w-32 font-medium text-slate-700">Remote sensing</span>
              <div className="flex-1 relative h-3 bg-slate-100 rounded-full">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '54%' }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-900" style={{ left: '70%' }} />
              </div>
              <span className="w-10 text-right font-semibold text-slate-700 tabular-nums">54%</span>
            </div>
          </div>
        </div>

        {/* Right: Skill gap distribution Donut (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <h3 className="font-bold text-slate-900 text-sm mb-2">Skill gap distribution</h3>

          <div className="my-2 flex items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="52"
                  stroke="#2563eb"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={326}
                  strokeDashoffset={326 - (326 * 46) / 100}
                />
                <circle
                  cx="72"
                  cy="72"
                  r="52"
                  stroke="#bfdbfe"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={326}
                  strokeDashoffset={326 - (326 * 34) / 100}
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-bold text-slate-900">1,042</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Meets target</span>
              <span className="font-bold text-slate-900">46%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Minor gap</span>
              <span className="font-bold text-slate-900">34%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Major gap</span>
              <span className="font-bold text-slate-900">20%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Competency Recommendations Table matching 09-competency.png */}
      <div className="w-full max-w-full min-w-0 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs overflow-hidden">
        <ScrollDrivenTable minWidth="min-w-[780px]">
          <table className="w-full text-left text-xs min-w-[780px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[200px]">Subject</th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[130px]">Matched trainers</th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[130px]">Trainees mapped</th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[160px]">Avg. level</th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[110px]">Gap</th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[160px]">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50">
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap font-semibold text-slate-900">Cyclone tracking</td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">2</td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">214</td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[49%]" />
                    </div>
                    <span className="text-slate-500 font-medium">49%</span>
                  </div>
                </td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 text-rose-700 font-semibold text-[11px] bg-rose-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Major
                  </span>
                </td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">Add trainer</td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap font-semibold text-slate-900">Remote sensing</td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">3</td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">242</td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[54%]" />
                    </div>
                    <span className="text-slate-500 font-medium">54%</span>
                  </div>
                </td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 text-rose-700 font-semibold text-[11px] bg-rose-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Major
                  </span>
                </td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">Run pre-assessment</td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap font-semibold text-slate-900">Radar analysis</td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">3</td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">142</td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[58%]" />
                    </div>
                    <span className="text-slate-500 font-medium">58%</span>
                  </div>
                </td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 text-amber-700 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Minor
                  </span>
                </td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">Assign mentors</td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap font-semibold text-slate-900">Forecasting</td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">5</td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">356</td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[72%]" />
                    </div>
                    <span className="text-slate-500 font-medium">72%</span>
                  </div>
                </td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 text-amber-700 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Minor
                  </span>
                </td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">Advanced module</td>
              </tr>

              <tr className="hover:bg-slate-50/50">
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap font-semibold text-slate-900">Instrumentation</td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">2</td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">187</td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 w-[81%]" />
                    </div>
                    <span className="text-slate-500 font-medium">81%</span>
                  </div>
                </td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    None
                  </span>
                </td>
                <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium">Maintain</td>
              </tr>
            </tbody>
          </table>
        </ScrollDrivenTable>
      </div>
    </div>
  );
};
