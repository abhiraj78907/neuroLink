import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('VITE_GEMINI_API_KEY is not set. AI features will not work.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export interface FacialRecognitionResult {
  emotions: Array<{ emotion: string; confidence: number }>;
  facialFeatures: {
    symmetry: number;
    expression: string;
    ageEstimate?: number;
  };
  riskIndicators: string[];
  analysis: string;
  confidence: number;
}

export interface SpeechAnalysisResult {
  transcription: string;
  metrics: {
    pauseFrequency: number;
    wordRepetition: number;
    clarity: number;
    vocabularyRichness: number;
    speechRate: number;
  };
  riskIndicators: string[];
  insights: string;
  confidence: number;
}

export interface AIProcessingStatus {
  status: 'processing' | 'completed' | 'error';
  progress?: number;
  result?: FacialRecognitionResult | SpeechAnalysisResult;
  error?: string;
}

class GeminiAIService {
  private model: any;

  constructor() {
    if (!genAI) {
      console.warn('Gemini AI not initialized - API key missing');
      return;
    }

    // Use Gemini 1.5 Pro for multimodal capabilities
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  }

  // Convert image to base64 for Gemini
  private async imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Convert audio to base64 for Gemini
  private async audioToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Analyze facial features from image
  async analyzeFacialRecognition(
    imageFile: File,
    patientContext?: { age?: number; gender?: string; medicalHistory?: string[] }
  ): Promise<FacialRecognitionResult> {
    if (!this.model) {
      throw new Error('Gemini AI not initialized. Please check your API key.');
    }

    try {
      const base64Image = await this.imageToBase64(imageFile);
      
      const contextPrompt = patientContext
        ? `Patient context: Age ${patientContext.age || 'unknown'}, Gender: ${patientContext.gender || 'unknown'}, Medical history: ${patientContext.medicalHistory?.join(', ') || 'none'}`
        : '';

      const prompt = `
Analyze this facial image for potential Alzheimer's disease indicators. Focus on:
1. Facial expressions and emotional state
2. Facial symmetry and muscle tone
3. Any visible signs of cognitive decline (facial drooping, expression changes, etc.)

${contextPrompt}

Provide a detailed analysis in JSON format with:
- emotions: array of detected emotions with confidence scores (0-1)
- facialFeatures: object with symmetry (0-1), expression (string), ageEstimate (number)
- riskIndicators: array of potential risk indicators found
- analysis: detailed text analysis
- confidence: overall confidence score (0-1)

Return ONLY valid JSON, no markdown formatting.
`;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: imageFile.type || 'image/jpeg',
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      let parsedResult;
      try {
        // Remove markdown code blocks if present
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedResult = JSON.parse(cleanedText);
      } catch (parseError) {
        // Fallback: try to extract JSON from text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse AI response');
        }
      }

      return {
        emotions: parsedResult.emotions || [],
        facialFeatures: parsedResult.facialFeatures || { symmetry: 0.5, expression: 'neutral' },
        riskIndicators: parsedResult.riskIndicators || [],
        analysis: parsedResult.analysis || 'Analysis completed',
        confidence: parsedResult.confidence || 0.5,
      };
    } catch (error: any) {
      console.error('Facial recognition analysis error:', error);
      throw new Error(`Facial analysis failed: ${error.message}`);
    }
  }

  // Analyze speech from audio file
  async analyzeSpeech(
    audioFile: File,
    patientContext?: { age?: number; medicalHistory?: string[] }
  ): Promise<SpeechAnalysisResult> {
    if (!this.model) {
      throw new Error('Gemini AI not initialized. Please check your API key.');
    }

    try {
      const base64Audio = await this.audioToBase64(audioFile);
      
      const contextPrompt = patientContext
        ? `Patient context: Age ${patientContext.age || 'unknown'}, Medical history: ${patientContext.medicalHistory?.join(', ') || 'none'}`
        : '';

      const prompt = `
Analyze this speech audio for potential Alzheimer's disease indicators. Focus on:
1. Speech clarity and articulation
2. Pause frequency and patterns
3. Word repetition and vocabulary richness
4. Speech rate and fluency
5. Any signs of cognitive decline in speech patterns

${contextPrompt}

Provide a detailed analysis in JSON format with:
- transcription: full text transcription of the speech
- metrics: object with pauseFrequency (0-1), wordRepetition (0-1), clarity (0-100), vocabularyRichness (0-100), speechRate (words per minute)
- riskIndicators: array of potential risk indicators found
- insights: detailed text analysis
- confidence: overall confidence score (0-1)

Return ONLY valid JSON, no markdown formatting.
`;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Audio,
            mimeType: audioFile.type || 'audio/webm',
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      let parsedResult;
      try {
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        parsedResult = JSON.parse(cleanedText);
      } catch (parseError) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse AI response');
        }
      }

      return {
        transcription: parsedResult.transcription || '',
        metrics: {
          pauseFrequency: parsedResult.metrics?.pauseFrequency || 0,
          wordRepetition: parsedResult.metrics?.wordRepetition || 0,
          clarity: parsedResult.metrics?.clarity || 0,
          vocabularyRichness: parsedResult.metrics?.vocabularyRichness || 0,
          speechRate: parsedResult.metrics?.speechRate || 0,
        },
        riskIndicators: parsedResult.riskIndicators || [],
        insights: parsedResult.insights || 'Analysis completed',
        confidence: parsedResult.confidence || 0.5,
      };
    } catch (error: any) {
      console.error('Speech analysis error:', error);
      throw new Error(`Speech analysis failed: ${error.message}`);
    }
  }

  // Real-time speech analysis from audio stream (chunks)
  async analyzeSpeechStream(
    audioChunk: Blob,
    previousContext?: Partial<SpeechAnalysisResult>
  ): Promise<Partial<SpeechAnalysisResult>> {
    // For real-time analysis, we'll process chunks incrementally
    // This is a simplified version - in production, you'd want to buffer and process larger chunks
    try {
      const audioFile = new File([audioChunk], 'chunk.webm', { type: 'audio/webm' });
      const result = await this.analyzeSpeech(audioFile);
      
      // Merge with previous context if available
      if (previousContext) {
        return {
          ...result,
          transcription: (previousContext.transcription || '') + ' ' + result.transcription,
        };
      }
      
      return result;
    } catch (error: any) {
      throw new Error(`Stream analysis failed: ${error.message}`);
    }
  }
}

export const geminiAIService = new GeminiAIService();

