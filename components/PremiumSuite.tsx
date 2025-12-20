
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { PremiumTool } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TOOLS: PremiumTool[] = [
  {
    id: 'timeline',
    title: 'Campaign Timeline Planner',
    description: 'Create a multi-week content schedule for your next big product or event launch.',
    icon: '📅',
    category: 'analytics',
    promptTemplate: 'Generate a 4-week Facebook campaign timeline for: ',
    inputPlaceholder: 'e.g. Launching a new eco-friendly skincare line'
  },
  {
    id: 'finder',
    title: 'Top Content Finder',
    description: 'Identify trends and content types that are currently getting high engagement in your niche.',
    icon: '🚀',
    category: 'analytics',
    promptTemplate: 'Analyze and suggest top-performing Facebook content strategies for this niche: ',
    inputPlaceholder: 'e.g. High-performance gaming PCs'
  },
  {
    id: 'audience',
    title: 'Audience Demographics',
    description: 'Predict likely target segments and interests based on your product or page topic.',
    icon: '📊',
    category: 'analytics',
    promptTemplate: 'Predict audience demographics and interests for a Facebook page focused on: ',
    inputPlaceholder: 'e.g. Urban organic gardening for beginners'
  },
  {
    id: 'toxic',
    title: 'Toxic Comment Detector',
    description: 'Scan comments for toxicity, harassment, or hidden bullying patterns.',
    icon: '☢️',
    category: 'moderation',
    promptTemplate: 'Analyze this comment for toxicity and provide a risk score (0-100%): ',
    inputPlaceholder: 'Paste a suspicious comment here...'
  },
  {
    id: 'sentiment',
    title: 'Sentiment Analyzer',
    description: 'Batch-analyze community feelings towards your latest post or announcement.',
    icon: '🎭',
    category: 'moderation',
    promptTemplate: 'Determine the emotional sentiment (Positive, Neutral, Negative) and key emotions in this text: ',
    inputPlaceholder: 'Paste post comments or feedback here...'
  },
  {
    id: 'spam',
    title: 'Spam & Bot Detector',
    description: 'Detect common bot patterns, phishing links, and repetitive spam accounts.',
    icon: '🤖',
    category: 'moderation',
    promptTemplate: 'Identify spam markers or bot-like behavior in this content: ',
    inputPlaceholder: 'Paste suspicious text or links...'
  },
  {
    id: 'violation',
    title: 'Group Rule Checker',
    description: 'Instantly check if a post violates standard Facebook Group rules or community standards.',
    icon: '⚖️',
    category: 'moderation',
    promptTemplate: 'Check if this post violates typical FB Community Standards or Group rules: ',
    inputPlaceholder: 'Paste the post content to check...'
  },
  {
    id: 'caption',
    title: 'Viral Caption Writer',
    description: 'Craft high-engagement captions designed specifically for the Facebook algorithm.',
    icon: '✍️',
    category: 'content',
    promptTemplate: 'Write 3 viral Facebook captions for: ',
    inputPlaceholder: 'e.g. A sunset photo at the Grand Canyon'
  },
  {
    id: 'optimizer',
    title: 'Emoji & Hashtag Pro',
    description: 'The perfect balance of visual breaks and searchable tags for maximum reach.',
    icon: '✨',
    category: 'content',
    promptTemplate: 'Suggest the perfect emojis and 5 strategic hashtags for this caption: ',
    inputPlaceholder: 'Paste your draft caption here...'
  },
  {
    id: 'hook',
    title: 'Facebook Hook Gen',
    description: 'Generate the crucial first two lines that stop the scroll.',
    icon: '🪝',
    category: 'content',
    promptTemplate: 'Generate 5 scroll-stopping 2-line hooks for a Facebook post about: ',
    inputPlaceholder: 'e.g. Why most small businesses fail in year one'
  },
  {
    id: 'story',
    title: 'Story Script Creator',
    description: 'Plan out a 3-part Facebook Story (Hook, Value, CTA) in seconds.',
    icon: '🤳',
    category: 'content',
    promptTemplate: 'Create a 3-part Facebook Story script for: ',
    inputPlaceholder: 'e.g. Sharing a "Day in the Life" as a freelance coder'
  },
  {
    id: 'improver',
    title: 'Caption Improver',
    description: 'Rewrite bland captions into punchy, clear, and engaging Facebook posts.',
    icon: '🪄',
    category: 'content',
    promptTemplate: 'Rewrite this caption to be more engaging and readable for Facebook: ',
    inputPlaceholder: 'Paste your "boring" caption here...'
  }
];

const PremiumSuite: React.FC = () => {
  const [activeTool, setActiveTool] = useState<PremiumTool | null>(null);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const runTool = async () => {
    if (!activeTool || !input.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: activeTool.promptTemplate + input,
      });
      setResult(response.text || 'No response generated.');
    } catch (err) {
      setResult('Error processing request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-slate-900 mb-4">Premium <span className="text-[#1877F2]">Creator Suite</span></h2>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">Advanced AI tools designed specifically for Facebook page managers and content creators.</p>
      </div>

      {activeTool ? (
        <div className="max-w-4xl mx-auto glass rounded-[3rem] p-8 md:p-12 border-white/60 shadow-2xl shadow-blue-100/40">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-slate-50">
                {activeTool.icon}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">{activeTool.title}</h3>
                <span className="text-xs font-bold text-[#1877F2] uppercase tracking-widest">{activeTool.category}</span>
              </div>
            </div>
            <button 
              onClick={() => { setActiveTool(null); setResult(''); setInput(''); }}
              className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <textarea
              className="w-full h-32 p-6 bg-white/50 border-2 border-slate-100 rounded-3xl focus:border-[#1877F2] focus:ring-0 outline-none transition-all text-lg font-medium resize-none placeholder:text-slate-300"
              placeholder={activeTool.inputPlaceholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={runTool}
              disabled={loading || !input.trim()}
              className="w-full h-16 glossy-button text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 shine-effect disabled:opacity-50"
            >
              {loading ? (
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate with AI
                </>
              )}
            </button>

            {result && (
              <div className="mt-8 p-8 bg-white/80 rounded-[2rem] border border-blue-50 shadow-inner animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">AI Analysis Result</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="text-xs font-bold text-[#1877F2] hover:underline"
                  >
                    Copy to clipboard
                  </button>
                </div>
                <div className="prose prose-slate max-w-none">
                  {result.split('\n').map((line, i) => (
                    <p key={i} className="text-slate-700 font-medium whitespace-pre-wrap leading-relaxed mb-2">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <div 
              key={tool.id}
              onClick={() => setActiveTool(tool)}
              className="glass p-8 rounded-[2.5rem] border-white/60 shadow-xl shadow-slate-100/30 hover:scale-[1.03] transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm border border-slate-50 group-hover:scale-110 transition-transform">
                  {tool.icon}
                </div>
                <h3 className="font-extrabold text-slate-900 text-xl mb-3">{tool.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4">{tool.description}</p>
              </div>
              <div className="flex items-center justify-between mt-6">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{tool.category}</span>
                <span className="text-[#1877F2] font-bold text-sm group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Try Tool 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PremiumSuite;
