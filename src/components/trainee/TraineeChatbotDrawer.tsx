import React, { useState } from 'react';
import { useTraineeData } from '../../context/TraineeDataContext';
import { TraineeTab } from '../../types';
import { Sparkles, X, Send, BookOpen, Clock, Target, ArrowRight } from 'lucide-react';

interface TraineeChatbotDrawerProps {
  onSelectTab: (tab: TraineeTab) => void;
  showToast: (msg: string) => void;
}

export const TraineeChatbotDrawer: React.FC<TraineeChatbotDrawerProps> = ({
  onSelectTab,
  showToast,
}) => {
  const { isChatbotOpen, setIsChatbotOpen, chatMessages, sendChatMessage } = useTraineeData();
  const [inputText, setInputText] = useState('');

  if (!isChatbotOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText.trim());
    setInputText('');
  };

  const handleChipClick = (prompt: string) => {
    sendChatMessage(prompt);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 lg:hidden"
        onClick={() => setIsChatbotOpen(false)}
      />

      <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Ask Assistant
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e7f7ee] text-[#15803d]">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Answers about your learning
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsChatbotOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-[#1f5eff] text-white rounded-tr-xs'
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Links or due items */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-2.5 space-y-1.5">
                      {msg.links.map((link, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-slate-800"
                        >
                          <span className="font-semibold">{link.title}</span>
                          <span className="font-bold text-slate-900">{link.date}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Action Button */}
                  {msg.quickAction && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTab('course-player');
                        setIsChatbotOpen(false);
                        showToast('Resuming Cyclone Track Analysis');
                      }}
                      className="mt-2.5 w-full py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 rounded-xl font-semibold text-xs flex items-center justify-between transition-colors shadow-2xs"
                    >
                      <span>{msg.quickAction.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Preset Recommendation Chips */}
          <div className="pt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleChipClick('Show my learning progress')}
              className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-500 bg-white text-slate-700 hover:text-blue-600 text-xs font-medium transition-colors cursor-pointer"
            >
              My progress
            </button>
            <button
              type="button"
              onClick={() => handleChipClick('What are my recommended courses?')}
              className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-500 bg-white text-slate-700 hover:text-blue-600 text-xs font-medium transition-colors cursor-pointer"
            >
              Recommended courses
            </button>
            <button
              type="button"
              onClick={() => handleChipClick('Which mentor can help with radar analysis?')}
              className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-blue-500 bg-white text-slate-700 hover:text-blue-600 text-xs font-medium transition-colors cursor-pointer"
            >
              Find a mentor
            </button>
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 text-xs sm:text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 bg-[#1f5eff] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
