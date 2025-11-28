import api from './api';

export interface Rating {
  source: string;
  criticsRating?: string;
  audienceRating?: string;
}

export interface StreamingPlatform {
  name: string;
  cost?: string;
  url?: string;
}

export interface SearchResult {
  title: string;
  year?: string;
  posterUrl?: string;
  ratings: Rating[];
  plot?: string;
  cast?: string[];
  reviewerSummary?: string;
  streamingPlatforms?: StreamingPlatform[];
}

// Description: Search for a movie or TV show by name
// Endpoint: POST /api/search
// Request: { query: string }
// Response: { title: string, year?: string, posterUrl?: string, ratings: Rating[], plot?: string, cast?: string[], reviewerSummary?: string, streamingPlatforms?: StreamingPlatform[] }
export const searchMedia = async (query: string): Promise<SearchResult> => {
  console.log('[API] Searching for media:', query);

  try {
    const response = await api.post('/api/search', { query });
    return response.data;
  } catch (error) {
    console.error('[API] Search error:', error);
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new Error(err?.response?.data?.error || err.message || 'An error occurred while searching');
  }
};
