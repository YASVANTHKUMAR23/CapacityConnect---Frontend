import React, { useState, useEffect } from 'react';
import { useTraineeData } from '../../context/TraineeDataContext';
import { TraineeTab } from '../../types';
import {
  Clock,
  ChevronDown,
  Flag,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  X,
} from 'lucide-react';

interface TraineeTakeAssessmentPageProps {
  assessmentId: string;
  onFinishTest: () => void;
  showToast: (msg: string) => void;
}

export const TraineeTakeAssessmentPage: React.FC<TraineeTakeAssessmentPageProps> = ({
  assessmentId,
  onFinishTest,
  showToast,
}) => {
  const { submitAssessment } = useTraineeData();

  // 20 questions definition
  const totalQuestions = 20;
  const [currentQIndex, setCurrentQIndex] = useState(5); // 0-indexed, shows Question 6 of 20
  const [answers, setAnswers] = useState<Record<number, number>>({
    0: 1,
    1: 2,
    2: 0,
    3: 3,
    4: 1,
    5: 1, // Question 6: Option 2 (Mid-level steering flow)
  });
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(1935); // 32 min 15 sec
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [warningToast, setWarningToast] = useState<string | null>(null);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Secure mode: Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchWarnings((prev) => prev + 1);
        setWarningToast('Tab switch detected! IMD Secure Mode monitors all focus changes.');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Secure mode: Block copy/paste
  const handleCopyPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setWarningToast('Copying question content is disabled during secure examination.');
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const questions = [
    {
      prompt: 'What constitutes the primary thermodynamic reservoir for cyclogenesis over the Bay of Bengal?',
      options: ['Mixed layer ocean heat content', 'Middle tropospheric dry air', 'Sea surface salinity', 'Trade inversion depth'],
    },
    {
      prompt: 'Which satellite spectral band is most effective in tracking upper-level moisture troughs steering a cyclone?',
      options: ['Thermal infrared 10.8 µm', 'Visible 0.65 µm', 'Water vapour 6.7 µm', 'Shortwave infrared 3.9 µm'],
    },
    {
      prompt: 'In Dvorak analysis, a central cold cover (CCC) pattern often indicates:',
      options: ['Temporary arrest in intensification', 'Rapid deepening into super cyclone', 'Landfall interaction', 'Eye formation'],
    },
    {
      prompt: 'Which Doppler radar product provides instantaneous radial velocity of the cyclonic eyewall?',
      options: ['Reflectivity (Z)', 'Spectrum Width (W)', 'Radial Velocity (V)', 'Differential Reflectivity (ZDR)'],
    },
    {
      prompt: 'What vertical wind shear threshold between 850 hPa and 200 hPa is typically favourable for storm intensification?',
      options: ['Greater than 35 knots', 'Less than 10-15 knots', 'Exact 25 knots', 'Zero wind shear only'],
    },
    {
      prompt: 'Which factor mainly steers a tropical cyclone track?',
      options: [
        'Sea surface temperature',
        'Mid-level steering flow',
        'Coastal topography',
        'Surface roughness',
      ],
    },
  ];

  // Fill remainder up to 20 questions
  for (let i = 6; i < 20; i++) {
    questions.push({
      prompt: `Question ${i + 1}: Regarding operational cyclone track analysis and numerical guidance integration...`,
      options: [
        'Ensemble mean trajectory consensus',
        'High-resolution non-hydrostatic WRF core',
        'Barotropic track extrapolation model',
        'Empirical analogue track database',
      ],
    });
  }

  const currentQ = questions[currentQIndex];

  const handleSelectOption = (optIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentQIndex]: optIndex }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => ({ ...prev, [currentQIndex]: !prev[currentQIndex] }));
    showToast(flagged[currentQIndex] ? 'Flag removed' : 'Question flagged for review');
  };

  const handleSubmitTest = () => {
    submitAssessment('asmt-1', 76, 32);
    showToast('Assessment submitted successfully!');
    onFinishTest();
  };

  const answeredCount = Object.keys(answers).length;
  const notVisitedCount = totalQuestions - answeredCount;

  return (
    <div
      onCopy={handleCopyPaste}
      onCut={handleCopyPaste}
      className="min-h-screen bg-[#f4f6fb] text-[#1c2333] select-none font-sans antialiased flex flex-col justify-between"
    >
      {/* Top Header matching 12-take-assessment */}
      <header className="bg-white border-b border-[#e6e9f2] px-6 py-4 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#1c2333]">
              Cyclone Track mid-term
            </h1>
            <p className="text-xs text-[#5b6478] mt-0.5">
              Secure mode · Question {currentQIndex + 1} of {totalQuestions}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Countdown Timer */}
            <div className="px-3.5 py-1.5 rounded-full bg-[#fff1e0] text-[#b45309] font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-amber-200 shadow-2xs">
              <Clock className="w-4 h-4 text-[#b45309]" />
              <span>{formatTimer(secondsLeft)} left</span>
            </div>

            {/* Language dropdown */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                className="h-9 px-3 rounded-xl bg-white border border-[#e6e9f2] text-xs font-semibold text-[#1c2333] flex items-center gap-1"
              >
                <span>English</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab switch warning alert */}
      {tabSwitchWarnings > 0 && (
        <div className="bg-[#fde8ea] border-b border-[#b91c1c]/20 px-6 py-2.5 text-xs text-[#b91c1c] font-semibold flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>
            Notice: {tabSwitchWarnings} tab focus switch(es) recorded. Examination session is audited.
          </span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Question Card (2 cols) matching 12-take-assessment */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[11px] font-bold tracking-wider text-[#5b6478] uppercase block">
                QUESTION {currentQIndex + 1}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1c2333] leading-snug">
                {currentQ.prompt}
              </h2>

              {/* Radio Options */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = answers[currentQIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-3.5 cursor-pointer border ${
                        isSelected
                          ? 'border-[#1f5eff] bg-[#e8efff]/30 text-[#1c2333] shadow-xs'
                          : 'border-[#e6e9f2] hover:border-slate-300 text-slate-800 bg-white'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[#1f5eff] bg-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#1f5eff]" />
                        )}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={toggleFlag}
                className={`h-10 px-4 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                  flagged[currentQIndex]
                    ? 'border-amber-400 bg-amber-50 text-amber-700'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flagged[currentQIndex] ? 'Flagged' : 'Flag for review'}</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  disabled={currentQIndex === 0}
                  onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                  className="h-10 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={currentQIndex === totalQuestions - 1}
                  onClick={() =>
                    setCurrentQIndex((prev) => Math.min(totalQuestions - 1, prev + 1))
                  }
                  className="h-10 px-5 rounded-xl bg-[#1f5eff] hover:bg-blue-600 disabled:opacity-40 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Right Question Navigator Card matching 12-take-assessment */}
          <div className="p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[#1c2333]">
                Question navigator
              </h3>
            </div>

            {/* 1 to 20 Grid (4 columns x 5 rows) */}
            <div className="grid grid-cols-5 gap-2.5">
              {Array.from({ length: totalQuestions }, (_, i) => {
                const isAnswered = answers[i] !== undefined;
                const isCurrent = i === currentQIndex;
                const isFlagged = flagged[i];

                let btnStyle =
                  'bg-white border border-[#e6e9f2] text-slate-700 hover:border-slate-300';

                if (isCurrent) {
                  btnStyle = 'bg-[#1f5eff] text-white font-bold shadow-xs border-blue-600';
                } else if (isAnswered) {
                  btnStyle = 'bg-[#e7f7ee] text-[#15803d] font-bold border-emerald-200';
                }

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentQIndex(i)}
                    className={`h-10 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer relative ${btnStyle}`}
                  >
                    <span>{i + 1}</span>
                    {isFlagged && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Summary Legend */}
            <div className="text-[11px] text-[#5b6478] pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Answered {answeredCount}</span>
              <span>·</span>
              <span>Current 1</span>
              <span>·</span>
              <span>Not visited {notVisitedCount}</span>
            </div>

            {/* Submit test button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(true)}
                className="w-full py-3 bg-[#1f5eff] hover:bg-blue-600 text-white rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
              >
                Submit test
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#1c2333]">
              Submit examination?
            </h3>
            <p className="text-xs text-[#5b6478] mt-2 leading-relaxed">
              You have answered <strong className="text-slate-900">{answeredCount} of {totalQuestions}</strong> questions. Once submitted, your score will be computed and your attempt recorded.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Keep reviewing
              </button>
              <button
                type="button"
                onClick={handleSubmitTest}
                className="px-5 py-2 rounded-xl bg-[#1f5eff] hover:bg-blue-600 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Confirm & submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
