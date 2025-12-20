
import React from 'react';

const PrivacyPolicy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-slate-500 font-bold hover:text-[#1877F2] transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Home
      </button>

      <div className="glass rounded-[3rem] p-10 md:p-16 border-white/60 shadow-2xl">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Privacy <span className="text-[#1877F2]">Policy</span></h1>
        
        <div className="space-y-8 text-slate-600 leading-relaxed font-medium">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Information We Collect</h2>
            <p>We only collect the minimum amount of data necessary to provide our services. This includes the public Facebook URLs you paste into our downloader and basic device information such as browser type and language to optimize the user interface.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. How We Use Information</h2>
            <p>The URLs provided are processed through our AI-powered analysis engine to identify the best quality media source. This information is processed in real-time and is not stored permanently on our servers after your session ends.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Data Security</h2>
            <p>We implement industry-standard security measures to protect your information. All data transmitted between your browser and our service is encrypted using SSL (Secure Sockets Layer) technology.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Cookies</h2>
            <p>We use small text files called cookies to improve your browsing experience and remember your preferences. You can disable cookies in your browser settings, though some features of our site may not function correctly.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Third-Party Links</h2>
            <p>Our service interacts with Facebook's CDN to provide media downloads. We are not responsible for the privacy practices or content of third-party websites including Facebook itself.</p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 text-center">
          <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Last Updated: March 2025</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
