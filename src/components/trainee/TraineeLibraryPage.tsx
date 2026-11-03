import React, { useState } from 'react';
import {
  FolderGit2,
  FileText,
  PlayCircle,
  Presentation,
  Download,
  CheckCircle2,
  Lock,
  Unlock,
  BookOpen,
  ArrowRight,
  Search,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  ArrowDownToLine,
  Eye,
} from 'lucide-react';
import { useTraineeData } from '../../context/TraineeDataContext';
import { useTrainerData } from '../../context/TrainerDataContext';
import { TraineeTab } from '../../types';
import { LibraryAnnouncementBanner } from '../common/LibraryAnnouncementBanner';

interface TraineeLibraryPageProps {
  onSelectTab: (tab: TraineeTab) => void;
  showToast: (msg: string) => void;
}

export const TraineeLibraryPage: React.FC<TraineeLibraryPageProps> = ({
  onSelectTab,
  showToast,
}) => {
  const { courses, setSelectedCourseId, enrollCourse, updateCourseProgress } = useTraineeData();
  const { materials } = useTrainerData();

  const [filterFormat, setFilterFormat] = useState<'All' | 'PDF' | 'MP4' | 'PPTX'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');
  const [collapsedCourses, setCollapsedCourses] = useState<Record<string, boolean>>({});

  const toggleCourseCollapse = (courseId: string) => {
    setCollapsedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  // Helper: Match material to course
  const isMaterialInCourse = (materialCourse: string, courseTitle: string) => {
    const m = materialCourse.toLowerCase();
    const c = courseTitle.toLowerCase();
    if (m === c || m.includes(c) || c.includes(m)) return true;
    if (m.includes('cyclone') && c.includes('cyclone')) return true;
    if (m.includes('radar') && c.includes('radar')) return true;
    if (m.includes('monsoon') && c.includes('monsoon')) return true;
    if (m.includes('satellite') && c.includes('satellite')) return true;
    if (m.includes('nwp') && (c.includes('numerical') || c.includes('nwp'))) return true;
    return false;
  };

  // Helper: Check if trainee has started learning or finished the course
  const getCourseAccessStatus = (course: (typeof courses)[0]) => {
    const isCompleted = course.status === 'Completed' || (course.progress ?? 0) === 100;
    const isStarted = course.enrolled && ((course.progress ?? 0) > 0 || course.status === 'Enrolled');

    if (isCompleted) {
      return {
        accessible: true,
        statusType: 'completed' as const,
        badgeLabel: 'Course Completed · Full Archive Access',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      };
    }

    if (isStarted) {
      return {
        accessible: true,
        statusType: 'started' as const,
        badgeLabel: `Learning in Progress (${course.progress || 38}%) · Library Unlocked`,
        badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
      };
    }

    return {
      accessible: false,
      statusType: 'locked' as const,
      badgeLabel: 'Locked · Start Learning Course to Access',
      badgeColor: 'bg-slate-100 text-slate-600 border-slate-200',
    };
  };

  const handleStartLearning = (courseId: string, courseTitle: string) => {
    enrollCourse(courseId);
    updateCourseProgress(courseId, 15, 'M1 · Fundamentals');
    setSelectedCourseId(courseId);
    showToast(`Started learning "${courseTitle}". Course Library is now unlocked!`);
    onSelectTab('course-player');
  };

  const handleOpenCoursePlayer = (courseId: string) => {
    setSelectedCourseId(courseId);
    onSelectTab('course-player');
  };

  // Visible courses
  const visibleCourses = courses.filter((c) => {
    if (selectedCourseFilter !== 'All' && c.id !== selectedCourseFilter) return false;
    return true;
  });

  // Calculate totals
  const unlockedCoursesCount = courses.filter((c) => getCourseAccessStatus(c).accessible).length;
  const accessibleMaterialsCount = materials.filter((m) =>
    courses.some((c) => getCourseAccessStatus(c).accessible && isMaterialInCourse(m.courseAttached, c.title))
  ).length;

  return (
    <div
      className="w-full max-w-full min-w-0 space-y-5 font-sans antialiased text-slate-900"
      style={{ fontFamily: 'Plus Jakarta Sans' }}
    >
      {/* 1. LARGE WIDTH ANNOUNCEMENT CARD (Matching image_99434a4f.png) */}
      <LibraryAnnouncementBanner showToast={showToast} targetRole="trainee" />

      {/* 2. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Course Library & Reference Materials
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Official operational manuals, Doppler case studies and presentations unlocked as you progress through each course.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onSelectTab('course-catalog')}
          className="px-5 py-[9px] bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <BookOpen className="w-4 h-4" />
          <span>Browse Course Catalog</span>
        </button>
      </div>

      {/* 3. THREE STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-medium text-slate-500">Unlocked Courses</span>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
              {unlockedCoursesCount} / {courses.length}
            </div>
            <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">
              Active learning & completed tracks
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Unlock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-medium text-slate-500">Accessible Files</span>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
              {accessibleMaterialsCount + 18} files
            </div>
            <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">
              SOP manuals, presentations, and video lectures
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-medium text-slate-500">Reference Downloads</span>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
              34 downloaded
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Available offline for shift duty
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <ArrowDownToLine className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4. FILTER TABS & SEARCH */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 text-[12px]">
          {[
            { id: 'All', label: 'All Resources' },
            { id: 'PDF', label: 'PDF Manuals & SOPs' },
            { id: 'MP4', label: 'Recorded Lectures (MP4)' },
            { id: 'PPTX', label: 'Slide Decks (PPTX)' },
          ].map((tab) => {
            const isActive = filterFormat === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterFormat(tab.id as any)}
                className={`px-5 py-[9px] rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 text-[12px] ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search unlocked library files by title, technique, or keyword..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 transition-colors"
            />
          </div>

          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-blue-600 cursor-pointer"
          >
            <option value="All">All Courses ({courses.length})</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5. COURSE-BY-COURSE LIBRARY CARDS */}
      <div className="space-y-6">
        {visibleCourses.map((course) => {
          const access = getCourseAccessStatus(course);

          // Get materials for this course
          const courseMaterials = materials.filter((m) => {
            if (!isMaterialInCourse(m.courseAttached, course.title)) return false;
            if (filterFormat !== 'All' && m.format !== filterFormat) return false;
            if (searchQuery.trim()) {
              const q = searchQuery.toLowerCase();
              return (
                m.title.toLowerCase().includes(q) ||
                m.tags.some((t) => t.toLowerCase().includes(q))
              );
            }
            return true;
          });

          const isCollapsed = collapsedCourses[course.id] || false;

          return (
            <div
              key={course.id}
              className={`rounded-2xl border shadow-2xs overflow-hidden transition-all ${
                access.accessible
                  ? 'bg-white border-slate-200/90 hover:border-slate-300'
                  : 'bg-slate-50/70 border-slate-200/70 opacity-95'
              }`}
            >
              {/* Course Header Bar */}
              <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs ${
                      access.accessible ? 'bg-blue-600' : 'bg-slate-400'
                    }`}
                  >
                    {access.accessible ? (
                      course.code || 'MET'
                    ) : (
                      <Lock className="w-5 h-5 text-white" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                        {course.subject || 'Meteorology'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${access.badgeColor}`}
                      >
                        {access.badgeLabel}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                      {course.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Trainer: <strong className="text-slate-700">{course.trainer}</strong> ·{' '}
                      {course.institution}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                  {access.accessible ? (
                    <button
                      type="button"
                      onClick={() => handleOpenCoursePlayer(course.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <span>Continue learning</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartLearning(course.id, course.title)}
                      className="px-4 py-2 bg-[#181c24] hover:bg-[#252b38] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Unlock className="w-3.5 h-3.5 text-blue-400" />
                      <span>Start learning course</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleCourseCollapse(course.id)}
                    className="p-2 bg-white border border-slate-200/90 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                    title={isCollapsed ? 'Expand library' : 'Collapse library'}
                  >
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Course Materials Content Area */}
              {!isCollapsed && (
                <div className="p-5 sm:p-6">
                  {/* Condition 1: LOCKED STATE (Trainee has not started course) */}
                  {!access.accessible ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-300 rounded-xl bg-white space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Course Library Files Locked
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                          As per IMD training guidelines, official reference guides, Doppler datasets,
                          and lecture slides are unlocked as soon as you start learning the course curriculum.
                        </p>
                      </div>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handleStartLearning(course.id, course.title)}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Start Learning Course to Unlock {courseMaterials.length || 3} Files</span>
                        </button>
                      </div>
                    </div>
                  ) : courseMaterials.length === 0 ? (
                    /* Condition 2: UNLOCKED BUT NO MATCHING MATERIALS */
                    <div className="p-6 text-center border border-slate-200 rounded-xl bg-slate-50/50">
                      <FileText className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-slate-700">
                        All curriculum handouts are integrated into the lesson player.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleOpenCoursePlayer(course.id)}
                        className="mt-2 text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Open lesson player</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    /* Condition 3: UNLOCKED AND ACTIVE FILES */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                      {courseMaterials.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 flex flex-col justify-between hover:border-blue-400 transition-all hover:shadow-xs group"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                                  {item.format === 'MP4' && <PlayCircle className="w-5 h-5" />}
                                  {item.format === 'PDF' && <FileText className="w-5 h-5" />}
                                  {item.format === 'PPTX' && <Presentation className="w-5 h-5" />}
                                </div>
                                <div>
                                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                    {item.format} · {item.size}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block mt-0.5">
                                    {item.version}
                                  </span>
                                </div>
                              </div>

                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
                                Unlocked
                              </span>
                            </div>

                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 mt-3 group-hover:text-blue-600 transition-colors leading-snug">
                              {item.title}
                            </h3>

                            <div className="flex flex-wrap gap-1 mt-3">
                              {item.tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[10px] px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-md font-medium"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span className="text-[11px] text-slate-400">
                              {item.category}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  showToast(`Downloading "${item.title}" for offline study.`)
                                }
                                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
