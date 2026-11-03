import React from 'react';
import { useTraineeData } from '../../context/TraineeDataContext';
import { TraineeTab } from '../../types';
import { Target, TrendingUp, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface TraineeCompetencyPageProps {
  onSelectTab: (tab: TraineeTab) => void;
  showToast: (msg: string) => void;
}

export const TraineeCompetencyPage: React.FC<TraineeCompetencyPageProps> = ({
  onSelectTab,
  showToast,
}) => {
  const { competencies } = useTraineeData();

  const subjects = [
    { name: 'Forecasting', score: 72, target: 70 },
    { name: 'Radar analysis', score: 58, target: 70 },
    { name: 'Climate data', score: 66, target: 70 },
    { name: 'Cyclone tracking', score: 49, target: 70 },
    { name: 'Instrumentation', score: 81, target: 70 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2333] tracking-tight">
          My competency
        </h1>
        <p className="text-xs sm:text-sm text-[#5b6478] mt-1">
          Skill levels, gaps and recommended learning
        </p>
      </div>

      {/* 4 KPI Cards matching 14-my-competency */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall level */}
        <div className="p-5 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs">
          <span className="text-xs font-medium text-[#5b6478] block">Overall level</span>
          <span className="text-2xl sm:text-3xl font-bold text-[#1c2333] mt-1 block">
            66%
          </span>
          <span className="text-xs font-semibold text-[#15803d] mt-1 block">
            ↗ 5.2% vs last 30 days
          </span>
        </div>

        {/* Skill gaps */}
        <div className="p-5 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs">
          <span className="text-xs font-medium text-[#5b6478] block">Skill gaps</span>
          <span className="text-2xl sm:text-3xl font-bold text-[#1c2333] mt-1 block">
            2
          </span>
          <span className="text-xs font-semibold text-[#b91c1c] mt-1 block">
            Cyclone tracking, Radar
          </span>
        </div>

        {/* Meets target */}
        <div className="p-5 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs">
          <span className="text-xs font-medium text-[#5b6478] block">Meets target</span>
          <span className="text-2xl sm:text-3xl font-bold text-[#1c2333] mt-1 block">
            3
          </span>
          <span className="text-xs text-[#5b6478] mt-1 block">of 5 subjects</span>
        </div>

        {/* Pre-assessment */}
        <div className="p-5 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs">
          <span className="text-xs font-medium text-[#5b6478] block">Pre-assessment</span>
          <span className="text-2xl sm:text-3xl font-bold text-[#1c2333] mt-1 block">
            66%
          </span>
          <span className="text-xs text-[#5b6478] mt-1 block">taken 12 Sep</span>
        </div>
      </div>

      {/* Two Column Layout: Level by subject & AI recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Level by subject (2 cols) */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-[#1c2333]">Level by subject</h3>
            <p className="text-xs text-[#5b6478] mt-0.5">
              Current level against target
            </p>
          </div>

          <div className="space-y-5 pt-2">
            {subjects.map((s) => (
              <div key={s.name} className="flex items-center justify-between gap-4">
                <span className="w-32 sm:w-36 text-xs sm:text-sm font-semibold text-[#1c2333] truncate">
                  {s.name}
                </span>

                {/* Progress bar with vertical target marker line at 70% */}
                <div className="flex-1 relative h-2.5 bg-slate-100 rounded-full">
                  <div
                    className="h-2.5 bg-[#1f5eff] rounded-full transition-all duration-300"
                    style={{ width: `${s.score}%` }}
                  />
                  {/* Vertical target line at 70% */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
                    style={{ left: `${s.target}%` }}
                    title={`Target: ${s.target}%`}
                  />
                </div>

                <span className="w-10 text-right text-xs sm:text-sm font-bold text-[#1c2333]">
                  {s.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: AI recommendations matching 14-my-competency */}
        <div>
          <div className="p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#1c2333]">
                AI recommendations
              </h3>
              <p className="text-xs text-[#5b6478] mt-0.5">Closes your biggest gaps</p>
            </div>

            <div className="space-y-3 pt-1">
              {/* Cyclone Track Analysis */}
              <div
                onClick={() => onSelectTab('course-player')}
                className="p-3.5 rounded-xl border border-[#e6e9f2] hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1c2333] group-hover:text-blue-600 transition-colors">
                    Cyclone Track Analysis
                  </h4>
                  <p className="text-[11px] text-[#5b6478]">Cyclone tracking</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fde8ea] text-[#b91c1c]">
                  Major
                </span>
              </div>

              {/* Radar Data Quality */}
              <div
                onClick={() => onSelectTab('course-player')}
                className="p-3.5 rounded-xl border border-[#e6e9f2] hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1c2333] group-hover:text-blue-600 transition-colors">
                    Radar Data Quality
                  </h4>
                  <p className="text-[11px] text-[#5b6478]">Radar analysis</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff1e0] text-[#b45309]">
                  Minor
                </span>
              </div>

              {/* Numerical Weather Models */}
              <div
                onClick={() => onSelectTab('course-catalog')}
                className="p-3.5 rounded-xl border border-[#e6e9f2] hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1c2333] group-hover:text-blue-600 transition-colors">
                    Numerical Weather Models
                  </h4>
                  <p className="text-[11px] text-[#5b6478]">Forecasting</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff1e0] text-[#b45309]">
                  Minor
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => onSelectTab('mentors')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-[#1c2333] transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Find mentors for skill gaps</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
