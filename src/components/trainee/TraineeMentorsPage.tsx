import React, { useState } from 'react';
import { useTraineeData } from '../../context/TraineeDataContext';
import { TraineeTab, TraineeMentorItem } from '../../types';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  X,
  MessageSquare,
  Send,
  Sparkles,
  Star,
  Award,
  ArrowRight,
  Filter,
  Check,
  Video,
  FileText,
  BadgeCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface TraineeMentorsPageProps {
  onSelectTab: (tab: TraineeTab) => void;
  showToast: (msg: string) => void;
}

export const TraineeMentorsPage: React.FC<TraineeMentorsPageProps> = ({
  onSelectTab,
  showToast,
}) => {
  const { mentors, sessionRequests, requestMentorSession } = useTraineeData();
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking modal state
  const [selectedMentor, setSelectedMentor] = useState<TraineeMentorItem | null>(null);
  const [topic, setTopic] = useState('');
  const [sessionTimeSlot, setSessionTimeSlot] = useState('Tomorrow 15:30 IST');
  const [sessionType, setSessionType] = useState<'video' | 'chat'>('video');
  const [doubtNotes, setDoubtNotes] = useState('');
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  // Detail view modal
  const [mentorDetailModal, setMentorDetailModal] = useState<TraineeMentorItem | null>(null);

  const domains = [
    'All',
    'Tropical Meteorology',
    'Numerical Modeling',
    'Radar Meteorology',
    'Climatology & Extremes',
    'Oceanography',
    'Satellite Meteorology',
  ];

  const filteredMentors = mentors.filter((m) => {
    const matchesDomain = selectedDomain === 'All' || m.domain === selectedDomain;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.domain && m.domain.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.division && m.division.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDomain && matchesSearch;
  });

  const handleOpenRequest = (mentor: TraineeMentorItem) => {
    setSelectedMentor(mentor);
    setTopic(`${mentor.gapMatched || 'Competency'} Guidance & Doubt Clearing`);
    setSessionTimeSlot(mentor.availableSlot || 'Tomorrow 15:30 IST');
    setRequestModalOpen(true);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor || !topic.trim()) return;
    requestMentorSession(selectedMentor.name, topic.trim());
    setRequestModalOpen(false);
    showToast(`1-on-1 mentorship session requested with ${selectedMentor.name} for ${sessionTimeSlot}!`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* AI Recommendation Engine Header Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>AI Niche & Competency Matchmaking Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Personalized Mentor Recommendations
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              We analyzed your pre-assessment results and priority competency gaps (Cyclone Tracking: <strong>49%</strong>, Radar Analysis: <strong>58%</strong>). You have been paired with Senior IMD Scientists and Division Heads whose direct niche matches your current learning trajectory.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center shrink-0">
            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <span className="text-2xl font-bold text-white block">6</span>
              <span className="text-[11px] text-slate-300 font-medium">Mapped Mentors</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <span className="text-2xl font-bold text-emerald-400 block">98%</span>
              <span className="text-[11px] text-slate-300 font-medium">Peak Niche Match</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-2xl font-bold text-blue-300 block">2</span>
              <span className="text-[11px] text-slate-300 font-medium">Priority Skill Gaps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trainee Niche Profile Snapshot */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e6e9f2] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#1f5eff] font-bold text-sm grid place-items-center shrink-0 border border-blue-200">
            AV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#1c2333]">Asha Verma</h3>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Trainee Officer · New Delhi
              </span>
            </div>
            <p className="text-xs text-[#5b6478] mt-0.5">
              Active Focus: <strong>Tropical Cyclone Tracking & Nowcasting Readiness</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-medium">Matching Gaps:</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200/60">
            Cyclone Tracking (49%)
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
            Radar Analysis (58%)
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            Instrumentation (81% - Mastered)
          </span>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Domain Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {domains.map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomain(dom)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedDomain === dom
                  ? 'bg-[#1f5eff] text-white shadow-xs'
                  : 'bg-white border border-[#e6e9f2] text-[#5b6478] hover:border-slate-300 hover:text-[#1c2333]'
              }`}
            >
              {dom === 'All' ? 'All Specializations' : dom}
            </button>
          ))}
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mentors by name, niche..."
            className="w-full h-10 px-3.5 bg-white border border-[#e6e9f2] rounded-xl text-xs text-[#1c2333] placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Recommended Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.id}
            className="p-5 sm:p-6 rounded-[16px] bg-white border border-[#e6e9f2] shadow-2xs flex flex-col justify-between hover:shadow-lg transition-all duration-300 group hover:border-blue-300 relative overflow-hidden"
          >
            {/* Top Match Score Pill */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={
                    mentor.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={mentor.name}
                  className="w-13 h-13 rounded-2xl object-cover ring-2 ring-blue-100 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-[#1c2333] truncate group-hover:text-[#1f5eff] transition-colors">
                      {mentor.name}
                    </h3>
                    <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  </div>
                  <p className="text-xs text-blue-700 font-medium truncate">
                    {mentor.designation || 'Senior Scientist'}
                  </p>
                  <p className="text-[11px] text-[#5b6478] truncate">
                    {mentor.division || 'IMD Directorate'}
                  </p>
                </div>
              </div>

              {/* Match Score Badge */}
              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>{mentor.matchScore || 92}% Match</span>
                </span>
                <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-amber-600 mt-1">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>{mentor.rating || 4.9}</span>
                </div>
              </div>
            </div>

            {/* AI Niche Rationale Box */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100/80 mb-4 text-xs">
              <span className="text-[10.5px] font-bold text-blue-800 uppercase tracking-wider block mb-1">
                Why Recommended for You:
              </span>
              <p className="text-slate-700 leading-relaxed text-[11.5px]">
                {mentor.matchRationale ||
                  `Directly matches your ${mentor.gapMatched} competency gap. Experienced faculty at National Meteorological Training Institute.`}
              </p>
            </div>

            {/* Specialization & Availability Stats */}
            <div className="space-y-2 mb-4 text-xs">
              <div className="flex items-center justify-between text-[#5b6478]">
                <span>Domain:</span>
                <strong className="text-slate-800 font-semibold">{mentor.domain || mentor.specialization}</strong>
              </div>
              <div className="flex items-center justify-between text-[#5b6478]">
                <span>Next Opening:</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  {mentor.availableSlot || 'Tomorrow, 3:30 PM'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#5b6478]">
                <span>Mentored:</span>
                <span className="text-slate-700 font-medium">
                  {mentor.coursesCount} Courses · {mentor.traineesCount} Trainees
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMentorDetailModal(mentor)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Profile
              </button>
              <button
                type="button"
                onClick={() => handleOpenRequest(mentor)}
                className="flex-1 py-2.5 px-4 bg-[#1f5eff] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Book 1-on-1 Guidance</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Table Card: My Mentorship Session Requests */}
      <div className="p-5 sm:p-6 rounded-[16px] bg-white border border-[#e6e9f2] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1c2333]">My 1-on-1 Mentorship Sessions</h3>
            <p className="text-xs text-[#5b6478] mt-0.5">Track your scheduled scientific consultations and doubt sessions</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
            {sessionRequests.length} Booked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="text-[#5b6478] border-b border-slate-100 font-medium text-xs">
                <th className="pb-3.5 font-medium">Mentor</th>
                <th className="pb-3.5 font-medium">Topic / Competency</th>
                <th className="pb-3.5 font-medium">Scheduled Time</th>
                <th className="pb-3.5 font-medium">Meeting Link</th>
                <th className="pb-3.5 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessionRequests.map((sr) => (
                <tr key={sr.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 pr-4 font-bold text-[#1c2333]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs grid place-items-center">
                        {sr.mentorName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <span>{sr.mentorName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#1c2333] font-medium text-xs">
                    {sr.topic}
                  </td>
                  <td className="py-4 px-4 text-[#5b6478] text-xs">
                    {sr.requestedDate}
                  </td>
                  <td className="py-4 px-4 text-xs">
                    {sr.status === 'Completed' ? (
                      <span className="text-slate-400">Archived</span>
                    ) : (
                      <a
                        href="#join-room"
                        onClick={(e) => {
                          e.preventDefault();
                          showToast(`Launching secure IMD video room with ${sr.mentorName}...`);
                        }}
                        className="text-[#1f5eff] hover:underline font-semibold flex items-center gap-1"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Video Room</span>
                      </a>
                    )}
                  </td>
                  <td className="py-4 pl-4 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        sr.status === 'Completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-[#e8efff] text-[#1d4ed8]'
                      }`}
                    >
                      {sr.status === 'Pending' ? 'Confirmed · Tomorrow' : sr.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book 1-on-1 Guidance Session Modal */}
      {requestModalOpen && selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={
                    selectedMentor.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={selectedMentor.name}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-blue-100"
                />
                <div>
                  <h3 className="text-base font-bold text-[#1c2333]">
                    Book 1-on-1 Consultation
                  </h3>
                  <p className="text-xs text-blue-700 font-medium">
                    {selectedMentor.name} · {selectedMentor.designation}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRequestModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1c2333] mb-1">
                  Discussion Subject / Competency Area
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Cyclone Track Steering & Radar Artefacts"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-[#1c2333] focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1c2333] mb-1">
                    Available Time Slot
                  </label>
                  <select
                    value={sessionTimeSlot}
                    onChange={(e) => setSessionTimeSlot(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#1c2333] focus:outline-hidden"
                  >
                    <option value="Tomorrow 15:30 IST">Tomorrow, 15:30 IST</option>
                    <option value="Thursday 11:00 IST">Thursday, 11:00 IST</option>
                    <option value="Friday 14:00 IST">Friday, 14:00 IST</option>
                    <option value="Next Monday 16:00 IST">Next Monday, 16:00 IST</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1c2333] mb-1">
                    Meeting Format
                  </label>
                  <select
                    value={sessionType}
                    onChange={(e) => setSessionType(e.target.value as 'video' | 'chat')}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#1c2333] focus:outline-hidden"
                  >
                    <option value="video">Secure Video Call (IMD Room)</option>
                    <option value="chat">Real-Time Chat & Code Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#1c2333] mb-1">
                  Specific Doubts or Assessment Questions to Review
                </label>
                <textarea
                  rows={3}
                  value={doubtNotes}
                  onChange={(e) => setDoubtNotes(e.target.value)}
                  placeholder="Mention specific questions from your Module 2 assessment or Dvorak track analysis doubts..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-[#1c2333] focus:outline-hidden focus:ring-2 focus:ring-blue-600/30"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1f5eff] hover:bg-blue-600 text-white font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mentor Detail Modal */}
      {mentorDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <img
                  src={mentorDetailModal.avatarUrl}
                  alt={mentorDetailModal.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-100"
                />
                <div>
                  <h3 className="text-base font-bold text-[#1c2333]">{mentorDetailModal.name}</h3>
                  <p className="text-xs text-blue-700 font-semibold">{mentorDetailModal.designation}</p>
                  <p className="text-[11px] text-[#5b6478]">{mentorDetailModal.division}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMentorDetailModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-[#1c2333] mb-1">Academic & Operational Background</h4>
                <p className="text-[#5b6478] leading-relaxed">
                  Lead investigator and operational trainer for IMD's severe weather advisory operations. Specializes in {mentorDetailModal.specialization} with numerous operational forecasting handbooks published for Indian coastlines.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#1c2333] mb-1">Niche Compatibility Rationale</h4>
                <p className="text-slate-700 bg-blue-50/70 p-3 rounded-xl border border-blue-100 leading-relaxed">
                  {mentorDetailModal.matchRationale}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-700">Next Available Slot:</span>
                <span className="font-bold text-emerald-700">{mentorDetailModal.availableSlot}</span>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setMentorDetailModal(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const m = mentorDetailModal;
                    setMentorDetailModal(null);
                    handleOpenRequest(m);
                  }}
                  className="px-5 py-2 bg-[#1f5eff] hover:bg-blue-600 text-white font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Book Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
