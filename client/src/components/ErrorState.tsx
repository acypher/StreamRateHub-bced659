import { AlertCircle, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6 max-w-2xl mx-auto">
      <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold">Search Error</AlertTitle>
        <AlertDescription className="text-base mt-2">
          {message}
        </AlertDescription>
      </Alert>
      
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          <Search className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}