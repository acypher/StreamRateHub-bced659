import { Film, Calendar } from 'lucide-react';
import { RatingsTable } from './RatingsTable';
import { PlotSummary } from './PlotSummary';
import { CastList } from './CastList';
import { ReviewerSummary } from './ReviewerSummary';
import type { SearchResult } from '@/api/search';

interface SearchResultsProps {
  result: SearchResult;
}

export function SearchResults({ result }: SearchResultsProps) {
  console.log('[SearchResults] Rendering result:', result.title);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Title Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl text-white">
        <div className="flex items-start gap-6">
          {result.posterUrl && (
            <div className="flex-shrink-0">
              <img 
                src={result.posterUrl} 
                alt={result.title}
                className="w-32 h-48 object-cover rounded-lg shadow-lg border-4 border-white/20"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Film className="h-8 w-8" />
              <h1 className="text-4xl font-bold">{result.title}</h1>
            </div>
            {result.year && (
              <div className="flex items-center gap-2 text-white/90">
                <Calendar className="h-5 w-5" />
                <span className="text-xl">{result.year}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ratings Table */}
      <RatingsTable ratings={result.ratings} />

      {/* Plot Summary */}
      <PlotSummary summary={result.plotSummary} />

      {/* Cast List */}
      <CastList cast={result.cast} />

      {/* Reviewer Summary */}
      <ReviewerSummary summary={result.reviewerSummary} />
    </div>
  );
}