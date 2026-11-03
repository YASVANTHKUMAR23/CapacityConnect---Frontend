import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Users,
  Star,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  PlayCircle,
  FileText,
  Presentation,
  HelpCircle,
  Upload,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useTrainerData } from '../../context/TrainerDataContext';
import { TrainerCourse, TrainerCourseModule } from '../../types';

interface TrainerCoursesPageProps {
  showToast: (msg: string) => void;
}

export const TrainerCoursesPage: React.FC<TrainerCoursesPageProps> = ({ showToast }) => {
  const {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    addCourse,
    updateCourse,
    addModuleToCourse,
    trainees,
  } = useTrainerData();

  // View state: 'list' | 'detail' | 'create'
  const [viewState, setViewState] = useState<'list' | 'detail' | 'create'>('list');
  const [filterTab, setFilterTab] = useState<'All' | 'Active' | 'Draft' | 'Inactive'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Add module modal state (t17-add-module-popup)
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDesc, setModuleDesc] = useState('');
  const [moduleDuration, setModuleDuration] = useState('8 hrs');
  const [lessonsDraft, setLessonsDraft] = useState<
    { id: string; title: string; type: 'video' | 'document' | 'presentation' | 'quiz'; duration: string }[]
  >([
    { id: 'l-1', title: 'Operational Guidelines & Case Study', type: 'video', duration: '45 mins' },
  ]);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonType, setNewLessonType] = useState<'video' | 'document' | 'presentation' | 'quiz'>('video');
  const [newLessonDuration, setNewLessonDuration] = useState('30 mins');
  const [requirePrerequisite, setRequirePrerequisite] = useState(true);

  // Create course form state (t05-create-course)
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Tropical Meteorology');
  const [newCourseLevel, setNewCourseLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [newCourseDuration, setNewCourseDuration] = useState('4 Weeks (28 hrs)');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseStatus, setNewCourseStatus] = useState<'Active' | 'Draft'>('Draft');

  // Filtered courses
  const filteredCourses = courses.filter((c) => {
    if (filterTab !== 'All' && c.status !== filterTab) return false;
    if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const handleOpenDetail = (courseId: string) => {
    setSelectedCourseId(courseId);
    setViewState('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    addCourse({
      title: newCourseTitle,
      code: newCourseCode || `MET-${Math.floor(100 + Math.random() * 900)}`,
      category: newCourseCategory,
      enrolled: 0,
      completed: 0,
      rating: 5.0,
      status: newCourseStatus,
      lastUpdated: 'Just now',
      description: newCourseDesc || 'Comprehensive operational curriculum designed for IMD forecasters.',
      level: newCourseLevel,
      duration: newCourseDuration,
      modulesCount: 1,
      modules: [
        {
          id: `mod-${Date.now()}`,
          title: 'Module 1: Orientation & Diagnostic Foundations',
          description: 'Baseline synoptic definitions and observational instrument overview.',
          duration: '6 hrs',
          status: 'Published',
          lessons: [
            { id: 'les-init-1', title: '1.1 Curriculum Blueprint & SOP Walkthrough', type: 'video', duration: '40 mins' },
          ],
        },
      ],
    });

    showToast(`Course "${newCourseTitle}" created successfully.`);
    setViewState('list');
  };

  const handleAddLessonToDraft = () => {
    if (!newLessonTitle.trim()) return;
    setLessonsDraft((prev) => [
      ...prev,
      {
        id: `l-${Date.now()}`,
        title: newLessonTitle,
        type: newLessonType,
        duration: newLessonDuration,
      },
    ]);
    setNewLessonTitle('');
  };

  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim()) return;

    if (selectedCourse) {
      addModuleToCourse(selectedCourse.id, {
        title: moduleTitle,
        description: moduleDesc,
        duration: moduleDuration,
        status: 'Published',
        lessons: lessonsDraft,
      });
      showToast(`Module "${moduleTitle}" added to ${selectedCourse.title}.`);
    }

    setIsAddModuleOpen(false);
    setModuleTitle('');
    setModuleDesc('');
    setLessonsDraft([{ id: 'l-1', title: 'Operational Guidelines & Case Study', type: 'video', duration: '45 mins' }]);
  };

  return (
    <div className="space-y-6">
      {/* VIEW: COURSE LIST (t03-my-courses) */}
      {viewState === 'list' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                My Courses
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Manage your teaching curriculums, modules, and enrolled trainee batches.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setViewState('create')}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create course</span>
            </button>
          </div>

          {/* Filter Tabs + Search & Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 text-xs">
              {(['All', 'Active', 'Draft', 'Inactive'] as const).map((tab) => {
                const count =
                  tab === 'All'
                    ? courses.length
                    : courses.filter((c) => c.status === tab).length;
                const isActive = filterTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setFilterTab(tab)}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>{tab}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded ${
                        isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search and Category Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by course title, code (e.g. MET-402)..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-blue-600 cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Tropical Meteorology">Tropical Meteorology</option>
                  <option value="Observational Meteorology">Observational Meteorology</option>
                  <option value="Synoptic Meteorology">Synoptic Meteorology</option>
                  <option value="Remote Sensing">Remote Sensing</option>
                </select>
              </div>
            </div>
          </div>

          {/* Courses Grid / Cards (Responsive for mobile & tablet) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 flex flex-col justify-between hover:border-slate-300 transition-all hover:shadow-xs group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {course.code}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            course.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : course.status === 'Draft'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {course.status}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Course stats strip */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 block">Enrolled</span>
                      <span className="font-bold text-slate-900 tabular-nums">{course.enrolled}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 block">Completion</span>
                      <span className="font-bold text-slate-900 tabular-nums">{course.completionRate}%</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 block">Rating</span>
                      <span className="font-bold text-slate-900 flex items-center justify-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {course.rating || '—'}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span>Curriculum completion</span>
                      <span className="font-semibold text-slate-800">{course.completionRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${course.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer action buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">
                    {course.modulesCount} modules · {course.duration}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(course.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Manage curriculum</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: COURSE DETAIL & MODULES (t04-course-detail) */}
      {viewState === 'detail' && selectedCourse && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Breadcrumb / Back */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewState('list')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to My Courses</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddModuleOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add module</span>
              </button>
            </div>
          </div>

          {/* Course Banner Header */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {selectedCourse.code}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {selectedCourse.status}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    · {selectedCourse.category}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 tracking-tight">
                  {selectedCourse.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>

              {/* Quick stats badge */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center shrink-0 min-w-[130px]">
                <span className="text-[11px] text-slate-500 block">Enrolled Trainees</span>
                <span className="text-xl font-bold text-slate-900 tabular-nums">
                  {selectedCourse.enrolled}
                </span>
                <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">
                  {selectedCourse.completed} certified
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-500">
              <span>Duration: <strong className="text-slate-800">{selectedCourse.duration}</strong></span>
              <span>Level: <strong className="text-slate-800">{selectedCourse.level}</strong></span>
              <span>Last updated: <strong className="text-slate-800">{selectedCourse.lastUpdated}</strong></span>
              <span>Rating: <strong className="text-slate-800">{selectedCourse.rating} / 5.0</strong></span>
            </div>
          </div>

          {/* Curriculum Split: Modules (Left) & Completion Donut / Enrolled Trainees (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Modules list */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Course Curriculum & Modules</h2>
                  <p className="text-xs text-slate-500">Structured lessons, readings, and knowledge checks</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModuleOpen(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add new module</span>
                </button>
              </div>

              {selectedCourse.modules.map((mod, idx) => (
                <div
                  key={mod.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden"
                >
                  <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-100 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{mod.title}</h3>
                        {mod.description && (
                          <p className="text-xs text-slate-500 mt-0.5">{mod.description}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 shrink-0 tabular-nums">{mod.duration}</span>
                  </div>

                  {/* Lessons in module */}
                  <div className="p-3 sm:p-4 divide-y divide-slate-100">
                    {mod.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-lg transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          {lesson.type === 'video' && <PlayCircle className="w-4 h-4 text-blue-600 shrink-0" />}
                          {lesson.type === 'document' && <FileText className="w-4 h-4 text-emerald-600 shrink-0" />}
                          {lesson.type === 'presentation' && <Presentation className="w-4 h-4 text-purple-600 shrink-0" />}
                          {lesson.type === 'quiz' && <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />}
                          <span className="font-medium text-slate-800">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 text-slate-500">
                          {lesson.completedCount && (
                            <span className="text-[11px] text-slate-400 hidden sm:inline tabular-nums">
                              {lesson.completedCount} completed
                            </span>
                          )}
                          <span className="tabular-nums font-mono text-[11px]">{lesson.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right 1 Col: Donut Completion & Enrolled Trainees */}
            <div className="space-y-6">
              {/* Donut Card (matching t04) */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Trainee Progress Breakdown</h3>

                {/* Donut Chart representation */}
                <div className="flex items-center justify-center py-2">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke="#f1f5f9"
                        strokeWidth="3.5"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke="#10b981"
                        strokeWidth="3.5"
                        strokeDasharray="38, 100"
                        strokeDashoffset="0"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke="#3b82f6"
                        strokeWidth="3.5"
                        strokeDasharray="46, 100"
                        strokeDashoffset="-38"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke="#cbd5e1"
                        strokeWidth="3.5"
                        strokeDasharray="16, 100"
                        strokeDashoffset="-84"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-2xl font-bold text-slate-900 tabular-nums">38%</span>
                      <span className="text-[10px] text-slate-500 block">Completed</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                      Completed (82)
                    </span>
                    <span className="font-bold text-slate-900 tabular-nums">38%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-xs bg-blue-500" />
                      In Progress (98)
                    </span>
                    <span className="font-bold text-slate-900 tabular-nums">46%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-xs bg-slate-300" />
                      Not Started (34)
                    </span>
                    <span className="font-bold text-slate-900 tabular-nums">16%</span>
                  </div>
                </div>
              </div>

              {/* Enrolled Trainees List - naturally expanded on desktop without inner scrollbar */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">Enrolled Trainees</h3>
                  <span className="text-xs text-slate-500 tabular-nums">{trainees.length} forecasters</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {trainees.map((t) => (
                    <div key={t.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg ${t.avatarBg} flex items-center justify-center font-bold text-[10px]`}
                        >
                          {t.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{t.name}</p>
                          <p className="text-[10px] text-slate-500">{t.division.split(',')[1] || t.division}</p>
                        </div>
                      </div>
                      <span className="font-mono text-slate-700 tabular-nums">{t.courseProgress}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: CREATE COURSE (t05-create-course) */}
      {viewState === 'create' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewState('list')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cancel & Back</span>
            </button>
            <span className="text-xs text-slate-400 font-medium">New Course Builder</span>
          </div>

          <form onSubmit={handleCreateCourseSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Main details form */}
            <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">Course Information</h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="e.g. Advanced Doppler Weather Radar Nowcasting"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course Code</label>
                  <input
                    type="text"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    placeholder="e.g. MET-420"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-600 cursor-pointer"
                  >
                    <option value="Tropical Meteorology">Tropical Meteorology</option>
                    <option value="Observational Meteorology">Observational Meteorology</option>
                    <option value="Synoptic Meteorology">Synoptic Meteorology</option>
                    <option value="Remote Sensing">Remote Sensing</option>
                    <option value="Computational Met">Computational Met</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Proficiency Level</label>
                  <select
                    value={newCourseLevel}
                    onChange={(e) => setNewCourseLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-600 cursor-pointer"
                  >
                    <option value="Beginner">Beginner (Level 1)</option>
                    <option value="Intermediate">Intermediate (Level 2)</option>
                    <option value="Advanced">Advanced (Level 3)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    value={newCourseDuration}
                    onChange={(e) => setNewCourseDuration(e.target.value)}
                    placeholder="e.g. 5 Weeks (30 hrs)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description & Objectives</label>
                <textarea
                  rows={4}
                  value={newCourseDesc}
                  onChange={(e) => setNewCourseDesc(e.target.value)}
                  placeholder="Outline syllabus, target forecaster cadres, and expected operational competencies..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-600 resize-none"
                />
              </div>
            </div>

            {/* Right 1 Col: Publishing & Cover Upload */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Publishing Settings</h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewCourseStatus('Draft')}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border cursor-pointer ${
                        newCourseStatus === 'Draft'
                          ? 'bg-amber-50 border-amber-300 text-amber-800'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Save Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCourseStatus('Active')}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border cursor-pointer ${
                        newCourseStatus === 'Active'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Publish Active
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Artwork</label>
                  <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <span className="text-xs font-medium text-slate-700 block mt-2">
                      Upload course banner
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">PNG, JPG up to 5MB</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Complete & Save Course
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ADD MODULE POPUP MODAL (t17-add-module-popup) */}
      {isAddModuleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[calc(100vw-2rem)] sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add New Module</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Append curriculum unit to <strong className="text-slate-800">{selectedCourse?.title}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModuleOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Module Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  placeholder="e.g. Module 5: Storm Surge Modeling & Coastal Inundation"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={moduleDesc}
                  onChange={(e) => setModuleDesc(e.target.value)}
                  placeholder="Objectives and operational focus..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={moduleDuration}
                  onChange={(e) => setModuleDuration(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              {/* Lessons draft builder */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">Lessons in this module</span>
                  <span className="text-[11px] text-slate-400">{lessonsDraft.length} lessons</span>
                </div>

                <div className="space-y-1.5 mb-3 max-h-32 overflow-y-auto">
                  {lessonsDraft.map((ls, i) => (
                    <div
                      key={ls.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs"
                    >
                      <span className="truncate max-w-[220px] font-medium text-slate-800">
                        {i + 1}. {ls.title} ({ls.type})
                      </span>
                      <span className="text-[10px] text-slate-400 tabular-nums">{ls.duration}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Add lesson row */}
                <div className="space-y-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <input
                    type="text"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    placeholder="New lesson title..."
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden"
                  />
                  <div className="flex items-center gap-2">
                    <select
                      value={newLessonType}
                      onChange={(e) => setNewLessonType(e.target.value as any)}
                      className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-lg cursor-pointer"
                    >
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                      <option value="presentation">Presentation</option>
                      <option value="quiz">Quiz</option>
                    </select>
                    <input
                      type="text"
                      value={newLessonDuration}
                      onChange={(e) => setNewLessonDuration(e.target.value)}
                      placeholder="e.g. 30 mins"
                      className="w-24 px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleAddLessonToDraft}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-100/70 hover:bg-blue-100 rounded-lg cursor-pointer ml-auto"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Prerequisite toggle */}
              <div className="flex items-center justify-between pt-2">
                <label className="text-xs text-slate-700 font-medium">Require previous module completion</label>
                <input
                  type="checkbox"
                  checked={requirePrerequisite}
                  onChange={(e) => setRequirePrerequisite(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModuleOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
