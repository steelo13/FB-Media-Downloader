
import React from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, darkMode, toggleDarkMode }) => {
  return (
    <nav className="glass sticky top-4 z-50 mx-4 mt-4 rounded-2xl shadow-sm overflow-hidden border-white/60 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setView('downloader')}
          >
            <div className="w-10 h-10 glossy-button rounded-xl flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight dark:text-white">
              Swift FB <span className="text-[#1877F2]">Downloader</span>
            </span>
          </div>
          <div className="flex items-center gap-4 md:gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button 
              onClick={() => setView('downloader')}
              className={`hidden md:block hover:text-[#1877F2] transition-colors ${currentView === 'downloader' ? 'text-[#1877F2]' : ''}`}
            >
              Downloader
            </button>
            
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            <button 
              onClick={() => setView('premium')}
              className={`bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-lg shadow-slate-200 dark:shadow-none active:scale-95 flex items-center gap-2 ${currentView === 'premium' ? 'ring-2 ring-[#1877F2] ring-offset-2 dark:ring-offset-slate-900' : ''}`}
            >
              <span className="text-amber-400">★</span>
              <span className="hidden sm:inline">Creator Suite</span>
              <span className="sm:hidden">Suite</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
