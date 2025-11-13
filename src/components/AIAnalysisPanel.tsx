import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileUploader } from './FileUploader';
import { LiveStreamCapture } from './LiveStreamCapture';
import { AIProcessingStatus } from './AIProcessingStatus';
import { useAIProcessing } from '@/hooks/useAIProcessing';
import { Patient } from '@/lib/types';
import { Upload, Video, Mic, Sparkles } from 'lucide-react';

export interface AIAnalysisPanelProps {
  patientId: string;
  patientContext?: Patient;
}

export function AIAnalysisPanel({ patientId, patientContext }: AIAnalysisPanelProps) {
  const {
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
  } = useAIProcessing();

  const [activeTab, setActiveTab] = useState<'upload' | 'live'>('upload');
  const [streamType, setStreamType] = useState<'video' | 'audio'>('video');
  const [stopStream, setStopStream] = useState<(() => void) | null>(null);

  const handleImageUpload = async (file: File) => {
    await processFacialImage(file, patientId, patientContext);
  };

  const handleAudioUpload = async (file: File) => {
    await processSpeechAudio(file, patientId, patientContext);
  };

  const handleStreamReady = (stream: MediaStream) => {
    if (streamType === 'video') {
      const stop = processLiveVideo(stream, patientId, patientContext);
      setStopStream(() => stop);
    } else {
      const stop = processLiveAudio(stream, patientId, patientContext);
      setStopStream(() => stop);
    }
  };

  const handleStreamStop = () => {
    if (stopStream) {
      stopStream();
      setStopStream(null);
    }
    reset();
  };

  return (
    <Card className="card-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>AI Analysis</CardTitle>
        </div>
        <CardDescription>
          Upload files or use live capture for real-time AI analysis with Gemini
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upload' | 'live')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="live">
              <Video className="mr-2 h-4 w-4" />
              Live Stream
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FileUploader
                type="image"
                label="Facial Recognition"
                description="Upload an image for facial analysis"
                accept="image/*"
                maxSize={10}
                onFileSelect={handleImageUpload}
                disabled={status === 'processing'}
              />
              <FileUploader
                type="audio"
                label="Speech Analysis"
                description="Upload an audio file for speech analysis"
                accept="audio/*"
                maxSize={50}
                onFileSelect={handleAudioUpload}
                disabled={status === 'processing'}
              />
            </div>
          </TabsContent>

          <TabsContent value="live" className="space-y-4 mt-4">
            <div className="flex gap-2 mb-4">
              <Button
                variant={streamType === 'video' ? 'default' : 'outline'}
                onClick={() => setStreamType('video')}
                disabled={status === 'processing'}
              >
                <Video className="mr-2 h-4 w-4" />
                Video
              </Button>
              <Button
                variant={streamType === 'audio' ? 'default' : 'outline'}
                onClick={() => setStreamType('audio')}
                disabled={status === 'processing'}
              >
                <Mic className="mr-2 h-4 w-4" />
                Audio
              </Button>
            </div>

            <LiveStreamCapture
              type={streamType}
              onStreamReady={handleStreamReady}
              onStreamStop={handleStreamStop}
              isProcessing={status === 'processing'}
            />
          </TabsContent>
        </Tabs>

        {(status !== 'idle' || result) && (
          <div className="mt-4">
            <AIProcessingStatus
              status={status}
              progress={progress}
              message={message}
              error={error || undefined}
              result={result || undefined}
            />
          </div>
        )}

        {status === 'completed' && (
          <div className="mt-4">
            <Button variant="outline" onClick={reset} className="w-full">
              Analyze Another
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

