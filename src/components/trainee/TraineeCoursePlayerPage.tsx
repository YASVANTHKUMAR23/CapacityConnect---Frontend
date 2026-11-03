import React, { useState } from 'react';
import { useTraineeData } from '../../context/TraineeDataContext';
import { TraineeTab } from '../../types';
import {
  Play,
  CheckCircle2,
  FileText,
  Presentation,
  HelpCircle,
  ChevronDown,
  Download,
  Share2,
  ArrowLeft,
  Volume2,
  Maximize2,
  Pause,
} from 'lucide-react';

interface TraineeCoursePlayerPageProps {
  onSelectTab: (tab: TraineeTab) => void;
  showToast: (msg: string) => void;
}

export const TraineeCoursePlayerPage: React.FC<TraineeCoursePlayerPageProps> = ({
  onSelectTab,
  showToast,
}) => {
  const { updateCourseProgress } = useTraineeData();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState(3);
  const [playerLanguage, setPlayerLanguage] = useState<'English' | 'Hindi'>('English');
  const [isCompleted, setIsCompleted] = useState(false);

  const modules = [
    { id: 1, title: 'Introduction to cyclone genesis', type: 'Video', completed: true },
    { id: 2, title: 'Satellite imagery interpretation', type: 'PPT', completed: true },
    { id: 3, title: 'Track forecasting methods', type: 'Video', completed: isCompleted },
    { id: 4, title: 'Intensity estimation', type: 'PDF', completed: false },
    { id: 5, title: 'Final assessment', type: 'Quiz', completed: false },
  ];

  const handleMarkComplete = () => {
    setIsCompleted(true);
    updateCourseProgress('course-1', 60, 'M4 · Intensity estimation');
    showToast('Module 3 marked as complete! Progress updated to 60%.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={() => onSelectTab('my-courses')}
            className="text-xs font-semibold text-[#1f5eff] hover:underline flex items-center gap-1 mb-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My courses</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2333] tracking-tight">
            Cyclone Track Analysis
          </h1>
          <p className="text-xs sm:text-sm text-[#5b6478] mt-0.5">
            Module 3 · Track forecasting methods
          </p>
        </div>
      </div>

      {/* Main Player & Modules Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Area: Video Player & Controls (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Big Dark Video Player Container matching 09-course-player */}
          <div className="relative w-full aspect-video rounded-2xl bg-[#090d16] flex items-center justify-center overflow-hidden shadow-md border border-slate-800 group">
            {/* Simulation of operational weather radar/satellite backdrop */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1f5eff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Play/Pause Button in Center (Matches bright blue circle in mockup!) */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1f5eff] hover:bg-blue-600 active:scale-95 text-white flex items-center justify-center shadow-2xl transition-all cursor-pointer z-10"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-white" />
              ) : (
                <Play className="w-8 h-8 fill-white ml-1" />
              )}
            </button>

            {/* In-player HUD simulation */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-black/60 text-white text-[11px] font-mono border border-white/10">
                IMD-DWR-HQ · REC 1080p
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-white/80 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px]">
                  {isPlaying ? '08:42 / 24:10' : '00:00 / 24:10'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 cursor-pointer hover:text-white" />
                <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white" />
              </div>
            </div>
          </div>

          {/* Module Information & Action Controls Card */}
          <div className="p-5 sm:p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#1c2333]">
                Track forecasting methods
              </h2>
              <p className="text-xs text-[#5b6478] mt-1">
                Dr. Ravi Menon · 24 min · Resources:{' '}
                <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                  slides.pptx
                </span>
                ,{' '}
                <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                  handbook.pdf
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Language Selector */}
              <div className="relative">
                <select
                  value={playerLanguage}
                  onChange={(e) => setPlayerLanguage(e.target.value as any)}
                  className="appearance-none h-10 px-3.5 pr-8 bg-white border border-[#e6e9f2] rounded-xl text-xs font-semibold text-[#1c2333] cursor-pointer shadow-2xs"
                >
                  <option value="English">Language: English</option>
                  <option value="Hindi">Language: Hindi</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Mark Complete Button */}
              <button
                type="button"
                onClick={handleMarkComplete}
                className={`h-10 px-5 rounded-xl font-semibold text-xs transition-all shadow-xs cursor-pointer ${
                  isCompleted
                    ? 'bg-[#e7f7ee] text-[#15803d] border border-emerald-300'
                    : 'bg-[#1f5eff] hover:bg-blue-600 text-white'
                }`}
              >
                {isCompleted ? 'Completed ✓' : 'Mark complete'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Modules List */}
        <div className="space-y-4">
          <div className="p-5 sm:p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#1c2333]">Modules</h3>
              <p className="text-xs text-[#5b6478] mt-0.5">
                {isCompleted ? '3' : '2'} of 5 completed
              </p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2.5">
                <div
                  className="bg-[#1f5eff] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: isCompleted ? '60%' : '38%' }}
                />
              </div>
            </div>

            {/* List of modules */}
            <div className="space-y-2 pt-1">
              {modules.map((m) => {
                const isActive = m.id === currentModuleId;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setCurrentModuleId(m.id);
                      showToast(`Switched to Module ${m.id}: ${m.title}`);
                    }}
                    className={`p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isActive
                        ? 'border-[#1f5eff] bg-blue-50/40 shadow-2xs'
                        : 'border-[#e6e9f2] hover:bg-slate-50'
                    }`}
                  >
                    {/* Status Icon or number */}
                    <div className="mt-0.5 shrink-0">
                      {m.completed ? (
                        <div className="w-5 h-5 rounded-full bg-[#e7f7ee] text-[#15803d] flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : isActive ? (
                        <div className="w-5 h-5 rounded-full bg-[#1f5eff] text-white text-[11px] font-bold flex items-center justify-center">
                          {m.id}
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 text-slate-500 text-[11px] font-medium flex items-center justify-center">
                          {m.id}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-bold leading-snug ${
                          isActive ? 'text-[#1f5eff]' : 'text-[#1c2333]'
                        }`}
                      >
                        {m.title}
                      </p>
                      <span className="text-[10px] text-[#5b6478]">{m.type}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Give feedback button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onSelectTab('course-feedback')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-[#1c2333] transition-colors cursor-pointer text-center"
              >
                Give feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
