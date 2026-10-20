import React from 'react';

export const MobileStatCards: React.FC = () => {
  return (
    <div className="sm:hidden flex flex-col gap-3.5 mb-4">
      {/* 1. User Signups */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
        <span className="text-sm text-slate-500 font-normal">User Signups</span>
        <div className="text-3xl font-bold text-slate-900 mt-2 mb-1.5 tracking-tight leading-none">
          450
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="text-emerald-500">↗ 10.00%</span>
          <span className="text-slate-400 font-normal">vs last 30 days</span>
        </div>
      </div>

      {/* 2. Churn Rate */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
        <span className="text-sm text-slate-500 font-normal">Churn Rate</span>
        <div className="text-3xl font-bold text-slate-900 mt-2 mb-1.5 tracking-tight leading-none">
          2.3%
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="text-rose-500">↘ 10.00%</span>
          <span className="text-slate-400 font-normal">vs last 30 days</span>
        </div>
      </div>

      {/* 3. Customer Support Tickets */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
        <span className="text-sm text-slate-500 font-normal">Customer Support Tickets</span>
        <div className="text-3xl font-bold text-slate-900 mt-2 mb-1.5 tracking-tight leading-none">
          120
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="text-emerald-500">↗ 10.00%</span>
          <span className="text-slate-400 font-normal">vs last 30 days</span>
        </div>
      </div>

      {/* 4. Active Subscriptions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs">
        <span className="text-sm text-slate-500 font-normal">Active Subscriptions</span>
        <div className="text-3xl font-bold text-slate-900 mt-2 mb-1.5 tracking-tight leading-none">
          1,250
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="text-emerald-500">↗ 10.00%</span>
          <span className="text-slate-400 font-normal">vs last 30 days</span>
        </div>
      </div>
    </div>
  );
};
