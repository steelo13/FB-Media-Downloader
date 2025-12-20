
export enum MediaType {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  CAROUSEL = 'CAROUSEL',
  REEL = 'REEL',
  STORY = 'STORY'
}

export type ViewState = 'downloader' | 'premium' | 'privacy' | 'terms';

export interface MediaOption {
  quality: string;
  url: string;
  size?: string;
  format: 'mp4' | 'jpg' | 'png';
}

export interface ExtractionResult {
  title: string;
  thumbnail: string;
  type: MediaType;
  author: string;
  options: MediaOption[];
  description?: string;
}

export interface PremiumTool {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'moderation' | 'analytics' | 'content';
  promptTemplate: string;
  inputPlaceholder: string;
}
