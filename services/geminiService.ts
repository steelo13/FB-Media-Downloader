
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractionResult, MediaType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeLink = async (url: string): Promise<{ analysis: string; mockResult: ExtractionResult }> => {
  const prompt = `Analyze this Facebook URL: ${url}. 
  Provide a JSON response describing what this media likely is (Video, Reel, or Post).
  Be creative but realistic. Mention the probable creator name and content description.
  
  URL context hints:
  - "/reels/" indicates a Reel.
  - "/videos/" or "/watch/" indicates a Video.
  - "/posts/" or "/photos/" indicates a Post.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["VIDEO", "IMAGE", "REEL", "STORY"] },
          author: { type: Type.STRING },
          description: { type: Type.STRING },
          estimatedQuality: { type: Type.STRING }
        },
        required: ["title", "type", "author", "description"]
      }
    }
  });

  const data = JSON.parse(response.text);
  
  // Since we can't actually scrape FB without a backend proxy, 
  // we simulate the extraction result based on AI analysis.
  const mockResult: ExtractionResult = {
    title: data.title,
    author: data.author,
    type: data.type as MediaType,
    description: data.description,
    thumbnail: `https://picsum.photos/seed/${Math.random()}/800/450`,
    options: data.type === 'IMAGE' ? [
      { quality: 'Original', url: '#', format: 'jpg', size: '1.2 MB' }
    ] : [
      { quality: 'HD (1080p)', url: '#', format: 'mp4', size: '24.5 MB' },
      { quality: 'SD (720p)', url: '#', format: 'mp4', size: '12.1 MB' }
    ]
  };

  return {
    analysis: data.description,
    mockResult
  };
};
