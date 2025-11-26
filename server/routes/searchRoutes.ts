import { Router } from 'express';
import { scrapeMediaData } from '../services/scrapingService';

const router = Router();

// Description: Search for movies or TV shows and get aggregated ratings (POST)
// Endpoint: POST /api/search
// Request: { query: string }
// Response: { title: string, year?: string, posterUrl?: string, ratings: Array<{ source: string, criticsRating?: string, audienceRating?: string }>, plot?: string, cast?: string[], reviewerSummary?: string }
router.post('/', async (req, res) => {
  console.log('[SearchRoutes] POST /api/search - Search request received');

  try {
    const { query } = req.body;

    // Validate query
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      console.log('[SearchRoutes] Invalid query parameter');
      return res.status(400).json({
        error: 'Query parameter is required and must be a non-empty string',
      });
    }

    console.log(`[SearchRoutes] Searching for: ${query}`);

    // Scrape data from all sources
    const mediaData = await scrapeMediaData(query.trim());

    console.log(`[SearchRoutes] Successfully retrieved data for: ${mediaData.title}`);

    // Return the aggregated data
    res.status(200).json(mediaData);
  } catch (error) {
    console.error(`[SearchRoutes] Error processing search request: ${error.message}`, error);
    res.status(500).json({
      error: error.message || 'Failed to fetch media data. Please try again.',
    });
  }
});

// Description: Search for movies or TV shows and get aggregated ratings (GET - for easy testing)
// Endpoint: GET /api/search?query=movie_name
// Request: { query: string (as URL parameter) }
// Response: { title: string, year?: string, posterUrl?: string, ratings: Array<{ source: string, criticsRating?: string, audienceRating?: string }>, plot?: string, cast?: string[], reviewerSummary?: string }
router.get('/', async (req, res) => {
  console.log('[SearchRoutes] GET /api/search - Search request received');

  try {
    const { query } = req.query;

    // Validate query
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      console.log('[SearchRoutes] Invalid query parameter');
      return res.status(400).json({
        error: 'Query parameter is required and must be a non-empty string',
      });
    }

    console.log(`[SearchRoutes] Searching for: ${query}`);

    // Scrape data from all sources
    const mediaData = await scrapeMediaData(query.trim());

    console.log(`[SearchRoutes] Successfully retrieved data for: ${mediaData.title}`);

    // Return the aggregated data
    res.status(200).json(mediaData);
  } catch (error) {
    console.error(`[SearchRoutes] Error processing search request: ${error.message}`, error);
    res.status(500).json({
      error: error.message || 'Failed to fetch media data. Please try again.',
    });
  }
});

export default router;
