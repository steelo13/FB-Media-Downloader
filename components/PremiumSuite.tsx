
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
    promptTemplate: 'Generate a highly structured 4-week Facebook campaign timeline. Use clear week-by-week headers, bullet points for daily tasks, and bold text for key milestones for: ',
    inputPlaceholder: 'e.g. Launching a new eco-friendly skincare line'
  },
  {
    id: 'finder',
    title: 'Top Content Finder',
    description: 'Identify trends and content types that are currently getting high engagement in your niche.',
    icon: '🚀',
    category: 'analytics',
    promptTemplate: 'Provide a structured report on top-performing Facebook content strategies. Categorize by "Content Types", "Trending Topics", and "Engagement Hooks". Use bullet points for each category for the niche: ',
    inputPlaceholder: 'e.g. High-performance gaming PCs'
  },
  {
    id: 'audience',
    title: 'Audience Demographics',
    description: 'Predict likely target segments and interests based on your product or page topic.',
    icon: '📊',
    category: 'analytics',
    promptTemplate: 'Analyze and list predicted audience segments. Use headers for "Primary Demographics", "Key Interests", and "Behavioral Traits". Ensure each point is clearly separated for: ',
    inputPlaceholder: 'e.g. Urban organic gardening for beginners'
  },
  {
    id: 'besttime',
    title: 'Best Time to Post Analyzer',
    description: 'Data-driven suggestions for when your specific audience is most active and likely to engage.',
    icon: '⏰',
    category: 'analytics',
    promptTemplate: 'Analyze the best posting times for Facebook. Break it down by "Peak Engagement Hours", "Best Days of the Week", and "Optimal Frequency" for this niche: ',
    inputPlaceholder: 'e.g. Professional B2B software consulting'
  },
  {
    id: 'toxic',
    title: 'Toxic Comment Detector',
    description: 'Scan comments for toxicity, harassment, or hidden bullying patterns.',
    icon: '☢️',
    category: 'moderation',
    promptTemplate: 'Analyze the following comment for toxicity. Provide a "Toxicity Score (0-100%)", "Risk Category", and "Recommended Action" in a clear, labeled format: ',
    inputPlaceholder: 'Paste a suspicious comment here...'
  },
  {
    id: 'sentiment',
    title: 'Sentiment Analyzer',
    description: 'Batch-analyze community feelings towards your latest post or announcement.',
    icon: '🎭',
    category: 'moderation',
    promptTemplate: 'Break down the sentiment of the following feedback. Provide a "General Sentiment" header, followed by a list of "Key Emotional Drivers" and "Common Feedback Themes": ',
    inputPlaceholder: 'Paste post comments or feedback here...'
  },
  {
    id: 'spam',
    title: 'Spam & Bot Detector',
    description: 'Detect common bot patterns, phishing links, and repetitive spam accounts.',
    icon: '🤖',
    category: 'moderation',
    promptTemplate: 'Evaluate the text for bot activity. Use headers like "Spam Probability", "Identified Patterns", and "Safety Warning" for: ',
    inputPlaceholder: 'Paste suspicious text or links...'
  },
  {
    id: 'violation',
    title: 'Group Rule Checker',
    description: 'Instantly check if a post violates standard Facebook Group rules or community standards.',
    icon: '⚖️',
    category: 'moderation',
    promptTemplate: 'Verify this content against community standards. List "Potential Violations", "Standard Rule References", and a "Final Verdict" in clear sections for: ',
    inputPlaceholder: 'Paste the post content to check...'
  },
  {
    id: 'caption',
    title: 'Viral Caption Writer',
    description: 'Craft high-engagement captions designed specifically for the Facebook algorithm.',
    icon: '✍️',
    category: 'content',
    promptTemplate: 'Generate 3 distinct viral Facebook captions. Label them "Option 1: Engagement Focused", "Option 2: Value Driven", and "Option 3: Short & Punchy". Use clear spacing between options for: ',
    inputPlaceholder: 'e.g. A sunset photo at the Grand Canyon'
  },
  {
    id: 'optimizer',
    title: 'Emoji & Hashtag Pro',
    description: 'The perfect balance of visual breaks and searchable tags for maximum reach.',
    icon: '✨',
    category: 'content',
    promptTemplate: 'Analyze this caption and provide two separate lists: "Recommended Emojis" and "Strategic Hashtags". Group hashtags by reach (Broad, Niche, Trending) for: ',
    inputPlaceholder: 'Paste your draft caption here...'
  },
  {
    id: 'hook',
    title: 'Facebook Hook Gen',
    description: 'Generate the crucial first two lines that stop the scroll.',
    icon: '🪝',
    category: 'content',
    promptTemplate: 'Generate 5 high-converting 2-line hooks. Number them 1-5 and provide a brief "Why it works" note for each hook related to: ',
    inputPlaceholder: 'e.g. Why most small businesses fail in year one'
  },
  {
    id: 'story',
    title: 'Story Script Creator',
    description: 'Plan out a 3-part Facebook Story (Hook, Value, CTA) in seconds.',
    icon: '🤳',
    category: 'content',
    promptTemplate: 'Script a 3-part Facebook Story. Use clear headers for "Frame 1 (The Hook)", "Frame 2 (The Meat)", and "Frame 3 (The CTA)". Include visual suggestions for each for: ',
    inputPlaceholder: 'e.g. Sharing a "Day in the Life" as a freelance coder'
  },
  {
    id: 'improver',
    title: 'Image Caption Improver',
    description: 'Rewrite bland captions into punchy, clear, and engaging Facebook posts for your photos.',
    icon: '🖼️',
    category: 'content',
    promptTemplate: 'Improve this photo caption. Provide 3 variations: "The Storyteller", "The Provocative Question", and "The Quick Insight". Highlight the specific emotion target for each: ',
    inputPlaceholder: 'Paste your basic photo description or draft caption here...'
  },
  {
    id: 'reposter',
    title: 'Repost Content Rewriter',
    description: 'Breathe new life into old content by rewriting it with a fresh angle and tone.',
    icon: '🔄',
    category: 'content',
    promptTemplate: 'Rewrite the following post to sound fresh and new. Provide 2 versions: "Professional/Informative" and "Relatable/Casual". Ensure the core value is preserved: ',
    inputPlaceholder: 'Paste an old post you want to reuse...'
  },
  {
    id: 'meme',
    title: 'Facebook Meme Generator',
    description: 'Generate funny, relatable, and high-shareability captions for your meme images.',
    icon: '🤡',
    category: 'content',
    promptTemplate: 'Generate 5 funny and relatable meme captions for the following context or image description. Use popular Facebook meme formats if applicable: ',
    inputPlaceholder: 'e.g. A cat looking stressed at a computer'
  },
  {
    id: 'scheduler',
    title: 'Facebook Post Scheduler',
    description: 'Organize your post ideas into a strategic batching sequence for consistent reach.',
    icon: '🕙',
    category: 'analytics',
    promptTemplate: 'Create a strategic posting sequence for these ideas. Suggest "Optimal Order", "Interval Timing", and "Cross-Promotion Tips" in a structured list for: ',
    inputPlaceholder: 'List 3-5 post ideas or topics...'
  },
  {
    id: 'calendar',
    title: 'Weekly Calendar Builder',
    description: 'Build a full 7-day mix of content types to keep your page active and varied.',
    icon: '🗓️',
    category: 'analytics',
    promptTemplate: 'Build a 7-day Facebook content calendar. For each day, list "Post Type", "Topic Suggestion", and "Primary Goal". Use bold headers for each day: ',
    inputPlaceholder: 'e.g. Fitness coaching for busy moms'
  }
];

const StructuredResultRenderer: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  
  return (
    <div className="space-y-6">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-4" />;

        const isHeader = trimmed.endsWith(':') || trimmed.startsWith('##') || /^[A-Z\s]{4,}$/.test(trimmed) || trimmed.startsWith('Day ') || trimmed.startsWith('Option ');
        const isListItem = trimmed.startsWith('-') || trimmed.startsWith('•') || /^\d+[\.\)]/.test(trimmed);

        if (isHeader) {
          return (
            <h4 key={index} className="text-xl font-black text-slate-900 dark:text-white mt-10 mb-4 border-l-4 border-[#1877F2] pl-4 bg-slate-50 dark:bg-slate-800/50 py-2 rounded-r-lg">
              {trimmed.replace(/^#+\s*/, '')}
            </h4>
          );
        }

        if (isListItem) {
          return (
            <div key={index} className="flex gap-4 pl-4 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-50 dark:border-slate-700 shadow-sm">
              <span className="text-[#1877F2] dark:text-blue-400 font-black mt-0.5">→</span>
              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed flex-1">
                {renderBoldText(trimmed.replace(/^[-•]\s*/, '').replace(/^\d+[\.\)]\s*/, ''))}
              </p>
            </div>
          );
        }

        return (
          <p key={index} className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed px-2">
            {renderBoldText(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

const renderBoldText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-extrabold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

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
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Premium <span className="text-[#1877F2]">Creator Suite</span></h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">Advanced AI tools designed specifically for Facebook page managers and content creators.</p>
      </div>

      {activeTool ? (
        <div className="max-w-4xl mx-auto glass rounded-[3rem] p-8 md:p-12 border-white/60 dark:border-white/10 shadow-2xl shadow-blue-100/40 dark:shadow-none">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-slate-50 dark:border-slate-700">
                {activeTool.icon}
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{activeTool.title}</h3>
                <span className="text-xs font-bold text-[#1877F2] dark:text-blue-400 uppercase tracking-widest">{activeTool.category}</span>
              </div>
            </div>
            <button 
              onClick={() => { setActiveTool(null); setResult(''); setInput(''); }}
              className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-slate-400 dark:text-slate-500 transition-all hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <textarea
                className="w-full h-32 p-6 bg-white/50 dark:bg-slate-800/40 border-2 border-slate-100 dark:border-slate-700 rounded-3xl focus:border-[#1877F2] focus:ring-0 outline-none transition-all text-lg font-medium resize-none placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-white group-hover:border-slate-200 dark:group-hover:border-slate-600 shadow-sm"
                placeholder={activeTool.inputPlaceholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                AI Ready
              </div>
            </div>
            
            <button
              onClick={runTool}
              disabled={loading || !input.trim()}
              className="w-full h-16 glossy-button text-white font-bold text-lg rounded-2xl flex items-center justify-center gap-3 shine-effect disabled:opacity-50 shadow-lg shadow-blue-100 dark:shadow-blue-900 active:scale-95"
            >
              {loading ? (
                <div className="flex gap-1.5 items-center">
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  <span className="ml-2">Crafting Strategy...</span>
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Professional Report
                </>
              )}
            </button>

            {result && (
              <div className="mt-10 animate-in slide-in-from-top-6 duration-700">
                <div className="p-1 glass bg-white/40 dark:bg-slate-900/40 rounded-[2.8rem] border-white dark:border-white/10 overflow-hidden shadow-2xl">
                   <div className="bg-white/95 dark:bg-slate-900/95 p-8 md:p-14 rounded-[2.6rem] shadow-inner">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        <div>
                          <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] block">Report Generated</span>
                          <span className="text-[10px] text-slate-300 dark:text-slate-600 font-bold uppercase tracking-wider">Analysis complete • Gemini Intelligence</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(result);
                        }}
                        className="flex items-center gap-2 text-xs font-bold text-[#1877F2] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-5 py-2.5 rounded-xl transition-all active:scale-95 border border-blue-50 dark:border-blue-900/50 group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        Copy Report
                      </button>
                    </div>
                    
                    <StructuredResultRenderer text={result} />
                    
                    <div className="mt-16 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-center">
                       <p className="text-[10px] text-slate-300 dark:text-slate-600 font-black uppercase tracking-[0.3em]">
                         End of Content Intelligence Report
                       </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TOOLS.map((tool) => (
            <div 
              key={tool.id}
              onClick={() => setActiveTool(tool)}
              className="glass p-10 rounded-[2.8rem] border-white/60 dark:border-white/10 shadow-xl shadow-slate-100/30 dark:shadow-none hover:scale-[1.03] transition-all duration-300 group cursor-pointer flex flex-col justify-between hover:shadow-blue-100/50 dark:hover:bg-slate-800/60"
            >
              <div>
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-4xl mb-8 shadow-sm border border-slate-50 dark:border-slate-700 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  {tool.icon}
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-2xl mb-4 group-hover:text-[#1877F2] dark:group-hover:text-blue-400 transition-colors">{tool.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-base leading-relaxed mb-4">{tool.description}</p>
              </div>
              <div className="flex items-center justify-between mt-8">
                <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">{tool.category}</span>
                <span className="glossy-button text-white w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
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
