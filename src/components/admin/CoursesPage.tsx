import React, { useState } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { ScrollDrivenTable } from './ScrollDrivenTable';
import { MobileStatCards } from './MobileStatCards';

interface CoursesPageProps {
  showToast?: (msg: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = () => {
  const { courses } = useAdminData();
  const [activeTab, setActiveTab] = useState<'Active' | 'Inactive'>('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [trainerFilter, setTrainerFilter] = useState('All');

  const filteredCourses = courses.filter((c) => {
    if (c.status !== activeTab) return false;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (subjectFilter !== 'All' && c.category !== subjectFilter) return false;
    if (trainerFilter !== 'All' && c.trainer !== trainerFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
      {/* Mobile Stat Cards at top matching other admin views */}
      <MobileStatCards />

      {/* Filter Tabs & Search row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Tabs matching 05-courses.png */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('Active')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'Active'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            Active <span className="opacity-80 ml-1">36</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Inactive')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'Inactive'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            Inactive <span className="opacity-80 ml-1">12</span>
          </button>
        </div>

        {/* Search and Filters row (Desktop) */}
        <div className="hidden sm:flex items-center gap-3 flex-1 max-w-xl justify-end">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses"
              className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 shadow-2xs"
            />
          </div>

          <div className="relative shrink-0">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-slate-700 shadow-2xs focus:outline-hidden cursor-pointer"
            >
              <option value="All">Subject: All</option>
              <option value="Meteorology">Meteorology</option>
              <option value="Forecasting">Forecasting</option>
              <option value="Climatology">Climatology</option>
              <option value="Instrumentation">Instrumentation</option>
              <option value="Remote sensing">Remote sensing</option>
              <option value="Agrometeorology">Agrometeorology</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative shrink-0">
            <select
              value={trainerFilter}
              onChange={(e) => setTrainerFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-slate-700 shadow-2xs focus:outline-hidden cursor-pointer"
            >
              <option value="All">Trainer: All</option>
              <option value="Dr. Ravi Menon">Dr. Ravi Menon</option>
              <option value="Dr. Anita Rao">Dr. Anita Rao</option>
              <option value="Prof. Sunil Das">Prof. Sunil Das</option>
              <option value="Meera Iyer">Meera Iyer</option>
              <option value="Farah Khan">Farah Khan</option>
              <option value="Dr. Pooja Sen">Dr. Pooja Sen</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Courses Table Card */}
      <div className="w-full max-w-full min-w-0 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Mobile Heading and Search+Filter row strictly matching reference design */}
        <div className="sm:hidden mb-3">
          <h2 className="font-bold text-slate-900 text-base mb-3">Courses list</h2>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses"
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 shadow-2xs"
              />
            </div>
            <button
              type="button"
              className="px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-white text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs shrink-0 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-600" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Scroll-Driven Courses Table with generous column padding and min-widths */}
        <ScrollDrivenTable minWidth="min-w-[860px]">
          <table className="w-full text-left text-[13px] min-w-[860px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[13px]">
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[280px]">Course</th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[180px]">Trainer</th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[120px]">Enrolled</th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[180px]">Completion</th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[130px]">Deadline</th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[110px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-[13px] shrink-0 ${c.avatarBg}`}
                      >
                        {c.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-[13px]">{c.title}</div>
                        <div className="text-slate-400 text-xs font-normal">
                          {c.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium text-[13px]">{c.trainer}</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-800 font-semibold tabular-nums text-[13px]">
                    {c.enrolled}
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${c.completion}%` }}
                        />
                      </div>
                      <span className="text-slate-500 text-xs font-medium tabular-nums">
                        {c.completion}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-500 font-medium text-[13px]">{c.deadline}</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-xs bg-emerald-50 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollDrivenTable>

        {/* Mobile Pagination strictly matching reference design */}
        <div className="sm:hidden flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
          <button
            type="button"
            className="w-9 h-9 rounded-xl border border-slate-200/90 bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 shadow-2xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <button
              type="button"
              className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-xs cursor-pointer"
            >
              1
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              2
            </button>
            <span className="text-slate-400 px-1">...</span>
            <button
              type="button"
              className="w-8 h-8 rounded-xl text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
            >
              6
            </button>
          </div>
          <button
            type="button"
            className="w-9 h-9 rounded-xl border border-slate-200/90 bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop Pagination (preserved for non-mobile views) */}
        <div className="hidden sm:flex items-center justify-between pt-5 border-t border-slate-100 text-xs text-slate-500">
          <span>Showing 1-6 of 36</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              className="px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
