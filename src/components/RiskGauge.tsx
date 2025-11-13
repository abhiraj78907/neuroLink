import { cn } from '@/lib/utils';

interface RiskGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function RiskGauge({ score, size = 'md', showLabel = true, className }: RiskGaugeProps) {
  const getRiskLevel = (score: number) => {
    if (score < 30) return { label: 'Low', color: 'text-risk-low', bg: 'bg-risk-low' };
    if (score < 50) return { label: 'Medium', color: 'text-risk-medium', bg: 'bg-risk-medium' };
    if (score < 75) return { label: 'High', color: 'text-risk-high', bg: 'bg-risk-high' };
    return { label: 'Critical', color: 'text-risk-critical', bg: 'bg-risk-critical' };
  };

  const risk = getRiskLevel(score);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke={`hsl(var(--risk-${risk.label.toLowerCase()}))`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold', risk.color, textSizeClasses[size])}>
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={cn('font-medium', risk.color, labelSizeClasses[size])}>
          {risk.label} Risk
        </span>
      )}
    </div>
  );
}
