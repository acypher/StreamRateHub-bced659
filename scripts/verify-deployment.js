#!/usr/bin/env node

/**
 * Deployment Verification Script
 *
 * This script verifies that the StreamRateHub application is properly deployed
 * and accessible at the permanent URL. It tests both frontend and backend endpoints.
 */

const https = require('https');
const http = require('http');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Deployment configuration
const DEPLOYMENT_URL = 'https://preview-01x0eatj.ui.pythagora.ai';
const API_BASE = `${DEPLOYMENT_URL}/api`;

/**
 * Make an HTTP request and return the response
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const startTime = Date.now();

    const req = protocol.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const duration = Date.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data,
          duration,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout after 30 seconds'));
    });
  });
}

/**
 * Test a specific endpoint
 */
async function testEndpoint(name, url, expectedStatus = 200) {
  console.log(`${colors.cyan}Testing: ${name}${colors.reset}`);
  console.log(`${colors.blue}URL: ${url}${colors.reset}`);

  try {
    const response = await makeRequest(url);
    const success = response.statusCode === expectedStatus;

    if (success) {
      console.log(`${colors.green}✓ Status: ${response.statusCode} (${response.duration}ms)${colors.reset}`);

      // Try to parse JSON response
      try {
        const json = JSON.parse(response.data);
        console.log(`${colors.green}✓ Response: ${JSON.stringify(json, null, 2).substring(0, 200)}...${colors.reset}`);
      } catch (e) {
        console.log(`${colors.green}✓ Response received (HTML/Text)${colors.reset}`);
      }
    } else {
      console.log(`${colors.red}✗ Status: ${response.statusCode} (expected ${expectedStatus})${colors.reset}`);
    }

    console.log('');
    return success;
  } catch (error) {
    console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}\n`);
    return false;
  }
}

/**
 * Main verification function
 */
async function verifyDeployment() {
  console.log(`${colors.bright}${colors.cyan}======================================${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}StreamRateHub Deployment Verification${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}======================================${colors.reset}\n`);

  const results = {
    passed: 0,
    failed: 0,
    total: 0,
  };

  // Test 1: Frontend availability
  console.log(`${colors.bright}[1/3] Frontend Availability${colors.reset}`);
  const frontendTest = await testEndpoint(
    'Frontend Homepage',
    DEPLOYMENT_URL,
    200
  );
  results.total++;
  if (frontendTest) results.passed++;
  else results.failed++;

  // Test 2: Backend health check
  console.log(`${colors.bright}[2/3] Backend Health Check${colors.reset}`);
  const healthTest = await testEndpoint(
    'API Health Endpoint',
    `${API_BASE}/health`,
    200
  );
  results.total++;
  if (healthTest) results.passed++;
  else results.failed++;

  // Test 3: Search endpoint (with a simple query)
  console.log(`${colors.bright}[3/3] Search Endpoint Test${colors.reset}`);
  const searchTest = await testEndpoint(
    'Search API (test query: "Inception")',
    `${API_BASE}/search?query=Inception`,
    200
  );
  results.total++;
  if (searchTest) results.passed++;
  else results.failed++;

  // Summary
  console.log(`${colors.bright}${colors.cyan}======================================${colors.reset}`);
  console.log(`${colors.bright}Summary${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}======================================${colors.reset}`);
  console.log(`Total Tests: ${results.total}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}\n`);

  if (results.failed === 0) {
    console.log(`${colors.bright}${colors.green}✓ All deployment checks passed!${colors.reset}`);
    console.log(`${colors.green}The application is accessible at: ${DEPLOYMENT_URL}${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.bright}${colors.red}✗ Some deployment checks failed!${colors.reset}`);
    console.log(`${colors.yellow}Please check the logs above for details.${colors.reset}\n`);
    process.exit(1);
  }
}

// Run verification
console.log(`${colors.cyan}Starting deployment verification...${colors.reset}\n`);
verifyDeployment().catch((error) => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});
