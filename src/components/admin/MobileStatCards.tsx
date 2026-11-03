import React from 'react';

export const MobileStatCards: React.FC = () => {
  return (
    <div className="sm:hidden flex flex-col gap-3.5 mb-4">
      {/* 1. Active Trainee Officers */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
        <span className="text-sm text-slate-500 font-normal">Active Trainee Officers</span>
        <div className="text-3xl font-bold text-slate-900 mt-2 mb-1.5 tracking-tight leading-none">
          1,096
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="text-emerald-500">↗ 12.4%</span>
          <span className="text-slate-400 font-normal">vs last training cycle</span>
        </div>
      </div>

      {/* 2. Certified Competency Rate */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
        <span className="text-sm text-slate-500 font-normal">Certified Competency Rate</span>
        <div className="text-3xl font-bold text-slate-900 mt-2 mb-1.5 tracking-tight leading-none">
          84.6%
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="text-emerald-500">↗ 4.2%</span>
          <span className="text-slate-400 font-normal">qualified officers</span>
        </div>
      </div>

      {/* 3. Evaluations Cleared */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
        <span className="text-sm text-slate-500 font-normal">Evaluations Cleared</span>
        <div className="text-3xl font-bold text-slate-900 mt-2 mb-1.5 tracking-tight leading-none">
          348
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="text-emerald-500">↗ 18.5%</span>
          <span className="text-slate-400 font-normal">radar & NWP assessments</span>
        </div>
      </div>

      {/* 4. Operational Readiness */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
        <span className="text-sm text-slate-500 font-normal">Operational Readiness</span>
        <div className="text-3xl font-bold text-slate-900 mt-2 mb-1.5 tracking-tight leading-none">
          98.4%
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="text-emerald-500">↗ 2.1%</span>
          <span className="text-slate-400 font-normal">station compliance</span>
        </div>
      </div>
    </div>
  );
};
