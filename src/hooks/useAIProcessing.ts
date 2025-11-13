import { useState, useCallback } from 'react';
import { aiProcessingPipeline } from '@/lib/aiProcessingPipeline';
import { Patient } from '@/lib/types';
import { FacialRecognitionResult, SpeechAnalysisResult } from '@/lib/geminiAIService';

export interface UseAIProcessingReturn {
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  error: string | null;
  result: FacialRecognitionResult | SpeechAnalysisResult | null;
  processFacialImage: (file: File, patientId: string, patientContext?: Patient) => Promise<void>;
  processSpeechAudio: (file: File, patientId: string, patientContext?: Patient) => Promise<void>;
  processLiveVideo: (stream: MediaStream, patientId: string, patientContext?: Patient) => () => void;
  processLiveAudio: (stream: MediaStream, patientId: string, patientContext?: Patient) => () => void;
  reset: () => void;
}

export function useAIProcessing(): UseAIProcessingReturn {
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FacialRecognitionResult | SpeechAnalysisResult | null>(null);

  const processFacialImage = useCallback(
    async (file: File, patientId: string, patientContext?: Patient) => {
      setStatus('processing');
      setProgress(0);
      setMessage('Starting facial recognition analysis...');
      setError(null);
      setResult(null);

      try {
        const result = await aiProcessingPipeline.processFacialImage(file, {
          patientId,
          patientContext,
          onProgress: (prog, msg) => {
            setProgress(prog);
            setMessage(msg);
          },
          onComplete: (res) => {
            setResult(res);
            setStatus('completed');
            setProgress(100);
            setMessage('Analysis completed successfully!');
          },
          onError: (err) => {
            setError(err.message);
            setStatus('error');
            setMessage('Analysis failed');
          },
        });
      } catch (err: any) {
        setError(err.message || 'Failed to process facial image');
        setStatus('error');
        setMessage('Analysis failed');
      }
    },
    []
  );

  const processSpeechAudio = useCallback(
    async (file: File, patientId: string, patientContext?: Patient) => {
      setStatus('processing');
      setProgress(0);
      setMessage('Starting speech analysis...');
      setError(null);
      setResult(null);

      try {
        const result = await aiProcessingPipeline.processSpeechAudio(file, {
          patientId,
          patientContext,
          onProgress: (prog, msg) => {
            setProgress(prog);
            setMessage(msg);
          },
          onComplete: (res) => {
            setResult(res);
            setStatus('completed');
            setProgress(100);
            setMessage('Analysis completed successfully!');
          },
          onError: (err) => {
            setError(err.message);
            setStatus('error');
            setMessage('Analysis failed');
          },
        });
      } catch (err: any) {
        setError(err.message || 'Failed to process speech audio');
        setStatus('error');
        setMessage('Analysis failed');
      }
    },
    []
  );

  const processLiveVideo = useCallback(
    (stream: MediaStream, patientId: string, patientContext?: Patient) => {
      setStatus('processing');
      setProgress(0);
      setMessage('Starting live video analysis...');
      setError(null);
      setResult(null);

      const stopProcessing = aiProcessingPipeline.processLiveVideoStream(stream, {
        patientId,
        patientContext,
        onProgress: (prog, msg) => {
          setProgress(prog);
          setMessage(msg);
        },
        onComplete: (res) => {
          setResult(res);
          setMessage('Frame analyzed');
        },
        onError: (err) => {
          setError(err.message);
          setStatus('error');
          setMessage('Stream processing failed');
        },
      });

      return stopProcessing;
    },
    []
  );

  const processLiveAudio = useCallback(
    (stream: MediaStream, patientId: string, patientContext?: Patient) => {
      setStatus('processing');
      setProgress(0);
      setMessage('Starting live audio analysis...');
      setError(null);
      setResult(null);

      const stopProcessing = aiProcessingPipeline.processLiveAudioStream(stream, {
        patientId,
        patientContext,
        onProgress: (prog, msg) => {
          setProgress(prog);
          setMessage(msg);
        },
        onComplete: (res) => {
          setResult(res);
          setMessage('Chunk analyzed');
        },
        onError: (err) => {
          setError(err.message);
          setStatus('error');
          setMessage('Stream processing failed');
        },
      });

      return stopProcessing;
    },
    []
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setMessage('');
    setError(null);
    setResult(null);
  }, []);

  return {
    status,
    progress,
    message,
    error,
    result,
    processFacialImage,
    processSpeechAudio,
    processLiveVideo,
    processLiveAudio,
    reset,
  };
}

