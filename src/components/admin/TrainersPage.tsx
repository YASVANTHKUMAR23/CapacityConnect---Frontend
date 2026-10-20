import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

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
    <div className="space-y-6">
      {/* Filter Tabs matching 03-trainers.png */}
      <div className="flex items-center gap-2">
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

      {/* Search and Filters row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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

      {/* Trainers Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[13px]">
                <th className="pb-3.5 font-medium">Trainer</th>
                <th className="pb-3.5 font-medium">Subject expertise</th>
                <th className="pb-3.5 font-medium">Courses</th>
                <th className="pb-3.5 font-medium">Trainees</th>
                <th className="pb-3.5 font-medium">Last active</th>
                <th className="pb-3.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrainers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 pr-3">
                    <div>
                      <div className="font-semibold text-slate-900 text-[13px]">{t.name}</div>
                      <div className="text-slate-400 text-xs font-normal">
                        {t.email}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-700 font-medium text-[13px]">{t.expertise}</td>
                  <td className="py-3.5 text-slate-800 font-semibold tabular-nums text-[13px]">
                    {t.coursesCount}
                  </td>
                  <td className="py-3.5 text-slate-800 font-semibold tabular-nums text-[13px]">
                    {t.traineesCount}
                  </td>
                  <td className="py-3.5 text-slate-500 font-medium text-[13px]">{t.lastActive}</td>
                  <td className="py-3.5">
                    {t.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate-500 font-semibold text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-100 text-xs text-slate-500">
          <span>Showing 1-7 of 62</span>
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
