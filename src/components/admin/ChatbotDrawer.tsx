import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  Plus,
  Send,
  SendHorizontal,
  Download,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { AdminTab } from '../../types';

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: AdminTab) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text?: string;
  type?: 'text' | 'course-card' | 'trainee-card';
}

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  if (!isOpen) return null;

  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'user',
      text: 'Which courses have the lowest completion rate this month?',
    },
    {
      id: 'm-2',
      sender: 'bot',
      type: 'course-card',
    },
    {
      id: 'm-3',
      sender: 'user',
      text: 'Yes, show the list.',
    },
    {
      id: 'm-4',
      sender: 'bot',
      type: 'trainee-card',
    },
  ]);

  const [toastNote, setToastNote] = useState<string | null>(null);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputVal.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    setTimeout(() => {
      let botResponse: ChatMessage;
      const lower = query.toLowerCase();

      if (lower.includes('approval') || lower.includes('pending')) {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: 'There are currently 4 pending accounts waiting for review: Kiran Joshi (Bengaluru), Sana Ahmed (Hyderabad), Vikram Patel (Ahmedabad), and Rhea Menon (Kochi). Would you like to review them in Role Management?',
        };
      } else if (lower.includes('competency') || lower.includes('gap')) {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: 'The largest skill gaps are in Cyclone tracking (49% capacity, 2 matched trainers for 214 trainees) and Remote sensing (54% capacity).',
        };
      } else if (lower.includes('trainer') || lower.includes('top')) {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: 'Top active trainers by enrollment: Dr. Anita Rao (356 trainees, 6 courses) and Prof. Sunil Das (298 trainees, 3 courses).',
        };
      } else {
        botResponse = {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: `Analyzing live IMD database for "${query}"... Average course completion is at 68% across all 36 active modules, with 1,096 active trainees.`,
        };
      }

      setMessages((prev) => [...prev, botResponse]);
    }, 400);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-200">
      {/* Toast inside drawer */}
      {toastNote && (
        <div className="absolute top-16 left-4 right-4 z-50 bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-lg flex items-center justify-between">
          <span>{toastNote}</span>
          <button onClick={() => setToastNote(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Capacity assistant
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Online · Admin analytics</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setMessages([
                {
                  id: 'init-1',
                  sender: 'bot',
                  text: 'Hello! I can answer questions on IMD courses, trainee progress, competency gaps, and approvals.',
                },
              ]);
            }}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
            title="New conversation"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
            title="Close assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Context filters bar */}
      <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px] font-medium text-slate-600 select-none">
        <span className="text-slate-400 font-normal">Context</span>
        <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
          Courses
        </span>
        <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
          Last 30 days
        </span>
        <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
          All divisions
        </span>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center">
          <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
            Today, 09:41
          </span>
        </div>

        {messages.map((m) => {
          if (m.sender === 'user') {
            return (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[85%] bg-blue-600 text-white rounded-2xl rounded-tr-xs p-3.5 text-xs font-medium leading-relaxed shadow-xs">
                  {m.text}
                </div>
              </div>
            );
          }

          // Bot text message
          if (m.text) {
            return (
              <div key={m.id} className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="max-w-[88%] bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-xs p-3.5 text-xs text-slate-800 leading-relaxed shadow-xs">
                  {m.text}
                </div>
              </div>
            );
          }

          // Course card response
          if (m.type === 'course-card') {
            return (
              <div key={m.id} className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="max-w-[90%] space-y-2">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-xs p-3.5 text-xs text-slate-800 space-y-3 shadow-xs">
                    <p className="font-medium text-slate-900">
                      Three active courses are below 50% completion.
                    </p>

                    <div className="space-y-2 pt-1 border-t border-slate-200/60">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                            1
                          </span>
                          <span className="font-semibold text-slate-900">
                            Cyclone Track Analysis
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-rose-500 w-[38%]" />
                          </div>
                          <span className="font-bold text-slate-800 tabular-nums">38%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                            2
                          </span>
                          <span className="font-semibold text-slate-900">
                            Radar Data Quality
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 w-[44%]" />
                          </div>
                          <span className="font-bold text-slate-800 tabular-nums">44%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                            3
                          </span>
                          <span className="font-semibold text-slate-900">
                            Numerical Weather Models
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 w-[47%]" />
                          </div>
                          <span className="font-bold text-slate-800 tabular-nums">47%</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed pt-1">
                      Most learners drop off after module 3. Want the trainees who have not started the final assessment?
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          // Trainee list card
          if (m.type === 'trainee-card') {
            return (
              <div key={m.id} className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="max-w-[90%] space-y-2.5">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-xs p-3.5 text-xs text-slate-800 space-y-3 shadow-xs">
                    <p className="font-medium text-slate-900">
                      Found <span className="font-bold text-slate-950">46 trainees</span>, 28 of them in the Eastern region.
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setToastNote('Assessment reminder emails dispatched to 46 trainees.');
                        }}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl font-medium text-xs transition-colors cursor-pointer"
                      >
                        <SendHorizontal className="w-3 h-3" />
                        <span>Send reminder</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setToastNote('Exporting 46 trainee records as CSV...');
                        }}
                        className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl font-medium text-xs transition-colors cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Export list</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Suggested quick chips */}
      <div className="px-4 py-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => handleSend('Show competency gaps')}
          className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
        >
          Competency gaps
        </button>
        <button
          type="button"
          onClick={() => handleSend('Pending approvals')}
          className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
        >
          Pending approvals
        </button>
        <button
          type="button"
          onClick={() => handleSend('Top trainers')}
          className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
        >
          Top trainers
        </button>
      </div>

      {/* Input box */}
      <div className="p-4 bg-white border-t border-slate-200/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <button
            type="button"
            className="absolute left-3 text-slate-400 hover:text-slate-600"
            title="Attach data filter"
          >
            <Plus className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask about courses, trainees, analytics..."
            className="w-full pl-9 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
          />

          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="absolute right-1.5 w-7 h-7 rounded-full bg-blue-600 disabled:opacity-40 hover:bg-blue-700 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <p className="text-[10px] text-slate-400 text-center mt-2">
          Answers use live portal data. Check important figures before sharing.
        </p>
      </div>
    </div>
  );
};
