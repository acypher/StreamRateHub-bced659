# Why Does CineCite Need a Backend Server?

## TL;DR

**The backend server is absolutely essential** because web scraping cannot be performed from a browser due to CORS security restrictions. Since Rotten Tomatoes, Metacritic, and IMDB don't provide public APIs, we must scrape their websites, which requires a server-side solution.

## Detailed Reasons

### 1. Web Scraping Requires Server-Side Execution

**The Problem:**
- Browsers enforce CORS (Cross-Origin Resource Sharing) policies
- External websites block requests from JavaScript running in the browser
- Rotten Tomatoes, Metacritic, and IMDB don't have public APIs

**The Solution:**
- Backend server makes HTTP requests to these websites
- Server-side code is not restricted by CORS policies
- Uses libraries like `axios` (HTTP client) and `cheerio` (HTML parser)
- Can use `puppeteer` (headless browser) for JavaScript-heavy sites

**Example Flow:**
```
Frontend → Backend Server → Scrape RT, Metacritic, IMDB → Parse HTML → Return JSON → Frontend
```

### 2. Rate Limiting & Request Management

**Why It Matters:**
- Sending too many requests too quickly can get your IP blocked
- Websites have anti-scraping measures
- Need intelligent throttling and delays

**Backend Implementation:**
- Uses `bottleneck` library for rate limiting
- Implements delays between requests (e.g., 2 seconds between each site)
- Can implement caching to reduce redundant requests
- Queues requests to prevent overwhelming target sites

**Code Example from `scrapingService.ts`:**
```typescript
const limiter = new Bottleneck({
  minTime: 2000,  // Minimum 2 seconds between requests
  maxConcurrent: 1  // One request at a time
});
```

### 3. Security & API Key Protection

**Why It Matters:**
- Frontend code is visible to anyone (View Source)
- API keys exposed in frontend = security breach
- Server can validate, sanitize, and secure data

**Backend Provides:**
- Secure storage of API keys in `.env` files
- Password hashing with `bcrypt` (10+ salt rounds)
- JWT token generation and validation
- HTML sanitization before sending to frontend
- Protection against XSS and SQL injection

### 4. User Authentication & Data Persistence

**Why It Matters:**
- Users need accounts to save preferences, favorites, watchlists
- Secure authentication requires server-side validation
- Database operations should never be exposed to frontend

**Backend Provides:**
- JWT-based authentication (access + refresh tokens)
- MongoDB database for user accounts
- Secure password storage (never plaintext)
- Session management and token refresh
- Role-based access control (admin vs user)

**Authentication Flow:**
```
1. User registers → Backend hashes password → Stores in MongoDB
2. User logs in → Backend validates → Returns JWT tokens
3. Frontend stores tokens → Sends with each request
4. Backend validates token → Allows/denies access
```

### 5. Performance & Optimization

**Why It Matters:**
- Scraping multiple websites is slow (5-15 seconds)
- Frontend shouldn't be blocked waiting for responses
- Can implement smart caching strategies

**Backend Provides:**
- Asynchronous scraping (Promise.all for parallel requests)
- Server-side caching (Redis, in-memory, or database)
- CDN integration for frequently accessed data
- Aggregation and data processing before sending to frontend

### 6. Compliance & Legal Protection

**Why It Matters:**
- Web scraping exists in a legal gray area
- Server logs are crucial for compliance
- Need to implement robots.txt respect and user-agent headers

**Backend Provides:**
- Request logging and audit trails
- User-agent headers that identify your scraper
- Rate limiting to respect target websites
- Ability to quickly disable scraping if requested

## What Would Happen Without a Backend?

### Scenario: Frontend-Only Architecture

**Attempt 1: Direct API calls from browser**
```javascript
// This WILL FAIL with CORS error
fetch('https://www.rottentomatoes.com/...')
  .then(response => response.text())
  .catch(error => console.error("CORS Error:", error));
```

**Result:** ❌ Blocked by browser security policies

**Attempt 2: Use browser extension**
- ❌ Requires every user to install an extension
- ❌ Extension store approval process
- ❌ Security concerns from users
- ❌ No mobile support

**Attempt 3: Use third-party scraping API**
- ❌ Costs money (not free)
- ❌ Still need backend to protect API keys
- ❌ Rate limits and quotas
- ❌ Dependency on external service

## Alternative Architectures Considered

### 1. Serverless Functions (AWS Lambda, Vercel Functions)
✅ **Could work** for basic scraping
❌ Cold start delays (slow initial requests)
❌ Limited execution time (Lambda: 15 minutes max)
❌ More complex debugging

### 2. Browser Extension
❌ Requires installation
❌ No authentication/database
❌ Difficult updates
❌ Limited audience

### 3. Static Site + Third-Party APIs
❌ No free APIs for RT, Metacritic, IMDB
❌ Would still need backend for API key security

## Conclusion

**The backend server is not optional—it's fundamental to CineCite's core functionality.** Without it, the application simply cannot work. The backend provides:

1. ✅ **Scraping capability** (impossible from browser)
2. ✅ **Rate limiting** (prevents IP bans)
3. ✅ **Security** (API keys, authentication)
4. ✅ **Data persistence** (MongoDB for users)
5. ✅ **Performance** (caching, optimization)
6. ✅ **Legal compliance** (logging, user-agent)

The backend is the bridge between the user's browser and the external rating websites, handling all the complex, restricted, and sensitive operations that make CineCite possible.

---

## For Developers

**Technologies Used:**
- **Express.js** - Web server framework
- **Axios** - HTTP client for making requests
- **Cheerio** - HTML parsing (jQuery-like syntax)
- **Puppeteer** - Headless browser (for JS-heavy sites)
- **Bottleneck** - Rate limiting
- **MongoDB + Mongoose** - Database
- **JWT + bcrypt** - Authentication
- **TypeScript** - Type safety

**Key Files:**
- `server/services/scrapingService.ts` - Core scraping logic
- `server/routes/searchRoutes.ts` - Search API endpoint
- `server/routes/authRoutes.ts` - Authentication endpoints
- `server/config/database.ts` - MongoDB connection

**Useful Scripts:**
See `server/scripts/README.md` for database seeding, testing, and management scripts.
