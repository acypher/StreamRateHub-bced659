#!/usr/bin/env node

/**
 * URL Monitoring Script for CineCite
 *
 * This script monitors the application's accessibility and checks if URLs are responding correctly.
 * It can be run periodically to ensure the application remains accessible.
 *
 * Usage: node scripts/monitor-url.js
 */

const https = require('https');
const http = require('http');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Configuration
const PERMANENT_URL = 'https://preview-0ag1onvs.ui.pythagora.ai';
const ENDPOINTS = [
  { path: '/api/health', name: 'Health Check' },
  { path: '/api/url-info', name: 'URL Info' },
  { path: '/api/permanent-url', name: 'Permanent URL' },
  { path: '/', name: 'Frontend' },
];

// Helper function for colored console output
function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Helper function to make HTTP/HTTPS requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const startTime = Date.now();

    const req = protocol.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const duration = Date.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          duration,
          data,
          headers: res.headers,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Test a single endpoint
async function testEndpoint(baseUrl, endpoint) {
  const url = `${baseUrl}${endpoint.path}`;

  try {
    log('cyan', `\n🔍 Testing: ${endpoint.name}`);
    log('blue', `   URL: ${url}`);

    const response = await makeRequest(url);

    if (response.statusCode === 200) {
      log('green', `   ✅ Status: ${response.statusCode} OK`);
      log('green', `   ⏱️  Response time: ${response.duration}ms`);

      // Try to parse JSON response
      try {
        const json = JSON.parse(response.data);
        log('green', `   📦 Response: ${JSON.stringify(json, null, 2).substring(0, 200)}...`);
      } catch (e) {
        log('green', `   📦 Response length: ${response.data.length} bytes`);
      }

      return { success: true, duration: response.duration };
    } else if (response.statusCode >= 300 && response.statusCode < 400) {
      log('yellow', `   ⚠️  Status: ${response.statusCode} (Redirect)`);
      log('yellow', `   📍 Location: ${response.headers.location || 'N/A'}`);
      return { success: false, redirect: true, location: response.headers.location };
    } else {
      log('red', `   ❌ Status: ${response.statusCode}`);
      return { success: false, statusCode: response.statusCode };
    }
  } catch (error) {
    log('red', `   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main monitoring function
async function monitorUrl() {
  log('bright', '╔════════════════════════════════════════════════════════════╗');
  log('bright', '║         CineCite URL Monitoring & Health Check            ║');
  log('bright', '╚════════════════════════════════════════════════════════════╝');

  log('cyan', `\n📡 Monitoring URL: ${PERMANENT_URL}`);
  log('cyan', `🕐 Timestamp: ${new Date().toISOString()}`);

  const results = {
    totalTests: ENDPOINTS.length,
    passed: 0,
    failed: 0,
    redirects: 0,
    startTime: Date.now(),
  };

  // Test each endpoint
  for (const endpoint of ENDPOINTS) {
    const result = await testEndpoint(PERMANENT_URL, endpoint);

    if (result.success) {
      results.passed++;
    } else if (result.redirect) {
      results.redirects++;
    } else {
      results.failed++;
    }
  }

  // Summary
  const totalTime = Date.now() - results.startTime;

  log('bright', '\n╔════════════════════════════════════════════════════════════╗');
  log('bright', '║                        SUMMARY                             ║');
  log('bright', '╚════════════════════════════════════════════════════════════╝');

  log('cyan', `\n📊 Total Tests: ${results.totalTests}`);
  log('green', `✅ Passed: ${results.passed}`);

  if (results.failed > 0) {
    log('red', `❌ Failed: ${results.failed}`);
  }

  if (results.redirects > 0) {
    log('yellow', `⚠️  Redirects: ${results.redirects}`);
  }

  log('cyan', `⏱️  Total Time: ${totalTime}ms`);

  // Overall status
  if (results.failed === 0 && results.redirects === 0) {
    log('green', '\n✅ ALL SYSTEMS OPERATIONAL');
    log('green', '   Your permanent URL is working correctly!');
    log('green', `   Bookmark: ${PERMANENT_URL}`);
  } else if (results.redirects > 0) {
    log('yellow', '\n⚠️  WARNING: REDIRECTS DETECTED');
    log('yellow', '   Your URL may be redirecting to another location.');
    log('yellow', '   This could indicate:');
    log('yellow', '   - The deployment URL has changed');
    log('yellow', '   - DNS configuration issues');
    log('yellow', '   - Application routing problems');
    log('cyan', '\n   📝 Recommended actions:');
    log('cyan', '   1. Check if you\'re using the correct permanent URL');
    log('cyan', '   2. Visit the /url-info page in your browser');
    log('cyan', '   3. Clear browser cache and cookies');
    log('cyan', '   4. Update any bookmarks with the current URL');
  } else {
    log('red', '\n❌ ISSUES DETECTED');
    log('red', '   Some endpoints are not responding correctly.');
    log('cyan', '\n   📝 Recommended actions:');
    log('cyan', '   1. Check if the application is running');
    log('cyan', '   2. Verify network connectivity');
    log('cyan', '   3. Check server logs for errors');
    log('cyan', '   4. Restart the application if necessary');
  }

  log('cyan', '\n────────────────────────────────────────────────────────────');
  log('cyan', '💡 Tip: Run this script periodically to monitor URL health');
  log('cyan', '────────────────────────────────────────────────────────────\n');

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run the monitor
monitorUrl().catch((error) => {
  log('red', `\n❌ Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
