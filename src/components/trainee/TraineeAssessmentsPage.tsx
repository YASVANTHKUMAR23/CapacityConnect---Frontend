import React, { useState } from 'react';
import { useTraineeData } from '../../context/TraineeDataContext';
import { TraineeTab } from '../../types';
import { FileCheck, Clock, CheckCircle } from 'lucide-react';

interface TraineeAssessmentsPageProps {
  onSelectTab: (tab: TraineeTab) => void;
  onStartAssessment: (assessmentId: string) => void;
  showToast: (msg: string) => void;
}

export const TraineeAssessmentsPage: React.FC<TraineeAssessmentsPageProps> = ({
  onSelectTab,
  onStartAssessment,
  showToast,
}) => {
  const { assessments } = useTraineeData();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Upcoming' | 'Live' | 'Completed'>('All');

  const filteredAssessments = assessments.filter((a) => {
    if (activeFilter === 'All') return true;
    return a.status === activeFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2333] tracking-tight">
          Assessments
        </h1>
        <p className="text-xs sm:text-sm text-[#5b6478] mt-1">
          Subject-wise MCQ tests and results
        </p>
      </div>

      {/* Filter Tabs matching 11-assessments */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveFilter('All')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeFilter === 'All'
              ? 'bg-[#1f5eff] text-white shadow-xs'
              : 'bg-white text-[#5b6478] hover:bg-slate-50 border border-[#e6e9f2]'
          }`}
        >
          All {assessments.length}
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('Upcoming')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeFilter === 'Upcoming'
              ? 'bg-[#1f5eff] text-white shadow-xs'
              : 'bg-white text-[#5b6478] hover:bg-slate-50 border border-[#e6e9f2]'
          }`}
        >
          Upcoming
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('Live')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeFilter === 'Live'
              ? 'bg-[#1f5eff] text-white shadow-xs'
              : 'bg-white text-[#5b6478] hover:bg-slate-50 border border-[#e6e9f2]'
          }`}
        >
          Live
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('Completed')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeFilter === 'Completed'
              ? 'bg-[#1f5eff] text-white shadow-xs'
              : 'bg-white text-[#5b6478] hover:bg-slate-50 border border-[#e6e9f2]'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Table Card matching 11-assessments */}
      <div className="p-5 sm:p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-[#5b6478] border-b border-slate-100 font-medium text-xs">
                <th className="pb-3.5 font-medium">Assessment</th>
                <th className="pb-3.5 font-medium">Course</th>
                <th className="pb-3.5 font-medium">Deadline</th>
                <th className="pb-3.5 font-medium">Attempts</th>
                <th className="pb-3.5 font-medium">Status</th>
                <th className="pb-3.5 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssessments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Title */}
                  <td className="py-4 pr-4 font-bold text-[#1c2333]">
                    {a.title}
                  </td>

                  {/* Course */}
                  <td className="py-4 px-4 text-[#5b6478] text-xs">
                    {a.courseTitle}
                  </td>

                  {/* Deadline */}
                  <td className="py-4 px-4 text-[#1c2333] text-xs font-medium">
                    {a.deadline}
                  </td>

                  {/* Attempts */}
                  <td className="py-4 px-4 text-[#5b6478] text-xs">
                    {a.attemptsUsed} of {a.maxAttempts}
                  </td>

                  {/* Status Pill */}
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        a.status === 'Live'
                          ? 'bg-[#e7f7ee] text-[#15803d]'
                          : a.status === 'Upcoming'
                          ? 'bg-[#e8efff] text-[#1d4ed8]'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-4 pl-4 text-right">
                    {a.status === 'Live' ? (
                      <button
                        type="button"
                        onClick={() => onStartAssessment(a.id)}
                        className="font-bold text-[#1f5eff] hover:underline cursor-pointer text-xs"
                      >
                        Start
                      </button>
                    ) : a.status === 'Completed' ? (
                      <button
                        type="button"
                        onClick={() => onSelectTab('assessment-result')}
                        className="font-bold text-[#1f5eff] hover:underline cursor-pointer text-xs"
                      >
                        Result
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          showToast(`${a.title} opens on ${a.deadline}. Instructions will be sent.`)
                        }
                        className="font-bold text-[#1f5eff] hover:underline cursor-pointer text-xs"
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#5b6478]">
          <span>Showing 1-{filteredAssessments.length} of {filteredAssessments.length}</span>
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
