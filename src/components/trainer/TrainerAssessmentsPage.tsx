import React, { useState } from 'react';
import {
  FileCheck,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Trash2,
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BarChart2,
  Users,
  ChevronRight,
  X,
  FileQuestion,
  Award,
} from 'lucide-react';
import { useTrainerData } from '../../context/TrainerDataContext';
import { TrainerAssessment, TrainerSubmission } from '../../types';

interface TrainerAssessmentsPageProps {
  showToast: (msg: string) => void;
}

export const TrainerAssessmentsPage: React.FC<TrainerAssessmentsPageProps> = ({ showToast }) => {
  const {
    assessments,
    selectedAssessmentId,
    setSelectedAssessmentId,
    addAssessment,
    deleteAssessment,
    courses,
    trainees,
  } = useTrainerData();

  // View state: 'list' | 'results' | 'create'
  const [viewState, setViewState] = useState<'list' | 'results' | 'create'>('list');
  const [filterTab, setFilterTab] = useState<'All' | 'Live' | 'Scheduled' | 'Closed' | 'Draft'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');

  // Delete modal state (t09-delete-popup)
  const [deleteModalAssessment, setDeleteModalAssessment] = useState<TrainerAssessment | null>(null);
  const [deleteConfirmationChecked, setDeleteConfirmationChecked] = useState(false);

  // View answers popup state
  const [viewAnswersSubmission, setViewAnswersSubmission] = useState<{
    traineeName: string;
    division: string;
    score: number;
    timeSpent: string;
    answers: { question: string; chosen: string; correct: string; isCorrect: boolean }[];
  } | null>(null);

  // Create assessment form state (t10-create-assessment)
  const [asmtTitle, setAsmtTitle] = useState('');
  const [asmtCourseId, setAsmtCourseId] = useState(courses[0]?.id || 'course-1');
  const [asmtModule, setAsmtModule] = useState('Module 1: Cyclogenesis & Steering');
  const [asmtType, setAsmtType] = useState<'Quiz' | 'Mid-term' | 'Final' | 'Assignment'>('Quiz');
  const [asmtTimeLimit, setAsmtTimeLimit] = useState(30);
  const [asmtPassMarks, setAsmtPassMarks] = useState(60);
  const [asmtTotalMarks, setAsmtTotalMarks] = useState(100);
  const [asmtDeadline, setAsmtDeadline] = useState('2026-11-15T23:59');

  // Question bank draft in creator
  const [questionsDraft, setQuestionsDraft] = useState([
    {
      id: 'qd-1',
      prompt: 'What is the minimum sea surface temperature (SST) generally required for cyclogenesis in the Bay of Bengal?',
      options: ['24.5 °C', '26.5 °C', '29.0 °C', '32.0 °C'],
      correctIndex: 1,
      points: 5,
    },
    {
      id: 'qd-2',
      prompt: 'Which Doppler radar product is utilized to detect tornadic vortex signatures (TVS)?',
      options: ['Reflectivity factor (Z)', 'Radial velocity shear (V)', 'Spectrum width (W)', 'Echo tops (ET)'],
      correctIndex: 1,
      points: 5,
    },
  ]);
  const [newQuestionPrompt, setNewQuestionPrompt] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctOptIndex, setCorrectOptIndex] = useState(0);

  const selectedAssessment = assessments.find((a) => a.id === selectedAssessmentId) || assessments[0];

  // Filter assessments
  const filteredAssessments = assessments.filter((a) => {
    if (filterTab !== 'All' && a.status !== filterTab) return false;
    if (courseFilter !== 'All' && a.courseTitle !== courseFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.courseTitle.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenResults = (asmtId: string) => {
    setSelectedAssessmentId(asmtId);
    setViewState('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmDelete = () => {
    if (!deleteModalAssessment) return;
    deleteAssessment(deleteModalAssessment.id);
    showToast(`Assessment "${deleteModalAssessment.title}" has been deleted.`);
    setDeleteModalAssessment(null);
    setDeleteConfirmationChecked(false);
  };

  const handleAddQuestionToDraft = () => {
    if (!newQuestionPrompt.trim() || !opt0.trim() || !opt1.trim()) return;
    setQuestionsDraft((prev) => [
      ...prev,
      {
        id: `qd-${Date.now()}`,
        prompt: newQuestionPrompt,
        options: [opt0, opt1, opt2 || 'None of the above', opt3 || 'All of the above'],
        correctIndex: correctOptIndex,
        points: 5,
      },
    ]);
    setNewQuestionPrompt('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setCorrectOptIndex(0);
  };

  const handleSaveAssessmentSubmit = (statusToSave: 'Live' | 'Draft' | 'Scheduled') => {
    if (!asmtTitle.trim()) return;
    const parentCourse = courses.find((c) => c.id === asmtCourseId) || courses[0];

    addAssessment({
      title: asmtTitle,
      courseId: asmtCourseId,
      courseTitle: parentCourse.title,
      moduleTitle: asmtModule,
      type: asmtType,
      totalEnrolled: parentCourse.enrolled || 180,
      deadline: asmtDeadline.replace('T', ', '),
      status: statusToSave,
      timeLimitMinutes: asmtTimeLimit,
      totalMarks: asmtTotalMarks,
      passMarks: asmtPassMarks,
      questionsCount: questionsDraft.length,
      questions: questionsDraft,
    });

    showToast(`Assessment "${asmtTitle}" saved with status "${statusToSave}".`);
    setViewState('list');
  };

  return (
    <div className="space-y-6">
      {/* VIEW: ASSESSMENTS LIST (t08-assessments) */}
      {viewState === 'list' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Assessments
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Manage quizzes, mid-term examinations, and final evaluation test banks.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setViewState('create')}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create assessment</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 text-xs">
              {(['All', 'Live', 'Scheduled', 'Closed', 'Draft'] as const).map((tab) => {
                const count =
                  tab === 'All'
                    ? assessments.length
                    : assessments.filter((a) => a.status === tab).length;
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

            {/* Search & Course filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search assessment title, course..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 transition-colors"
                />
              </div>

              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-blue-600 cursor-pointer"
              >
                <option value="All">All Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Container (Horizontal scroll with min-width for table integrity) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse min-w-[700px]">
                <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th className="py-3 px-4 sm:px-5">Assessment</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Submissions</th>
                    <th className="py-3 px-4">Pass Rate</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssessments.map((asmt) => (
                    <tr key={asmt.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 sm:px-5">
                        <div className="font-semibold text-slate-900">{asmt.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 max-w-xs truncate">
                          {asmt.courseTitle}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-700">{asmt.type}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">
                          {asmt.questionsCount} questions
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 tabular-nums">
                          {asmt.submissions} / {asmt.totalEnrolled}
                        </div>
                        <div className="w-20 bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${asmt.submissionRate}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 tabular-nums">
                          {asmt.passRate ? `${asmt.passRate}%` : '—'}
                        </span>
                        {asmt.avgScore ? (
                          <span className="block text-[10px] text-slate-400">Avg {asmt.avgScore}/100</span>
                        ) : null}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-700 font-mono text-[11px]">
                        {asmt.deadline}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            asmt.status === 'Live'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : asmt.status === 'Scheduled'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : asmt.status === 'Draft'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {asmt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenResults(asmt.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Results</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteModalAssessment(asmt);
                              setDeleteConfirmationChecked(false);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete assessment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: ASSESSMENT RESULTS & ANALYTICS (t11-assessment-results) */}
      {viewState === 'results' && selectedAssessment && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Back button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewState('list')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Assessments</span>
            </button>
            <span
              className={`text-xs px-2.5 py-0.5 rounded font-semibold ${
                selectedAssessment.status === 'Live'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {selectedAssessment.status}
            </span>
          </div>

          {/* Title Header */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-700">
                  {selectedAssessment.courseTitle}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  {selectedAssessment.title} — Results & Analytics
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Deadline: {selectedAssessment.deadline} · Time limit: {selectedAssessment.timeLimitMinutes} mins · Pass marks: {selectedAssessment.passMarks}/100
                </p>
              </div>

              <button
                type="button"
                onClick={() => showToast('Exporting results CSV spreadsheet for Training Directorate...')}
                className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
              >
                Export Results CSV
              </button>
            </div>

            {/* 4 Analytics KPI Cards (t11) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[11px] text-slate-400 block">Total Submissions</span>
                <span className="text-xl font-bold text-slate-900 tabular-nums">
                  {selectedAssessment.submissions || 168} / {selectedAssessment.totalEnrolled || 214}
                </span>
                <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">78.5% response</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[11px] text-slate-400 block">Pass Rate</span>
                <span className="text-xl font-bold text-slate-900 tabular-nums">
                  {selectedAssessment.passRate || 72}%
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Threshold: 60%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[11px] text-slate-400 block">Average Score</span>
                <span className="text-xl font-bold text-slate-900 tabular-nums">
                  {selectedAssessment.avgScore || 71.4}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Out of 100 marks</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[11px] text-slate-400 block">Avg. Completion Time</span>
                <span className="text-xl font-bold text-slate-900 tabular-nums">
                  {selectedAssessment.avgTimeMins || 24} min
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Limit: 30 min</span>
              </div>
            </div>
          </div>

          {/* Hardest Questions & Score Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score distribution histogram */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900">Score Distribution Histogram</h3>
              <p className="text-xs text-slate-500 mt-0.5">Categorized across 168 evaluated submissions</p>

              <div className="mt-5 space-y-3">
                {[
                  { range: '90 - 100% (Distinction)', count: 28, pct: 16.6, color: 'bg-emerald-500' },
                  { range: '75 - 89% (First Class)', count: 68, pct: 40.5, color: 'bg-blue-600' },
                  { range: '60 - 74% (Passed)', count: 48, pct: 28.5, color: 'bg-indigo-500' },
                  { range: '50 - 59% (Borderline)', count: 14, pct: 8.3, color: 'bg-amber-500' },
                  { range: '< 50% (Failed)', count: 10, pct: 6.1, color: 'bg-rose-500' },
                ].map((s) => (
                  <div key={s.range} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">{s.range}</span>
                      <span className="font-bold text-slate-900 tabular-nums">{s.count} trainees ({s.pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`${s.color} h-full rounded-full`} style={{ width: `${s.pct * 2}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hardest Questions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900">Hardest Questions Analysis</h3>
              <p className="text-xs text-slate-500 mt-0.5">Highest error rates requiring lecture review</p>

              <div className="mt-4 space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-600">Q4: Eyewall Vorticity Calculation</span>
                    <span className="font-semibold text-slate-900 tabular-nums">42% correct</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Most common misconception: Trainees used surface radius instead of RMW (radius of maximum winds).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-600">Q2: Dvorak Curved Band Degree Wrap</span>
                    <span className="font-semibold text-slate-900 tabular-nums">54% correct</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Misinterpretation of log-spiral overlay scale on enhanced IR images.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-600">Q7: Steering Current 500-200 hPa Layer Mean</span>
                    <span className="font-semibold text-slate-900 tabular-nums">59% correct</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Confusion between low-level monsoon trough steering vs subtropical ridge outflow.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submissions List */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Trainee Submissions</h3>
                <p className="text-xs text-slate-500">Live attempt records and answer sheet inspection</p>
              </div>
              <span className="text-xs text-slate-500 tabular-nums">{trainees.length} graded records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse min-w-[650px]">
                <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th className="py-3 px-4 sm:px-5">Trainee</th>
                    <th className="py-3 px-4">Division</th>
                    <th className="py-3 px-4">Time Spent</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Answer Sheet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trainees.map((t) => {
                    const isPassed = t.avgScore >= 60;
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 sm:px-5">
                          <div className="font-semibold text-slate-900">{t.name}</div>
                          <div className="text-[11px] text-slate-400">{t.email}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{t.division}</td>
                        <td className="py-3 px-4 font-mono text-[11px] tabular-nums">
                          {Math.floor(20 + Math.random() * 8)} min
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 tabular-nums">{t.avgScore} / 100</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              isPassed
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {isPassed ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setViewAnswersSubmission({
                                traineeName: t.name,
                                division: t.division,
                                score: t.avgScore,
                                timeSpent: '24 min',
                                answers: [
                                  {
                                    question: 'In Dvorak analysis, what does a Data T-number (DT) of 4.5 correspond to?',
                                    chosen: '65 to 75 knots (Very Severe Cyclonic Storm)',
                                    correct: '65 to 75 knots (Very Severe Cyclonic Storm)',
                                    isCorrect: true,
                                  },
                                  {
                                    question: 'Which vertical wind shear value is most favorable for rapid intensification?',
                                    chosen: isPassed ? 'Less than 10 to 12 knots' : 'Between 25 and 35 knots',
                                    correct: 'Less than 10 to 12 knots',
                                    isCorrect: isPassed,
                                  },
                                  {
                                    question: 'Which atmospheric layer provides the predominant deep-layer steering?',
                                    chosen: '500-200 hPa deep layer mean',
                                    correct: '500-200 hPa deep layer mean',
                                    isCorrect: true,
                                  },
                                ],
                              })
                            }
                            className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer"
                          >
                            View answers
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: CREATE ASSESSMENT (t10-create-assessment) */}
      {viewState === 'create' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewState('list')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Assessments</span>
            </button>
            <span className="text-xs text-slate-400 font-medium">Create New Assessment</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Form & Questions Builder */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h2 className="text-base font-bold text-slate-900">Assessment Details</h2>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assessment Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={asmtTitle}
                    onChange={(e) => setAsmtTitle(e.target.value)}
                    placeholder="e.g. Cyclone Track Analysis Cycle 4 Mid-Term Evaluation"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Associated Course</label>
                    <select
                      value={asmtCourseId}
                      onChange={(e) => setAsmtCourseId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 cursor-pointer"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                    <select
                      value={asmtType}
                      onChange={(e) => setAsmtType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 cursor-pointer"
                    >
                      <option value="Quiz">Quick Quiz (Knowledge check)</option>
                      <option value="Mid-term">Mid-Term Examination</option>
                      <option value="Final">Final Operational Certification</option>
                      <option value="Assignment">Practical Case Assignment</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Question Bank Editor */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Question Bank Editor</h3>
                    <p className="text-xs text-slate-500 mt-0.5">MCQ questions, point weighting, and correct answer key</p>
                  </div>
                  <span className="text-xs text-slate-500 tabular-nums">{questionsDraft.length} drafted</span>
                </div>

                {/* Draft questions list */}
                <div className="space-y-3">
                  {questionsDraft.map((q, idx) => (
                    <div key={q.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900">
                          {idx + 1}. {q.prompt}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 shrink-0">
                          {q.points} pts
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-2 text-[11px]">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-1.5 rounded-md ${
                              oIdx === q.correctIndex
                                ? 'bg-emerald-100 text-emerald-800 font-medium border border-emerald-300'
                                : 'text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new question card */}
                <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 space-y-3">
                  <span className="text-xs font-bold text-slate-900 block">+ Add Multiple Choice Question</span>
                  <div>
                    <input
                      type="text"
                      value={newQuestionPrompt}
                      onChange={(e) => setNewQuestionPrompt(e.target.value)}
                      placeholder="Question prompt..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctOptIndex === 0}
                        onChange={() => setCorrectOptIndex(0)}
                      />
                      <input
                        type="text"
                        value={opt0}
                        onChange={(e) => setOpt0(e.target.value)}
                        placeholder="Option A..."
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctOptIndex === 1}
                        onChange={() => setCorrectOptIndex(1)}
                      />
                      <input
                        type="text"
                        value={opt1}
                        onChange={(e) => setOpt1(e.target.value)}
                        placeholder="Option B..."
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctOptIndex === 2}
                        onChange={() => setCorrectOptIndex(2)}
                      />
                      <input
                        type="text"
                        value={opt2}
                        onChange={(e) => setOpt2(e.target.value)}
                        placeholder="Option C..."
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={correctOptIndex === 3}
                        onChange={() => setCorrectOptIndex(3)}
                      />
                      <input
                        type="text"
                        value={opt3}
                        onChange={(e) => setOpt3(e.target.value)}
                        placeholder="Option D..."
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuestionToDraft}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200/80 rounded-lg cursor-pointer"
                  >
                    Append Question to Bank
                  </button>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Settings & Publishing */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Assessment Parameters</h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time Limit (Minutes)</label>
                  <input
                    type="number"
                    value={asmtTimeLimit}
                    onChange={(e) => setAsmtTimeLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pass Marks</label>
                    <input
                      type="number"
                      value={asmtPassMarks}
                      onChange={(e) => setAsmtPassMarks(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Total Marks</label>
                    <input
                      type="number"
                      value={asmtTotalMarks}
                      onChange={(e) => setAsmtTotalMarks(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Submission Deadline</label>
                  <input
                    type="datetime-local"
                    value={asmtDeadline}
                    onChange={(e) => setAsmtDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleSaveAssessmentSubmit('Live')}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Publish Assessment Live
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveAssessmentSubmit('Scheduled')}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Schedule for 1 November
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveAssessmentSubmit('Draft')}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION POPUP MODAL (t09-delete-popup) - Bounded Responsive Sizing */}
      {deleteModalAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[calc(100vw-2rem)] sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900">Delete this assessment?</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Are you sure you want to delete <strong className="text-slate-900">'{deleteModalAssessment.title}'</strong>?{' '}
                  This assessment currently has <strong className="text-slate-900">{deleteModalAssessment.submissions || 62} trainee submissions</strong>.
                  This action cannot be undone and will permanently remove all student attempt history and grades.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={deleteConfirmationChecked}
                      onChange={(e) => setDeleteConfirmationChecked(e.target.checked)}
                      className="mt-0.5 rounded text-rose-600 focus:ring-0 cursor-pointer"
                    />
                    <span>I understand that this action is irreversible and will delete all submissions.</span>
                  </label>
                </div>

                <div className="mt-5 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteModalAssessment(null);
                      setDeleteConfirmationChecked(false);
                    }}
                    className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!deleteConfirmationChecked}
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Delete assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW ANSWERS POPUP MODAL - Bounded Responsive Sizing */}
      {viewAnswersSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[calc(100vw-2rem)] sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Trainee Submission: {viewAnswersSubmission.traineeName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {viewAnswersSubmission.division} · Score: <strong className="text-slate-900">{viewAnswersSubmission.score}%</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewAnswersSubmission(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {viewAnswersSubmission.answers.map((ans, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-slate-900">Q{i + 1}: {ans.question}</span>
                    {ans.isCorrect ? (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">
                        +5 pts
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-bold shrink-0">
                        0 pts
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <div>Selected: <strong className={ans.isCorrect ? 'text-emerald-700' : 'text-rose-600'}>{ans.chosen}</strong></div>
                    {!ans.isCorrect && (
                      <div className="text-emerald-700 mt-0.5">Correct Answer: {ans.correct}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewAnswersSubmission(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                Close Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
