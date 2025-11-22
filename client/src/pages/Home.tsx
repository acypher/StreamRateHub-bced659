import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { SearchResults } from '@/components/SearchResults';
import { searchMedia, type SearchResult } from '@/api/search';
import { useToast } from '@/hooks/useToast';

export function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    console.log('[Home] Starting search for:', query);
    setIsLoading(true);
    setError(null);
    setResult(null);
    setSearchQuery(query);

    try {
      const response = await searchMedia(query);
      console.log('[Home] Search successful:', response.data.title);
      setResult(response.data);
    } catch (err: any) {
      console.error('[Home] Search failed:', err.message);
      setError(err.message);
      toast({
        title: 'Search Failed',
        description: err.message,
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
      {/* Hero Section - Always visible */}
      <div className={`flex flex-col items-center justify-center transition-all duration-500 ${result || isLoading || error ? 'py-8' : 'flex-1'}`}>
        <div className="text-center space-y-6 mb-8">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-12 w-12 text-purple-600 dark:text-purple-400 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              StreamRate Hub
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