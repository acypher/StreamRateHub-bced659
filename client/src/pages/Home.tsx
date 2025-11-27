import { useState } from 'react';
import { Sparkles, Link2, Info } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { SearchResults } from '@/components/SearchResults';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { searchMedia, type SearchResult } from '@/api/search';
import { useToast } from '@/hooks/useToast';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUrlBanner, setShowUrlBanner] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = async (query: string) => {
    console.log('[Home] Starting search for:', query);
    setIsLoading(true);
    setError(null);
    setResult(null);
    setSearchQuery(query);

    try {
      const response = await searchMedia(query);
      console.log('[Home] Search successful:', response.title);
      setResult(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('[Home] Search failed:', errorMessage);
      setError(errorMessage);
      toast({
        title: 'Search Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      {/* URL Info Banner - Dismissible */}
      {showUrlBanner && (
        <div className="w-full bg-blue-50 dark:bg-blue-950 border-b-2 border-blue-200 dark:border-blue-800 py-3 px-4">
          <Alert className="max-w-6xl mx-auto bg-transparent border-none">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="flex items-center justify-between gap-4">
              <span className="text-sm text-blue-900 dark:text-blue-100">
                <strong>💡 Tip:</strong> Need to access your permanent URL or troubleshoot connection issues? Click the <strong className="font-bold">"URL Info"</strong> button in the top right corner of the page (blue button in the header).
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => navigate('/url-info')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Link2 className="h-4 w-4 mr-1" />
                  Go Now
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowUrlBanner(false)}
                  className="text-blue-600 dark:text-blue-400"
                >
                  Dismiss
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Hero Section - Always visible */}
      <div className={`flex flex-col items-center justify-center transition-all duration-500 ${result || isLoading || error ? 'py-8' : 'flex-1'}`}>
        <div className="text-center space-y-6 mb-8">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-12 w-12 text-purple-600 dark:text-purple-400 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CineCite
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Get ratings and reviews from multiple sources in one place
          </p>
        </div>

        <SearchBar
          onSearch={handleSearch}
          isLoading={isLoading}
          initialValue={searchQuery}
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 pb-8">
        {isLoading && <LoadingState />}
        
        {error && !isLoading && (
          <ErrorState message={error} onRetry={handleRetry} />
        )}
        
        {result && !isLoading && !error && (
          <SearchResults result={result} />
        )}
      </div>
    </div>
  );
}