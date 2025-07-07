import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface RateLimitDisplayProps {
  rateLimit: {
    remaining: number;
    limit: number;
    resetTime: string;
  };
}

const RateLimitDisplay: React.FC<RateLimitDisplayProps> = ({ rateLimit }) => {
  const formatTimeUntilReset = (resetTime: string) => {
    const resetDate = new Date(resetTime);
    const now = new Date();
    const diffMs = resetDate.getTime() - now.getTime();
    const diffMins = Math.ceil(diffMs / (1000 * 60));
    
    if (diffMins <= 0) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    
    const diffHours = Math.ceil(diffMins / 60);
    return `${diffHours}h`;
  };

  const isExceeded = rateLimit.remaining <= 0;
  const isLow = rateLimit.remaining <= rateLimit.limit * 0.2 && rateLimit.remaining > 0;

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${
      isExceeded 
        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
        : isLow
        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    }`}>
      <div className="flex items-center gap-2">
        {isExceeded ? (
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
        ) : (
          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        )}
        <span className={`text-sm font-medium ${
          isExceeded 
            ? 'text-red-800 dark:text-red-300'
            : isLow
            ? 'text-yellow-800 dark:text-yellow-300'
            : 'text-blue-800 dark:text-blue-300'
        }`}>
          {isExceeded 
            ? 'Rate limit exceeded'
            : `${rateLimit.remaining}/${rateLimit.limit} requests remaining`
          }
        </span>
      </div>
      {isExceeded && (
        <span className="text-xs text-red-600 dark:text-red-400">
          Resets in {formatTimeUntilReset(rateLimit.resetTime)}
        </span>
      )}
    </div>
  );
};

export default RateLimitDisplay; 