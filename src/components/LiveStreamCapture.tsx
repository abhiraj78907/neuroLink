import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, VideoOff, Mic, MicOff, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LiveStreamCaptureProps {
  type: 'video' | 'audio';
  onStreamReady: (stream: MediaStream) => void;
  onStreamStop: () => void;
  isProcessing?: boolean;
}

export function LiveStreamCapture({
  type,
  onStreamReady,
  onStreamStop,
  isProcessing = false,
}: LiveStreamCaptureProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startStream = async () => {
    try {
      setError(null);
      
      const constraints: MediaStreamConstraints = {
        video: type === 'video' ? { facingMode: 'user' } : false,
        audio: type === 'audio' || type === 'video',
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current && type === 'video') {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsStreaming(true);
      onStreamReady(stream);
    } catch (err: any) {
      setError(err.message || 'Failed to access camera/microphone');
      console.error('Stream error:', err);
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
    onStreamStop();
  };

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle>
          {type === 'video' ? 'Live Video Capture' : 'Live Audio Capture'}
        </CardTitle>
        <CardDescription>
          {type === 'video'
            ? 'Capture real-time video for facial recognition analysis'
            : 'Capture real-time audio for speech analysis'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {type === 'video' && (
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                "w-full h-full object-cover",
                !isStreaming && "hidden"
              )}
            />
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center">
                <VideoOff className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          {!isStreaming ? (
            <Button
              onClick={startStream}
              disabled={isProcessing}
              className="flex-1"
            >
              {type === 'video' ? (
                <>
                  <Video className="mr-2 h-4 w-4" />
                  Start Video
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Audio
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={stopStream}
              variant="destructive"
              disabled={isProcessing}
              className="flex-1"
            >
              <Square className="mr-2 h-4 w-4" />
              Stop {type === 'video' ? 'Video' : 'Audio'}
            </Button>
          )}
        </div>

        {isStreaming && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span>Streaming active</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

