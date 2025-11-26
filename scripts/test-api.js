/**
 * Script to test the CineCite API endpoints
 * This script tests the search functionality without requiring a database
 *
 * IMPORTANT: Run this script from the project root directory!
 *
 * ✅ Correct:   node scripts/test-api.js
 * ❌ Incorrect: cd scripts && node test-api.js
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testSearchEndpoint(query) {
  try {
    log(`\n🔍 Testing search for: "${query}"`, 'blue');
    const startTime = Date.now();

    const response = await axios.get(`${API_BASE_URL}/api/search`, {
      params: { q: query },
      timeout: 60000, // 60 second timeout for scraping
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    if (response.data && response.data.title) {
      log(`✅ Search successful (${duration}s)`, 'green');
      log(`   Title: ${response.data.title}`, 'green');
      log(`   Year: ${response.data.year || 'N/A'}`, 'green');

      // Display ratings
      if (response.data.ratings) {
        log(`   Ratings:`, 'green');
        if (response.data.ratings.rottenTomatoes) {
          log(`     - Rotten Tomatoes: ${response.data.ratings.rottenTomatoes.critics || 'N/A'} (critics), ${response.data.ratings.rottenTomatoes.audience || 'N/A'} (audience)`, 'green');
        }
        if (response.data.ratings.metacritic) {
          log(`     - Metacritic: ${response.data.ratings.metacritic.critics || 'N/A'} (critics), ${response.data.ratings.metacritic.audience || 'N/A'} (audience)`, 'green');
        }
        if (response.data.ratings.imdb) {
          log(`     - IMDB: ${response.data.ratings.imdb.rating || 'N/A'}`, 'green');
        }
      }

      // Display cast count
      if (response.data.cast && response.data.cast.length > 0) {
        log(`   Cast: ${response.data.cast.length} members`, 'green');
      }

      return true;
    } else {
      log(`⚠️  Search returned empty result`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Search failed: ${error.message}`, 'red');
    if (error.response) {
      log(`   Status: ${error.response.status}`, 'red');
      log(`   Error: ${error.response.data?.error || 'Unknown error'}`, 'red');
    }
    return false;
  }
}

async function testHealthEndpoint() {
  try {
    log(`\n💓 Testing health endpoint`, 'blue');
    const response = await axios.get(`${API_BASE_URL}/api`);

    if (response.data && response.data.message) {
      log(`✅ Health check passed: ${response.data.message}`, 'green');
      return true;
    } else {
      log(`⚠️  Unexpected health check response`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Health check failed: ${error.message}`, 'red');
    return false;
  }
}

async function runTests() {
  log('='.repeat(60), 'blue');
  log('CineCite API Test Suite', 'blue');
  log('='.repeat(60), 'blue');
  log(`Testing API at: ${API_BASE_URL}`, 'blue');

  const results = {
    passed: 0,
    failed: 0,
  };

  // Test health endpoint
  const healthResult = await testHealthEndpoint();
  if (healthResult) results.passed++;
  else results.failed++;

  // Test search with different queries
  const testQueries = [
    'The Matrix',
    'Breaking Bad',
    'Inception',
  ];

  for (const query of testQueries) {
    const searchResult = await testSearchEndpoint(query);
    if (searchResult) results.passed++;
    else results.failed++;

    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Summary
  log('\n' + '='.repeat(60), 'blue');
  log('Test Summary', 'blue');
  log('='.repeat(60), 'blue');
  log(`✅ Passed: ${results.passed}`, 'green');
  log(`❌ Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Total: ${results.passed + results.failed}`, 'blue');

  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test suite error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
