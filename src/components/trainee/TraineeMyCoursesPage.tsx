import React, { useState } from 'react';
import { useTraineeData } from '../../context/TraineeDataContext';
import { TraineeTab } from '../../types';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';

interface TraineeMyCoursesPageProps {
  onSelectTab: (tab: TraineeTab) => void;
  showToast: (msg: string) => void;
}

export const TraineeMyCoursesPage: React.FC<TraineeMyCoursesPageProps> = ({
  onSelectTab,
  showToast,
}) => {
  const { courses } = useTraineeData();
  const [activeTab, setActiveTab] = useState<'in-progress' | 'completed'>('in-progress');

  const inProgressCourses = courses.filter((c) => c.enrolled && (c.progress ?? 0) < 100);
  const completedCourses = courses.filter((c) => c.enrolled && (c.progress ?? 0) >= 100);

  const displayedCourses = activeTab === 'in-progress' ? inProgressCourses : completedCourses;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2333] tracking-tight">
          My courses
        </h1>
        <p className="text-xs sm:text-sm text-[#5b6478] mt-1">
          Your enrolled courses and progress
        </p>
      </div>

      {/* Tabs matching 08-my-courses */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('in-progress')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'in-progress'
              ? 'bg-[#1f5eff] text-white shadow-xs'
              : 'bg-white text-[#5b6478] hover:bg-slate-50 border border-[#e6e9f2]'
          }`}
        >
          In progress {inProgressCourses.length}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-[#1f5eff] text-white shadow-xs'
              : 'bg-white text-[#5b6478] hover:bg-slate-50 border border-[#e6e9f2]'
          }`}
        >
          Completed {completedCourses.length}
        </button>
      </div>

      {/* Courses Table Card */}
      <div className="p-5 sm:p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-[#5b6478] border-b border-slate-100 font-medium text-xs">
                <th className="pb-3.5 font-medium">Course</th>
                <th className="pb-3.5 font-medium">Trainer</th>
                <th className="pb-3.5 font-medium">Progress</th>
                <th className="pb-3.5 font-medium">Deadline</th>
                <th className="pb-3.5 font-medium">Status</th>
                <th className="pb-3.5 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedCourses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Course name with avatar initials */}
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-200">
                        {c.code}
                      </div>
                      <div>
                        <span className="font-bold text-[#1c2333] block">
                          {c.title}
                        </span>
                        <span className="text-xs text-[#5b6478]">{c.subject}</span>
                      </div>
                    </div>
                  </td>

                  {/* Trainer */}
                  <td className="py-4 px-4 text-[#1c2333] font-medium text-xs">
                    {c.trainer}
                  </td>

                  {/* Progress bar */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5 w-32 sm:w-36">
                      <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#1f5eff] h-2 rounded-full"
                          style={{ width: `${c.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#5b6478] font-semibold w-8">
                        {c.progress}%
                      </span>
                    </div>
                  </td>

                  {/* Deadline */}
                  <td className="py-4 px-4 text-[#1c2333] text-xs font-medium">
                    {c.deadline || 'Flexible'}
                  </td>

                  {/* Status pill */}
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        c.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-[#e8efff] text-[#1d4ed8]'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-4 pl-4 text-right">
                    {c.status === 'Completed' ? (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('course-feedback');
                          showToast('Opening feedback form for ' + c.title);
                        }}
                        className="font-bold text-[#1f5eff] hover:underline cursor-pointer text-xs"
                      >
                        Feedback
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('course-player');
                          showToast('Resuming ' + c.title);
                        }}
                        className="font-bold text-[#1f5eff] hover:underline cursor-pointer text-xs"
                      >
                        Resume
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table pagination footer matching image */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#5b6478]">
          <span>Showing 1-{displayedCourses.length} of {displayedCourses.length}</span>
          <div className="flex items-center gap-2 font-medium">
            <span className="text-slate-400 cursor-not-allowed">Previous</span>
            <span>·</span>
            <span className="text-slate-400 cursor-not-allowed">Next</span>
          </div>
        </div>
      </div>
    </div>
  );
};
