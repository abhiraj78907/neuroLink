import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Mic, File } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileUploaderProps {
  accept?: string;
  maxSize?: number; // in MB
  onFileSelect: (file: File) => void;
  label?: string;
  description?: string;
  type?: 'image' | 'audio' | 'any';
  disabled?: boolean;
}

export function FileUploader({
  accept,
  maxSize = 50,
  onFileSelect,
  label = 'Upload File',
  description,
  type = 'any',
  disabled = false,
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getAcceptTypes = () => {
    if (accept) return accept;
    switch (type) {
      case 'image':
        return 'image/*';
      case 'audio':
        return 'audio/*';
      default:
        return '*/*';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-5 w-5" />;
      case 'audio':
        return <Mic className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      
      <div className="space-y-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept={getAcceptTypes()}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        
        {!selectedFile ? (
          <Card
            className={cn(
              "border-2 border-dashed cursor-pointer transition-colors hover:border-primary/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={!disabled ? handleClick : undefined}
          >
            <CardContent className="flex flex-col items-center justify-center p-8">
              {getIcon()}
              <p className="mt-2 text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">
                Max size: {maxSize}MB
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {getIcon()}
                <div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
}

