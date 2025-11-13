import { geminiAIService, FacialRecognitionResult, SpeechAnalysisResult } from './geminiAIService';
import { firestoreService } from './firestoreService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/integrations/firebase/config';
import { Patient } from './types';

export interface ProcessingOptions {
  patientId: string;
  patientContext?: Patient;
  onProgress?: (progress: number, status: string) => void;
  onComplete?: (result: any) => void;
  onError?: (error: Error) => void;
}

class AIProcessingPipeline {
  // Process uploaded image for facial recognition
  async processFacialImage(
    imageFile: File,
    options: ProcessingOptions
  ): Promise<FacialRecognitionResult> {
    const { patientId, patientContext, onProgress, onComplete, onError } = options;

    try {
      // Update progress
      onProgress?.(10, 'Uploading image...');

      // Upload image to Firebase Storage
      const imageRef = ref(storage, `patients/${patientId}/facial/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      onProgress?.(30, 'Analyzing facial features with AI...');

      // Analyze with Gemini AI
      const result = await geminiAIService.analyzeFacialRecognition(imageFile, {
        age: patientContext?.age,
        gender: patientContext?.gender,
        medicalHistory: patientContext?.medicalHistory,
      });

      onProgress?.(80, 'Saving results...');

      // Save to Firestore
      const processingId = await firestoreService.saveAIProcessingResult(
        patientId,
        'facial',
        {
          ...result,
          imageUrl,
          processedAt: new Date().toISOString(),
        }
      );

      // Create timeline event
      await firestoreService.createTimelineEvent({
        patientId,
        date: new Date().toISOString(),
        type: 'test',
        title: 'Facial Recognition Analysis Completed',
        description: `AI analysis completed with ${(result.confidence * 100).toFixed(0)}% confidence. Found ${result.riskIndicators.length} risk indicators.`,
        severity: result.riskIndicators.length > 0 ? 'warning' : 'info',
      });

      onProgress?.(100, 'Complete');
      onComplete?.(result);

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Facial recognition processing failed';
      onError?.(new Error(errorMessage));
      throw error;
    }
  }

  // Process uploaded audio for speech analysis
  async processSpeechAudio(
    audioFile: File,
    options: ProcessingOptions
  ): Promise<SpeechAnalysisResult> {
    const { patientId, patientContext, onProgress, onComplete, onError } = options;

    try {
      onProgress?.(10, 'Uploading audio...');

      // Upload audio to Firebase Storage
      const audioRef = ref(storage, `patients/${patientId}/speech/${Date.now()}_${audioFile.name}`);
      await uploadBytes(audioRef, audioFile);
      const audioUrl = await getDownloadURL(audioRef);

      onProgress?.(30, 'Transcribing and analyzing speech...');

      // Analyze with Gemini AI
      const result = await geminiAIService.analyzeSpeech(audioFile, {
        age: patientContext?.age,
        medicalHistory: patientContext?.medicalHistory,
      });

      onProgress?.(70, 'Saving results...');

      // Save speech analysis to Firestore
      const speechAnalysisId = await firestoreService.createSpeechAnalysis({
        patientId,
        date: new Date().toISOString(),
        duration: 0, // You might want to calculate this from the audio file
        transcription: result.transcription,
        audioUrl,
        metrics: result.metrics,
        aiInsights: result.insights,
        riskIndicators: result.riskIndicators,
      });

      // Save AI processing result
      await firestoreService.saveAIProcessingResult(patientId, 'speech', {
        ...result,
        audioUrl,
        speechAnalysisId,
        processedAt: new Date().toISOString(),
      });

      // Create timeline event
      await firestoreService.createTimelineEvent({
        patientId,
        date: new Date().toISOString(),
        type: 'test',
        title: 'Speech Analysis Completed',
        description: `Speech analysis completed. Clarity: ${result.metrics.clarity.toFixed(0)}%, Found ${result.riskIndicators.length} risk indicators.`,
        severity: result.riskIndicators.length > 0 ? 'warning' : 'info',
      });

      onProgress?.(100, 'Complete');
      onComplete?.(result);

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Speech analysis processing failed';
      onError?.(new Error(errorMessage));
      throw error;
    }
  }

  // Process live video stream for real-time facial recognition
  async processLiveVideoStream(
    videoStream: MediaStream,
    options: ProcessingOptions & { interval?: number }
  ): Promise<() => void> {
    const { patientId, patientContext, onProgress, onComplete, onError, interval = 5000 } = options;

    let isProcessing = true;
    let frameCount = 0;

    const processFrame = async () => {
      if (!isProcessing) return;

      try {
        // Capture frame from video stream
        const videoElement = document.createElement('video');
        videoElement.srcObject = videoStream;
        videoElement.play();

        await new Promise((resolve) => {
          videoElement.onloadedmetadata = () => {
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(videoElement, 0, 0);

            canvas.toBlob(async (blob) => {
              if (blob) {
                const imageFile = new File([blob], `frame_${Date.now()}.jpg`, { type: 'image/jpeg' });
                
                try {
                  const result = await geminiAIService.analyzeFacialRecognition(imageFile, {
                    age: patientContext?.age,
                    gender: patientContext?.gender,
                    medicalHistory: patientContext?.medicalHistory,
                  });

                  frameCount++;
                  onProgress?.(50, `Processing frame ${frameCount}...`);
                  onComplete?.(result);

                  // Save periodic results (every 5 frames)
                  if (frameCount % 5 === 0) {
                    await firestoreService.saveAIProcessingResult(patientId, 'facial', {
                      ...result,
                      frameNumber: frameCount,
                      processedAt: new Date().toISOString(),
                    });
                  }
                } catch (error: any) {
                  console.error('Frame processing error:', error);
                  // Continue processing even if one frame fails
                }
              }
              resolve(null);
            }, 'image/jpeg');
          };
        });

        // Schedule next frame
        if (isProcessing) {
          setTimeout(processFrame, interval);
        }
      } catch (error: any) {
        console.error('Stream processing error:', error);
        onError?.(new Error(`Stream processing failed: ${error.message}`));
      }
    };

    // Start processing
    processFrame();

    // Return stop function
    return () => {
      isProcessing = false;
    };
  }

  // Process live audio stream for real-time speech analysis
  async processLiveAudioStream(
    audioStream: MediaStream,
    options: ProcessingOptions & { chunkDuration?: number }
  ): Promise<() => void> {
    const { patientId, patientContext, onProgress, onComplete, onError, chunkDuration = 10000 } = options;

    let isProcessing = true;
    let audioContext: AudioContext | null = null;
    let mediaRecorder: MediaRecorder | null = null;
    let accumulatedTranscription = '';

    try {
      audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(audioStream);
      const destination = audioContext.createMediaStreamDestination();
      source.connect(destination);

      mediaRecorder = new MediaRecorder(destination.stream);

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && isProcessing) {
          try {
            onProgress?.(30, 'Analyzing audio chunk...');

            const audioFile = new File([event.data], `chunk_${Date.now()}.webm`, { type: 'audio/webm' });
            const result = await geminiAIService.analyzeSpeech(audioFile, {
              age: patientContext?.age,
              medicalHistory: patientContext?.medicalHistory,
            });

            accumulatedTranscription += ' ' + result.transcription;
            onProgress?.(60, 'Processing speech...');
            onComplete?.({ ...result, transcription: accumulatedTranscription });

            // Save periodic results
            await firestoreService.saveAIProcessingResult(patientId, 'speech', {
              ...result,
              transcription: accumulatedTranscription,
              processedAt: new Date().toISOString(),
            });
          } catch (error: any) {
            console.error('Chunk processing error:', error);
            onError?.(new Error(`Chunk processing failed: ${error.message}`));
          }
        }
      };

      mediaRecorder.start(chunkDuration);

      // Return stop function
      return () => {
        isProcessing = false;
        mediaRecorder?.stop();
        audioContext?.close();
      };
    } catch (error: any) {
      onError?.(new Error(`Audio stream setup failed: ${error.message}`));
      return () => {};
    }
  }
}

export const aiProcessingPipeline = new AIProcessingPipeline();

