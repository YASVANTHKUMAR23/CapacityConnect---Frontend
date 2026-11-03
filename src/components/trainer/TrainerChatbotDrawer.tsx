import React, { useState, useRef, useEffect } from 'react';
import { useTrainerData } from '../../context/TrainerDataContext';
import { Sparkles, X, Send, Bot, User, ArrowRight, BellRing, ExternalLink } from 'lucide-react';
import { TrainerTab } from '../../types';

interface TrainerChatbotDrawerProps {
  onSelectTab: (tab: TrainerTab) => void;
  showToast: (msg: string) => void;
}

export const TrainerChatbotDrawer: React.FC<TrainerChatbotDrawerProps> = ({
  onSelectTab,
  showToast,
}) => {
  const { isChatbotOpen, setIsChatbotOpen, chatMessages, sendChatMessage, setSelectedTraineeId } = useTrainerData();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChatbotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatbotOpen]);

  if (!isChatbotOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText);
    setInputText('');
  };

  const handleQuickPrompt = (prompt: string) => {
    sendChatMessage(prompt);
  };

  const handleActionClick = (actionKey: string) => {
    if (actionKey === 'VIEW_LOW_SCORERS') {
      onSelectTab('trainees');
      setIsChatbotOpen(false);
      showToast('Switched to Trainees list filtered for intervention.');
    } else if (actionKey === 'REMIND_ALL_3') {
      onSelectTab('trainees');
      setIsChatbotOpen(false);
      showToast('Reminder dialog opened for Rohit Sharma, Priya Das, and Amit Patel.');
    } else if (actionKey === 'VIEW_ROHIT') {
      setSelectedTraineeId('tr-1');
      onSelectTab('trainees');
      setIsChatbotOpen(false);
    } else if (actionKey === 'SUMMARIZE_FEEDBACK') {
      onSelectTab('feedback');
      setIsChatbotOpen(false);
    } else if (actionKey === 'UPCOMING_DEADLINES') {
      onSelectTab('assessments');
      setIsChatbotOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsChatbotOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6">
        <aside
          aria-label="Capacity Assistant Panel"
          className="w-screen max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-250 ease-out"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-slate-900">Capacity Assistant</h2>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Trainer Copilot
                  </span>
                </div>
                <p className="text-xs text-slate-500">Ask about courses, student progress & deadlines</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsChatbotOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg cursor-pointer transition-colors"
              aria-label="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick context pills */}
          <div className="px-4 py-2.5 bg-slate-100/60 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
            <span className="text-slate-500 font-medium whitespace-nowrap text-[11px]">Suggested:</span>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Which trainees are behind on Cyclone Track?')}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 whitespace-nowrap text-[11px] font-medium cursor-pointer shadow-2xs transition-colors shrink-0"
            >
              Low scorers
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Summarize this week’s feedback ratings')}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 whitespace-nowrap text-[11px] font-medium cursor-pointer shadow-2xs transition-colors shrink-0"
            >
              Feedback summary
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('Show upcoming assessment deadlines')}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 whitespace-nowrap text-[11px] font-medium cursor-pointer shadow-2xs transition-colors shrink-0"
            >
              Upcoming deadlines
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-sm ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs sm:text-[13px] leading-relaxed font-normal">
                    {msg.text}
                  </p>
                  <div
                    className={`text-[10px] mt-1.5 ${
                      msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>

                  {/* Actions buttons inside message */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-wrap gap-1.5">
                      {msg.actions.map((act) => (
                        <button
                          key={act.actionKey}
                          type="button"
                          onClick={() => handleActionClick(act.actionKey)}
                          className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold">
                    RM
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-200 bg-white">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about trainees, courses, or question banks..."
                className="w-full pl-3.5 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="absolute right-1.5 p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-lg cursor-pointer transition-colors"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-center">
              Capacity Assistant draws context from Dr. Ravi Menon's assigned courses and assessments.
            </p>
          </form>
        </aside>
      </div>
    </div>
  );
};
