import React, { useState } from 'react';
import { useTraineeData } from '../../context/TraineeDataContext';
import { TraineeTab } from '../../types';
import { User, Mail, MapPin, Award, Briefcase, Sparkles, X, Plus } from 'lucide-react';

interface TraineeProfilePageProps {
  onSelectTab: (tab: TraineeTab) => void;
  showToast: (msg: string) => void;
}

export const TraineeProfilePage: React.FC<TraineeProfilePageProps> = ({
  onSelectTab,
  showToast,
}) => {
  const { profile, updateProfile } = useTraineeData();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editField, setEditField] = useState<'qualifications' | 'experience' | 'general'>('general');

  // Form states for modal
  const [degree, setDegree] = useState('M.Sc Meteorology');
  const [institution, setInstitution] = useState('Pune University');
  const [year, setYear] = useState('2016');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2333] tracking-tight">
            My profile
          </h1>
          <p className="text-xs sm:text-sm text-[#5b6478] mt-1">
            Your details used for competency mapping
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditField('general');
            setEditModalOpen(true);
          }}
          className="h-10 px-5 rounded-xl bg-[#1f5eff] hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
        >
          Edit profile
        </button>
      </div>

      {/* Identity Card matching 19-my-profile */}
      <div className="p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#e8efff] text-[#1d4ed8] font-bold text-lg flex items-center justify-center shrink-0">
          AV
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#1c2333]">
            {profile.name}
          </h2>
          <p className="text-xs sm:text-sm text-[#5b6478] mt-0.5">
            {profile.email} · {profile.location} · {profile.role}
          </p>
        </div>
      </div>

      {/* Grid of details matching 19-my-profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Qualifications */}
        <div className="p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1c2333]">Qualifications</h3>
            <button
              type="button"
              onClick={() => {
                setEditField('qualifications');
                setEditModalOpen(true);
              }}
              className="text-xs font-semibold text-[#1f5eff] hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {profile.qualifications.map((q, idx) => (
              <div key={idx} className="border-b border-slate-100 last:border-none pb-3 last:pb-0">
                <p className="text-xs sm:text-sm font-bold text-[#1c2333]">
                  {q.degree}
                </p>
                <p className="text-xs text-[#5b6478] mt-0.5">
                  {q.institution} · {q.year}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Work experience */}
        <div className="p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1c2333]">Work experience</h3>
            <button
              type="button"
              onClick={() => {
                setEditField('experience');
                setEditModalOpen(true);
              }}
              className="text-xs font-semibold text-[#1f5eff] hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {profile.workExperience.map((w, idx) => (
              <div key={idx} className="border-b border-slate-100 last:border-none pb-3 last:pb-0">
                <p className="text-xs sm:text-sm font-bold text-[#1c2333]">
                  {w.role}
                </p>
                <p className="text-xs text-[#5b6478] mt-0.5">
                  {w.organization} · {w.duration}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-[#1c2333]">Interests</h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {profile.interests.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e8efff] text-[#1d4ed8]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-[#1c2333]">Skills</h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {profile.skills.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e8efff] text-[#1d4ed8]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-[#1c2333]">
                Edit Profile Details
              </h3>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-[#1c2333] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={profile.name}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1c2333] mb-1">
                  Posting / Division Location
                </label>
                <input
                  type="text"
                  defaultValue={profile.location}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditModalOpen(false);
                  showToast('Profile details updated successfully');
                }}
                className="px-5 py-2 bg-[#1f5eff] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
