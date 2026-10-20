import React from 'react';
import { Screen } from '../types';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate }) => {
  return (
    <header className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-8 sm:pt-10 flex items-center justify-between">
      <div 
        onClick={() => onNavigate('login')}
        className="flex items-center gap-3 font-bold text-[17px] tracking-tight text-slate-900 cursor-pointer select-none"
      >
        <span className="flex aspect-square h-[40px] w-[40px] items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xs shrink-0">
          <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        </span>
        <span>Capacity Connect</span>
      </div>

      {currentScreen === 'signup' && (
        <div className="text-sm text-slate-500 font-normal">
          Have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="text-blue-600 hover:text-blue-700 font-medium focus:outline-hidden hover:underline transition-colors"
          >
            Sign in
          </button>
        </div>
      )}
    </header>
  );
};
