
import React from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <nav className="glass sticky top-4 z-50 mx-4 mt-4 rounded-2xl shadow-sm overflow-hidden">
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
            <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600">
              FB Media <span className="text-[#1877F2]">Downloader</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button 
              onClick={() => setView('downloader')}
              className={`hover:text-[#1877F2] transition-colors ${currentView === 'downloader' ? 'text-[#1877F2]' : ''}`}
            >
              Downloader
            </button>
            <button 
              onClick={() => setView('premium')}
              className={`bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center gap-2 ${currentView === 'premium' ? 'ring-2 ring-[#1877F2] ring-offset-2' : ''}`}
            >
              <span className="text-amber-400">★</span>
              Creator Suite
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
