import React, { useState } from 'react';
import { Search, ChevronDown, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { MobileStatCards } from './MobileStatCards';
import { ScrollDrivenTable } from './ScrollDrivenTable';

interface TrainersPageProps {
  showToast?: (msg: string) => void;
}

export const TrainersPage: React.FC<TrainersPageProps> = () => {
  const { trainers } = useAdminData();
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [divisionFilter, setDivisionFilter] = useState('All');

  const filteredTrainers = trainers.filter((t) => {
    if (activeTab !== 'All' && t.status !== activeTab) return false;
    if (
      searchQuery &&
      !t.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.expertise.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (subjectFilter !== 'All' && t.expertise !== subjectFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile Stat Cards at top strictly matching reference image image_e0a499b4.png */}
      <MobileStatCards />

      {/* Filter Tabs matching 03-trainers.png (Desktop preserved) */}
      <div className="hidden sm:flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('All')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'All'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          All <span className="opacity-80 ml-1">62</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('Active')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'Active'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Active <span className="opacity-80 ml-1">54</span>
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
          Inactive <span className="opacity-80 ml-1">8</span>
        </button>
      </div>

      {/* Desktop Search and Filters row (hidden sm:flex) */}
      <div className="hidden sm:flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trainers"
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
              <option value="Cyclone tracking">Cyclone tracking</option>
              <option value="Numerical models">Numerical models</option>
              <option value="Climate data">Climate data</option>
              <option value="Instrumentation">Instrumentation</option>
              <option value="Radar analysis">Radar analysis</option>
              <option value="Agromet advisory">Agromet advisory</option>
              <option value="Ocean forecasting">Ocean forecasting</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-slate-700 shadow-2xs focus:outline-hidden cursor-pointer"
            >
              <option value="All">Division: All</option>
              <option value="Delhi HQ">Delhi HQ</option>
              <option value="Pune">Pune</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Mumbai">Mumbai</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Trainers / Members list Table Card */}
      <div className="w-full max-w-full min-w-0 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Mobile Heading and Search+Filter row strictly matching image_e0a499b4.png */}
        <div className="sm:hidden mb-3">
          <h2 className="font-bold text-slate-900 text-base mb-3">Members list</h2>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
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

        {/* Scroll-Driven Table with Mobile Scroll Progress Bar */}
        <ScrollDrivenTable minWidth="min-w-[840px]">
          <table className="w-full text-left text-[13px] min-w-[840px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[13px]">
                <th className="py-3.5 pl-3 pr-2 w-10">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[240px]">Client</th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[200px]">Subject expertise</th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[120px]">Courses</th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[120px]">Trainees</th>
                <th className="py-3.5 px-5 sm:px-6 font-medium whitespace-nowrap min-w-[120px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrainers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="py-4 pl-3 pr-2">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                        {t.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-[13px]">{t.name}</div>
                        <div className="text-slate-400 text-xs font-normal">
                          {t.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-700 font-medium text-[13px]">{t.expertise}</td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-800 font-semibold tabular-nums text-[13px]">
                    {t.coursesCount}
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap text-slate-800 font-semibold tabular-nums text-[13px]">
                    {t.traineesCount}
                  </td>
                  <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                    {t.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-xs bg-emerald-50 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate-500 font-semibold text-xs bg-slate-100 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollDrivenTable>

        {/* Mobile Pagination strictly matching image_e0a499b4.png */}
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
              10
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
          <span>Showing 1-7 of 62</span>
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
