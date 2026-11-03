import React, { useState } from 'react';
import { useTraineeData } from '../../context/TraineeDataContext';
import { TraineeTab, TraineeCourseItem } from '../../types';
import {
  Search,
  ChevronDown,
  BookOpen,
  Star,
  Clock,
  Award,
  Layers,
  Sparkles,
  CheckCircle2,
  X,
  ExternalLink,
  GraduationCap,
  Users,
  PlayCircle,
  FileText,
} from 'lucide-react';

interface TraineeCourseCatalogPageProps {
  onSelectTab: (tab: TraineeTab) => void;
  showToast: (msg: string) => void;
}

export const TraineeCourseCatalogPage: React.FC<TraineeCourseCatalogPageProps> = ({
  onSelectTab,
  showToast,
}) => {
  const { courses, enrollCourse, setSelectedCourseId } = useTraineeData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedTrainer, setSelectedTrainer] = useState('All');

  // Syllabus preview modal state
  const [previewCourse, setPreviewCourse] = useState<TraineeCourseItem | null>(null);

  const subjects = ['All', 'Meteorology', 'Climatology', 'Instrumentation', 'Forecasting', 'Oceanography'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const languages = ['All', 'English', 'Hindi', 'Tamil', 'Marathi'];
  const trainers = ['All', 'Dr. Ravi Menon', 'Prof. Sunil Das', 'Meera Iyer', 'Dr. Anita Rao', 'Dr. Pooja Sen', 'Farah Khan'];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.trainer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'All' || c.subject === selectedSubject;
    const matchesLanguage = selectedLanguage === 'All' || c.languages.includes(selectedLanguage);
    const matchesLevel = selectedLevel === 'All' || c.level === selectedLevel;
    const matchesTrainer = selectedTrainer === 'All' || c.trainer === selectedTrainer;
    return matchesSearch && matchesSubject && matchesLanguage && matchesLevel && matchesTrainer;
  });

  const handleEnroll = (c: TraineeCourseItem) => {
    enrollCourse(c.id);
    showToast(`Successfully enrolled in "${c.title}"! Course added to your dashboard.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Coursera-style Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#e6e9f2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-[#1f5eff] uppercase tracking-wide">
              IMD Academic Catalogue
            </span>
            <span className="text-xs text-[#5b6478]">Govt. Certified Training</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2333] tracking-tight">
            Explore Meteorological Courses
          </h1>
          <p className="text-xs sm:text-sm text-[#5b6478] mt-1">
            Master operational forecasting, satellite interpretation, Doppler radar analytics and synoptic climatology.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#5b6478]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>{courses.length} Approved Curriculums Available</span>
        </div>
      </div>

      {/* Subject Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {subjects.map((sub) => (
          <button
            key={sub}
            type="button"
            onClick={() => setSelectedSubject(sub)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              selectedSubject === sub
                ? 'bg-[#1f5eff] text-white shadow-xs'
                : 'bg-white border border-[#e6e9f2] text-[#5b6478] hover:border-slate-300 hover:text-[#1c2333]'
            }`}
          >
            {sub === 'All' ? 'All Subjects' : sub}
          </button>
        ))}
      </div>

      {/* Search and Secondary Coursera Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input with search icon */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course topic, instructor, radar keywords or Dvorak..."
            className="w-full h-11 pl-10 pr-4 bg-white border border-[#e6e9f2] rounded-xl text-xs sm:text-sm text-[#1c2333] placeholder:text-[#5b6478] focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns: Level, Language, Trainer */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Level Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="appearance-none h-11 pl-3 pr-8 bg-white border border-[#e6e9f2] rounded-xl text-xs font-medium text-[#1c2333] focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 shadow-2xs transition-all cursor-pointer w-full sm:w-auto"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  Level: {lvl}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Language Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="appearance-none h-11 pl-3 pr-8 bg-white border border-[#e6e9f2] rounded-xl text-xs font-medium text-[#1c2333] focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 shadow-2xs transition-all cursor-pointer w-full sm:w-auto"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  Language: {lang}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Trainer Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedTrainer}
              onChange={(e) => setSelectedTrainer(e.target.value)}
              className="appearance-none h-11 pl-3 pr-8 bg-white border border-[#e6e9f2] rounded-xl text-xs font-medium text-[#1c2333] focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 shadow-2xs transition-all cursor-pointer w-full sm:w-auto"
            >
              {trainers.map((tr) => (
                <option key={tr} value={tr}>
                  Instructor: {tr}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between text-xs text-[#5b6478]">
        <span>Showing <strong>{filteredCourses.length}</strong> meteorological courses</span>
        {(selectedSubject !== 'All' || selectedLevel !== 'All' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedSubject('All');
              setSelectedLevel('All');
              setSelectedLanguage('All');
              setSelectedTrainer('All');
              setSearchQuery('');
            }}
            className="text-[#1f5eff] hover:underline font-medium cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Coursera-Style Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-[16px] border border-[#e6e9f2] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-blue-300"
          >
            <div>
              {/* Cover Image Container with Coursera Badges */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                <img
                  src={
                    course.imageUrl ||
                    'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=600&auto=format&fit=crop&q=80'
                  }
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Level Pill floating top-left */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-md text-[10.5px] font-bold bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs">
                    {course.level || 'Intermediate'}
                  </span>
                  <span className="px-2 py-1 rounded-md text-[10px] font-semibold bg-slate-900/80 text-white shadow-xs backdrop-blur-xs flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {course.hours || '24 hrs'}
                  </span>
                </div>

                {/* Enrolled status badge if already enrolled */}
                {course.enrolled && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10.5px] font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Enrolled ({course.progress}%)
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5">
                {/* Institution & Subject Row */}
                <div className="flex items-center justify-between text-[11px] text-[#5b6478] mb-1.5">
                  <span className="font-semibold text-blue-700 uppercase tracking-wider truncate max-w-[200px]">
                    {course.institution || 'IMD Training Directorate'}
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                    {course.subject}
                  </span>
                </div>

                {/* Course Title */}
                <h3 className="text-base font-bold text-[#1c2333] group-hover:text-[#1f5eff] transition-colors leading-snug line-clamp-2 min-h-[44px]">
                  {course.title}
                </h3>

                {/* Instructor byline */}
                <div className="flex items-center gap-2 mt-2.5">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] grid place-items-center">
                    {course.code || 'IM'}
                  </div>
                  <span className="text-xs text-[#5b6478]">
                    Instructor: <strong className="text-slate-800 font-medium">{course.trainer}</strong>
                  </span>
                </div>

                {/* Description excerpt */}
                <p className="text-xs text-[#5b6478] mt-2.5 line-clamp-2 leading-relaxed">
                  {course.description || 'Comprehensive operational curriculum designed for duty officers and meteorologists.'}
                </p>

                {/* Coursera Meta Row: Ratings, Reviews, Modules */}
                <div className="flex items-center gap-3 mt-3.5 pt-3 border-t border-slate-100 text-xs text-[#5b6478]">
                  <div className="flex items-center gap-1 font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{course.rating || 4.8}</span>
                    <span className="font-normal text-slate-400">
                      ({(course.reviewsCount || 850).toLocaleString()})
                    </span>
                  </div>
                  <span className="text-slate-300">·</span>
                  <div className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>{course.modulesCount} modules</span>
                  </div>
                  <span className="text-slate-300">·</span>
                  <span className="text-[11px] truncate max-w-[80px]">
                    {course.languages.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Card Footer */}
            <div className="p-5 pt-0">
              {course.enrolled ? (
                <div className="space-y-2">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1f5eff] h-full rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewCourse(course)}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-center"
                    >
                      Syllabus
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        onSelectTab('course-player');
                        showToast(`Resuming "${course.title}"`);
                      }}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-[#1f5eff] hover:bg-blue-600 transition-colors cursor-pointer text-center shadow-xs"
                    >
                      Resume
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setPreviewCourse(course);
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-center"
                  >
                    Syllabus
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleEnroll(course);
                      setSelectedCourseId(course.id);
                      onSelectTab('course-player');
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-[#1f5eff] hover:bg-blue-600 transition-colors cursor-pointer text-center shadow-xs flex items-center justify-center gap-1"
                  >
                    <span>Enroll Free</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No courses match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, subject filter, or level to explore available modules.
          </p>
        </div>
      )}

      {/* Coursera-Style Course Syllabus Preview Modal */}
      {previewCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header with Course Banner */}
            <div className="relative aspect-[21/9] w-full overflow-hidden bg-slate-900">
              <img
                src={previewCourse.imageUrl}
                alt={previewCourse.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent p-5 sm:p-6 flex flex-col justify-end text-white">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  {previewCourse.institution}
                </span>
                <h2 className="text-lg sm:text-xl font-bold leading-tight mt-1">
                  {previewCourse.title}
                </h2>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-300 flex-wrap">
                  <span className="flex items-center gap-1 font-semibold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {previewCourse.rating} ({previewCourse.reviewsCount || 850} reviews)
                  </span>
                  <span>·</span>
                  <span>{previewCourse.level} Level</span>
                  <span>·</span>
                  <span>Approx. {previewCourse.hours || '24 hrs'} to complete</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewCourse(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1.5">What you will learn</h4>
                <p className="text-slate-600 leading-relaxed">
                  {previewCourse.description} Designed according to World Meteorological Organization (WMO-258) standards and IMD operational duty requirements.
                </p>
              </div>

              {/* Syllabus Breakdown */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                  <span>Syllabus Modules ({previewCourse.modulesCount} modules)</span>
                  <span className="text-xs font-normal text-slate-500">Flexible deadlines</span>
                </h4>
                <div className="space-y-2.5">
                  {[
                    { num: 1, title: 'Foundations & Mathematical Principles', duration: '4 hrs', type: 'Video lectures & Reading' },
                    { num: 2, title: 'Instrument Calibration & Operational Ingestion', duration: '6 hrs', type: 'Interactive Simulation' },
                    { num: 3, title: 'Advanced Pattern Analysis & Real-Time Case Studies', duration: '8 hrs', type: 'Hands-on Exercise' },
                    { num: 4, title: 'Operational Decision Making & Warning Issuance', duration: '6 hrs', type: 'Mock Advisory Review' },
                    { num: 5, title: 'Final Certification Assessment & Protocol Evaluation', duration: '4 hrs', type: 'Graded Assessment' },
                  ].slice(0, previewCourse.modulesCount).map((m) => (
                    <div key={m.num} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 font-bold text-xs grid place-items-center shrink-0 mt-0.5">
                          {m.num}
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 text-xs">{m.title}</h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">{m.type}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium shrink-0">{m.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructor Card matching image_ad664f06.png */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-blue-50/30 flex items-center gap-3.5">
                <img
                  src="/public/assets/aistudio/image_ad664f06.png"
                  alt={previewCourse.trainer}
                  className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-200 shadow-2xs bg-white"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80';
                  }}
                />
                <div>
                  <div className="text-xs text-slate-600 font-medium">
                    Instructor: <strong className="text-slate-900 font-bold">{previewCourse.trainer}</strong>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Senior Scientist, IMD
                  </div>
                  <div className="text-[10.5px] text-blue-700 mt-0.5">
                    {previewCourse.institution} · Senior Faculty at National Meteorological Training Institute
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
              <button
                type="button"
                onClick={() => setPreviewCourse(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Close preview
              </button>
              {previewCourse.enrolled ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCourseId(previewCourse.id);
                    setPreviewCourse(null);
                    onSelectTab('course-player');
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#1f5eff] hover:bg-blue-600 cursor-pointer shadow-xs"
                >
                  Resume Course
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    handleEnroll(previewCourse);
                    setSelectedCourseId(previewCourse.id);
                    setPreviewCourse(null);
                    onSelectTab('course-player');
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#1f5eff] hover:bg-blue-600 cursor-pointer shadow-xs"
                >
                  Enroll Now Free
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
