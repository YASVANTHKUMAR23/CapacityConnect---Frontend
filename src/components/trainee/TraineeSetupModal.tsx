import React, { useState, useEffect } from 'react';
import { useTraineeData } from '../../context/TraineeDataContext';
import {
  Upload,
  CheckCircle2,
  Clock,
  X,
  Plus,
  ArrowRight,
  ArrowLeft,
  FileText,
  User,
  Award,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { Footer } from '../Footer';

interface TraineeSetupModalProps {
  onComplete: () => void;
  onSignOut: () => void;
  showToast: (msg: string) => void;
}

export const TraineeSetupModal: React.FC<TraineeSetupModalProps> = ({
  onComplete,
  onSignOut,
  showToast,
}) => {
  const { updateProfile, uploadedEvidence, addEvidence } = useTraineeData();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Profile form state
  const [highestQualification, setHighestQualification] = useState(
    'M.Sc Meteorology, Pune University (2016)'
  );
  const [workExperience, setWorkExperience] = useState(
    'Scientist B, Regional Met Centre · 6 years'
  );
  const [interests, setInterests] = useState<string[]>([
    'Cyclone tracking',
    'Numerical models',
    'Radar analysis',
  ]);
  const [skills, setSkills] = useState<string[]>([
    'Forecasting',
    'Python',
    'Satellite imagery',
  ]);
  const [newInterest, setNewInterest] = useState('');
  const [isAddingInterest, setIsAddingInterest] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // Step 2: Certificate evidence upload state
  const [isUploading, setIsUploading] = useState(false);

  // Step 3: Pre-assessment state
  const [selectedOption, setSelectedOption] = useState<number | null>(1); // Option 2 (Eye) selected
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(1122); // 18 min 42 sec
  const [isTimerRunning] = useState(true);

  useEffect(() => {
    if (!isTimerRunning || currentStep !== 3) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, currentStep]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAddInterest = () => {
    if (newInterest.trim()) {
      setInterests((prev) => [...prev, newInterest.trim()]);
      setNewInterest('');
      setIsAddingInterest(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills((prev) => [...prev, newSkill.trim()]);
      setNewSkill('');
      setIsAddingSkill(false);
    }
  };

  const handleStep1Continue = () => {
    updateProfile({
      qualifications: [{ degree: highestQualification, institution: 'University', year: '2016' }],
      workExperience: [{ role: 'Scientist B', organization: workExperience, duration: '6 years' }],
      interests,
      skills,
    });
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSimulateDropCertificate = () => {
    setIsUploading(true);
    setTimeout(() => {
      addEvidence('Agromet_Certificate_MoES.pdf', 'IMD Training Institute', '2023');
      setIsUploading(false);
      showToast('Certificate uploaded and verified against MoES repository.');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col justify-between selection:bg-slate-900 selection:text-white font-sans antialiased">
      {/* Top Header matching Authentication Design */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-8 sm:pt-10 flex items-center justify-between select-none">
        <div className="flex items-center gap-3 font-bold text-[17px] tracking-tight text-slate-900">
          <span className="flex aspect-square h-[40px] w-[40px] items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xs shrink-0">
            <svg
              className="w-5.5 h-5.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </span>
          <span>Capacity Connect</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>
            Signed in as <strong className="font-semibold text-slate-800">Asha Verma</strong>
          </span>
          <span className="text-slate-300">·</span>
          <button
            type="button"
            onClick={onSignOut}
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline focus:outline-hidden transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[680px] mx-auto">
          {/* Stepper Progress Bar */}
          <div className="w-full mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Step {currentStep} of 4
              </span>
              <span className="text-xs font-medium text-slate-500">
                {currentStep === 1 && 'Profile Details'}
                {currentStep === 2 && 'Certificate Verification'}
                {currentStep === 3 && 'Diagnostic Assessment'}
                {currentStep === 4 && 'Competency Results'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2.5 mb-2.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep >= 1 ? 'bg-[#181c24]' : 'bg-slate-200'
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep >= 2 ? 'bg-[#181c24]' : 'bg-slate-200'
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep >= 3 ? 'bg-[#181c24]' : 'bg-slate-200'
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep >= 4 ? 'bg-[#181c24]' : 'bg-slate-200'
                }`}
              />
            </div>
            <div className="grid grid-cols-4 text-xs font-medium text-slate-400">
              <span className={currentStep === 1 ? 'text-slate-900 font-semibold' : ''}>
                1. Profile
              </span>
              <span className={currentStep === 2 ? 'text-slate-900 font-semibold' : ''}>
                2. Certificates
              </span>
              <span className={currentStep === 3 ? 'text-slate-900 font-semibold' : ''}>
                3. Pre-assessment
              </span>
              <span className={currentStep === 4 ? 'text-slate-900 font-semibold' : ''}>
                4. Results
              </span>
            </div>
          </div>

          {/* STEP 1: Tell us about yourself (01-profile-details) */}
          {currentStep === 1 && (
            <div className="animate-in fade-in duration-200">
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg border border-slate-200/90 bg-white flex items-center justify-center text-slate-800 shadow-xs mb-6">
                <User className="w-4 h-4 stroke-[1.8]" />
              </div>

              {/* Title block */}
              <div className="mb-6">
                <h1 className="text-[30px] sm:text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
                  Tell us about yourself
                </h1>
                <p className="text-[15px] text-slate-500 mt-2 font-normal leading-relaxed">
                  Your account is registered. Complete your profile details to unlock the learning portal.
                </p>
              </div>

              {/* Account Info Card (from sign up) */}
              <div className="border border-slate-200/90 rounded-xl bg-white shadow-xs overflow-hidden mb-6 divide-y divide-slate-100">
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-slate-500">Account</span>
                  <span className="font-medium text-slate-900">Asha Verma</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium text-slate-900">asha.verma@imd.gov.in</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-slate-500">Station / Office</span>
                  <span className="font-medium text-slate-900">New Delhi · Regional Met Centre</span>
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    Highest qualification
                  </label>
                  <input
                    type="text"
                    value={highestQualification}
                    onChange={(e) => setHighestQualification(e.target.value)}
                    placeholder="e.g. M.Sc Meteorology, University of Pune"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    Work experience
                  </label>
                  <input
                    type="text"
                    value={workExperience}
                    onChange={(e) => setWorkExperience(e.target.value)}
                    placeholder="e.g. Scientist B, Regional Met Centre · 6 years"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    Interests
                  </label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {interests.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#181c24] text-white shadow-2xs"
                      >
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => setInterests(interests.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-white transition-colors"
                          aria-label={`Remove interest ${item}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {isAddingInterest ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          placeholder="Interest name"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                          className="px-3 py-1 bg-white border border-slate-300 rounded-full text-xs text-slate-900 focus:outline-hidden focus:border-blue-600 w-32 shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={handleAddInterest}
                          className="text-xs bg-[#181c24] text-white px-2.5 py-1 rounded-full font-medium hover:bg-slate-800"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingInterest(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 bg-white border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-800 mb-1.5">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {skills.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#181c24] text-white shadow-2xs"
                      >
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-white transition-colors"
                          aria-label={`Remove skill ${item}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {isAddingSkill ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Skill name"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                          className="px-3 py-1 bg-white border border-slate-300 rounded-full text-xs text-slate-900 focus:outline-hidden focus:border-blue-600 w-32 shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className="text-xs bg-[#181c24] text-white px-2.5 py-1 rounded-full font-medium hover:bg-slate-800"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingSkill(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 bg-white border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleStep1Continue}
                  className="w-full bg-[#181c24] hover:bg-[#242b38] active:bg-[#12151b] text-white py-3 rounded-lg font-medium text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Add your certificates (02-certificates) */}
          {currentStep === 2 && (
            <div className="animate-in fade-in duration-200">
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg border border-slate-200/90 bg-white flex items-center justify-center text-slate-800 shadow-xs mb-6">
                <Award className="w-4 h-4 stroke-[1.8]" />
              </div>

              {/* Title block */}
              <div className="mb-6">
                <h1 className="text-[30px] sm:text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
                  Add your certificates
                </h1>
                <p className="text-[15px] text-slate-500 mt-2 font-normal leading-relaxed">
                  Upload certificates as evidence. They are verified against MoES and IMD-linked training providers.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={handleSimulateDropCertificate}
                className="border-2 border-dashed border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50/70 rounded-xl p-7 text-center cursor-pointer transition-all shadow-xs mb-6 group"
              >
                <div className="w-10 h-10 mx-auto rounded-lg bg-slate-100/90 border border-slate-200/80 flex items-center justify-center text-slate-700 group-hover:scale-105 transition-transform mb-2.5">
                  <Upload className="w-5 h-5 stroke-[1.8]" />
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  {isUploading ? 'Validating certificate issuer...' : 'Drop certificates here or click to browse'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PDF, PNG or JPG, up to 10 MB each
                </p>
              </div>

              {/* Uploaded items list */}
              <div className="border border-slate-200/90 rounded-xl bg-white shadow-xs overflow-hidden mb-6 divide-y divide-slate-100">
                <div className="px-4 py-2.5 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Verified Evidence ({uploadedEvidence.length})
                </div>
                {uploadedEvidence.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-4 py-3.5 text-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                        <FileText className="w-4 h-4 stroke-[1.8]" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{item.fileName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.provider} · {item.year}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                        item.evidenceCheck === 'Verified'
                          ? 'bg-[#e7f7ee] text-[#15803d]'
                          : item.evidenceCheck === 'Pending'
                          ? 'bg-[#fff1e0] text-[#b45309]'
                          : 'bg-[#fde8ea] text-[#b91c1c]'
                      }`}
                    >
                      {item.evidenceCheck}
                    </span>
                  </div>
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-1/3 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 border border-slate-200/90 py-3 rounded-lg font-medium text-sm transition-all shadow-xs cursor-pointer text-center"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(3);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-2/3 bg-[#181c24] hover:bg-[#242b38] active:bg-[#12151b] text-white py-3 rounded-lg font-medium text-sm transition-all shadow-xs cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Pre-assessment (03-pre-assessment) */}
          {currentStep === 3 && (
            <div className="animate-in fade-in duration-200">
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg border border-slate-200/90 bg-white flex items-center justify-center text-slate-800 shadow-xs mb-6">
                <HelpCircle className="w-4 h-4 stroke-[1.8]" />
              </div>

              {/* Title block */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Question 4 of 20
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{formatTimer(timeLeftSeconds)} left</span>
                  </span>
                </div>
                <h1 className="text-[30px] sm:text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
                  Pre-assessment
                </h1>
                <p className="text-[15px] text-slate-500 mt-2 font-normal leading-relaxed">
                  This diagnostic quiz maps your baseline competency to recommend personalized courses.
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-6">
                <div className="bg-[#181c24] h-1.5 rounded-full w-[20%] transition-all duration-300" />
              </div>

              {/* Question container */}
              <div className="border border-slate-200/90 rounded-xl bg-white shadow-xs p-5 sm:p-6 mb-6">
                <p className="text-base font-semibold text-slate-900 mb-4 leading-snug">
                  Which feature marks the centre of a mature tropical cyclone?
                </p>

                <div className="space-y-2.5">
                  {[
                    'Spiral rainband',
                    'Eye',
                    'Outflow jet',
                    'Monsoon trough',
                  ].map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedOption(idx)}
                        className={`w-full p-3.5 sm:p-4 rounded-lg text-left text-sm font-medium transition-all flex items-center gap-3.5 cursor-pointer border ${
                          isSelected
                            ? 'bg-slate-50/80 border-slate-900 text-slate-900 ring-1 ring-slate-900 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50/50'
                        }`}
                      >
                        <span
                          className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </span>
                        <span className="flex-1 text-sm">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-1/2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 border border-slate-200/90 py-3 rounded-lg font-medium text-sm transition-all shadow-xs cursor-pointer text-center"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(4);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-1/2 bg-[#181c24] hover:bg-[#242b38] active:bg-[#12151b] text-white py-3 rounded-lg font-medium text-sm transition-all shadow-xs cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Your starting competency (04-pre-assessment-result) */}
          {currentStep === 4 && (
            <div className="animate-in fade-in duration-200">
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg border border-slate-200/90 bg-white flex items-center justify-center text-slate-800 shadow-xs mb-6">
                <CheckCircle2 className="w-4 h-4 stroke-[1.8] text-green-600" />
              </div>

              {/* Title block */}
              <div className="mb-6">
                <h1 className="text-[30px] sm:text-[32px] font-bold text-slate-900 tracking-tight leading-tight">
                  Your starting competency
                </h1>
                <p className="text-[15px] text-slate-500 mt-2 font-normal leading-relaxed">
                  Diagnostic score: <strong className="font-semibold text-slate-900">66%</strong> · 20 of 20 answered. We&apos;ve mapped your baseline competencies and tailored your recommendations.
                </p>
              </div>

              {/* Competency levels card */}
              <div className="border border-slate-200/90 rounded-xl bg-white shadow-xs p-5 sm:p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-slate-900">Baseline Competency Index</h2>
                  <span className="text-xs text-slate-500">4 areas assessed</span>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Forecasting', pct: 72 },
                    { name: 'Radar analysis', pct: 58 },
                    { name: 'Cyclone tracking', pct: 49 },
                    { name: 'Instrumentation', pct: 81 },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-800">{item.name}</span>
                        <span className="font-semibold text-slate-900">{item.pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#181c24] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended courses card */}
              <div className="border border-slate-200/90 rounded-xl bg-white shadow-xs overflow-hidden mb-6 divide-y divide-slate-100">
                <div className="px-4 py-3 bg-slate-50/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Recommended for You
                  </span>
                  <span className="text-xs text-slate-500">Based on diagnostic gaps</span>
                </div>
                <div className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Cyclone Track Analysis</p>
                    <p className="text-xs text-slate-500 mt-0.5">Closes largest competency gap (49% → 80%)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Previewing Cyclone Track Analysis syllabus')}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200/90 hover:bg-slate-50 text-xs font-medium text-slate-800 transition-colors cursor-pointer shrink-0"
                  >
                    View syllabus
                  </button>
                </div>
                <div className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Radar Data Quality & Interpretation</p>
                    <p className="text-xs text-slate-500 mt-0.5">Builds Doppler radar analysis proficiency</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Previewing Radar Data Quality syllabus')}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200/90 hover:bg-slate-50 text-xs font-medium text-slate-800 transition-colors cursor-pointer shrink-0"
                  >
                    View syllabus
                  </button>
                </div>
              </div>

              {/* Enter portal button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onComplete}
                  className="w-full bg-[#181c24] hover:bg-[#242b38] active:bg-[#12151b] text-white py-3.5 rounded-lg font-medium text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Complete profile & enter portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer matching Authentication Pages */}
      <Footer />
    </div>
  );
};
