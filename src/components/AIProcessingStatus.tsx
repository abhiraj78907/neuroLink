import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle, Sparkles, AlertTriangle } from 'lucide-react';

export interface AIProcessingStatusProps {
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress?: number;
  message?: string;
  error?: string;
  result?: any;
}

export function AIProcessingStatus({
  status,
  progress = 0,
  message,
  error,
  result,
}: AIProcessingStatusProps) {
  if (status === 'idle') {
    return null;
  }

  return (
    <Card className="card-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Processing</CardTitle>
          </div>
          <Badge
            variant={
              status === 'completed'
                ? 'default'
                : status === 'error'
                ? 'destructive'
                : 'secondary'
            }
          >
            {status === 'processing' && 'Processing...'}
            {status === 'completed' && 'Complete'}
            {status === 'error' && 'Error'}
          </Badge>
        </div>
        <CardDescription>
          {message || 'Analyzing with Gemini AI...'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'processing' && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing your data with AI...</span>
            </div>
          </>
        )}

        {status === 'completed' && result && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Analysis completed successfully! Results are being saved.
            </AlertDescription>
          </Alert>
        )}

        {status === 'error' && error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && status === 'completed' && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span>Risk Indicators</span>
            </div>
            {result.riskIndicators && result.riskIndicators.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {result.riskIndicators.map((indicator: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {indicator}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No significant risk indicators detected.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

