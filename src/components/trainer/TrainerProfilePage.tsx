import React, { useState } from 'react';
import {
  UserCircle2,
  Award,
  BookOpen,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Plus,
  Upload,
  Edit2,
  X,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { useTrainerData } from '../../context/TrainerDataContext';

interface TrainerProfilePageProps {
  showToast: (msg: string) => void;
}

export const TrainerProfilePage: React.FC<TrainerProfilePageProps> = ({ showToast }) => {
  const { profile, updateProfile, addCompetency, addCertificate } = useTrainerData();

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddCompetencyOpen, setIsAddCompetencyOpen] = useState(false);
  const [isUploadCertOpen, setIsUploadCertOpen] = useState(false);

  // Edit profile form state
  const [editName, setEditName] = useState(profile.name);
  const [editTitle, setEditTitle] = useState(profile.roleTitle);
  const [editDivision, setEditDivision] = useState(profile.division);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editOffice, setEditOffice] = useState(profile.officeLocation);
  const [editBio, setEditBio] = useState(profile.bio);

  // Add competency form
  const [compName, setCompName] = useState('');
  const [compPct, setCompPct] = useState(90);

  // Upload cert form
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certYear, setCertYear] = useState('2025');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      roleTitle: editTitle,
      division: editDivision,
      phone: editPhone,
      officeLocation: editOffice,
      bio: editBio,
    });
    showToast('Trainer profile updated successfully.');
    setIsEditProfileOpen(false);
  };

  const handleSaveCompetency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim()) return;
    addCompetency(compName, compPct);
    showToast(`Added competency "${compName}" (${compPct}%).`);
    setIsAddCompetencyOpen(false);
    setCompName('');
  };

  const handleSaveCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certIssuer.trim()) return;
    addCertificate({
      title: certTitle,
      issuer: certIssuer,
      year: certYear,
    });
    showToast(`Certificate "${certTitle}" uploaded and verified.`);
    setIsUploadCertOpen(false);
    setCertTitle('');
    setCertIssuer('');
  };

  return (
    <div className="space-y-6">
      {/* Cover and Profile Banner (t18-profile) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Decorative subtle background strip */}
        <div className="h-28 sm:h-36 bg-gradient-to-r from-blue-700 via-slate-800 to-blue-900 relative">
          <div className="absolute top-3 right-3">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-5 sm:px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            <div className="flex items-end gap-3.5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900 border-4 border-white text-white flex items-center justify-center font-bold text-2xl shadow-md">
                RM
              </div>
              <div className="mb-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{profile.name}</h1>
                    <span title="IMD Verified Trainer">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                    </span>
                  </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">{profile.roleTitle}</p>
                <p className="text-xs text-slate-400 mt-0.5">{profile.division}</p>
              </div>
            </div>

            {/* Profile Strength Donut / Badge */}
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80 self-start sm:self-auto shrink-0">
              <div className="w-10 h-10 rounded-full border-4 border-blue-600 border-t-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-900">
                86%
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Profile Strength</span>
                <span className="text-[10px] text-emerald-600 block">Instructor BIP-M Complete</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl pt-2">
            {profile.bio}
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{profile.officeLocation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Expertise Skills (Left) & Qualifications / Certificates (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Competencies & Expertise (t18) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Expertise & Competencies</h2>
              <p className="text-xs text-slate-500 mt-0.5">Instructional mastery benchmarks</p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddCompetencyOpen(true)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add subject</span>
            </button>
          </div>

          <div className="space-y-4">
            {profile.competencies.map((comp) => (
              <div key={comp.name} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{comp.name}</span>
                  <span className="font-bold text-slate-900 tabular-nums">{comp.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{ width: `${comp.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Competencies are cross-verified against WMO Regional Meteorological Training standards.
          </div>
        </div>

        {/* Right: Qualifications & Certificates */}
        <div className="space-y-6">
          {/* Qualifications */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Academic Qualifications</h2>
            <div className="divide-y divide-slate-100">
              {profile.qualifications.map((q, idx) => (
                <div key={idx} className="py-2.5 flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{q.degree}</span>
                    <span className="text-[11px] text-slate-500 block">{q.institution}</span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Conferred {q.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Official Certifications & Licenses</h2>
              <button
                type="button"
                onClick={() => setIsUploadCertOpen(true)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload certificate</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {profile.certificates.map((cert) => (
                <div key={cert.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{cert.title}</span>
                      <span className="text-[11px] text-slate-500 block">{cert.issuer} · {cert.year}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL - Bounded Responsive Sizing */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[calc(100vw-2rem)] sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Edit Trainer Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Division</label>
                <input
                  type="text"
                  required
                  value={editDivision}
                  onChange={(e) => setEditDivision(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Office Location</label>
                  <input
                    type="text"
                    value={editOffice}
                    onChange={(e) => setEditOffice(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Bio</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD COMPETENCY MODAL - Bounded Responsive Sizing */}
      {isAddCompetencyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[calc(100vw-2rem)] sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Instructional Competency</h3>
              <button
                type="button"
                onClick={() => setIsAddCompetencyOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCompetency} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject / Area <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  placeholder="e.g. Quantitative Precipitation Estimation (QPE)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <label className="font-semibold text-slate-700">Proficiency Benchmark</label>
                  <span className="font-bold text-blue-600 tabular-nums">{compPct}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={compPct}
                  onChange={(e) => setCompPct(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCompetencyOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Save Competency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD CERTIFICATE MODAL - Bounded Responsive Sizing */}
      {isUploadCertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-[calc(100vw-2rem)] sm:max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Upload Certificate</h3>
              <button
                type="button"
                onClick={() => setIsUploadCertOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCertificate} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Certificate Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  placeholder="e.g. WMO Aeronautical Forecaster Competency"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Issuing Organization <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  placeholder="e.g. World Meteorological Organization"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Year of Conformance</label>
                <input
                  type="text"
                  value={certYear}
                  onChange={(e) => setCertYear(e.target.value)}
                  placeholder="2025"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center bg-slate-50 cursor-pointer">
                <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                <span className="text-[11px] font-medium text-slate-600 block mt-1">Upload PDF or scan</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadCertOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
