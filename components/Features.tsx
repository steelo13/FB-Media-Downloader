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
        <div key={i} className="glass p-10 rounded-[2.5rem] border-white dark:border-white/10 shadow-2xl hover:scale-[1.05] transition-all duration-300 group">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-4xl mb-8 shadow-md border border-slate-100 dark:border-slate-700 group-hover:rotate-6 transition-transform">
            {f.icon}
          </div>
          <h3 className="font-black text-black dark:text-white text-xl mb-4 tracking-tight">{f.title}</h3>
          <p className="text-slate-800 dark:text-slate-200 font-bold text-[15px] leading-relaxed opacity-95">{f.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default Features;