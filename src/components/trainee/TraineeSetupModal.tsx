import React, { useState, useEffect } from 'react';
import { Screen } from '../../types';
import { useTraineeData } from '../../context/TraineeDataContext';
import {
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Plus,
  ArrowRight,
  ArrowLeft,
  FileText,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

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
  const { profile, updateProfile, uploadedEvidence, addEvidence } = useTraineeData();
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
  const [newFileName, setNewFileName] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Step 3: Pre-assessment state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(3); // 0-indexed, shows Question 4 of 20
  const [selectedOption, setSelectedOption] = useState<number | null>(1); // Option 2 (Eye) selected
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(1122); // 18 min 42 sec
  const [isTimerRunning, setIsTimerRunning] = useState(true);

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

  const preAssessmentQuestions = [
    {
      qNum: 1,
      prompt: 'What constitutes the main thermodynamic engine of a tropical cyclone?',
      options: [
        'Sensible heat flux from sea surface',
        'Latent heat release from condensation in convective clouds',
        'Coriolis acceleration in the upper troposphere',
        'Upper level anti-cyclonic divergence',
      ],
      correct: 1,
    },
    {
      qNum: 2,
      prompt: 'What minimum sea surface temperature (SST) is typically required for tropical cyclogenesis in the North Indian Ocean?',
      options: ['24.5 °C', '26.5 °C', '28.0 °C', '30.0 °C'],
      correct: 1,
    },
    {
      qNum: 3,
      prompt: 'In Dvorak technique, what does Central Dense Overcast (CDO) pattern indicate?',
      options: [
        'Weakening shear pattern',
        'Intensification phase of tropical cyclone',
        'Extratropical transition',
        'Post-landfall decay',
      ],
      correct: 1,
    },
    {
      qNum: 4,
      prompt: 'Which feature marks the centre of a mature tropical cyclone?',
      options: ['Spiral rainband', 'Eye', 'Outflow jet', 'Monsoon trough'],
      correct: 1,
    },
  ];

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
      {/* Top Simple Header */}
      <header className="w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
            Capacity Connect
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <span>Signed in as <strong className="text-slate-800">Asha Verma</strong></span>
          <span className="text-slate-300">·</span>
          <button
            type="button"
            onClick={onSignOut}
            className="text-slate-900 font-semibold hover:underline cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-2xl">
          {/* Stepper Progress Bar */}
          <div className="mb-8">
            <div className="grid grid-cols-4 gap-2 mb-2">
              <div className="h-1 bg-slate-900 rounded-full" />
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentStep >= 2 ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              />
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentStep >= 3 ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              />
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentStep >= 4 ? 'bg-slate-900' : 'bg-slate-200'
                }`}
              />
            </div>
            <div className="grid grid-cols-4 text-[11px] font-medium text-slate-500">
              <span className={currentStep === 1 ? 'text-slate-900 font-bold' : ''}>
                Profile
              </span>
              <span className={currentStep === 2 ? 'text-slate-900 font-bold' : ''}>
                Certificates
              </span>
              <span className={currentStep === 3 ? 'text-slate-900 font-bold' : ''}>
                Pre-assessment
              </span>
              <span className={currentStep === 4 ? 'text-slate-900 font-bold' : ''}>
                Result
              </span>
            </div>
          </div>

          {/* STEP 1: Tell us about yourself (01-profile-details) */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Tell us about yourself
                </h1>
                <p className="text-sm text-slate-500 mt-1.5">
                  Your account is created. Complete your profile to unlock the portal.
                </p>
              </div>

              {/* Account (from sign up) */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Account (from sign up)
                </label>
                <div className="w-full px-4 py-3 bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-700 font-medium select-none">
                  Asha Verma · asha.verma@imd.gov.in · New Delhi
                </div>
              </div>

              {/* Highest qualification */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Highest qualification
                </label>
                <input
                  type="text"
                  value={highestQualification}
                  onChange={(e) => setHighestQualification(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-2xs"
                />
              </div>

              {/* Work experience */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Work experience
                </label>
                <input
                  type="text"
                  value={workExperience}
                  onChange={(e) => setWorkExperience(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-2xs"
                />
              </div>

              {/* Interests */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Interests
                </label>
                <div className="flex flex-wrap gap-2 items-center">
                  {interests.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-[#181c24] text-white rounded-full text-xs font-medium flex items-center gap-1.5"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => setInterests(interests.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {isAddingInterest ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Interest name"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                        className="px-3 py-1 bg-white border border-slate-300 rounded-full text-xs text-slate-800 outline-hidden w-28"
                      />
                      <button
                        type="button"
                        onClick={handleAddInterest}
                        className="text-xs bg-slate-900 text-white px-2 py-1 rounded-full"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingInterest(true)}
                      className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2 items-center">
                  {skills.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-[#181c24] text-white rounded-full text-xs font-medium flex items-center gap-1.5"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => setSkills(skills.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {isAddingSkill ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Skill name"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                        className="px-3 py-1 bg-white border border-slate-300 rounded-full text-xs text-slate-800 outline-hidden w-28"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="text-xs bg-slate-900 text-white px-2 py-1 rounded-full"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingSkill(true)}
                      className="px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-full text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Continue button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleStep1Continue}
                  className="w-full py-3.5 bg-[#181c24] hover:bg-[#252b37] text-white rounded-xl font-semibold text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Add your certificates (02-certificates) */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Add your certificates
                </h1>
                <p className="text-sm text-slate-500 mt-1.5">
                  Upload certificates as evidence. They are checked against MoES and IMD-linked providers.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={handleSimulateDropCertificate}
                className="border-2 border-dashed border-slate-300 hover:border-slate-400 bg-white/70 hover:bg-slate-50/80 rounded-2xl p-8 text-center cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:scale-105 transition-transform mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  {isUploading ? 'Validating certificate issuer...' : 'Drop certificates here'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  PDF or image, up to 10 MB each
                </p>
              </div>

              {/* Uploaded items list */}
              <div className="space-y-2.5">
                {uploadedEvidence.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs"
                  >
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        {item.fileName}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.provider} · {item.year}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
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
              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-1/3 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(3);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-2/3 py-3.5 bg-[#181c24] hover:bg-[#252b37] text-white rounded-xl font-semibold text-sm transition-all shadow-xs cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Pre-assessment (03-pre-assessment) */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Pre-assessment
                </h1>
                <p className="text-sm text-slate-500 mt-1.5 flex items-center gap-2">
                  <span>Question 4 of 20</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-semibold text-slate-700">
                    {formatTimer(timeLeftSeconds)} left
                  </span>
                  <span className="text-slate-300">·</span>
                  <span>This maps your starting competency.</span>
                </p>
              </div>

              {/* Progress line */}
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                <div className="bg-slate-900 h-1 w-[20%]" />
              </div>

              {/* Question container */}
              <div className="space-y-3 pt-2">
                <p className="text-sm sm:text-base font-bold text-slate-900">
                  Which feature marks the centre of a mature tropical cyclone?
                </p>

                <div className="space-y-2.5 pt-1">
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
                        className={`w-full p-3.5 sm:p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-3.5 cursor-pointer border ${
                          isSelected
                            ? 'bg-white border-slate-900 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-slate-900 bg-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isSelected && (
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                          )}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Previous / Next buttons */}
              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-1/2 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(4);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-1/2 py-3.5 bg-[#181c24] hover:bg-[#252b37] text-white rounded-xl font-semibold text-sm transition-all shadow-xs cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Your starting competency (04-pre-assessment-result) */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Your starting competency
                </h1>
                <p className="text-sm text-slate-500 mt-1.5">
                  Score 66% · 20 of 20 answered. These courses are recommended for you.
                </p>
              </div>

              {/* Competency levels card */}
              <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-4">
                {[
                  { name: 'Forecasting', pct: 72 },
                  { name: 'Radar analysis', pct: 58 },
                  { name: 'Cyclone tracking', pct: 49 },
                  { name: 'Instrumentation', pct: 81 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                    <span className="w-36 font-semibold text-slate-800 truncate">
                      {item.name}
                    </span>
                    <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-slate-900 h-2.5 rounded-full"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-bold text-slate-800">
                      {item.pct}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Recommended courses */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">
                  Recommended courses
                </h3>
                <div className="space-y-2.5">
                  <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Cyclone Track Analysis
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Closes your largest gap
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('Previewing Cyclone Track Analysis syllabus')}
                      className="text-xs font-bold text-slate-900 hover:text-blue-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300"
                    >
                      View
                    </button>
                  </div>

                  <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Radar Data Quality
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Builds radar skills
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('Previewing Radar Data Quality syllabus')}
                      className="text-xs font-bold text-slate-900 hover:text-blue-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>

              {/* Enter portal button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onComplete}
                  className="w-full py-4 bg-[#181c24] hover:bg-[#252b37] text-white rounded-xl font-semibold text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Enter portal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-6 text-center text-xs text-slate-400">
        Capacity Connect · India Meteorological Department, MoES
      </footer>
    </div>
  );
};
