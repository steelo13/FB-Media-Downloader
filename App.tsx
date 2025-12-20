
import React, { useState, useCallback, useRef } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);

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
              <div className="inline-block px-4 py-1.5 bg-blue-50 text-[#1877F2] text-xs font-bold rounded-full uppercase tracking-widest border border-blue-100 mb-2">
                AI-Powered Extraction
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Save Any Facebook <br />
                <span className="text-[#1877F2] text-glow">Media Instantly</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                Experience the next generation of content saving. Fast, secure, and high-definition downloads with zero intrusive ads.
              </p>
            </div>

            <div className="max-w-3xl mx-auto relative">
              {clipboardSuggestion && !url && !isDragging && (
                <div className="absolute -top-14 right-0 z-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <button
                    onClick={handlePasteSuggestion}
                    className="glass flex items-center gap-2 text-[#1877F2] px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-white transition-all shadow-xl shadow-blue-100/50 border-blue-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Paste from clipboard?
                  </button>
                </div>
              )}

              <div className={`absolute inset-0 -m-6 rounded-[2.5rem] border-4 border-dashed transition-all duration-500 pointer-events-none flex items-center justify-center z-30 ${isDragging ? 'border-[#1877F2] bg-blue-50/80 opacity-100 scale-100 backdrop-blur-md' : 'border-transparent opacity-0 scale-95'}`}>
                <div className="text-center">
                  <div className="w-20 h-20 glossy-button rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-blue-300 animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <p className="text-2xl font-black text-slate-900">Release to analyze</p>
                  <p className="text-slate-500 font-medium mt-2">Extracting your media in high quality...</p>
                </div>
              </div>

              <form onSubmit={handleExtract} className="relative z-10 flex flex-col md:flex-row gap-4 p-2 glass rounded-3xl shadow-2xl shadow-slate-200/50">
                <div className="flex-grow relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Paste or drag Facebook link here..."
                    className={`w-full h-16 pl-14 pr-6 bg-transparent rounded-2xl text-lg font-medium focus:outline-none transition-all placeholder:text-slate-400`}
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
                  className="h-16 px-10 glossy-button text-white font-bold text-lg rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shine-effect"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : 'Download'}
                </button>
              </form>
              
              {error && !isDragging && (
                <div className="absolute -bottom-10 left-6 text-red-500 text-sm font-bold animate-in fade-in slide-in-from-top-2 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
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
                <div className="mt-28 glass rounded-[3rem] p-12 text-center border-white/60 shadow-xl shadow-slate-100/50">
                  <h2 className="text-3xl font-black text-slate-900 mb-8">What You Can Download</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { name: 'Videos (SD / HD)', icon: '📹' },
                      { name: 'Reels', icon: '⚡' },
                      { name: 'Images from posts', icon: '📸' },
                      { name: 'Public stories', icon: '🕒' }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white/50 p-6 rounded-[2rem] border border-white shadow-sm flex flex-col items-center gap-3 group hover:bg-white transition-all duration-300">
                        <span className="text-4xl group-hover:scale-125 transition-transform duration-300">{item.icon}</span>
                        <span className="text-slate-800 font-bold text-sm">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Creator Suite CTA Section */}
                <div className="mt-28 relative overflow-hidden glass rounded-[3rem] p-8 md:p-14 border-white/60 shadow-2xl shadow-blue-50/50 group">
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl group-hover:bg-blue-200/40 transition-colors"></div>
                  <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex-1 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-6 border border-amber-200">
                        <span>★</span>
                        New Tools Available
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
                        Go Beyond Downloading with <span className="text-[#1877F2]">Creator Suite</span>
                      </h2>
                      <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-xl">
                        Unlock over 15+ AI-powered professional tools. From viral caption generators to toxic comment detectors, we have everything to scale your Facebook presence.
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button 
                        onClick={() => setView('premium')}
                        className="glossy-button px-10 py-5 rounded-2xl text-white font-black text-lg shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                      >
                        Explore Creator Suite
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-28 glass rounded-[2.5rem] p-12 text-center border-white/40 shadow-xl shadow-slate-100/50">
                  <h2 className="text-3xl font-black text-slate-900 mb-6">Unrivaled Compatibility</h2>
                  <div className="flex flex-wrap justify-center gap-4 text-sm font-bold">
                    {['Public Reels', 'HD Video Clips', 'Watch Tab', 'Individual Photos', 'Carousel Posts', 'Stories'].map((type) => (
                      <span key={type} className="px-6 py-3 bg-white/50 rounded-2xl text-slate-700 border border-white shadow-sm flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
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
                <div className="w-full max-w-4xl glass rounded-[3rem] p-12 animate-pulse border-white/60">
                  <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-1/2 aspect-video bg-slate-200/50 rounded-3xl"></div>
                    <div className="lg:w-1/2 space-y-6">
                      <div className="h-10 bg-slate-200/50 rounded-xl w-3/4"></div>
                      <div className="h-4 bg-slate-200/50 rounded-xl w-1/2"></div>
                      <div className="space-y-4 mt-10">
                        <div className="h-16 bg-slate-100/50 rounded-2xl"></div>
                        <div className="h-16 bg-slate-100/50 rounded-2xl"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-10 flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#1877F2] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-[#1877F2] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-[#1877F2] rounded-full animate-bounce"></div>
                  </div>
                  <p className="text-slate-500 font-bold text-sm tracking-wide uppercase">AI analysis in progress</p>
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
      className="min-h-screen pb-20"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <Navbar currentView={view} setView={setView} />

      <main className="max-w-6xl mx-auto px-4 py-16 md:py-28">
        {renderContent()}

        <footer className="mt-40 pt-16 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 glossy-button rounded-xl flex items-center justify-center text-white">
                <span className="font-bold text-xl">F</span>
              </div>
              <span className="font-extrabold text-slate-900 text-xl tracking-tighter">FB Media <span className="text-[#1877F2]">Downloader</span></span>
            </div>
            <div className="flex gap-10 text-sm font-bold text-slate-400">
              <button onClick={() => setView('downloader')} className="hover:text-[#1877F2] transition-colors">Downloader</button>
              <button onClick={() => setView('premium')} className="hover:text-[#1877F2] transition-colors">Premium Suite</button>
              <button onClick={() => setView('privacy')} className="hover:text-[#1877F2] transition-colors">Privacy Policy</button>
              <button onClick={() => setView('terms')} className="hover:text-[#1877F2] transition-colors">Terms of Service</button>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2025 Premium Downloader Inc.</p>
          </div>
          <div className="mt-16 p-10 glass rounded-[2.5rem] text-center text-xs text-slate-400 border border-white leading-relaxed">
            <strong className="text-slate-600">Disclaimer:</strong> This tool is intended for personal archiving of public content. We do not host, store, or redistribute any data. All media remains the intellectual property of its respective creators and is streamed directly from source CDN.
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
