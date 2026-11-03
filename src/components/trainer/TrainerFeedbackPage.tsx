import React, { useState } from 'react';
import {
  MessageSquareText,
  Star,
  Sparkles,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  CornerDownRight,
  Send,
  X,
  ThumbsUp,
  AlertCircle,
} from 'lucide-react';
import { useTrainerData } from '../../context/TrainerDataContext';
import { TrainerFeedbackItem } from '../../types';

interface TrainerFeedbackPageProps {
  showToast: (msg: string) => void;
}

export const TrainerFeedbackPage: React.FC<TrainerFeedbackPageProps> = ({ showToast }) => {
  const { feedbackItems, replyToFeedback, courses } = useTrainerData();
  const [filterSentiment, setFilterSentiment] = useState<'All' | 'Positive' | 'Neutral' | 'Constructive'>('All');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Comment & reply popup modal state (t16-comment-popup)
  const [replyModalItem, setReplyModalItem] = useState<TrainerFeedbackItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [markAddressed, setMarkAddressed] = useState(true);

  const filteredItems = feedbackItems.filter((item) => {
    if (filterSentiment !== 'All' && item.sentiment !== filterSentiment) return false;
    if (selectedCourse !== 'All' && item.courseTitle !== selectedCourse) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.traineeName.toLowerCase().includes(q) ||
        item.comment.toLowerCase().includes(q) ||
        item.courseTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenReplyModal = (item: TrainerFeedbackItem) => {
    setReplyModalItem(item);
    setReplyText(item.replyText || '');
    setMarkAddressed(item.addressed || true);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModalItem) return;

    replyToFeedback(replyModalItem.id, replyText, markAddressed);
    showToast(`Reply recorded for ${replyModalItem.traineeName}.`);
    setReplyModalItem(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Feedback & Insights
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review trainee evaluations, qualitative observations, and course satisfaction metrics.
        </p>
      </div>

      {/* Top 3 KPI Summary Cards (t15-feedback) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Rating Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Overall Instructor Rating</span>
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">4.6</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
            <span className="text-xs font-semibold text-emerald-600 ml-auto">+0.3 vs 2025</span>
          </div>

          {/* Star bars */}
          <div className="space-y-1.5 pt-1 text-[11px] text-slate-500">
            {[
              { star: 5, pct: 68 },
              { star: 4, pct: 22 },
              { star: 3, pct: 6 },
              { star: 2, pct: 3 },
              { star: 1, pct: 1 },
            ].map((s) => (
              <div key={s.star} className="flex items-center gap-2">
                <span className="w-6 tabular-nums">{s.star}★</span>
                <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${s.pct}%` }} />
                </div>
                <span className="w-7 text-right tabular-nums text-slate-400">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Sentiment Distribution</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-slate-900 tabular-nums">92%</span>
              <span className="text-xs font-semibold text-emerald-600">Positive or constructive</span>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                  Positive Reviews (132)
                </span>
                <span className="font-bold text-slate-800 tabular-nums">72%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-xs bg-blue-500" />
                  Neutral Suggestions (39)
                </span>
                <span className="font-bold text-slate-800 tabular-nums">21%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                  Constructive Critique (13)
                </span>
                <span className="font-bold text-slate-800 tabular-nums">7%</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Aggregated across 184 post-module survey responses
          </div>
        </div>

        {/* AI Synthesis Card (matching t15) */}
        <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 p-5 rounded-2xl border border-blue-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-blue-950">AI Evaluation Synthesis</span>
            </div>
            <p className="text-xs text-blue-900/90 mt-2.5 leading-relaxed font-normal">
              “Trainees consistently highlight Dr. Menon's practical cyclone case reconstructions and Dvorak video examples. Primary request: provide two additional coordinate calculation practice worksheets before Module 2 test.”
            </p>
          </div>

          <div className="pt-3 border-t border-blue-200/60 flex items-center justify-between text-[11px] text-blue-800 font-semibold">
            <span>Action item: 1 suggested tutorial update</span>
            <span className="text-blue-600">Read details →</span>
          </div>
        </div>
      </div>

      {/* Trainee Comments Feed */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {(['All', 'Positive', 'Neutral', 'Constructive'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilterSentiment(s)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
                  filterSentiment === s
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 cursor-pointer"
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

        {/* Comment Cards */}
        <div className="space-y-3.5">
          {filteredItems.map((fb) => (
            <div
              key={fb.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-900">{fb.traineeName}</span>
                  <span className="text-xs text-slate-400">· {fb.traineeDivision}</span>
                  <span className="text-xs text-slate-400">· {fb.courseTitle}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < fb.rating ? 'fill-current' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      fb.sentiment === 'Positive'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : fb.sentiment === 'Neutral'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {fb.sentiment}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                "{fb.comment}"
              </p>

              {/* Reply thread if answered */}
              {fb.replyText && (
                <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-xs text-blue-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-blue-900 text-[11px]">
                    <CornerDownRight className="w-3.5 h-3.5 text-blue-700" />
                    <span>Dr. Ravi Menon (Trainer Response)</span>
                  </div>
                  <p className="text-slate-700 text-[11px] leading-relaxed pl-5">{fb.replyText}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <span className="font-mono">{fb.date}</span>
                <button
                  type="button"
                  onClick={() => handleOpenReplyModal(fb)}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>{fb.replyText ? 'Edit response' : 'Reply to trainee'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMMENT & REPLY POPUP MODAL (t16-comment-popup) - Bounded Responsive Sizing */}
      {replyModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[calc(100vw-2rem)] sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Reply to Trainee Evaluation</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  To: <strong className="text-slate-800">{replyModalItem.traineeName}</strong> ({replyModalItem.traineeDivision})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReplyModalItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Original comment card quote */}
            <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <div className="flex items-center justify-between text-slate-500 text-[10px] mb-1">
                <span>{replyModalItem.courseTitle}</span>
                <span className="font-bold text-amber-600">{replyModalItem.rating} ★</span>
              </div>
              <p className="italic text-slate-700 font-normal">"{replyModalItem.comment}"</p>
            </div>

            <form onSubmit={handleSendReply} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Response</label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Thank trainee, provide clarification, or link supplementary material..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-600 resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={markAddressed}
                    onChange={(e) => setMarkAddressed(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Mark feedback item as addressed & closed</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReplyModalItem(null)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Response</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
