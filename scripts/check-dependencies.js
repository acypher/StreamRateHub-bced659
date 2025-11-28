/**
 * Script to check if all required dependencies are installed and services are available
 * This helps diagnose issues before running the application
 *
 * IMPORTANT: Run this script from the project root directory!
 *
 * ✅ Correct:   node scripts/check-dependencies.js
 * ❌ Incorrect: cd scripts && node check-dependencies.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

function checkCommand(command, name) {
  try {
    execSync(`${command} --version`, { stdio: 'pipe' });
    log(`✅ ${name} is installed`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${name} is not installed or not in PATH`, 'red');
    return false;
  }
}

function checkFile(filePath, description) {
  const fullPath = path.resolve(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    log(`✅ ${description} exists`, 'green');
    return true;
  } else {
    log(`❌ ${description} not found at ${filePath}`, 'red');
    return false;
  }
}

function checkEnvVariables() {
  const envPath = path.resolve(process.cwd(), 'server', '.env');
  if (!fs.existsSync(envPath)) {
    log(`⚠️  .env file not found in server directory`, 'yellow');
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const requiredVars = ['PORT', 'MONGODB_URI', 'SESSION_SECRET'];
  let allPresent = true;

  log(`\n📋 Environment Variables:`, 'blue');
  for (const varName of requiredVars) {
    const regex = new RegExp(`^${varName}=`, 'm');
    if (regex.test(envContent)) {
      log(`  ✅ ${varName} is set`, 'green');
    } else {
      log(`  ⚠️  ${varName} is not set`, 'yellow');
      allPresent = false;
    }
  }

  return allPresent;
}

function checkNodeModules() {
  const rootModules = path.resolve(process.cwd(), 'node_modules');
  const clientModules = path.resolve(process.cwd(), 'client', 'node_modules');
  const serverModules = path.resolve(process.cwd(), 'server', 'node_modules');

  let allInstalled = true;

  if (fs.existsSync(rootModules)) {
    log(`✅ Root node_modules exists`, 'green');
  } else {
    log(`❌ Root node_modules not found. Run: npm install`, 'red');
    allInstalled = false;
  }

  if (fs.existsSync(clientModules)) {
    log(`✅ Client node_modules exists`, 'green');
  } else {
    log(`⚠️  Client node_modules not found. Run: cd client && npm install`, 'yellow');
    allInstalled = false;
  }

  if (fs.existsSync(serverModules)) {
    log(`✅ Server node_modules exists`, 'green');
  } else {
    log(`⚠️  Server node_modules not found. Run: cd server && npm install`, 'yellow');
    allInstalled = false;
  }

  return allInstalled;
}

function checkPorts() {
  try {
    const netstat = execSync('netstat -tuln 2>/dev/null || ss -tuln 2>/dev/null', {
      stdio: 'pipe',
      encoding: 'utf-8',
    });

    const port3000InUse = netstat.includes(':3000 ');
    const port5173InUse = netstat.includes(':5173 ');

    log(`\n🔌 Port Status:`, 'blue');
    if (port3000InUse) {
      log(`  ⚠️  Port 3000 (server) is in use`, 'yellow');
    } else {
      log(`  ✅ Port 3000 (server) is available`, 'green');
    }

    if (port5173InUse) {
      log(`  ⚠️  Port 5173 (client) is in use`, 'yellow');
    } else {
      log(`  ✅ Port 5173 (client) is available`, 'green');
    }
  } catch (error) {
    log(`⚠️  Could not check port status`, 'yellow');
  }
}

async function runChecks() {
  log('='.repeat(60), 'blue');
  log('CineCite Dependency Check', 'blue');
  log('='.repeat(60), 'blue');

  const results = {
    passed: 0,
    failed: 0,
  };

  // Check required commands
  log(`\n🔧 Checking Required Commands:`, 'blue');
  if (checkCommand('node', 'Node.js')) results.passed++;
  else results.failed++;

  if (checkCommand('npm', 'npm')) results.passed++;
  else results.failed++;

  // Check project structure
  log(`\n📁 Checking Project Structure:`, 'blue');
  if (checkFile('package.json', 'Root package.json')) results.passed++;
  else results.failed++;

  if (checkFile('client/package.json', 'Client package.json')) results.passed++;
  else results.failed++;

  if (checkFile('server/package.json', 'Server package.json')) results.passed++;
  else results.failed++;

  if (checkFile('server/.env', 'Server .env file')) results.passed++;
  else results.failed++;

  // Check node_modules
  log(`\n📦 Checking Dependencies:`, 'blue');
  if (checkNodeModules()) results.passed++;
  else results.failed++;

  // Check environment variables
  if (checkEnvVariables()) results.passed++;
  else results.failed++;

  // Check ports
  checkPorts();

  // Summary
  log('\n' + '='.repeat(60), 'blue');
  log('Check Summary', 'blue');
  log('='.repeat(60), 'blue');
  log(`✅ Passed: ${results.passed}`, 'green');
  log(`❌ Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');

  if (results.failed === 0) {
    log(`\n🎉 All checks passed! You can run the application with: npm run start`, 'green');
  } else {
    log(`\n⚠️  Some checks failed. Please fix the issues above before running the application.`, 'yellow');
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

// Run checks
runChecks().catch(error => {
  log(`\n❌ Check script error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
