# StreamRateHub Utility Scripts

This directory contains utility scripts for testing, maintaining, and verifying the StreamRateHub application.

## Important: Running Scripts

**You must run these scripts from the project root directory**, not from inside the `scripts/` directory.

✅ **Correct:**
```bash
# From project root (/pythagora/pythagora-core/workspace/StreamRateHub-bced659/)
node scripts/verify-deployment.js
node scripts/test-api.js
node scripts/check-dependencies.js
```

❌ **Incorrect:**
```bash
# Don't do this - will fail
cd scripts
node test-api.js
```

## Permanent URL

StreamRateHub is deployed at: **https://preview-0hf1ju3b.ui.pythagora.ai**

See the `.deployment-url` file in the project root for more details about available endpoints.

## Available Scripts

### 1. Deployment Verification

**File:** `verify-deployment.js`

**Purpose:** Verifies that the StreamRateHub application is properly deployed and accessible at the permanent URL.

**Usage (from project root):**
```bash
node scripts/verify-deployment.js
```

**What it does:**
- Tests frontend availability at https://preview-0hf1ju3b.ui.pythagora.ai
- Verifies backend health check endpoint
- Tests the search API endpoint with a sample query
- Provides detailed test results with response times

**When to use:**
- After deployment to verify everything is working
- To check if the permanent URL is accessible
- As part of CI/CD pipeline
- When troubleshooting deployment issues

### 2. CORS Configuration Test

**File:** `test-cors.js`

**Purpose:** Verifies that the CORS (Cross-Origin Resource Sharing) configuration is set up correctly to allow requests from the preview environment.

**Usage (from project root):**
```bash
node scripts/test-cors.js
```

**What it does:**
- Tests if the API accepts requests from the Pythagora preview origin
- Verifies CORS headers are properly set
- Confirms the API is accessible

**When to use:**
- After updating the preview URL
- When debugging CORS-related errors
- Before deploying to a new environment

### 2. API Testing Script

**File:** `test-api.js`

**Purpose:** Tests the StreamRateHub API endpoints to ensure the scraping service is working correctly.

**Usage (from project root):**
```bash
node scripts/test-api.js
```

**What it does:**
- Tests the health check endpoint (`/api`)
- Tests the search endpoint (`/api/search`) with multiple movie/TV show queries
- Displays ratings, cast information, and response times
- Provides a summary of passed/failed tests

**Environment Variables:**
- `API_URL`: Base URL for the API (default: `http://localhost:3000`)

**Example:**
```bash
# Test local API
node scripts/test-api.js

# Test production API
API_URL=https://your-api-url.com node scripts/test-api.js
```

### 3. Dependency Check Script

**File:** `check-dependencies.js`

**Purpose:** Verifies that all required dependencies and configurations are in place before running the application.

**Usage (from project root):**
```bash
node scripts/check-dependencies.js
```

**What it checks:**
- Node.js and npm installation
- Project structure (package.json files)
- Environment variables in server/.env
- node_modules installation status
- Port availability (3000 and 5173)

**When to use:**
- Before running the application for the first time
- After cloning the repository
- When troubleshooting setup issues
- Before deployment

### 4. Database Seed Script

**File:** `seed-data.js`

**Purpose:** Placeholder script for seeding the database with initial data if needed in the future.

**Usage (from project root):**
```bash
node scripts/seed-data.js
```

**What it does:**
- Currently a placeholder for future extensibility
- Can be extended to add admin users, popular search suggestions, or cached data

**When to use:**
- When adding initial data requirements in the future
- For setting up default configuration values

### 5. Database Cleanup Script

**File:** `cleanup-database.js`

**Purpose:** Placeholder script for cleaning up cached data or temporary records.

**Usage (from project root):**
```bash
node scripts/cleanup-database.js
```

**What it does:**
- Currently a placeholder for future extensibility
- Can be extended to clear cached search results or temporary session data

**When to use:**
- When implementing caching features in the future
- For cleaning up expired sessions or temporary data

## Notes

### No Database Required (Currently)

StreamRateHub currently does not use a database for storing data. All movie/TV show information is fetched in real-time from:
- Rotten Tomatoes
- Metacritic
- IMDB

The scripts in this directory are designed to work without database dependencies, but include placeholders for future extensibility.

### Script Development Guidelines

When creating new scripts:
1. Add clear documentation in this README
2. Include error handling and helpful error messages
3. Use colored console output for better readability
4. Test scripts before committing
5. Keep scripts focused on a single purpose

## Common Tasks

### Verifying Deployment
```bash
# Make sure you're in the project root directory first!
cd /pythagora/pythagora-core/workspace/StreamRateHub-bced659

# Verify the permanent URL is accessible
node scripts/verify-deployment.js
```

### Running Tests Before Deployment
```bash
# Make sure you're in the project root directory first!
cd /pythagora/pythagora-core/workspace/StreamRateHub-bced659

# Check all dependencies
node scripts/check-dependencies.js

# Test CORS configuration
node scripts/test-cors.js

# Test the API
node scripts/test-api.js

# Verify the deployment
node scripts/verify-deployment.js
```

### Quick Diagnosis
If the application isn't working:
1. Run `node scripts/check-dependencies.js` to identify missing dependencies
2. Fix any issues reported
3. Run `node scripts/test-api.js` to verify the API is working
4. Start the application with `npm run start`

## Contributing

When adding new scripts:
1. Place them in the `scripts/` directory
2. Use Node.js for consistency
3. Add documentation to this README
4. Include usage examples
5. Test thoroughly before committing
