import React, { useState } from 'react';
import { Search, ChevronDown, Edit2, MoreHorizontal, X } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { TraineeItem } from '../../types';

interface TraineesPageProps {
  showToast?: (msg: string) => void;
}

export const TraineesPage: React.FC<TraineesPageProps> = ({ showToast }) => {
  const { trainees, updateTrainee } = useAdminData();
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [editingTrainee, setEditingTrainee] = useState<TraineeItem | null>(null);

  const filteredTrainees = trainees.filter((t) => {
    if (activeTab !== 'All' && t.status !== activeTab) return false;
    if (
      searchQuery &&
      !t.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.division.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (divisionFilter !== 'All' && t.division !== divisionFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs matching 04-trainees.png */}
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
          All <span className="opacity-80 ml-1">1,284</span>
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
          Active <span className="opacity-80 ml-1">1,096</span>
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
          Inactive <span className="opacity-80 ml-1">188</span>
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
            placeholder="Search trainees"
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-slate-700 shadow-2xs focus:outline-hidden cursor-pointer"
            >
              <option value="All">Division: All</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Pune">Pune</option>
              <option value="Thiruvananthapuram">Thiruvananthapuram</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Nagpur">Nagpur</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-slate-700 shadow-2xs focus:outline-hidden cursor-pointer"
            >
              <option value="All">Course: All</option>
              <option value="Cyclone Track Analysis">Cyclone Track Analysis</option>
              <option value="Numerical Weather Models">Numerical Weather Models</option>
              <option value="Climate Data Handling">Climate Data Handling</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Trainees Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                <th className="pb-3.5 font-medium">Trainee</th>
                <th className="pb-3.5 font-medium">Division</th>
                <th className="pb-3.5 font-medium">Enrolled courses</th>
                <th className="pb-3.5 font-medium">Avg. progress</th>
                <th className="pb-3.5 font-medium">Last active</th>
                <th className="pb-3.5 font-medium">Status</th>
                <th className="pb-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrainees.map((t) => (
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
                  <td className="py-3.5 text-slate-700 font-medium">{t.division}</td>
                  <td className="py-3.5 text-slate-800 font-semibold tabular-nums">
                    {t.enrolledCount}
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${t.avgProgress}%` }}
                        />
                      </div>
                      <span className="text-slate-500 text-[11px] font-medium tabular-nums">
                        {t.avgProgress}%
                      </span>
                    </div>
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
                        onClick={() => setEditingTrainee({ ...t })}
                        className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit trainee"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
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
          <span>Showing 1-7 of 1,284</span>
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

      {/* Edit Trainee Modal Dialog */}
      {editingTrainee && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  <Edit2 className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Edit Trainee Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingTrainee(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateTrainee(editingTrainee.id, {
                  name: editingTrainee.name,
                  email: editingTrainee.email,
                  division: editingTrainee.division,
                  enrolledCount: editingTrainee.enrolledCount,
                  avgProgress: editingTrainee.avgProgress,
                  status: editingTrainee.status,
                });
                showToast?.(`Trainee profile for "${editingTrainee.name}" updated successfully.`);
                setEditingTrainee(null);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingTrainee.name}
                  onChange={(e) =>
                    setEditingTrainee({ ...editingTrainee, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  value={editingTrainee.email}
                  onChange={(e) =>
                    setEditingTrainee({ ...editingTrainee, email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Division / Center</label>
                <select
                  value={editingTrainee.division}
                  onChange={(e) =>
                    setEditingTrainee({ ...editingTrainee, division: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 cursor-pointer"
                >
                  <option value="Delhi HQ">Delhi HQ</option>
                  <option value="Pune">Pune</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Regional Satellites">Regional Satellites</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Guwahati">Guwahati</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Enrolled Courses</label>
                  <input
                    type="number"
                    min={0}
                    value={editingTrainee.enrolledCount}
                    onChange={(e) =>
                      setEditingTrainee({
                        ...editingTrainee,
                        enrolledCount: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Progress (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editingTrainee.avgProgress}
                    onChange={(e) =>
                      setEditingTrainee({
                        ...editingTrainee,
                        avgProgress: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={editingTrainee.status}
                  onChange={(e) =>
                    setEditingTrainee({
                      ...editingTrainee,
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
                  onClick={() => setEditingTrainee(null)}
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
