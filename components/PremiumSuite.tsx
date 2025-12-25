
import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { PremiumTool } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TOOLS: PremiumTool[] = [
  // --- EXISTING & CORE TOOLS ---
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

  // --- CONTENT GENERATION TOOLS ---
  {
    id: 'idea-gen',
    title: 'Content Idea Generator',
    description: 'Generate 10 viral-ready content ideas based on your specific niche.',
    icon: '💡',
    category: 'content',
    promptTemplate: 'Generate 10 highly engaging Facebook content ideas. For each idea, include a "Core Concept", "Suggested Format", and "Engagement Goal". Target niche: ',
    inputPlaceholder: 'e.g. Personal Finance for Gen Z'
  },
  {
    id: 'viral-caption-gen',
    title: 'Viral Caption Generator',
    description: 'Craft high-engagement captions designed specifically for the Facebook algorithm.',
    icon: '✍️',
    category: 'content',
    promptTemplate: 'Generate 3 distinct viral Facebook captions. Label them "Option 1: The Storyteller", "Option 2: Value Driven", and "Option 3: Short & Punchy". For: ',
    inputPlaceholder: 'e.g. A photo of my new puppy'
  },
  {
    id: 'reel-script-gen',
    title: 'Reel Script Generator',
    description: 'Write complete 30-60 second scripts for Reels with visual and audio cues.',
    icon: '🎬',
    category: 'content',
    promptTemplate: 'Script a 45-second Facebook Reel. Use headers for "Visual Instructions", "Voiceover Script", and "On-screen Text" for: ',
    inputPlaceholder: 'e.g. 5 quick tips for better sleep'
  },
  {
    id: 'headline-gen',
    title: 'Viral Headline Generator',
    description: 'Generate scroll-stopping headlines that maximize CTR.',
    icon: '🗞️',
    category: 'content',
    promptTemplate: 'Generate 10 magnetic headlines for a Facebook post. Include "Click-worthy", "Curiosity-Gap", and "Authority-Based" versions for: ',
    inputPlaceholder: 'e.g. How I saved $10,000 in 3 months'
  },
  {
    id: 'cta-gen',
    title: 'CTA Generator for Posts',
    description: 'Generate powerful Calls to Action to drive comments, shares, or clicks.',
    icon: '📣',
    category: 'content',
    promptTemplate: 'Generate 10 high-converting CTAs for Facebook. Include options for "Comment Baiting", "Direct Link Clicks", and "Social Sharing" for: ',
    inputPlaceholder: 'e.g. A free social media strategy guide'
  },
  {
    id: 'reply-gen',
    title: 'Comment-to-Viral Reply',
    description: 'Turn standard comments into viral discussion threads with clever replies.',
    icon: '💬',
    category: 'content',
    promptTemplate: 'Generate 3 witty and engaging replies to this specific comment that will encourage others to join the thread. Comment: ',
    inputPlaceholder: 'Paste the comment text here...'
  },
  {
    id: 'story-caption-gen',
    title: 'Story Caption Generator',
    description: 'Generate short, punchy text overlays for your 24-hour stories.',
    icon: '🤳',
    category: 'content',
    promptTemplate: 'Generate 5 punchy captions for Facebook Stories. Include "Interaction Sticker Ideas" (Polls, Questions) for: ',
    inputPlaceholder: 'e.g. Behind the scenes of a logo design'
  },
  {
    id: 'meme-gen',
    title: 'Facebook Meme Generator',
    description: 'Generate funny, relatable captions for your meme images.',
    icon: '🤡',
    category: 'content',
    promptTemplate: 'Generate 5 relatable meme captions using popular Facebook formats for: ',
    inputPlaceholder: 'e.g. Trying to explain AI to my grandmother'
  },
  {
    id: 'hook-gen',
    title: 'Facebook Hook Gen',
    description: 'Generate the crucial first two lines that stop the scroll.',
    icon: '🧲',
    category: 'content',
    promptTemplate: 'Generate 5 high-converting opening hooks for Facebook. Number them 1-5 and explain why each one works for: ',
    inputPlaceholder: 'e.g. Why most entrepreneurs fail'
  },
  {
    id: 'improver',
    title: 'Image Caption Improver',
    description: 'Rewrite bland captions into punchy, clear, and engaging Facebook posts.',
    icon: '🖼️',
    category: 'content',
    promptTemplate: 'Improve this photo caption. Provide 3 variations: "The Storyteller", "The Provocative Question", and "The Quick Insight" for: ',
    inputPlaceholder: 'Paste your draft caption...'
  },
  {
    id: 'reposter',
    title: 'Repost Content Rewriter',
    description: 'Breathe new life into old content by rewriting it with a fresh angle.',
    icon: '🔄',
    category: 'content',
    promptTemplate: 'Rewrite the following post in 2 new styles: "Professional Insight" and "Relatable Story" for: ',
    inputPlaceholder: 'Paste an old post...'
  },

  // --- ANALYTICS & INSIGHTS ---
  {
    id: 'viral-analyzer',
    title: 'Viral Post Analyzer',
    description: 'Analyze exactly why a post went viral and how to replicate it.',
    icon: '🧠',
    category: 'analytics',
    promptTemplate: 'Deconstruct this viral post. Analyze its "Visual Hook", "Copywriting Structure", and "Social Triggers". Post: ',
    inputPlaceholder: 'Paste post content...'
  },
  {
    id: 'score-checker',
    title: 'Engagement Score Checker',
    description: 'Predict the potential engagement rate of your draft post.',
    icon: '📈',
    category: 'analytics',
    promptTemplate: 'Predict the engagement potential (1-100) of this draft. List "Pros", "Cons", and "3 Quick Wins to Improve Reach" for: ',
    inputPlaceholder: 'Paste your draft post...'
  },
  {
    id: 'tone-analyzer',
    title: 'Audience Tone Analyzer',
    description: 'Deep dive into the sentiment and mood of your comment section.',
    icon: '🗣️',
    category: 'analytics',
    promptTemplate: 'Analyze the tone of these audience comments. Provide a "Sentiment Score", "Common Emotional Triggers", and "Response Advice" for: ',
    inputPlaceholder: 'Paste recent comments...'
  },
  {
    id: 'trend-analyzer',
    title: 'Reels Trend Analyzer',
    description: 'Identify current trending audio and visual hooks for Reels.',
    icon: '⚡',
    category: 'analytics',
    promptTemplate: 'Identify current trends for Facebook Reels in this niche. List "Audio Trends", "Popular Transitions", and "Viral Script Formats" for: ',
    inputPlaceholder: 'e.g. Real Estate or Crypto'
  },
  {
    id: 'length-optimizer',
    title: 'Post Length Optimizer',
    description: 'Find the "Goldilocks" word count for your specific message.',
    icon: '📏',
    category: 'analytics',
    promptTemplate: 'Suggest the optimal length for this message. Provide "Short", "Mid", and "Long-form" versions with a recommendation for: ',
    inputPlaceholder: 'Paste your draft content...'
  },
  {
    id: 'insights-explainer',
    title: 'Insights Explainer Tool',
    description: 'Translate complex Facebook metrics into simple, actionable steps.',
    icon: '📊',
    category: 'analytics',
    promptTemplate: 'Simplify these Facebook Insights metrics. Explain "What happened", "What it means", and "What to do next" for: ',
    inputPlaceholder: 'Paste your reach/engagement data...'
  },

  // --- EXTRACTION TOOLS ---
  {
    id: 'video-dl-hq',
    title: 'Video Downloader (HD/4K)',
    description: 'Prepare high-quality video metadata for extraction and saving.',
    icon: '🎞️',
    category: 'extraction',
    promptTemplate: 'Analyze this video URL. Provide "Estimated Resolution", "Bitrate Profile", and "Metadata Summary" for: ',
    inputPlaceholder: 'Paste Facebook Video link...'
  },
  {
    id: 'reel-dl',
    title: 'Facebook Reel Downloader',
    description: 'Extract Reels with full metadata and audio information.',
    icon: '🌀',
    category: 'extraction',
    promptTemplate: 'Scan this Reel link. Provide "Audio Info", "Visual Analysis", and "Extraction Details" for: ',
    inputPlaceholder: 'Paste Reel link...'
  },
  {
    id: 'story-dl',
    title: 'Facebook Story Downloader',
    description: 'Archive ephemeral stories before they disappear permanently.',
    icon: '⏳',
    category: 'extraction',
    promptTemplate: 'Extract metadata for this public Story. List "Active Elements", "Sticker Overlays", and "Resolution" for: ',
    inputPlaceholder: 'Paste Story link...'
  },
  {
    id: 'image-dl',
    title: 'Facebook Image Downloader',
    description: 'Extract full-resolution images from any Facebook post.',
    icon: '📸',
    category: 'extraction',
    promptTemplate: 'Analyze this photo link for extraction. Provide "Original Resolution" and "Metadata" for: ',
    inputPlaceholder: 'Paste Photo post link...'
  },
  {
    id: 'album-bulk-dl',
    title: 'Album Bulk Downloader',
    description: 'Extract every image from a Facebook album in one report.',
    icon: '📂',
    category: 'extraction',
    promptTemplate: 'Analyze this Album link. List "Photo Count", "Estimated Bulk Size", and "Image Descriptions" for: ',
    inputPlaceholder: 'Paste Album link...'
  },
  {
    id: 'live-replay-dl',
    title: 'Live Video Replay Downloader',
    description: 'Specialized extraction for completed live broadcasts.',
    icon: '🔴',
    category: 'extraction',
    promptTemplate: 'Process this Live Stream replay URL. Provide "Stream Metadata", "Length", and "Download Readiness" for: ',
    inputPlaceholder: 'Paste Live Replay link...'
  },
  {
    id: 'media-extractor',
    title: 'Post Media Extractor',
    description: 'Extract all media (video + images) from a single complex post.',
    icon: '📦',
    category: 'extraction',
    promptTemplate: 'Scan this post for ALL media types. Provide a "Media Inventory" of every asset found in: ',
    inputPlaceholder: 'Paste Post link...'
  },
  {
    id: 'page-video-dl',
    title: 'Page Video Downloader',
    description: 'Analyze page-wide video archives for massive extraction.',
    icon: '🏢',
    category: 'extraction',
    promptTemplate: 'Analyze this Page video section. List "Available Resolutions" and "Metadata" for extraction for: ',
    inputPlaceholder: 'Paste Page URL...'
  },
  {
    id: 'group-video-dl',
    title: 'Group Video Downloader',
    description: 'Extract videos from public group discussions and posts.',
    icon: '👥',
    category: 'extraction',
    promptTemplate: 'Analyze this public group post. Provide "Video Quality" and "Group Metadata" for: ',
    inputPlaceholder: 'Paste Group Post link...'
  },
  {
    id: 'bulk-link-dl',
    title: 'Bulk Link Downloader',
    description: 'Process a list of multiple Facebook links simultaneously.',
    icon: '🧺',
    category: 'extraction',
    promptTemplate: 'Analyze these multiple links for batch extraction. Provide a "Batch Profile" for: ',
    inputPlaceholder: 'Paste links (one per line)...'
  },

  // --- GROWTH & PROFILE ---
  {
    id: 'page-name-gen',
    title: 'Facebook Page Name Generator',
    description: 'Strategic name generation for SEO and brand recognition.',
    icon: '📛',
    category: 'growth',
    promptTemplate: 'Generate 15 creative and strategic Facebook Page names. Categorize them as "Modern", "Classic", and "Search-Friendly" for: ',
    inputPlaceholder: 'e.g. A digital marketing agency for pets'
  },
  {
    id: 'bio-gen',
    title: 'Bio & About Section Generator',
    description: 'Optimized profiles that help your page show up in searches.',
    icon: '👤',
    category: 'growth',
    promptTemplate: 'Write a professional Facebook Bio and "About" section. Include "Mission Statement", "Key Services", and "Search Keywords" for: ',
    inputPlaceholder: 'e.g. Sourdough bakery in Portland'
  },
  {
    id: 'pinned-comment-gen',
    title: 'Auto-Pinned Comment Generator',
    description: 'Generate the perfect first comment to pin for engagement.',
    icon: '📌',
    category: 'growth',
    promptTemplate: 'Generate 3 perfect comments to pin. Variation 1: Email Signup. Variation 2: Community Question. Variation 3: Sales Link. For the post: ',
    inputPlaceholder: 'Describe the post topic...'
  },
  {
    id: 'group-name-gen',
    title: 'Group Name Generator',
    description: 'Catchy and descriptive names for high-growth communities.',
    icon: '🏰',
    category: 'growth',
    promptTemplate: 'Generate 10 catchy Facebook Group names. Include "Private Community Style" and "Broad Topic Style" for: ',
    inputPlaceholder: 'e.g. Mid-century furniture restoration'
  },

  // --- MARKETING & SALES ---
  {
    id: 'ad-copy-gen',
    title: 'Facebook Ad Copy Generator',
    description: 'High-converting ad scripts based on PAS and AIDA frameworks.',
    icon: '💰',
    category: 'marketing',
    promptTemplate: 'Write 3 variations of Facebook Ad copy using AIDA and PAS frameworks. Include "Headline", "Primary Text", and "CTA" for: ',
    inputPlaceholder: 'e.g. Selling a luxury water bottle'
  },
  {
    id: 'ad-hook-gen',
    title: 'Facebook Ad Hook Generator',
    description: 'The critical first line of your ad that stops the scroll.',
    icon: '⚡',
    category: 'marketing',
    promptTemplate: 'Generate 10 magnetic opening hooks for a Facebook Ad. Focus on "Fear of Missing Out", "Direct Benefit", and "Curiosity" for: ',
    inputPlaceholder: 'e.g. A course on social media ads'
  },
  {
    id: 'ad-analyzer',
    title: 'Ad Creative Analyzer',
    description: 'Expert feedback on your ad image or video concept.',
    icon: '🧐',
    category: 'marketing',
    promptTemplate: 'Analyze this Facebook Ad Creative concept. Provide "Estimated CTR potential", "Points of Friction", and "3 Split-test suggestions" for: ',
    inputPlaceholder: 'Describe your ad creative concept...'
  },
  {
    id: 'shop-caption-gen',
    title: 'Shop Product Caption Generator',
    description: 'Sales-focused captions for your Facebook Shop items.',
    icon: '🛒',
    category: 'marketing',
    promptTemplate: 'Write a persuasive product description for a Facebook Shop item. Focus on "Benefits" and "Social Proof" for: ',
    inputPlaceholder: 'e.g. Leather laptop sleeve'
  },
  {
    id: 'affiliate-post-gen',
    title: 'Facebook Affiliate Post Generator',
    description: 'Social-friendly affiliate posts that don’t look like ads.',
    icon: '🔗',
    category: 'marketing',
    promptTemplate: 'Write an authentic Facebook post for an affiliate product. Focus on "Personal Experience" and "Honest Recommendation" for: ',
    inputPlaceholder: 'e.g. An ergonomic office chair'
  },
  {
    id: 'lead-magnet-gen',
    title: 'Lead Magnet Caption Tool',
    description: 'Promote your PDF, ebook, or checklist for high conversions.',
    icon: '🧲',
    category: 'marketing',
    promptTemplate: 'Write a Facebook post to promote a free lead magnet. Use a "Desire-Building List" and a clear CTA for: ',
    inputPlaceholder: 'e.g. A checklist for better SEO'
  },
  {
    id: 'dm-reply-script',
    title: 'DM Auto-Reply Script Generator',
    description: 'Professional scripts for Messenger automation.',
    icon: '📥',
    category: 'marketing',
    promptTemplate: 'Generate 5 professional automated reply scripts for Facebook Messenger. Include "Welcome", "FAQ", and "Qualified Lead" versions for: ',
    inputPlaceholder: 'e.g. A local dental clinic'
  },
  {
    id: 'offer-angle-gen',
    title: 'Facebook Offer Angle Generator',
    description: 'Find unique ways to frame your sale or promotion.',
    icon: '💎',
    category: 'marketing',
    promptTemplate: 'Generate 5 unique marketing angles for a Facebook offer. Frame them as "Scarcity", "Logic", "Emotion", and "Social Proof" for: ',
    inputPlaceholder: 'e.g. 50% off web design services'
  },
  {
    id: 'local-biz-post',
    title: 'Facebook Local Business Post Generator',
    description: 'Drive foot traffic with location-focused social posts.',
    icon: '📍',
    category: 'marketing',
    promptTemplate: 'Generate 3 Facebook posts designed to drive local traffic. Focus on "In-store Specials" and "Community Pride" for: ',
    inputPlaceholder: 'e.g. A local family-run pizza shop'
  },
  {
    id: 'course-post-gen',
    title: 'Course / Digital Product Post Generator',
    description: 'Copy optimized for selling information products and courses.',
    icon: '💻',
    category: 'marketing',
    promptTemplate: 'Write a sales-focused Facebook post for a digital course. Use the "Story-Teach-Sell" framework for: ',
    inputPlaceholder: 'e.g. A masterclass on Python programming'
  },

  // --- ADDITIONAL UTILITY TOOLS ---
  {
    id: 'event-desc-gen',
    title: 'Event Description Writer',
    description: 'Write detailed, persuasive descriptions for Facebook Events.',
    icon: '🎫',
    category: 'content',
    promptTemplate: 'Write a detailed Facebook Event description. Include "What to Expect", "Schedule", and "Registration Info" for: ',
    inputPlaceholder: 'e.g. Local 5K charity run'
  },
  {
    id: 'poll-idea-gen',
    title: 'Poll Idea Generator',
    description: 'Generate engaging poll questions to boost page interaction.',
    icon: '📊',
    category: 'content',
    promptTemplate: 'Generate 5 engaging Facebook Poll ideas. For each poll, include the "Question" and "Options" for: ',
    inputPlaceholder: 'e.g. Travel and adventure niche'
  },
  {
    id: 'giveaway-rule-architect',
    title: 'Giveaway Rule Architect',
    description: 'Draft clear, legally-compliant rules for contests and giveaways.',
    icon: '🎁',
    category: 'moderation',
    promptTemplate: 'Draft a clear set of rules for a Facebook giveaway. Include "How to Enter", "Eligibility", "Deadline", and "Disclaimer" for: ',
    inputPlaceholder: 'e.g. A giveaway for a $50 gift card'
  }
];

const StructuredResultRenderer: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  
  return (
    <div className="space-y-6">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-4" />;

        const isHeader = trimmed.endsWith(':') || trimmed.startsWith('##') || /^[A-Z\s]{4,}$/.test(trimmed) || trimmed.startsWith('Day ') || trimmed.startsWith('Option ') || trimmed.startsWith('Variation ');
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
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Ensure tool navigation opens at the top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTool]);

  const filteredTools = useMemo(() => {
    let list = activeCategory === 'all' 
      ? TOOLS 
      : TOOLS.filter(t => t.category === activeCategory);
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, searchQuery]);

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

  const getEmbedHtml = (tool: PremiumTool) => {
    return `<!-- Swift FB Downloader - ${tool.title} Widget -->
<div style="border: 2px solid #1877f2; border-radius: 20px; padding: 25px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 450px; background: white; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); text-align: left;">
  <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
    <div style="font-size: 32px; background: #f0f7ff; padding: 10px; border-radius: 12px;">${tool.icon}</div>
    <h3 style="margin: 0; color: #0f172a; font-size: 20px; font-weight: 800; letter-spacing: -0.025em;">${tool.title}</h3>
  </div>
  <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin-bottom: 25px; font-weight: 500;">${tool.description}</p>
  <a href="https://swiftfbdownloader.com" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background: #1877f2; color: white; padding: 14px 20px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 15px; text-align: center; transition: all 0.2s ease;">Try this Tool at Swift FB Downloader</a>
</div>`;
  };

  const handleCopyEmbed = () => {
    if (!activeTool) return;
    navigator.clipboard.writeText(getEmbedHtml(activeTool));
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Premium <span className="text-[#1877F2]">Creator Suite</span></h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">50+ Professional AI tools to dominate the Facebook landscape.</p>
      </div>

      {!activeTool && (
        <div className="max-w-4xl mx-auto mb-16 space-y-8">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400 group-focus-within:text-[#1877F2] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search 50+ premium AI tools." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 pl-14 pr-6 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-[#1877F2] focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all text-lg font-bold dark:text-white shadow-xl shadow-slate-100/50 dark:shadow-none"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {['all', 'analytics', 'content', 'extraction', 'growth', 'marketing', 'moderation'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all border-2 ${activeCategory === cat ? 'bg-[#1877F2] text-white border-[#1877F2] shadow-lg shadow-blue-200' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700 hover:border-[#1877F2]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTool ? (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="glass rounded-[3rem] p-8 md:p-12 border-white/60 dark:border-white/10 shadow-2xl shadow-blue-100/40 dark:shadow-none">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-4xl shadow-md border border-slate-50 dark:border-slate-700">
                  {activeTool.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">{activeTool.title}</h3>
                  <span className="text-xs font-bold text-[#1877F2] dark:text-blue-400 uppercase tracking-widest">{activeTool.category}</span>
                </div>
              </div>
              <button 
                onClick={() => { setActiveTool(null); setResult(''); setInput(''); setShowEmbedCode(false); }}
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
                    <span className="ml-2">Crafting Logic...</span>
                  </div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Analyze & Generate
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
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Embed section */}
          <div className="glass rounded-[2.5rem] p-8 md:p-10 border-white/60 dark:border-white/10 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-[#1877F2] dark:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">Embed this tool</h4>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Add to your website • Free Backlink</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEmbedCode(!showEmbedCode)}
                className="text-xs font-black text-[#1877F2] dark:text-blue-400 underline underline-offset-4 hover:text-blue-600 transition-colors"
              >
                {showEmbedCode ? 'Hide HTML' : 'Show HTML Snippet'}
              </button>
            </div>

            {showEmbedCode ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Copy this code to your website:</p>
                    <div className="relative group">
                      <pre className="p-5 bg-slate-950 text-blue-300 text-[10px] md:text-xs rounded-2xl overflow-x-auto border-2 border-slate-900 leading-relaxed font-mono">
                        {getEmbedHtml(activeTool)}
                      </pre>
                      <button 
                        onClick={handleCopyEmbed}
                        className={`absolute top-4 right-4 px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95 ${copiedEmbed ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md'}`}
                      >
                        {copiedEmbed ? 'COPIED!' : 'COPY CODE'}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Preview Widget:</p>
                    <div className="flex justify-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                      <div className="scale-75 md:scale-90 origin-center">
                        <div className="bg-white rounded-[20px] border-2 border-[#1877f2] p-6 shadow-2xl max-w-[350px] text-left">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="text-2xl bg-blue-50 p-2 rounded-lg">{activeTool.icon}</div>
                            <h3 className="m-0 text-slate-900 text-lg font-extrabold">{activeTool.title}</h3>
                          </div>
                          <p className="text-slate-500 text-sm mb-6 leading-relaxed">{activeTool.description}</p>
                          <div className="w-full bg-[#1877f2] text-white py-3 rounded-xl font-bold text-sm text-center">
                            Try for Free at Swift FB Downloader
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center gap-4 text-center">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 max-w-sm">
                  Love this tool? Share it with your audience by embedding our premium widget on your blog or resource page.
                </p>
                <button 
                  onClick={() => setShowEmbedCode(true)}
                  className="px-8 py-3 bg-white dark:bg-slate-800 rounded-xl text-xs font-black text-[#1877F2] dark:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-700 hover:scale-105 transition-transform"
                >
                  Get Embed Code
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <button 
                key={tool.id}
                onClick={() => { setActiveTool(tool); setInput(''); setResult(''); }}
                className="glass p-8 rounded-[2rem] border-white/60 dark:border-white/10 shadow-xl shadow-slate-100/30 dark:shadow-none hover:scale-[1.03] transition-all duration-300 group cursor-pointer flex flex-col justify-between hover:shadow-blue-100/50 dark:hover:bg-slate-800/60 text-left w-full"
              >
                <div>
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-3xl mb-6 shadow-md border border-slate-50 dark:border-slate-700 group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg mb-3 leading-tight group-hover:text-[#1877F2] dark:group-hover:text-blue-400 transition-colors">{tool.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-xs leading-relaxed mb-4 line-clamp-2">{tool.description}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">{tool.category}</span>
                  <span className="text-[#1877F2] font-black text-[10px] uppercase group-hover:translate-x-1 transition-transform">Try Tool →</span>
                </div>
              </button>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="text-5xl mb-6">🔍</div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No tools found</h3>
              <p className="text-slate-500 font-medium">Try searching for something else like "Ad" or "Reel".</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PremiumSuite;
