import React, { useState, useCallback, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import Features from './components/Features';
import ResultCard from './components/ResultCard';
import PremiumSuite from './components/PremiumSuite';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import { ExtractionResult, ViewState } from './types';
import { analyzeLink } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('downloader');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [clipboardSuggestion, setClipboardSuggestion] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  const handleExtract = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = url.trim();
    if (!cleanUrl || !cleanUrl.includes('facebook.com') && !cleanUrl.includes('fb.watch')) {
      setError('Please enter a valid Facebook URL.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setClipboardSuggestion(null);

    try {
      const { mockResult } = await analyzeLink(cleanUrl);
      // Simulate extraction time
      await new Promise(r => setTimeout(r, 1500));
      setResult(mockResult);
      setUrl('');
      setClipboardSuggestion(null);
    } catch (err: any) {
      setError('Failed to extract media. Make sure the post is public.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  const checkClipboard = async () => {
    if (url.trim() !== '') return;
    try {
      const text = await navigator.clipboard.readText();
      if (text && (text.includes('facebook.com') || text.includes('fb.watch')) && text !== url) {
        setClipboardSuggestion(text);
      } else {
        setClipboardSuggestion(null);
      }
    } catch (err) {
      console.debug('Clipboard access denied or unavailable');
      setClipboardSuggestion(null);
    }
  };

  const handlePasteSuggestion = () => {
    if (clipboardSuggestion) {
      setUrl(clipboardSuggestion);
      setClipboardSuggestion(null);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedText = e.dataTransfer.getData('text') || e.dataTransfer.getData('text/uri-list');
    if (droppedText) {
      setUrl(droppedText);
      setError(null);
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const reset = () => {
    setResult(null);
    setUrl('');
    setError(null);
    setClipboardSuggestion(null);
  };

  const renderContent = () => {
    switch (view) {
      case 'premium':
        return <PremiumSuite />;
      case 'privacy':
        return <PrivacyPolicy onBack={() => setView('downloader')} />;
      case 'terms':
        return <TermsOfService onBack={() => setView('downloader')} />;
      case 'downloader':
      default:
        return (
          <>
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
              <div className="inline-block px-5 py-2 bg-blue-100 dark:bg-[#1877F2]/30 text-[#0052cc] dark:text-blue-300 text-[13px] font-black rounded-full uppercase tracking-widest border border-blue-200 dark:border-blue-700/50 mb-2">
                AI-Powered Extraction
              </div>
              <h1 className="text-5xl md:text-7xl font-[900] text-black dark:text-white tracking-tight leading-[1.05]">
                Save Any Facebook <br />
                <span className="text-[#1877F2] text-glow">Media Instantly</span>
              </h1>
              <p className="text-xl text-slate-800 dark:text-slate-100 font-semibold leading-relaxed max-w-2xl mx-auto opacity-90">
                Experience the next generation of content saving. Fast, secure, and high-definition downloads with zero intrusive ads.
              </p>
            </div>

            <div className="max-w-3xl mx-auto relative">
              {clipboardSuggestion && !url && !isDragging && (
                <div className="absolute -top-14 right-0 z-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <button
                    onClick={handlePasteSuggestion}
                    className="glass flex items-center gap-2 text-[#1877F2] dark:text-blue-300 px-6 py-3 rounded-2xl text-sm font-black hover:bg-white dark:hover:bg-slate-800 transition-all shadow-xl shadow-blue-200/50 dark:shadow-none border-blue-200 dark:border-blue-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Paste from clipboard
                  </button>
                </div>
              )}

              <div className={`absolute inset-0 -m-6 rounded-[2.5rem] border-4 border-dashed transition-all duration-500 pointer-events-none flex items-center justify-center z-30 ${isDragging ? 'border-[#1877F2] bg-blue-50/90 dark:bg-blue-900/80 opacity-100 scale-100 backdrop-blur-md' : 'border-transparent opacity-0 scale-95'}`}>
                <div className="text-center">
                  <div className="w-20 h-20 glossy-button rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-blue-300 dark:shadow-blue-900 animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <p className="text-3xl font-black text-black dark:text-white">Release to analyze</p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold mt-2">Extracting your media in high quality...</p>
                </div>
              </div>

              <form onSubmit={handleExtract} className="relative z-10 flex flex-col md:flex-row gap-4 p-3 glass rounded-[2rem] shadow-2xl shadow-slate-300/50 dark:shadow-black/70">
                <div className="flex-grow relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-slate-700 dark:text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Paste or drag Facebook link here..."
                    className={`w-full h-16 pl-14 pr-6 bg-transparent rounded-2xl text-xl font-bold focus:outline-none transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400 text-black dark:text-white`}
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (e.target.value) setClipboardSuggestion(null);
                    }}
                    onFocus={checkClipboard}
                  />
                </div>
                <button
                  disabled={loading}
                  type="submit"
                  className="h-16 px-12 glossy-button text-white font-black text-xl rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shine-effect shadow-xl"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-7 w-7 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Searching...
                    </>
                  ) : 'Extract Media'}
                </button>
              </form>
              
              {error && !isDragging && (
                <div className="absolute -bottom-12 left-6 text-red-600 dark:text-red-400 text-[15px] font-black animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
            </div>

            {!result && !loading && (
              <div className="animate-in fade-in duration-1000">
                <Features />
                
                {/* Supported Media Types Section */}
                <div className="mt-28 glass rounded-[3rem] p-14 text-center border-white/80 dark:border-white/20 shadow-2xl">
                  <h2 className="text-4xl font-[900] text-black dark:text-white mb-10 tracking-tight">What You Can Download</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                      { name: 'Videos (SD / HD)', icon: '📹' },
                      { name: 'Reels', icon: '⚡' },
                      { name: 'Images from posts', icon: '📸' },
                      { name: 'Public stories', icon: '🕒' }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white/80 dark:bg-slate-800/60 p-8 rounded-[2.5rem] border border-white dark:border-white/10 shadow-lg flex flex-col items-center gap-4 group hover:bg-white dark:hover:bg-slate-800 transition-all duration-300">
                        <span className="text-5xl group-hover:scale-125 transition-transform duration-300 filter drop-shadow-md">{item.icon}</span>
                        <span className="text-slate-950 dark:text-white font-black text-base">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Creator Suite CTA Section */}
                <div className="mt-28 relative overflow-hidden glass rounded-[3.5rem] p-10 md:p-16 border-white dark:border-white/20 shadow-2xl group">
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-400/30 transition-colors"></div>
                  <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex-1 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 text-[11px] font-black uppercase tracking-[0.2em] rounded-full mb-8 border border-amber-300 dark:border-amber-700/50 shadow-sm">
                        <span>★</span>
                        New Tools Available
                      </div>
                      <h2 className="text-4xl md:text-5xl font-[900] text-black dark:text-white mb-8 leading-[1.1] tracking-tight">
                        Professional <span className="text-[#1877F2]">Creator Suite</span>
                      </h2>
                      <p className="text-slate-800 dark:text-slate-100 font-bold text-xl leading-relaxed max-w-xl opacity-90">
                        Unlock 15+ AI-powered professional tools. From viral caption generators to sentiment analysis, scale your social presence effortlessly.
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button 
                        onClick={() => setView('premium')}
                        className="glossy-button px-12 py-6 rounded-2xl text-white font-black text-xl shadow-2xl shadow-blue-300/50 dark:shadow-blue-900/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                      >
                        Launch Creator Suite
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-28 glass rounded-[3rem] p-14 text-center border-white/80 dark:border-white/20 shadow-xl">
                  <h2 className="text-4xl font-[900] text-black dark:text-white mb-8 tracking-tight">Unrivaled Compatibility</h2>
                  <div className="flex flex-wrap justify-center gap-5 text-base font-black">
                    {['Public Reels', 'HD Video Clips', 'Watch Tab', 'Individual Photos', 'Carousel Posts', 'Stories'].map((type) => (
                      <span key={type} className="px-8 py-4 bg-white dark:bg-slate-800/80 rounded-[1.5rem] text-slate-900 dark:text-white border border-white dark:border-white/10 shadow-md flex items-center gap-3 hover:scale-105 transition-transform">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="mt-20 flex flex-col items-center">
                <div className="w-full max-w-4xl glass rounded-[3rem] p-14 animate-pulse border-white dark:border-white/10">
                  <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-1/2 aspect-video bg-slate-300/50 dark:bg-slate-700/50 rounded-3xl"></div>
                    <div className="lg:w-1/2 space-y-6">
                      <div className="h-12 bg-slate-300/50 dark:bg-slate-700/50 rounded-xl w-3/4"></div>
                      <div className="h-6 bg-slate-300/50 dark:bg-slate-700/50 rounded-xl w-1/2"></div>
                      <div className="space-y-4 mt-10">
                        <div className="h-16 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl"></div>
                        <div className="h-16 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-12 flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-[#1877F2] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-3 h-3 bg-[#1877F2] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-3 h-3 bg-[#1877F2] rounded-full animate-bounce"></div>
                  </div>
                  <p className="text-[#1877F2] dark:text-blue-400 font-black text-lg tracking-widest uppercase">AI analysis active</p>
                </div>
              </div>
            )}

            {result && (
              <ResultCard result={result} onReset={reset} />
            )}
          </>
        );
    }
  };

  return (
    <div 
      className="min-h-screen pb-24 transition-colors duration-500"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <Navbar currentView={view} setView={setView} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />

      <main className="max-w-6xl mx-auto px-4 py-16 md:py-28">
        {renderContent()}

        <footer className="mt-40 pt-16 border-t-2 border-slate-300/30 dark:border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 glossy-button rounded-xl flex items-center justify-center text-white shadow-lg">
                <span className="font-black text-2xl">F</span>
              </div>
              <span className="font-[900] text-black dark:text-white text-2xl tracking-tighter">FB Media <span className="text-[#1877F2]">Downloader</span></span>
            </div>
            <div className="flex gap-12 text-[15px] font-black text-slate-700 dark:text-slate-300">
              <button onClick={() => setView('downloader')} className="hover:text-[#1877F2] transition-colors">Downloader</button>
              <button onClick={() => setView('premium')} className="hover:text-[#1877F2] transition-colors">Premium Suite</button>
              <button onClick={() => setView('privacy')} className="hover:text-[#1877F2] transition-colors">Privacy</button>
              <button onClick={() => setView('terms')} className="hover:text-[#1877F2] transition-colors">Terms</button>
            </div>
            <p className="text-[11px] font-[900] text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em]">© 2025 Premium Extractor</p>
          </div>
          <div className="mt-16 p-12 glass rounded-[3rem] text-center text-[13px] text-slate-700 dark:text-slate-300 border-2 border-white dark:border-white/10 leading-relaxed shadow-xl">
            <strong className="text-black dark:text-white font-black uppercase tracking-widest block mb-4">Legal Disclaimer</strong> This tool is intended for personal archiving of publicly shared social media content. We do not host, store, or redistribute any data. All media remains the property of its respective creators and copyright holders. Use this tool responsibly and in accordance with relevant laws and platform policies.
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;