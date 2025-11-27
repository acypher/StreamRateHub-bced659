import axios from 'axios';
import * as cheerio from 'cheerio';
import Bottleneck from 'bottleneck';

// Rate limiter to prevent overwhelming target sites
const limiter = new Bottleneck({
  minTime: 1000, // Minimum 1 second between requests
  maxConcurrent: 1,
});

interface RatingData {
  source: string;
  criticsRating?: string;
  audienceRating?: string;
}

interface StreamingPlatform {
  name: string;
  cost?: string; // e.g., "Free with subscription", "Rent $3.99", "Buy $14.99"
}

interface ScrapedData {
  title: string;
  year?: string;
  posterUrl?: string;
  ratings: RatingData[];
  plot?: string;
  cast?: string[];
  reviewerSummary?: string;
  streamingPlatforms?: StreamingPlatform[];
}

/**
 * Scrapes Rotten Tomatoes for movie/TV show data
 */
async function scrapeRottenTomatoes(query: string): Promise<Partial<ScrapedData>> {
  console.log(`[ScrapingService] Scraping Rotten Tomatoes for: ${query}`);

  try {
    // Search for the title
    const searchUrl = `https://www.rottentomatoes.com/search?search=${encodeURIComponent(query)}`;
    const response = await limiter.schedule(() =>
      axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 10000,
      })
    );

    const $ = cheerio.load(response.data);

    // Try to find the first movie/TV result
    const firstResult = $('search-page-media-row').first();

    if (firstResult.length === 0) {
      console.log('[ScrapingService] No Rotten Tomatoes results found');
      return {
        ratings: [{
          source: 'Rotten Tomatoes',
          criticsRating: 'N/A',
          audienceRating: 'N/A',
        }],
      };
    }

    // Extract the link to the movie page
    const movieLink = firstResult.find('a[slot="title"]').attr('href');

    if (!movieLink) {
      console.log('[ScrapingService] No Rotten Tomatoes movie link found');
      return {
        ratings: [{
          source: 'Rotten Tomatoes',
          criticsRating: 'N/A',
          audienceRating: 'N/A',
        }],
      };
    }

    // Fetch the movie page
    const movieUrl = movieLink.startsWith('http') ? movieLink : `https://www.rottentomatoes.com${movieLink}`;
    const movieResponse = await limiter.schedule(() =>
      axios.get(movieUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 10000,
      })
    );

    const $movie = cheerio.load(movieResponse.data);

    // Extract title and year from JSON-LD structured data
    let title = query;
    let year: string | undefined;
    let tomatometer: string | undefined;
    let audienceScore: string | undefined;
    let plot: string | undefined;
    const cast: string[] = [];
    const streamingPlatforms: StreamingPlatform[] = [];

    // Try to extract data from JSON-LD
    const jsonLdScript = $movie('script[type="application/ld+json"]').first();
    if (jsonLdScript.length > 0) {
      try {
        const jsonData = JSON.parse(jsonLdScript.html() || '{}');
        if (jsonData.name) title = jsonData.name;
        if (jsonData.dateCreated) {
          const yearMatch = jsonData.dateCreated.match(/\d{4}/);
          if (yearMatch) year = yearMatch[0];
        }
        if (jsonData.aggregateRating?.ratingValue) {
          tomatometer = jsonData.aggregateRating.ratingValue.toString();
        }
        if (jsonData.description) plot = jsonData.description;
        if (jsonData.actor && Array.isArray(jsonData.actor)) {
          jsonData.actor.slice(0, 8).forEach((actor: { name?: string }) => {
            if (actor.name) cast.push(actor.name);
          });
        }
      } catch (e) {
        const err = e as Error;
        console.log('[ScrapingService] Failed to parse RT JSON-LD:', err.message);
      }
    }

    // Try to extract ratings from embedded JSON data
    const htmlContent = movieResponse.data;
    const jsonMatch = htmlContent.match(/"audienceScore":\{[^}]*"score":"(\d+)"[^}]*\}[^}]*"criticsScore":\{[^}]*"score":"(\d+)"/);
    if (jsonMatch) {
      audienceScore = jsonMatch[1];
      tomatometer = jsonMatch[2];
    } else {
      // Alternative pattern
      const altMatch = htmlContent.match(/"criticsScore":\{[^}]*"score":"(\d+)"[^}]*\}[^}]*"audienceScore":\{[^}]*"score":"(\d+)"/);
      if (altMatch) {
        tomatometer = altMatch[1];
        audienceScore = altMatch[2];
      }
    }

    // Try to extract streaming platform data from the page
    try {
      // Look for affiliate links or streaming service mentions
      $movie('where-to-watch a, [data-qa="affiliate-link"]').each((_, el) => {
        const linkText = $movie(el).text().trim().toLowerCase();
        const href = $movie(el).attr('href') || '';

        if (linkText.includes('netflix') || href.includes('netflix')) {
          streamingPlatforms.push({ name: 'Netflix' });
        } else if (linkText.includes('prime') || linkText.includes('amazon') || href.includes('amazon')) {
          streamingPlatforms.push({ name: 'Prime' });
        } else if (linkText.includes('apple') || href.includes('apple')) {
          streamingPlatforms.push({ name: 'Apple TV' });
        } else if (linkText.includes('hbo') || linkText.includes('max') || href.includes('hbo')) {
          streamingPlatforms.push({ name: 'HBO' });
        } else if (linkText.includes('disney') || href.includes('disney')) {
          streamingPlatforms.push({ name: 'Disney' });
        } else if (linkText.includes('hulu') || href.includes('hulu')) {
          streamingPlatforms.push({ name: 'Hulu' });
        }
      });

      console.log(`[ScrapingService] RT Streaming platforms found: ${streamingPlatforms.length}`);
    } catch (e) {
      const err = e as Error;
      console.log('[ScrapingService] Failed to extract RT streaming data:', err.message);
    }

    console.log(`[ScrapingService] Rotten Tomatoes data extracted: Tomatometer=${tomatometer}%, Audience=${audienceScore}%`);

    return {
      title,
      year,
      ratings: [{
        source: 'Rotten Tomatoes',
        criticsRating: tomatometer ? `${tomatometer}%` : 'N/A',
        audienceRating: audienceScore ? `${audienceScore}%` : 'N/A',
      }],
      plot: plot || undefined,
      cast: cast.length > 0 ? cast : undefined,
      streamingPlatforms: streamingPlatforms.length > 0 ? streamingPlatforms : undefined,
    };
  } catch (error) {
    const err = error as Error;
    console.error(`[ScrapingService] Rotten Tomatoes error: ${err.message}`);
    return {
      ratings: [{
        source: 'Rotten Tomatoes',
        criticsRating: 'N/A',
        audienceRating: 'N/A',
      }],
    };
  }
}

/**
 * Scrapes Metacritic for movie/TV show data
 */
async function scrapeMetacritic(query: string): Promise<Partial<ScrapedData>> {
  console.log(`[ScrapingService] Scraping Metacritic for: ${query}`);

  try {
    const searchUrl = `https://www.metacritic.com/search/${encodeURIComponent(query)}/`;
    const response = await limiter.schedule(() =>
      axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 10000,
      })
    );

    const $ = cheerio.load(response.data);

    // Find first movie or TV result - try multiple selectors
    let movieLink: string | undefined;

    // Try new structure first
    const searchResultItem = $('a[data-testid="search-result-item"]').first();
    if (searchResultItem.length > 0) {
      movieLink = searchResultItem.attr('href');
    }

    // Fallback to old structure
    if (!movieLink) {
      const firstResult = $('.c-finderProductCard').first();
      if (firstResult.length > 0) {
        movieLink = firstResult.find('a.c-finderProductCard_link').attr('href');
      }
    }

    if (!movieLink) {
      console.log('[ScrapingService] No Metacritic movie link found');
      return {
        ratings: [{
          source: 'Metacritic',
          criticsRating: 'N/A',
          audienceRating: 'N/A',
        }],
      };
    }

    // Fetch the movie page
    const movieUrl = movieLink.startsWith('http') ? movieLink : `https://www.metacritic.com${movieLink}`;
    const movieResponse = await limiter.schedule(() =>
      axios.get(movieUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 10000,
      })
    );

    const $movie = cheerio.load(movieResponse.data);

    let metascore: string | undefined;
    let userScore: string | undefined;
    let plot: string | undefined;
    const cast: string[] = [];

    // Try to extract data from JSON-LD structured data
    const jsonLdScript = $movie('script[type="application/ld+json"]').first();
    if (jsonLdScript.length > 0) {
      try {
        const jsonData = JSON.parse(jsonLdScript.html() || '{}');
        if (jsonData.aggregateRating?.ratingValue) {
          metascore = jsonData.aggregateRating.ratingValue.toString();
        }
        if (jsonData.description) plot = jsonData.description;
        if (jsonData.actor && Array.isArray(jsonData.actor)) {
          jsonData.actor.slice(0, 8).forEach((actor: { name?: string }) => {
            if (actor.name) cast.push(actor.name);
          });
        }
      } catch (e) {
        const err = e as Error;
        console.log('[ScrapingService] Failed to parse Metacritic JSON-LD:', err.message);
      }
    }

    // Try to extract Metascore from HTML if not found in JSON-LD
    if (!metascore) {
      const scoreSpan = $movie('.c-siteReviewScore_background span').first().text().trim();
      if (scoreSpan && /^\d+$/.test(scoreSpan)) {
        metascore = scoreSpan;
      }
    }

    // Try to extract user score from HTML
    const userScoreText = $movie('div[data-testid="user-score-info"]').find('.c-siteReviewScore span').text().trim();
    if (userScoreText && /^\d+\.?\d*$/.test(userScoreText)) {
      userScore = userScoreText;
    }

    // Extract plot if not found in JSON-LD
    if (!plot) {
      plot = $movie('.c-productDetails_description').text().trim();
    }

    console.log(`[ScrapingService] Metacritic data extracted: Metascore=${metascore}, User Score=${userScore}`);

    return {
      ratings: [{
        source: 'Metacritic',
        criticsRating: metascore && metascore !== 'tbd' ? metascore : 'N/A',
        audienceRating: userScore && userScore !== 'tbd' ? userScore : 'N/A',
      }],
      plot: plot || undefined,
      cast: cast.length > 0 ? cast.slice(0, 8) : undefined,
    };
  } catch (error) {
    const err = error as Error;
    console.error(`[ScrapingService] Metacritic error: ${err.message}`);
    return {
      ratings: [{
        source: 'Metacritic',
        criticsRating: 'N/A',
        audienceRating: 'N/A',
      }],
    };
  }
}

/**
 * Scrapes IMDB for movie/TV show data including streaming availability
 */
async function scrapeIMDB(query: string): Promise<Partial<ScrapedData>> {
  console.log(`[ScrapingService] Scraping IMDB for: ${query}`);

  try {
    const searchUrl = `https://www.imdb.com/find/?q=${encodeURIComponent(query)}&s=tt&exact=true`;
    const response = await limiter.schedule(() =>
      axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 10000,
      })
    );

    const $ = cheerio.load(response.data);

    // Find first movie or TV result
    const firstResult = $('section[data-testid="find-results-section-title"] ul li').first();

    if (firstResult.length === 0) {
      console.log('[ScrapingService] No IMDB results found');
      return {
        ratings: [{
          source: 'IMDB',
          criticsRating: 'N/A',
          audienceRating: 'N/A',
        }],
      };
    }

    const movieLink = firstResult.find('a').attr('href');

    if (!movieLink) {
      console.log('[ScrapingService] No IMDB movie link found');
      return {
        ratings: [{
          source: 'IMDB',
          criticsRating: 'N/A',
          audienceRating: 'N/A',
        }],
      };
    }

    // Fetch the movie page
    const movieUrl = movieLink.startsWith('http') ? movieLink : `https://www.imdb.com${movieLink}`;
    const movieResponse = await limiter.schedule(() =>
      axios.get(movieUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 10000,
      })
    );

    const $movie = cheerio.load(movieResponse.data);

    // Extract title
    const title = $movie('h1[data-testid="hero__pageTitle"]').text().trim() ||
                 $movie('h1').first().text().trim() ||
                 query;

    // Extract year
    const year = $movie('a[href*="releaseinfo"]').first().text().trim() ||
                $movie('span.sc-').text().match(/\d{4}/)?.[0];

    // Extract rating
    const rating = $movie('div[data-testid="hero-rating-bar__aggregate-rating__score"] span').first().text().trim() ||
                  $movie('span[itemprop="ratingValue"]').text().trim();

    // Extract plot
    const plot = $movie('span[data-testid="plot-xl"]').text().trim() ||
                $movie('span[data-testid="plot-l"]').text().trim() ||
                $movie('p span.sc-').first().text().trim();

    // Extract poster
    const posterUrl = $movie('img[data-testid="hero-media__poster"]').attr('src') ||
                     $movie('div.ipc-media img').attr('src');

    // Extract cast
    const cast: string[] = [];
    $movie('a[data-testid="title-cast-item__actor"]').each((_, el) => {
      const actorName = $movie(el).text().trim();
      if (actorName) cast.push(actorName);
    });

    // Extract reviewer summary from first few reviews
    const reviewTexts: string[] = [];
    $movie('div.review-container div.text').slice(0, 3).each((_, el) => {
      const reviewText = $movie(el).text().trim();
      if (reviewText) reviewTexts.push(reviewText);
    });

    // Extract streaming platform data
    const streamingPlatforms: StreamingPlatform[] = [];
    try {
      // Look for "Watch on" section or streaming service buttons
      $movie('[data-testid*="watch"], a[href*="justwatch"], .ipc-watch-options').each((_, el) => {
        const text = $movie(el).text().toLowerCase();
        const href = $movie(el).attr('href') || '';

        // Check for specific platforms
        if (text.includes('netflix') || href.includes('netflix')) {
          if (!streamingPlatforms.find(p => p.name === 'Netflix')) {
            streamingPlatforms.push({ name: 'Netflix' });
          }
        }
        if (text.includes('prime') || text.includes('amazon') || href.includes('amazon')) {
          if (!streamingPlatforms.find(p => p.name === 'Prime')) {
            streamingPlatforms.push({ name: 'Prime' });
          }
        }
        if (text.includes('apple tv') || href.includes('apple')) {
          if (!streamingPlatforms.find(p => p.name === 'Apple TV')) {
            streamingPlatforms.push({ name: 'Apple TV' });
          }
        }
        if (text.includes('hbo') || text.includes('max') || href.includes('hbo')) {
          if (!streamingPlatforms.find(p => p.name === 'HBO')) {
            streamingPlatforms.push({ name: 'HBO' });
          }
        }
        if (text.includes('disney') || href.includes('disney')) {
          if (!streamingPlatforms.find(p => p.name === 'Disney')) {
            streamingPlatforms.push({ name: 'Disney' });
          }
        }
        if (text.includes('hulu') || href.includes('hulu')) {
          if (!streamingPlatforms.find(p => p.name === 'Hulu')) {
            streamingPlatforms.push({ name: 'Hulu' });
          }
        }
      });

      // Check for rent/buy options and add cost information
      $movie('button, a').each((_, el) => {
        const text = $movie(el).text();
        const rentMatch = text.match(/rent.*?\$(\d+\.?\d*)/i);
        const buyMatch = text.match(/buy.*?\$(\d+\.?\d*)/i);

        if (rentMatch) {
          const platform = text.toLowerCase();
          if (platform.includes('prime') || platform.includes('amazon')) {
            const existing = streamingPlatforms.find(p => p.name === 'Prime');
            if (existing && !existing.cost) {
              existing.cost = `Rent $${rentMatch[1]}`;
            } else if (!existing) {
              streamingPlatforms.push({ name: 'Prime', cost: `Rent $${rentMatch[1]}` });
            }
          } else if (platform.includes('apple')) {
            const existing = streamingPlatforms.find(p => p.name === 'Apple TV');
            if (existing && !existing.cost) {
              existing.cost = `Rent $${rentMatch[1]}`;
            } else if (!existing) {
              streamingPlatforms.push({ name: 'Apple TV', cost: `Rent $${rentMatch[1]}` });
            }
          }
        }

        if (buyMatch) {
          const platform = text.toLowerCase();
          if (platform.includes('prime') || platform.includes('amazon')) {
            const existing = streamingPlatforms.find(p => p.name === 'Prime');
            if (existing && existing.cost && existing.cost.includes('Rent')) {
              existing.cost += ` / Buy $${buyMatch[1]}`;
            } else if (existing && !existing.cost) {
              existing.cost = `Buy $${buyMatch[1]}`;
            } else if (!existing) {
              streamingPlatforms.push({ name: 'Prime', cost: `Buy $${buyMatch[1]}` });
            }
          } else if (platform.includes('apple')) {
            const existing = streamingPlatforms.find(p => p.name === 'Apple TV');
            if (existing && existing.cost && existing.cost.includes('Rent')) {
              existing.cost += ` / Buy $${buyMatch[1]}`;
            } else if (existing && !existing.cost) {
              existing.cost = `Buy $${buyMatch[1]}`;
            } else if (!existing) {
              streamingPlatforms.push({ name: 'Apple TV', cost: `Buy $${buyMatch[1]}` });
            }
          }
        }
      });

      console.log(`[ScrapingService] IMDB Streaming platforms found: ${streamingPlatforms.length}`);
    } catch (e) {
      const err = e as Error;
      console.log('[ScrapingService] Failed to extract IMDB streaming data:', err.message);
    }

    console.log(`[ScrapingService] IMDB data extracted: Rating=${rating}/10`);

    return {
      title,
      year,
      posterUrl,
      ratings: [{
        source: 'IMDB',
        criticsRating: rating ? `${rating}/10` : 'N/A',
        audienceRating: undefined, // IMDB doesn't separate critic/audience
      }],
      plot: plot || undefined,
      cast: cast.length > 0 ? cast.slice(0, 8) : undefined,
      reviewerSummary: reviewTexts.length > 0 ? reviewTexts.join(' ') : undefined,
      streamingPlatforms: streamingPlatforms.length > 0 ? streamingPlatforms : undefined,
    };
  } catch (error) {
    const err = error as Error;
    console.error(`[ScrapingService] IMDB error: ${err.message}`);
    return {
      ratings: [{
        source: 'IMDB',
        criticsRating: 'N/A',
        audienceRating: 'N/A',
      }],
    };
  }
}

/**
 * Aggregates data from multiple sources
 */
function aggregateData(rtData: Partial<ScrapedData>, mcData: Partial<ScrapedData>, imdbData: Partial<ScrapedData>): ScrapedData {
  console.log('[ScrapingService] Aggregating data from all sources');

  // Prioritize IMDB for title and basic info, fallback to RT, then MC
  const title = imdbData.title || rtData.title || mcData.title || 'Unknown';
  const year = imdbData.year || rtData.year || mcData.year;
  const posterUrl = imdbData.posterUrl;

  // Combine all ratings
  const ratings: RatingData[] = [
    ...(rtData.ratings || []),
    ...(mcData.ratings || []),
    ...(imdbData.ratings || []),
  ];

  // Prioritize plot: IMDB > RT > MC
  const plot = imdbData.plot || rtData.plot || mcData.plot;

  // Combine cast (prefer IMDB, fallback to others)
  const cast = imdbData.cast || rtData.cast || mcData.cast;

  // Aggregate streaming platforms from all sources (remove duplicates)
  const streamingPlatformsMap = new Map<string, StreamingPlatform>();

  [rtData.streamingPlatforms, imdbData.streamingPlatforms].forEach(platforms => {
    if (platforms) {
      platforms.forEach(platform => {
        if (!streamingPlatformsMap.has(platform.name)) {
          streamingPlatformsMap.set(platform.name, platform);
        } else {
          // If platform exists and new data has cost info, update it
          const existing = streamingPlatformsMap.get(platform.name)!;
          if (platform.cost && !existing.cost) {
            existing.cost = platform.cost;
          }
        }
      });
    }
  });

  const streamingPlatforms = Array.from(streamingPlatformsMap.values());
  console.log(`[ScrapingService] Aggregated streaming platforms: ${streamingPlatforms.length}`);

  // Generate reviewer summary based on available ratings
  let reviewerSummary: string | undefined;

  // Try to use IMDB reviewer summary first
  if (imdbData.reviewerSummary) {
    reviewerSummary = imdbData.reviewerSummary;
  } else {
    // Generate a simple summary based on ratings
    const rtCriticsRating = rtData.ratings?.[0]?.criticsRating;
    const mcCriticsRating = mcData.ratings?.[0]?.criticsRating;
    const imdbRating = imdbData.ratings?.[0]?.criticsRating;

    const summaryParts: string[] = [];

    if (rtCriticsRating && rtCriticsRating !== 'N/A') {
      const rtScore = parseInt(rtCriticsRating);
      if (rtScore >= 80) {
        summaryParts.push('Critics on Rotten Tomatoes praise this title with strong positive reviews.');
      } else if (rtScore >= 60) {
        summaryParts.push('Critics on Rotten Tomatoes give this title generally favorable reviews.');
      } else {
        summaryParts.push('Critics on Rotten Tomatoes have mixed reactions to this title.');
      }
    }

    if (mcCriticsRating && mcCriticsRating !== 'N/A') {
      const mcScore = parseInt(mcCriticsRating);
      if (mcScore >= 75) {
        summaryParts.push('Metacritic critics rate it highly with universal acclaim.');
      } else if (mcScore >= 50) {
        summaryParts.push('Metacritic critics provide generally positive feedback.');
      } else {
        summaryParts.push('Metacritic critics have varied opinions.');
      }
    }

    if (imdbRating && imdbRating !== 'N/A') {
      const imdbScore = parseFloat(imdbRating);
      if (imdbScore >= 8.0) {
        summaryParts.push('IMDB users rate it as an excellent title with broad appeal.');
      } else if (imdbScore >= 6.5) {
        summaryParts.push('IMDB users find it enjoyable and worthwhile.');
      } else {
        summaryParts.push('IMDB users have mixed opinions on this title.');
      }
    }

    if (summaryParts.length > 0) {
      reviewerSummary = summaryParts.join(' ');
    }
  }

  return {
    title,
    year,
    posterUrl,
    ratings,
    plot,
    cast,
    reviewerSummary,
    streamingPlatforms: streamingPlatforms.length > 0 ? streamingPlatforms : undefined,
  };
}

/**
 * Main function to scrape all sources and aggregate data
 */
export async function scrapeMediaData(query: string): Promise<ScrapedData> {
  console.log(`[ScrapingService] Starting scrape for query: ${query}`);

  try {
    // Run all scrapers in parallel for better performance
    const [rtData, mcData, imdbData] = await Promise.all([
      scrapeRottenTomatoes(query),
      scrapeMetacritic(query),
      scrapeIMDB(query),
    ]);

    const aggregatedData = aggregateData(rtData, mcData, imdbData);

    console.log(`[ScrapingService] Scraping completed successfully for: ${query}`);

    return aggregatedData;
  } catch (error) {
    const err = error as Error;
    console.error(`[ScrapingService] Fatal scraping error: ${err.message}`, error);
    throw new Error('Failed to scrape media data from all sources');
  }
}
