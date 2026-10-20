import React, { useState } from 'react';
import { Search, ChevronDown, Edit2, MoreHorizontal, X } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { TrainerItem } from '../../types';

interface TrainersPageProps {
  showToast?: (msg: string) => void;
}

export const TrainersPage: React.FC<TrainersPageProps> = ({ showToast }) => {
  const { trainers, updateTrainer } = useAdminData();
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [divisionFilter, setDivisionFilter] = useState('All');
  const [editingTrainer, setEditingTrainer] = useState<TrainerItem | null>(null);

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
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3.5 font-medium">Trainer</th>
                <th className="pb-3.5 font-medium">Subject expertise</th>
                <th className="pb-3.5 font-medium">Courses</th>
                <th className="pb-3.5 font-medium">Trainees</th>
                <th className="pb-3.5 font-medium">Last active</th>
                <th className="pb-3.5 font-medium">Status</th>
                <th className="pb-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrainers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${t.avatarBg}`}
                      >
                        {t.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{t.name}</div>
                        <div className="text-slate-400 text-[11px] font-normal">
                          {t.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-700 font-medium">{t.expertise}</td>
                  <td className="py-3.5 text-slate-800 font-semibold tabular-nums">
                    {t.coursesCount}
                  </td>
                  <td className="py-3.5 text-slate-800 font-semibold tabular-nums">
                    {t.traineesCount}
                  </td>
                  <td className="py-3.5 text-slate-500 font-medium">{t.lastActive}</td>
                  <td className="py-3.5">
                    {t.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate-500 font-semibold text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 text-slate-400">
                      <button
                        type="button"
                        onClick={() => setEditingTrainer({ ...t })}
                        className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit trainer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" className="p-1.5 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
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

      {/* Edit Trainer Modal Dialog */}
      {editingTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${editingTrainer.avatarBg}`}
                >
                  {editingTrainer.initials}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Edit Trainer</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingTrainer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateTrainer(editingTrainer.id, editingTrainer);
                showToast?.(`Trainer "${editingTrainer.name}" updated successfully.`);
                setEditingTrainer(null);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Trainer Name</label>
                <input
                  type="text"
                  value={editingTrainer.name}
                  onChange={(e) => setEditingTrainer({ ...editingTrainer, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  value={editingTrainer.email}
                  onChange={(e) => setEditingTrainer({ ...editingTrainer, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Expertise</label>
                <input
                  type="text"
                  value={editingTrainer.expertise}
                  onChange={(e) =>
                    setEditingTrainer({ ...editingTrainer, expertise: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Courses</label>
                  <input
                    type="number"
                    value={editingTrainer.coursesCount}
                    onChange={(e) =>
                      setEditingTrainer({
                        ...editingTrainer,
                        coursesCount: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Trainees Mentored</label>
                  <input
                    type="number"
                    value={editingTrainer.traineesCount}
                    onChange={(e) =>
                      setEditingTrainer({
                        ...editingTrainer,
                        traineesCount: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={editingTrainer.status}
                  onChange={(e) =>
                    setEditingTrainer({
                      ...editingTrainer,
                      status: e.target.value as 'Active' | 'Inactive',
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTrainer(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 font-semibold text-slate-600 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
