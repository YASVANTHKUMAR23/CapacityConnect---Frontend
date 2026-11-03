import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  ArrowLeft,
  Mail,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  BookOpen,
  Award,
  ChevronRight,
  X,
  FileText,
  Activity,
  Plus,
} from 'lucide-react';
import { useTrainerData } from '../../context/TrainerDataContext';
import { TrainerTrainee } from '../../types';

interface TrainerTraineesPageProps {
  showToast: (msg: string) => void;
}

export const TrainerTraineesPage: React.FC<TrainerTraineesPageProps> = ({ showToast }) => {
  const {
    trainees,
    selectedTraineeId,
    setSelectedTraineeId,
    sendReminder,
    courses,
  } = useTrainerData();

  // View state: 'list' | 'detail'
  const [viewState, setViewState] = useState<'list' | 'detail'>('list');
  const [filterTab, setFilterTab] = useState<'All' | 'On track' | 'Needs attention' | 'Inactive'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');

  // Selected trainees for batch reminder
  const [selectedTraineeIds, setSelectedTraineeIds] = useState<string[]>(['tr-1', 'tr-2', 'tr-3']);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderSubject, setReminderSubject] = useState('Action Required: Upcoming Cyclone Track Assessment deadline');
  const [reminderMessage, setReminderMessage] = useState(
    'Dear Forecaster,\n\nOur records indicate you have not yet completed the Module 2 Dvorak exercise for Cycle 4. Please complete it before the test window closes on 31 October.'
  );
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelInApp, setChannelInApp] = useState(true);

  // Intervention note on detail page
  const [trainerNoteText, setTrainerNoteText] = useState('');
  const [interventionNotes, setInterventionNotes] = useState([
    {
      id: 'nt-1',
      date: '21 Oct 2026',
      author: 'Dr. Ravi Menon',
      note: 'Conducted 1-on-1 virtual mentoring on Dvorak curved-band log-spiral placement. Rohit is advised to review Lesson 2.2 before retaking quiz.',
    },
  ]);

  const activeTrainee = trainees.find((t) => t.id === selectedTraineeId) || trainees[0];

  // Filtering
  const filteredTrainees = trainees.filter((t) => {
    if (filterTab !== 'All' && t.status !== filterTab) return false;
    if (divisionFilter !== 'All' && !t.division.includes(divisionFilter)) return false;
    if (courseFilter !== 'All' && t.enrolledCourseTitle !== courseFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.division.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTraineeIds(filteredTrainees.map((t) => t.id));
    } else {
      setSelectedTraineeIds([]);
    }
  };

  const handleToggleSelectTrainee = (id: string) => {
    setSelectedTraineeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenDetail = (id: string) => {
    setSelectedTraineeId(id);
    setViewState('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTraineeIds.length) return;

    sendReminder(selectedTraineeIds, reminderSubject, reminderMessage, {
      email: channelEmail,
      inApp: channelInApp,
    });

    showToast(`Dispatched reminder to ${selectedTraineeIds.length} trainees.`);
    setIsReminderModalOpen(false);
  };

  const handleAddInterventionNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerNoteText.trim()) return;

    setInterventionNotes((prev) => [
      {
        id: `nt-${Date.now()}`,
        date: 'Today',
        author: 'Dr. Ravi Menon',
        note: trainerNoteText,
      },
      ...prev,
    ]);
    showToast('Intervention note recorded in trainee dossier.');
    setTrainerNoteText('');
  };

  return (
    <div className="space-y-6">
      {/* VIEW: TRAINEES LIST (t12-trainees) */}
      {viewState === 'list' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Trainees
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Monitor learning progress, assessment scores, and dispatch targeted interventions.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setIsReminderModalOpen(true)}
                disabled={selectedTraineeIds.length === 0}
                className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send reminder ({selectedTraineeIds.length})</span>
              </button>
              <button
                type="button"
                onClick={() => showToast('Exporting trainee roster CSV...')}
                className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 text-xs">
              {[
                { id: 'All', label: 'All Trainees', count: 542 },
                { id: 'On track', label: 'On Track', count: 388 },
                { id: 'Needs attention', label: 'Needs Attention', count: 84 },
                { id: 'Inactive', label: 'Inactive / Dormant', count: 70 },
              ].map((tab) => {
                const isActive = filterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded ${
                        isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search & Select dropdowns */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search trainee by name, email, or division..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={divisionFilter}
                  onChange={(e) => setDivisionFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden focus:border-blue-600 cursor-pointer"
                >
                  <option value="All">All Divisions</option>
                  <option value="Pune">RMC Pune</option>
                  <option value="Kolkata">RMC Kolkata</option>
                  <option value="Chennai">RMC Chennai</option>
                  <option value="Ahmedabad">MC Ahmedabad</option>
                  <option value="New Delhi">IMD HQ New Delhi</option>
                </select>

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
          </div>

          {/* Table Container (Horizontal scroll for responsiveness) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse min-w-[750px]">
                <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                  <tr>
                    <th className="py-3 px-3 sm:px-4 w-10">
                      <input
                        type="checkbox"
                        checked={
                          selectedTraineeIds.length > 0 &&
                          selectedTraineeIds.length === filteredTrainees.length
                        }
                        onChange={handleSelectAll}
                        className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-3 sm:px-4">Trainee</th>
                    <th className="py-3 px-3">Enrolled Course</th>
                    <th className="py-3 px-3">Course Progress</th>
                    <th className="py-3 px-3">Avg. Score</th>
                    <th className="py-3 px-3">Last Active</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTrainees.map((trainee) => {
                    const isSelected = selectedTraineeIds.includes(trainee.id);
                    return (
                      <tr
                        key={trainee.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isSelected ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <td className="py-3 px-3 sm:px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectTrainee(trainee.id)}
                            className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 sm:px-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-8 h-8 rounded-xl ${trainee.avatarBg} flex items-center justify-center font-bold text-xs shrink-0`}
                            >
                              {trainee.initials}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-900 block leading-tight">
                                {trainee.name}
                              </span>
                              <span className="text-[11px] text-slate-400 block mt-0.5">
                                {trainee.division}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 max-w-[190px]">
                          <span className="font-medium text-slate-800 truncate block">
                            {trainee.enrolledCourseTitle}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  trainee.courseProgress >= 70
                                    ? 'bg-emerald-500'
                                    : trainee.courseProgress >= 40
                                    ? 'bg-blue-600'
                                    : 'bg-amber-500'
                                }`}
                                style={{ width: `${trainee.courseProgress}%` }}
                              />
                            </div>
                            <span className="font-bold text-slate-900 tabular-nums text-[11px]">
                              {trainee.courseProgress}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 tabular-nums">
                            {trainee.avgScore}%
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {trainee.lastActive}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              trainee.status === 'On track'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : trainee.status === 'Needs attention'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {trainee.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTraineeIds([trainee.id]);
                                setIsReminderModalOpen(true);
                              }}
                              className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                            >
                              Remind
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(trainee.id)}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                            >
                              Detail
                            </button>
                          </div>
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

      {/* VIEW: TRAINEE DETAIL (t14-trainee-detail) */}
      {viewState === 'detail' && activeTrainee && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewState('list')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Trainees Roster</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTraineeIds([activeTrainee.id]);
                setIsReminderModalOpen(true);
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send direct reminder</span>
            </button>
          </div>

          {/* Profile Header */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-14 h-14 rounded-2xl ${activeTrainee.avatarBg} flex items-center justify-center font-bold text-xl shadow-xs`}
                >
                  {activeTrainee.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-900">{activeTrainee.name}</h1>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        activeTrainee.status === 'On track'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {activeTrainee.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeTrainee.designation} · {activeTrainee.division}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{activeTrainee.email}</p>
                </div>
              </div>

              {/* Top 4 KPI Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-[10px] text-slate-400 block">Overall Progress</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">
                    {activeTrainee.courseProgress}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Avg. Score</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">
                    {activeTrainee.avgScore}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Assessments</span>
                  <span className="text-base font-bold text-slate-900 tabular-nums">
                    {activeTrainee.attemptsCount} attempts
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Last Active</span>
                  <span className="text-xs font-mono font-medium text-slate-700 block mt-0.5">
                    {activeTrainee.lastActive}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2 Column Details: Left (Skill Gaps & Timeline), Right (Attempts history & notes) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Skill Gaps & Weak Areas (t14) */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900">Skill Gaps & Diagnostic Breakdown</h3>
                <p className="text-xs text-slate-500 mt-0.5">Competency scores evaluated across module quizzes</p>

                <div className="mt-4 space-y-3.5">
                  {activeTrainee.skillGaps.map((gap) => (
                    <div key={gap.skill} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700">{gap.skill}</span>
                        <span
                          className={`font-bold tabular-nums ${
                            gap.score >= 70 ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        >
                          {gap.score}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            gap.score >= 70 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${gap.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enrolled Course Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900">Active Course Enrollment</h3>
                <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <span className="font-semibold text-slate-900 block">{activeTrainee.enrolledCourseTitle}</span>
                  <div className="mt-2 flex items-center justify-between text-slate-500">
                    <span>Syllabus Completed</span>
                    <span className="font-bold text-slate-800 tabular-nums">{activeTrainee.courseProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${activeTrainee.courseProgress}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Assessment Attempt History & Notes */}
            <div className="space-y-6">
              {/* Attempts Table */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900">Assessment History</h3>
                <div className="mt-3 divide-y divide-slate-100">
                  {activeTrainee.attempts.map((att, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-900 block">{att.assessmentTitle}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{att.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold tabular-nums text-slate-800">{att.score}%</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            att.status === 'Passed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {att.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trainer Notes & Intervention Log */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Trainer Intervention Log</h3>

                <form onSubmit={handleAddInterventionNote} className="space-y-2">
                  <textarea
                    rows={3}
                    value={trainerNoteText}
                    onChange={(e) => setTrainerNoteText(e.target.value)}
                    placeholder="Log a mentoring note, guidance provided, or retake recommendation..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-600 resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!trainerNoteText.trim()}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 rounded-xl transition-colors cursor-pointer"
                    >
                      Record Note
                    </button>
                  </div>
                </form>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {interventionNotes.map((n) => (
                    <div key={n.id} className="p-3 rounded-xl bg-slate-50 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500 text-[10px]">
                        <span className="font-semibold text-slate-700">{n.author}</span>
                        <span className="font-mono">{n.date}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[11px]">{n.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEND REMINDER POPUP MODAL (t13-reminder-popup) - Bounded Responsive Sizing */}
      {isReminderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[calc(100vw-2rem)] sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Send Trainee Reminder</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  To: <strong className="text-slate-800">{selectedTraineeIds.length} selected forecasters</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReminderModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendReminderSubmit} className="mt-4 space-y-3.5">
              {/* Recipient summary pill list */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Recipients</label>
                <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200/80 max-h-24 overflow-y-auto">
                  {selectedTraineeIds.map((id) => {
                    const t = trainees.find((item) => item.id === id);
                    if (!t) return null;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-medium text-slate-700"
                      >
                        <span>{t.name}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleSelectTrainee(id)}
                          className="hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={reminderSubject}
                  onChange={(e) => setReminderSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-600 resize-none"
                />
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-slate-700 block">Delivery Channels</label>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={channelEmail}
                      onChange={(e) => setChannelEmail(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>Email notification</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={channelInApp}
                      onChange={(e) => setChannelInApp(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span>Portal push alert</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReminderModalOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send reminder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
