import React, { useState } from 'react';
import { useTraineeData } from '../../context/TraineeDataContext';
import { TraineeTab } from '../../types';
import { HeroVideoDialog } from '../magicui/hero-video-dialog';
import {
  ArrowLeft,
  Star,
  Clock,
  Layers,
  BookOpen,
  Video,
  FileText,
  CheckCircle2,
  Bookmark,
  Award,
  ShieldCheck,
  Check,
  Share2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface TraineeCourseDetailPageProps {
  onSelectTab: (tab: TraineeTab) => void;
  showToast: (msg: string) => void;
}

export const TraineeCourseDetailPage: React.FC<TraineeCourseDetailPageProps> = ({
  onSelectTab,
  showToast,
}) => {
  const { courses, selectedCourseId, enrollCourse } = useTraineeData();
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'reviews' | 'faq'>('overview');
  const [isSaved, setIsSaved] = useState(false);

  // Find the selected course or default to first
  const course = courses.find((c) => c.id === selectedCourseId) || courses[0] || {
    id: 'course-1',
    title: 'Cyclone Track Analysis & Dvorak Technique',
    subject: 'Meteorology',
    trainer: 'Dr. Ravi Menon',
    duration: '24 hours',
    level: 'Intermediate',
    rating: 4.8,
    reviewsCount: 1240,
    modulesCount: 6,
    enrolled: false,
    progress: 0,
    languages: ['English', 'Hindi'],
    institution: 'IMD Training Directorate',
    description:
      'A hands-on training course on cyclonic system analysis, track forecasting, and intensity estimation using the Dvorak technique and satellite data.',
    imageUrl:
      'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1200&auto=format&fit=crop&q=80',
  };

  const handleEnrollNow = () => {
    if (course.enrolled) {
      onSelectTab('course-player');
      showToast(`Resuming "${course.title}"`);
      return;
    }

    enrollCourse(course.id);
    showToast(`Successfully enrolled in "${course.title}"! Course added to your portal.`);
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    showToast(isSaved ? 'Removed from saved courses.' : 'Course saved to your bookmarks.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. Breadcrumbs Row Matching image_ee9f16cc.png */}
      <div className="flex items-center gap-3 text-xs sm:text-sm">
        <button
          type="button"
          onClick={() => onSelectTab('course-catalog')}
          className="p-1.5 rounded-xl bg-white border border-[#e6e9f2] text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs flex items-center justify-center shrink-0"
          title="Back to course catalog"
          aria-label="Back to course catalog"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-slate-500 font-medium truncate">
          <button
            type="button"
            onClick={() => onSelectTab('course-catalog')}
            className="hover:text-[#1f5eff] transition-colors cursor-pointer"
          >
            Course catalog
          </button>
          <span className="text-slate-400">›</span>
          <span className="text-slate-900 font-semibold truncate">{course.title}</span>
        </div>
      </div>

      {/* 2. Main 2-Column Split matching image_ee9f16cc.png */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: Video Preview & Tabs Content (7 Cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* Hero Video Dialog Preview (Course Video Player Dialoger) */}
          <div className="bg-white rounded-2xl border border-[#e6e9f2] p-3 shadow-2xs">
            <HeroVideoDialog
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc={
                course.imageUrl ||
                'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=1200&auto=format&fit=crop&q=80'
              }
              thumbnailAlt={`Preview ${course.title}`}
            />
          </div>

          {/* Tab Navigation matching image_ee9f16cc.png */}
          <div className="bg-white rounded-2xl border border-[#e6e9f2] p-5 sm:p-6 shadow-2xs space-y-6">
            <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-100 pb-3 overflow-x-auto no-scrollbar text-xs sm:text-sm font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`pb-3 -mb-3 transition-colors cursor-pointer relative ${
                  activeTab === 'overview'
                    ? 'text-[#1f5eff] border-b-2 border-[#1f5eff] font-bold'
                    : 'text-[#5b6478] hover:text-slate-900'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('curriculum')}
                className={`pb-3 -mb-3 transition-colors cursor-pointer relative ${
                  activeTab === 'curriculum'
                    ? 'text-[#1f5eff] border-b-2 border-[#1f5eff] font-bold'
                    : 'text-[#5b6478] hover:text-slate-900'
                }`}
              >
                Curriculum
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('instructor')}
                className={`pb-3 -mb-3 transition-colors cursor-pointer relative ${
                  activeTab === 'instructor'
                    ? 'text-[#1f5eff] border-b-2 border-[#1f5eff] font-bold'
                    : 'text-[#5b6478] hover:text-slate-900'
                }`}
              >
                Instructor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 -mb-3 transition-colors cursor-pointer relative ${
                  activeTab === 'reviews'
                    ? 'text-[#1f5eff] border-b-2 border-[#1f5eff] font-bold'
                    : 'text-[#5b6478] hover:text-slate-900'
                }`}
              >
                Reviews (1,240)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('faq')}
                className={`pb-3 -mb-3 transition-colors cursor-pointer relative ${
                  activeTab === 'faq'
                    ? 'text-[#1f5eff] border-b-2 border-[#1f5eff] font-bold'
                    : 'text-[#5b6478] hover:text-slate-900'
                }`}
              >
                FAQ
              </button>
            </div>

            {/* TAB CONTENT: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#1c2333] mb-2.5">
                    About this course
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5b6478] leading-relaxed">
                    This course provides a practical understanding of tropical cyclones, their
                    life cycle, and standard techniques used for track and intensity estimation. It
                    combines theoretical concepts with operational case studies from the Indian Ocean
                    region.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <h3 className="text-base font-bold text-[#1c2333] mb-3">
                    What you will learn
                  </h3>
                  <div className="space-y-2.5">
                    {[
                      'Structure and evolution of tropical cyclones',
                      'Cyclone track forecasting using NWP models',
                      'Dvorak technique for intensity estimation',
                      'Satellite data interpretation and analysis',
                      'Operational best practices and case studies',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <span className="flex size-5 rounded-full bg-emerald-50 text-emerald-600 items-center justify-center shrink-0 mt-0.5">
                          <Check className="size-3.5 stroke-[2.5]" />
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Curriculum */}
            {activeTab === 'curriculum' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-[#1c2333] mb-2">Curriculum Breakdown</h3>
                {[
                  { code: 'M1', title: 'Introduction to Cyclones', lessons: '4 lessons · 42 min' },
                  { code: 'M2', title: 'Satellite imagery basics', lessons: '5 lessons · 58 min' },
                  { code: 'M3', title: 'Track prediction models', lessons: '6 lessons · 75 min' },
                  { code: 'M4', title: 'Intensity estimation (Dvorak Technique)', lessons: '4 lessons · 50 min' },
                  { code: 'M5', title: 'Issuing operational warnings & advisories', lessons: '3 lessons · 35 min' },
                  { code: 'M6', title: 'Operational case studies & evaluation', lessons: '2 lessons · 40 min' },
                ].map((mod) => (
                  <div key={mod.code} className="p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 rounded-md text-xs font-bold bg-blue-50 text-[#1f5eff]">
                        {mod.code}
                      </span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800">{mod.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{mod.lessons}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Included
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: Instructor */}
            {activeTab === 'instructor' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                    RM
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{course.trainer}</h4>
                    <p className="text-xs text-blue-600 font-semibold">Senior Trainer & Chief Meteorologist</p>
                    <p className="text-[11px] text-slate-400">Cyclone Warning Division · IMD New Delhi</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#5b6478] leading-relaxed">
                  Dr. Ravi Menon has led cyclone forecasting operations at IMD Headquarters for over 18 years, overseeing warning disseminations during major Bay of Bengal and Arabian Sea systems.
                </p>
              </div>
            )}

            {/* TAB CONTENT: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-2">
                  <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                  <div>
                    <div className="text-base font-bold text-slate-900">4.8 out of 5 stars</div>
                    <div className="text-xs text-slate-500">Based on 1,240 ratings from verified trainee officers</div>
                  </div>
                </div>
                <div className="p-3 border border-slate-100 rounded-xl">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-800">Suresh K. · Meteorological Officer (Chennai)</span>
                    <span className="text-amber-600 font-semibold">★★★★★</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    The radar simulation and Dvorak spiral charts are identical to what we use on live night shifts. Highly recommended.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: FAQ */}
            {activeTab === 'faq' && (
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-800">Is this course accredited by IMD & MoES?</p>
                  <p className="text-slate-600 mt-1">Yes, passing the final assessment issues a verified MoES / IMD digital certificate.</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-800">Can I access lessons on mobile?</p>
                  <p className="text-slate-600 mt-1">Yes, all video dialogs and interactive lessons are optimized for smartphone browsers.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Course Enrollment & Includes (5 Cols)     */}
        {/* Strictly matches image_ee9f16cc.png bottom-left           */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Card with Title, Rating, Enroll & Save Button */}
          <div className="bg-white rounded-2xl border border-[#e6e9f2] p-6 shadow-2xs space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1c2333] leading-snug tracking-tight">
                {course.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#5b6478] mt-2.5 leading-relaxed">
                {course.description ||
                  'A hands-on training course on cyclonic system analysis, track forecasting, and intensity estimation using the Dvorak technique and satellite data.'}
              </p>
            </div>

            {/* Meta Row: Rating, Level, Duration */}
            <div className="flex items-center gap-3 text-xs font-medium text-[#5b6478] pt-1">
              <div className="flex items-center gap-1 font-bold text-amber-600">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{course.rating || 4.8}</span>
                <span className="font-normal text-slate-400">
                  ({(course.reviewsCount || 1240).toLocaleString()})
                </span>
              </div>
              <span className="text-slate-300">·</span>
              <span className="font-semibold text-slate-700">{course.level || 'Intermediate'}</span>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{course.hours || '24 hours'}</span>
              </div>
            </div>

            {/* Action Buttons: [Enroll now] + [Save] */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleEnrollNow}
                className="flex-1 py-3 px-5 rounded-xl font-bold text-sm text-white bg-[#1f5eff] hover:bg-blue-600 active:scale-98 transition-all cursor-pointer text-center shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                {course.enrolled ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Resume Course</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Enroll now</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleToggleSave}
                className={`py-3 px-4 rounded-xl font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                  isSaved
                    ? 'bg-blue-50 text-[#1f5eff] border-blue-200'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-[#e6e9f2]'
                }`}
                title={isSaved ? 'Saved to bookmarks' : 'Save course'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#1f5eff] text-[#1f5eff]' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            {course.enrolled && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>You are enrolled in this course</span>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectTab('course-player')}
                  className="font-bold text-[#1f5eff] hover:underline"
                >
                  Open Player →
                </button>
              </div>
            )}
          </div>

          {/* This course includes Card matching image_ee9f16cc.png */}
          <div className="bg-white rounded-2xl border border-[#e6e9f2] p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-[#1c2333] tracking-tight">
              This course includes
            </h3>

            <div className="space-y-3.5 text-xs text-slate-700">
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="font-medium">6 Modules · 24 Lessons</span>
              </div>

              <div className="flex items-center gap-3">
                <Video className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="font-medium">Video lectures (12+ hours)</span>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="font-medium">Reading materials & datasets</span>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="font-medium">Assessments & final quiz</span>
              </div>

              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="font-medium">Certificate of completion</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
