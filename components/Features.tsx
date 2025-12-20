
import React from 'react';

const Features: React.FC = () => {
  const features = [
    { title: '4K Resolution', desc: 'Preserve every detail with extraction of original HD and 4K media quality.', icon: '💎' },
    { title: 'AI Optimized', desc: 'Intelligent link parsing that understands context to find the best available source.', icon: '🧠' },
    { title: 'Privacy First', desc: 'Secure encryption with zero logging of your search history or downloads.', icon: '🔒' },
    { title: 'Batch Saving', desc: 'Download entire carousels or multiple video resolutions in one click.', icon: '📁' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-24">
      {features.map((f, i) => (
        <div key={i} className="glass p-8 rounded-[2rem] border-white/60 dark:border-white/10 shadow-xl shadow-slate-100/50 dark:shadow-none hover:scale-[1.03] transition-all duration-300 group">
          <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm border border-slate-50 dark:border-slate-700 group-hover:rotate-6 transition-transform">
            {f.icon}
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-lg mb-3">{f.title}</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default Features;
