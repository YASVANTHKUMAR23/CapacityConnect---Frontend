import React, { useState } from 'react';
import { Search, ChevronDown, MoreHorizontal } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

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
    <div className="space-y-6">
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

      {/* Search and Filters row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses"
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
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

          <div className="relative">
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

      {/* Courses Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3.5 font-medium">Course</th>
                <th className="pb-3.5 font-medium">Trainer</th>
                <th className="pb-3.5 font-medium">Enrolled</th>
                <th className="pb-3.5 font-medium">Completion</th>
                <th className="pb-3.5 font-medium">Deadline</th>
                <th className="pb-3.5 font-medium">Status</th>
                <th className="pb-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${c.avatarBg}`}
                      >
                        {c.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{c.title}</div>
                        <div className="text-slate-400 text-[11px] font-normal">
                          {c.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-700 font-medium">{c.trainer}</td>
                  <td className="py-3.5 text-slate-800 font-semibold tabular-nums">
                    {c.enrolled}
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${c.completion}%` }}
                        />
                      </div>
                      <span className="text-slate-500 text-[11px] font-medium tabular-nums">
                        {c.completion}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-500 font-medium">{c.deadline}</td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 text-slate-400">
                      <button
                        type="button"
                        className="p-1.5 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                        title="More options"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-100 text-xs text-slate-500">
          <span>Showing 1-6 of 36</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium"
            >
              Previous
            </button>
            <button
              type="button"
              className="px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
