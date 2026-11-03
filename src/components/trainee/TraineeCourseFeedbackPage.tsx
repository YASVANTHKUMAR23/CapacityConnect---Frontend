import React, { useState } from 'react';
import { useTraineeData } from '../../context/TraineeDataContext';
import { TraineeTab } from '../../types';
import { Star, ArrowLeft, Check, Sparkles } from 'lucide-react';

interface TraineeCourseFeedbackPageProps {
  onSelectTab: (tab: TraineeTab) => void;
  showToast: (msg: string) => void;
}

export const TraineeCourseFeedbackPage: React.FC<TraineeCourseFeedbackPageProps> = ({
  onSelectTab,
  showToast,
}) => {
  const { submitCourseFeedback } = useTraineeData();

  const [overallRating, setOverallRating] = useState(4);
  const [contentClarity, setContentClarity] = useState(5);
  const [trainerDelivery, setTrainerDelivery] = useState(4);
  const [resourceQuality, setResourceQuality] = useState(4);
  const [paceOfCourse, setPaceOfCourse] = useState(3);
  const [comments, setComments] = useState(
    'Case studies were very helpful. Module 4 felt rushed and more practice questions would help.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCourseFeedback(
      'course-4',
      overallRating,
      {
        contentClarity,
        trainerDelivery,
        resourceQuality,
        paceOfCourse,
      },
      comments
    );
    showToast('Feedback submitted to Dr. Ravi Menon. Thank you!');
    onSelectTab('my-courses');
  };

  const renderStarRow = (
    value: number,
    onChange: (val: number) => void
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 focus:outline-hidden transition-transform hover:scale-110 cursor-pointer"
          >
            <Star
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                star <= value
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <button
          type="button"
          onClick={() => onSelectTab('my-courses')}
          className="text-xs font-semibold text-[#1f5eff] hover:underline flex items-center gap-1 mb-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to courses</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2333] tracking-tight">
          Course feedback
        </h1>
        <p className="text-xs sm:text-sm text-[#5b6478] mt-0.5">
          Monsoon Onset Review · Dr. Ravi Menon
        </p>
      </div>

      {/* Two Column Layout matching 10-course-feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form Card (2 cols) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 p-6 sm:p-8 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs space-y-6"
        >
          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-bold text-[#1c2333] mb-2">
              Your rating
            </label>
            {renderStarRow(overallRating, setOverallRating)}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            {/* Content clarity */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs sm:text-sm font-medium text-[#1c2333]">
                Content clarity
              </span>
              {renderStarRow(contentClarity, setContentClarity)}
            </div>

            {/* Trainer delivery */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs sm:text-sm font-medium text-[#1c2333]">
                Trainer delivery
              </span>
              {renderStarRow(trainerDelivery, setTrainerDelivery)}
            </div>

            {/* Resource quality */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs sm:text-sm font-medium text-[#1c2333]">
                Resource quality
              </span>
              {renderStarRow(resourceQuality, setResourceQuality)}
            </div>

            {/* Pace of the course */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs sm:text-sm font-medium text-[#1c2333]">
                Pace of the course
              </span>
              {renderStarRow(paceOfCourse, setPaceOfCourse)}
            </div>
          </div>

          {/* Comments Textarea */}
          <div className="border-t border-slate-100 pt-4">
            <label className="block text-sm font-bold text-[#1c2333] mb-2">
              Comments
            </label>
            <textarea
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-[#1c2333] focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1f5eff] hover:bg-blue-600 text-white rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
            >
              Submit feedback
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('my-courses')}
              className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Right Info Card: Why it matters */}
        <div>
          <div className="p-6 rounded-[14px] bg-white border border-[#e6e9f2] shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-[#1c2333]">
              Why it matters
            </h3>
            <p className="text-xs font-semibold text-[#5b6478]">
              Your feedback goes to the trainer
            </p>
            <p className="text-xs text-[#5b6478] leading-relaxed">
              Trainers see an AI summary of all feedback to improve how courses are delivered. Your comment is shared without your name.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
