import React, { useState } from 'react';
import {
  FolderGit2,
  Upload,
  Search,
  FileText,
  PlayCircle,
  Presentation,
  Download,
  Trash2,
  CheckCircle2,
  Tag,
  BookOpen,
  ArrowDownToLine,
  X,
  FileCheck,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Plus,
} from 'lucide-react';
import { useTrainerData } from '../../context/TrainerDataContext';

interface TrainerLibraryPageProps {
  showToast: (msg: string) => void;
}

export const TrainerLibraryPage: React.FC<TrainerLibraryPageProps> = ({ showToast }) => {
  const { materials, addMaterial, deleteMaterial, courses } = useTrainerData();
  const [filterTab, setFilterTab] = useState<'All' | 'Videos' | 'Presentations' | 'Documents'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');
  const [collapsedCourses, setCollapsedCourses] = useState<Record<string, boolean>>({});

  // Upload modal state (t07-upload-popup)
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Manuals & SOPs');
  const [uploadFormat, setUploadFormat] = useState<'PDF' | 'MP4' | 'PPTX'>('PDF');
  const [uploadCourse, setUploadCourse] = useState(courses[0]?.title || '');
  const [uploadVersion, setUploadVersion] = useState('v1.0');
  const [uploadTags, setUploadTags] = useState('Cyclone, SOP, Training');
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [simulatedFileChosen, setSimulatedFileChosen] = useState(false);

  // Total stats
  const totalCount = materials.length + 42;
  const totalDownloads = '1,840+';

  const toggleCourseCollapse = (courseId: string) => {
    setCollapsedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const handleSimulateFileSelect = () => {
    setSimulatedFileChosen(true);
    setSimulatedProgress(25);
    const interval = setInterval(() => {
      setSimulatedProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 120);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    addMaterial({
      title: uploadTitle,
      category: uploadCategory,
      format: uploadFormat,
      size: uploadFormat === 'MP4' ? '280 MB' : uploadFormat === 'PPTX' ? '34.5 MB' : '12.8 MB',
      courseAttached: uploadCourse,
      uploadedDate: 'Today',
      version: uploadVersion || 'v1.0',
      tags: uploadTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    showToast(`Material "${uploadTitle}" uploaded directly to ${uploadCourse}.`);
    setIsUploadOpen(false);
    setUploadTitle('');
    setSimulatedFileChosen(false);
    setSimulatedProgress(0);
  };

  const handleDelete = (id: string, title: string) => {
    deleteMaterial(id);
    showToast(`Removed "${title}" from course library.`);
  };

  // Helper to match material to course
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

  // Filter courses based on selected course filter
  const visibleCourses = courses.filter((c) => {
    if (selectedCourseFilter !== 'All' && !c.title.toLowerCase().includes(selectedCourseFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full max-w-full min-w-0 space-y-5 font-sans antialiased text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Trainer Course Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Courseware organized by training curriculum. Files uploaded for each course are grouped under its dedicated card.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsUploadOpen(true);
            setUploadCourse(courses[0]?.title || '');
          }}
          className="px-5 py-[9px] bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload material</span>
        </button>
      </div>

      {/* 3. THREE STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-medium text-slate-500">Total Materials</span>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{totalCount} files</div>
            <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">Mapped to {courses.length} active courses</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <FolderGit2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-medium text-slate-500">Curriculum Coverage</span>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">100%</div>
            <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">All course modules have verified reference assets</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[12px] font-medium text-slate-500">Trainee Access Count</span>
            <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{totalDownloads}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Learner downloads & references</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <ArrowDownToLine className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4. FILTER TABS & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
        {/* Format Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 text-[12px]">
          {[
            { id: 'All', label: 'All Files', count: totalCount },
            { id: 'Videos', label: 'Video Lectures', count: 18 },
            { id: 'Presentations', label: 'Presentations', count: 12 },
            { id: 'Documents', label: 'Documents & SOPs', count: 18 },
          ].map((tab) => {
            const isActive = filterTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id as any)}
                className={`px-5 py-[9px] rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 text-[12px] ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Course Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library files by title, tag or topic..."
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
              <option key={c.id} value={c.title}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5. COURSES LIBRARY CARDS - FILES ARE UNDER THAT COURSE CARD ONLY */}
      <div className="space-y-6">
        {visibleCourses.map((course) => {
          // Find all materials attached to this course
          const courseMaterials = materials.filter((m) => {
            if (!isMaterialInCourse(m.courseAttached, course.title)) return false;
            if (filterTab === 'Videos' && m.format !== 'MP4') return false;
            if (filterTab === 'Presentations' && m.format !== 'PPTX') return false;
            if (filterTab === 'Documents' && m.format !== 'PDF') return false;
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
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all hover:border-slate-300"
            >
              {/* Course Card Header */}
              <div className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {course.code || 'MET'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                        {course.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        {course.level}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        {courseMaterials.length} files attached
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
                      {course.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadCourse(course.title);
                      setIsUploadOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload to this course</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCourseCollapse(course.id)}
                    className="p-2 bg-white border border-slate-200/90 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                    title={isCollapsed ? 'Expand Course Files' : 'Collapse Course Files'}
                  >
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Course Materials Grid (Under this course card only) */}
              {!isCollapsed && (
                <div className="p-5 sm:p-6">
                  {courseMaterials.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                      <FolderGit2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-700">
                        No library files uploaded for this course yet
                      </p>
                      <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                        Files uploaded for {course.title} will appear exclusively under this card for forecaster download and reference.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadCourse(course.title);
                          setIsUploadOpen(true);
                        }}
                        className="mt-3 px-4 py-2 bg-white border border-slate-200 hover:border-blue-500 text-blue-600 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload First Resource</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                      {courseMaterials.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 flex flex-col justify-between hover:border-blue-300 transition-all hover:shadow-xs group"
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
                                  <span className="text-[10px] text-slate-400 block mt-0.5">{item.version}</span>
                                </div>
                              </div>

                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
                                Active
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
                            <span className="text-[11px] text-slate-400 tabular-nums">
                              {item.downloadsCount} downloads
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  showToast(`Downloading "${item.title}" (${item.format})`)
                                }
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                                title="Download file"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(item.id, item.title)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                                title="Delete file"
                              >
                                <Trash2 className="w-4 h-4" />
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

      {/* UPLOAD MATERIAL MODAL (t07-upload-popup) */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[calc(100vw-2rem)] sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Upload Learning Material</h3>
                <p className="text-xs text-slate-500 mt-0.5">Author and attach content directly to course</p>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. DWR Calibration & Doppler Velocity SOP"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Course *</label>
                <select
                  value={uploadCourse}
                  onChange={(e) => setUploadCourse(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-hidden focus:border-blue-600 cursor-pointer"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  The uploaded file will be filed under this course card only.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Format</label>
                  <select
                    value={uploadFormat}
                    onChange={(e) => setUploadFormat(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-blue-600 cursor-pointer"
                  >
                    <option value="PDF">PDF Manual</option>
                    <option value="MP4">MP4 Video</option>
                    <option value="PPTX">PPTX Slides</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Version</label>
                  <input
                    type="text"
                    value={uploadVersion}
                    onChange={(e) => setUploadVersion(e.target.value)}
                    placeholder="v1.0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-blue-600 cursor-pointer"
                >
                  <option value="Manuals & SOPs">Manuals & SOPs</option>
                  <option value="Reference Guides">Reference Guides</option>
                  <option value="Video Lectures">Video Lectures</option>
                  <option value="Presentations">Presentations</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  placeholder="Cyclone, Radar, SOP, Reference"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              {/* Upload Drop Area */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Attach File *</label>
                <div
                  onClick={handleSimulateFileSelect}
                  className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center cursor-pointer bg-slate-50/50 transition-colors"
                >
                  <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                  <span className="text-xs font-medium text-slate-700 block mt-1.5">
                    {simulatedFileChosen ? 'File attached: ' + (uploadTitle || 'Course_Material') : 'Click to select PDF, MP4, or PPTX'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Maximum size: 500 MB</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Publish to Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
