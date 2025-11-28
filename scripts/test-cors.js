#!/usr/bin/env node

/**
 * CORS Test Script
 *
 * This script tests if the CORS configuration is working correctly
 * by simulating requests from the Pythagora preview environment.
 */

const axios = require('axios');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(50));
  log(title, colors.bright + colors.blue);
  console.log('='.repeat(50) + '\n');
}

async function testCORS() {
  logSection('Testing CORS Configuration');

  const baseURL = 'http://localhost:3000';
  const previewOrigin = 'https://preview-0ag1onvs.ui.pythagora.ai';

  try {
    log('Testing API endpoint with preview origin...', colors.yellow);

    // Test the root endpoint
    const rootResponse = await axios.get(`${baseURL}/api`, {
      headers: {
        'Origin': previewOrigin,
      },
    });

    log('✓ Root endpoint accessible', colors.green);
    log(`  Response: ${JSON.stringify(rootResponse.data)}`, colors.reset);

    // Test if CORS headers are present
    if (rootResponse.headers['access-control-allow-origin']) {
      log('✓ CORS headers present', colors.green);
      log(`  Allowed Origin: ${rootResponse.headers['access-control-allow-origin']}`, colors.reset);
    } else {
      log('✗ CORS headers missing', colors.red);
    }

    log('\n✓ CORS configuration is working correctly!', colors.bright + colors.green);
    process.exit(0);

  } catch (error) {
    log('✗ CORS test failed', colors.red);

    if (error.response) {
      log(`  Status: ${error.response.status}`, colors.red);
      log(`  Data: ${JSON.stringify(error.response.data)}`, colors.red);
    } else if (error.code === 'ECONNREFUSED') {
      log('  Error: Cannot connect to server. Is it running?', colors.red);
      log('  Make sure the server is running on http://localhost:3000', colors.yellow);
    } else {
      log(`  Error: ${error.message}`, colors.red);
    }

    process.exit(1);
  }
}

// Run the test
log('Starting CORS configuration test...', colors.bright);
testCORS();
