
import React, { useState } from 'react';
import { ExtractionResult, MediaType } from '../types';

interface ResultCardProps {
  result: ExtractionResult;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleDownloadAll = () => {
    console.log('Triggering batch download for all options:', result.options);
    alert(`Starting premium download for all ${result.options.length} media files...`);
  };

  const handleShare = async () => {
    const shareData = {
      title: result.title,
      text: `Check out this ${result.type.toLowerCase()} from ${result.author}: ${result.description}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text + " " + shareData.url);
        alert('Share link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const isImage = result.type === MediaType.IMAGE;
  const isVideo = result.type === MediaType.VIDEO || result.type === MediaType.REEL;
  const showDownloadAll = result.options.length > 1;

  const placeholderVideo = "https://cdn.pixabay.com/vimeo/328940142/landscape-22836.mp4?width=1280&hash=07f45c7e0c8b6a3867d79b6997d9e7943f211993";

  return (
    <div className={`w-full mx-auto mt-16 animate-in fade-in slide-in-from-bottom-8 duration-700 transition-all duration-500 ${isPreviewExpanded ? 'max-w-6xl' : 'max-w-5xl'}`}>
      <div className="glass rounded-[3rem] shadow-2xl overflow-hidden border-white/60 dark:border-white/10 shadow-blue-100/30 dark:shadow-none">
        <div className={`flex flex-col ${isPreviewExpanded ? 'lg:flex-col' : 'lg:flex-row'}`}>
          {/* Preview Section */}
          <div className={`relative bg-slate-900 transition-all duration-500 overflow-hidden ${isPreviewExpanded ? 'h-[70vh]' : 'lg:w-1/2 aspect-video lg:aspect-auto'}`}>
            
            <div 
              className="absolute inset-0 scale-110 blur-2xl opacity-50 transition-opacity duration-1000"
              style={{ 
                backgroundImage: `url(${result.thumbnail})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover'
              }}
            />

            {!isPlaying ? (
              <img 
                src={result.thumbnail} 
                alt={result.title} 
                className={`relative w-full h-full transition-all duration-700 ${!isPreviewExpanded ? 'object-cover hover:scale-105' : 'object-contain'}`}
              />
            ) : (
              <video 
                src={placeholderVideo} 
                className="relative w-full h-full object-contain bg-black"
                controls
                autoPlay
                onEnded={() => setIsPlaying(false)}
              />
            )}
            
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none transition-opacity ${isPlaying ? 'opacity-0' : 'opacity-100'}`}></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              {!isPlaying && isVideo && (
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="w-24 h-24 bg-white/20 backdrop-blur-3xl rounded-full flex items-center justify-center border border-white/40 shadow-2xl hover:scale-110 active:scale-90 transition-all group z-20"
                >
                  <svg className="w-12 h-12 text-white fill-current drop-shadow-lg group-hover:text-[#1877F2] transition-colors" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </button>
              )}
            </div>

            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-30">
              <span className="px-4 py-2 bg-white/30 backdrop-blur-md text-white text-xs font-black rounded-xl uppercase tracking-widest border border-white/20">
                {result.type}
              </span>
              
              <div className="flex gap-2">
                {isPlaying && (
                  <button 
                    onClick={() => setIsPlaying(false)}
                    className="p-3 bg-red-500/20 backdrop-blur-xl hover:bg-red-500/40 text-white rounded-2xl border border-red-500/30 transition-all active:scale-95 shadow-xl"
                    title="Close Video"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                
                <button 
                  onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                  className="p-3 bg-white/20 backdrop-blur-xl hover:bg-white/40 text-white rounded-2xl border border-white/30 transition-all active:scale-95 shadow-xl"
                  title={isPreviewExpanded ? "Theater Mode: Off" : "Theater Mode: On"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                </button>
              </div>
            </div>

            <div className={`absolute bottom-6 left-6 right-6 text-white z-10 transition-opacity ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md overflow-hidden border border-white/30">
                  <img src={`https://picsum.photos/seed/${result.author}/100`} alt="" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm drop-shadow-md">{result.author}</span>
                  {isPreviewExpanded && <span className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Premium Content Analysis</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Details & Downloads */}
          <div className={`${isPreviewExpanded ? 'w-full' : 'lg:w-1/2'} p-10 flex flex-col justify-between bg-white/40 dark:bg-slate-900/40 transition-all duration-500`}>
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 mr-4">
                  <h2 className={`font-black text-slate-900 dark:text-white leading-tight mb-2 transition-all ${isPreviewExpanded ? 'text-4xl' : 'text-3xl'}`}>
                    {result.title}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed max-w-2xl">
                    "{result.description}"
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleShare}
                    title="Share media"
                    className="p-3 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-2xl text-slate-600 dark:text-slate-300 hover:text-[#1877F2] dark:hover:text-blue-400 transition-all border border-slate-100 dark:border-slate-700 shadow-sm group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                  <button 
                    onClick={onReset}
                    className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-100 dark:border-slate-700 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Extraction Options</h4>
                  {showDownloadAll && (
                    <button 
                      onClick={handleDownloadAll}
                      className="text-xs font-bold text-[#1877F2] dark:text-blue-400 hover:bg-[#1877F2] hover:text-white flex items-center gap-2 px-4 py-2 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900 transition-all active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Save All
                    </button>
                  )}
                </div>

                <div className={`grid gap-4 ${isPreviewExpanded ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {result.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-900 transition-all hover:shadow-xl hover:shadow-blue-100/30 dark:hover:shadow-none group">
                      <div>
                        <div className="font-black text-slate-900 dark:text-white text-lg group-hover:text-[#1877F2] dark:group-hover:text-blue-400 transition-colors">{opt.quality}</div>
                        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{opt.format} • {opt.size || 'Auto Size'}</div>
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

            <div className="mt-10 p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/30">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-center leading-relaxed">
                Premium extraction complete. AI detected {result.type.toLowerCase()} format and prepared high-bitrate output.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
