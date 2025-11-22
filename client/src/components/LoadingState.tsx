import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Fetching ratings from multiple sources...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <div className="relative">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full bg-primary/20" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-xl font-semibold text-foreground">{message}</p>
        <p className="text-sm text-muted-foreground">This may take 5-15 seconds...</p>
      </div>
      <div className="flex gap-2">
        <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}