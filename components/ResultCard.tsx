
import React from 'react';
import { ExtractionResult, MediaType } from '../types';

interface ResultCardProps {
  result: ExtractionResult;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  const handleDownloadAll = () => {
    console.log('Triggering batch download for all options:', result.options);
    alert(`Starting premium download for all ${result.options.length} media files...`);
  };

  const showDownloadAll = result.options.length > 1;

  return (
    <div className="w-full max-w-5xl mx-auto mt-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="glass rounded-[3rem] shadow-2xl overflow-hidden border-white/60 shadow-blue-100/30">
        <div className="flex flex-col lg:flex-row">
          {/* Preview Section */}
          <div className="lg:w-1/2 relative bg-slate-100 aspect-video lg:aspect-auto overflow-hidden">
            <img 
              src={result.thumbnail} 
              alt={result.title} 
              className="w-full h-full object-cover scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              {result.type === MediaType.VIDEO || result.type === MediaType.REEL ? (
                <div className="w-20 h-20 bg-white/25 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/40 cursor-pointer hover:scale-110 transition-transform shadow-2xl">
                  <svg className="w-10 h-10 text-white fill-current drop-shadow-lg" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              ) : null}
            </div>

            <div className="absolute top-6 left-6">
              <span className="px-4 py-2 bg-white/30 backdrop-blur-md text-white text-xs font-black rounded-xl uppercase tracking-widest border border-white/20">
                {result.type}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md overflow-hidden border border-white/30">
                  <img src={`https://picsum.photos/seed/${result.author}/100`} alt="" />
                </div>
                <span className="font-bold text-sm drop-shadow-md">{result.author}</span>
              </div>
            </div>
          </div>

          {/* Details & Downloads */}
          <div className="lg:w-1/2 p-10 flex flex-col justify-between bg-white/40">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2">
                    {result.title}
                  </h2>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">
                    "{result.description}"
                  </p>
                </div>
                <button 
                  onClick={onReset}
                  className="p-2 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Extraction Options</h4>
                  {showDownloadAll && (
                    <button 
                      onClick={handleDownloadAll}
                      className="text-xs font-bold text-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center gap-2 px-4 py-2 bg-blue-50/50 rounded-xl border border-blue-100 transition-all active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Save All
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {result.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-white rounded-[1.5rem] border border-slate-100 hover:border-blue-200 transition-all hover:shadow-xl hover:shadow-blue-100/30 group">
                      <div>
                        <div className="font-black text-slate-900 text-lg group-hover:text-[#1877F2] transition-colors">{opt.quality}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{opt.format} • {opt.size || 'Auto Size'}</div>
                      </div>
                      <button className="glossy-button text-white px-7 py-3 rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Get File
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 rounded-2xl bg-blue-50/50 border border-blue-100/50">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center leading-relaxed">
                Premium extraction complete. Files are ready for high-speed download.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
