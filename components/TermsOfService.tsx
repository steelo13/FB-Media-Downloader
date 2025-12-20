
import React from 'react';

const TermsOfService: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
        <h1 className="text-4xl font-black text-slate-900 mb-8">Terms of <span className="text-[#1877F2]">Service</span></h1>
        
        <div className="space-y-8 text-slate-600 leading-relaxed font-medium">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using FB Media Downloader, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Permitted Use</h2>
            <p>Our service is intended for personal, non-commercial use only. You agree to use this tool only for archiving public content where you have the legal right to do so. You are solely responsible for complying with Facebook's terms of service and copyright laws.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Intellectual Property</h2>
            <p>We do not own the content you download. All rights, title, and interest in the media remain with the original creators or copyright holders. Our service is a tool for facilitating downloads, not a platform for content distribution.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Disclaimer of Warranties</h2>
            <p>The service is provided "as is" and "as available" without any warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, FB Media Downloader shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.</p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100 text-center">
          <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Last Updated: March 2025</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
