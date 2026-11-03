import React, { useState } from 'react';
import { useTraineeData } from '../../context/TraineeDataContext';
import { TraineeTab } from '../../types';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  MoreHorizontal,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface TraineeMyCoursesPageProps {
  onSelectTab: (tab: TraineeTab) => void;
  showToast: (msg: string) => void;
}

export const TraineeMyCoursesPage: React.FC<TraineeMyCoursesPageProps> = ({
  onSelectTab,
  showToast,
}) => {
  const {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    savedCourseIds,
    toggleSaveCourse,
  } = useTraineeData();

  const [filter, setFilter] = useState<'progress' | 'completed' | 'saved'>('progress');
  const [searchQuery, setSearchQuery] = useState('');

  // Course groupings matching image_ee9f16cc.png
  const inProgressCourses = courses.filter(
    (c) => c.enrolled && (c.progress ?? 0) < 100
  );
  const completedCourses = courses.filter(
    (c) => c.enrolled && (c.progress ?? 0) >= 100
  );
  const savedCourses = courses.filter((c) => savedCourseIds.includes(c.id));

  const currentList =
    filter === 'progress'
      ? inProgressCourses
      : filter === 'completed'
      ? completedCourses
      : savedCourses;

  const filteredCourses = currentList.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.trainer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    onSelectTab('course-player');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Row matching image_ee9f16cc.png */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2333] tracking-tight">
            My Courses
          </h1>
          <p className="text-xs sm:text-sm text-[#5b6478] mt-1">
            Track your enrolled courses, progress and completions.
          </p>
        </div>

        {/* Right Search Input & Quick Controls */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your courses..."
              className="w-full h-10 pl-9 pr-3 bg-white border border-[#e6e9f2] rounded-xl text-xs text-[#1c2333] placeholder:text-[#5b6478] focus:outline-hidden focus:ring-2 focus:ring-[#1f5eff]/30 shadow-2xs transition-all"
            />
          </div>

          <button
            type="button"
            onClick={() => onSelectTab('course-catalog')}
            className="h-10 px-3 bg-white border border-[#e6e9f2] hover:bg-slate-50 text-[#5b6478] rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs shrink-0 cursor-pointer"
            title="Explore Course Catalog"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#1f5eff]" />
            <span className="hidden sm:inline">Browse Catalog</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs matching image_ee9f16cc.png */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter('progress')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            filter === 'progress'
              ? 'bg-[#1f5eff] text-white shadow-xs'
              : 'bg-white text-[#5b6478] hover:bg-slate-50 border border-[#e6e9f2]'
          }`}
        >
          In Progress ({inProgressCourses.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            filter === 'completed'
              ? 'bg-[#1f5eff] text-white shadow-xs'
              : 'bg-white text-[#5b6478] hover:bg-slate-50 border border-[#e6e9f2]'
          }`}
        >
          Completed ({completedCourses.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('saved')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            filter === 'saved'
              ? 'bg-[#1f5eff] text-white shadow-xs'
              : 'bg-white text-[#5b6478] hover:bg-slate-50 border border-[#e6e9f2]'
          }`}
        >
          Saved ({savedCourses.length})
        </button>
      </div>

      {/* 2-Column Status Layout matching image_ee9f16cc.png */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Course Rows (8 cols) */}
        <div className="lg:col-span-8 space-y-3.5">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((c) => {
              const progressVal = c.progress ?? 0;
              return (
                <div
                  key={c.id}
                  className="p-4 sm:p-5 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  {/* Left: Thumbnail & Course Info */}
                  <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-slate-900 relative shadow-inner">
                      <img
                        src={c.imageUrl}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-1 left-1.5 text-white text-[10px] font-bold">
                        {c.code}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#1f5eff] uppercase tracking-wider">
                          {c.subject}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-[11px] text-[#5b6478]">
                          {c.trainer}
                        </span>
                      </div>

                      <h3
                        onClick={() => handleOpenCourse(c.id)}
                        className="text-sm sm:text-base font-bold text-[#1c2333] hover:text-[#1f5eff] transition-colors cursor-pointer truncate mt-0.5"
                      >
                        {c.title}
                      </h3>

                      <p className="text-xs text-[#5b6478] mt-0.5">
                        {c.modulesCount || 6} Modules · 24 Lessons · {c.hours || '24 hrs'}
                      </p>

                      {/* Progress bar row */}
                      <div className="flex items-center gap-3 mt-2.5 max-w-xs">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              progressVal === 100 ? 'bg-emerald-500' : 'bg-[#1f5eff]'
                            }`}
                            style={{ width: `${progressVal}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-[#1c2333] shrink-0">
                          {progressVal}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <button
                      type="button"
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors"
                      title="More options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {filter === 'completed' ? (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTab('certificates');
                          showToast(`Viewing certificate for ${c.title}`);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Certificate</span>
                      </button>
                    ) : filter === 'saved' ? (
                      <button
                        type="button"
                        onClick={() => handleOpenCourse(c.id)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#eef3ff] hover:bg-[#1f5eff] hover:text-white text-[#1f5eff] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        <span>Start course</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenCourse(c.id)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#eef3ff] hover:bg-[#1f5eff] hover:text-white text-[#1f5eff] transition-all cursor-pointer flex items-center gap-1 shadow-2xs group-hover:bg-[#1f5eff] group-hover:text-white"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center bg-white rounded-[14px] border border-[#e6e9f2] text-slate-500">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-sm text-slate-800">No courses in this tab</p>
              <p className="text-xs text-slate-500 mt-1">Explore our approved meteorological curriculum.</p>
              <button
                type="button"
                onClick={() => onSelectTab('course-catalog')}
                className="mt-4 px-4 py-2 bg-[#1f5eff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Browse Course Catalog
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Progress Statistics & Recent Completions (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Overall Progress Ring Card */}
          <div className="p-5 sm:p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs space-y-4">
            <h3 className="font-bold text-[#1c2333] text-sm">Overall progress</h3>

            {/* Circular Ring Gauge (53% as in mockup) */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#e8edf6"
                    strokeWidth="9"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#1f5eff"
                    strokeWidth="9"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - 0.53)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-[#1c2333]">53%</span>
                </div>
              </div>
              <span className="text-xs font-medium text-[#5b6478] mt-2">
                Course completion
              </span>
            </div>

            {/* Stat lines */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between text-[#5b6478]">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                  <span>Total courses</span>
                </span>
                <strong className="text-[#1c2333] font-bold">7</strong>
              </div>

              <div className="flex items-center justify-between text-[#5b6478]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>In progress</span>
                </span>
                <strong className="text-[#1c2333] font-bold">3</strong>
              </div>

              <div className="flex items-center justify-between text-[#5b6478]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Completed</span>
                </span>
                <strong className="text-[#1c2333] font-bold">4</strong>
              </div>

              <div className="flex items-center justify-between text-[#5b6478]">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-purple-500" />
                  <span>Certificates</span>
                </span>
                <strong className="text-[#1c2333] font-bold">4</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Recent Completions Card */}
          <div className="p-5 sm:p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs space-y-3.5">
            <h3 className="font-bold text-[#1c2333] text-sm">Recent completions</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1c2333]">Monsoon Onset Review</h4>
                  <p className="text-[11px] text-[#5b6478] mt-0.5">Completed on 12 Oct 2026</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1c2333]">Satellite Imagery Interpretation</h4>
                  <p className="text-[11px] text-[#5b6478] mt-0.5">Completed on 05 Oct 2026</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setFilter('completed');
              }}
              className="w-full pt-2 flex items-center justify-center gap-1 text-xs font-semibold text-[#1f5eff] hover:underline cursor-pointer"
            >
              <span>View all completed courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
