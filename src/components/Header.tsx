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
        className="font-bold text-[17px] tracking-tight text-slate-900 cursor-pointer select-none"
      >
        Capacity Connect
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
