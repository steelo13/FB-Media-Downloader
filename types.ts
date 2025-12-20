
export enum MediaType {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  CAROUSEL = 'CAROUSEL',
  REEL = 'REEL',
  STORY = 'STORY'
}

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

export interface AIAnalysis {
  confidence: number;
  detectedType: string;
  summary: string;
  safetyRating: string;
}
