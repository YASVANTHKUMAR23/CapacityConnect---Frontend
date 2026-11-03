import React from 'react';
import { TraineeTab } from '../../types';
import { CheckCircle2, XCircle, ArrowLeft, TrendingUp } from 'lucide-react';

interface TraineeAssessmentResultPageProps {
  onSelectTab: (tab: TraineeTab) => void;
  showToast: (msg: string) => void;
}

export const TraineeAssessmentResultPage: React.FC<TraineeAssessmentResultPageProps> = ({
  onSelectTab,
  showToast,
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Back button matching 13-assessment-result */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2333] tracking-tight">
            Monsoon review test
          </h1>
          <p className="text-xs sm:text-sm text-[#5b6478] mt-0.5">
            Result · submitted 10 Sep
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectTab('assessments')}
          className="h-10 px-4 rounded-xl bg-white border border-[#e6e9f2] text-xs font-semibold text-[#1c2333] hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
        >
          Back to assessments
        </button>
      </div>

      {/* 4 KPI Cards matching 13-assessment-result */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Score */}
        <div className="p-5 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs">
          <span className="text-xs font-medium text-[#5b6478] block">Score</span>
          <span className="text-2xl sm:text-3xl font-bold text-[#1c2333] mt-1 block">
            72%
          </span>
          <span className="text-xs text-[#5b6478] mt-1 block">18 of 25 correct</span>
        </div>

        {/* Result */}
        <div className="p-5 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs">
          <span className="text-xs font-medium text-[#5b6478] block">Result</span>
          <span className="text-2xl sm:text-3xl font-bold text-[#1c2333] mt-1 block">
            Pass
          </span>
          <span className="text-xs font-semibold text-[#15803d] mt-1 block">
            pass mark 50%
          </span>
        </div>

        {/* Time taken */}
        <div className="p-5 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs">
          <span className="text-xs font-medium text-[#5b6478] block">Time taken</span>
          <span className="text-2xl sm:text-3xl font-bold text-[#1c2333] mt-1 block">
            31 min
          </span>
          <span className="text-xs text-[#5b6478] mt-1 block">of 40 min</span>
        </div>

        {/* Class average */}
        <div className="p-5 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs">
          <span className="text-xs font-medium text-[#5b6478] block">Class average</span>
          <span className="text-2xl sm:text-3xl font-bold text-[#1c2333] mt-1 block">
            66%
          </span>
          <span className="text-xs font-semibold text-[#15803d] mt-1 block">
            ↗ 6% above average
          </span>
        </div>
      </div>

      {/* Two Column Layout: Answer Review & Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Answer Review (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#1c2333]">Answer review</h3>
            <p className="text-xs text-[#5b6478] mt-0.5">Incorrect answers first</p>
          </div>

          <div className="divide-y divide-slate-100 text-xs sm:text-sm">
            {/* Q3 */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-[#1c2333]">
                  Q3 · Centre of a mature cyclone
                </p>
                <p className="text-xs text-[#5b6478] mt-0.5">
                  Your answer: <span className="font-medium text-slate-800">Eye</span>
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e7f7ee] text-[#15803d] shrink-0">
                Correct
              </span>
            </div>

            {/* Q6 */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-[#1c2333]">
                  Q6 · Steering factor
                </p>
                <p className="text-xs text-[#5b6478] mt-0.5">
                  Your answer: <span className="font-medium text-slate-800">Mid-level flow</span>
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e7f7ee] text-[#15803d] shrink-0">
                Correct
              </span>
            </div>

            {/* Q9 */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-[#1c2333]">
                  Q9 · Dvorak T-number 4.5
                </p>
                <p className="text-xs text-[#5b6478] mt-0.5">
                  Your answer: <span className="font-medium text-slate-800">Wrong band</span>
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#fde8ea] text-[#b91c1c] shrink-0">
                Wrong
              </span>
            </div>

            {/* Q14 */}
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-[#1c2333]">
                  Q14 · Radar QC artefacts
                </p>
                <p className="text-xs text-[#5b6478] mt-0.5">
                  Your answer: <span className="font-medium text-slate-800">Ground clutter</span>
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#fde8ea] text-[#b91c1c] shrink-0">
                Wrong
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Weak Topics matching 13-assessment-result */}
        <div>
          <div className="p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#1c2333]">Weak topics</h3>
              <p className="text-xs text-[#5b6478] mt-0.5">Where you lost marks</p>
            </div>

            <div className="space-y-3 pt-1">
              {/* Dvorak intensity */}
              <div className="p-3.5 rounded-xl border border-[#e6e9f2] flex items-center justify-between">
                <span className="text-xs font-bold text-[#1c2333]">
                  Dvorak intensity
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff1e0] text-[#b45309]">
                  3 wrong
                </span>
              </div>

              {/* Radar QC artefacts */}
              <div className="p-3.5 rounded-xl border border-[#e6e9f2] flex items-center justify-between">
                <span className="text-xs font-bold text-[#1c2333]">
                  Radar QC artefacts
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff1e0] text-[#b45309]">
                  2 wrong
                </span>
              </div>

              {/* Track extrapolation */}
              <div className="p-3.5 rounded-xl border border-[#e6e9f2] flex items-center justify-between">
                <span className="text-xs font-bold text-[#1c2333]">
                  Track extrapolation
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#fff1e0] text-[#b45309]">
                  2 wrong
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onSelectTab('my-competency');
                  showToast('Reviewing updated competency map');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-colors text-center cursor-pointer"
              >
                View competency impact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
