# StreamRateHub Permanent URL Documentation

## 🌐 Production URLs

### Main Application URL
**https://preview-0hf1ju3b.ui.pythagora.ai**

This is your permanent, stable URL for accessing the StreamRateHub application. You can bookmark this URL and use it to access the application at any time.

---

## 📡 API Endpoints

All API endpoints are accessible via HTTPS at the base URL above.

### Health Check
- **Endpoint**: `GET /api/health`
- **Full URL**: https://preview-0hf1ju3b.ui.pythagora.ai/api/health
- **Purpose**: Check if the API is running and responsive
- **Response**:
  ```json
  {
    "status": "healthy",
    "message": "StreamRateHub API is running",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 12345.67
  }
  ```

### Search for Movies/TV Shows (POST)
- **Endpoint**: `POST /api/search`
- **Full URL**: https://preview-0hf1ju3b.ui.pythagora.ai/api/search
- **Purpose**: Search for a movie or TV show and get aggregated ratings
- **Request Body**:
  ```json
  {
    "query": "Inception"
  }
  ```
- **Response**:
  ```json
  {
    "title": "Inception",
    "year": "2010",
    "posterUrl": "https://...",
    "ratings": [
      {
        "source": "Rotten Tomatoes",
        "criticsRating": "87%",
        "audienceRating": "91%"
      },
      {
        "source": "Metacritic",
        "criticsRating": "74/100",
        "audienceRating": "8.6/10"
      },
      {
        "source": "IMDB",
        "criticsRating": "8.8/10"
      }
    ],
    "plot": "A thief who steals corporate secrets...",
    "cast": ["Leonardo DiCaprio", "Ellen Page", "Tom Hardy"],
    "reviewerSummary": "Critics praise Inception for its..."
  }
  ```

### Search for Movies/TV Shows (GET)
- **Endpoint**: `GET /api/search?query={searchTerm}`
- **Full URL**: https://preview-0hf1ju3b.ui.pythagora.ai/api/search?query=Inception
- **Purpose**: Search for a movie or TV show (convenient for browser testing)
- **Query Parameters**:
  - `query` (required): The name of the movie or TV show to search for
- **Response**: Same as POST endpoint above

---

## 🔧 Testing the Permanent URL

### Using a Web Browser
1. **Test the application**: Navigate to https://preview-0hf1ju3b.ui.pythagora.ai
2. **Test the health endpoint**: Navigate to https://preview-0hf1ju3b.ui.pythagora.ai/api/health
3. **Test a search**: Navigate to https://preview-0hf1ju3b.ui.pythagora.ai/api/search?query=Inception

### Using cURL
```bash
# Health check
curl https://preview-0hf1ju3b.ui.pythagora.ai/api/health

# Search (GET)
curl "https://preview-0hf1ju3b.ui.pythagora.ai/api/search?query=Inception"

# Search (POST)
curl -X POST https://preview-0hf1ju3b.ui.pythagora.ai/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "Inception"}'
```

### Using the Verification Script
Run the automated verification script from the project root:
```bash
node scripts/verify-deployment.js
```

This script will:
- Test frontend availability
- Check API health endpoint
- Verify search functionality
- Report response times and success/failure

---

## 🛠️ For Developers

### Local Development URLs
When running the application locally:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

### CORS Configuration
The production URL is already configured in the CORS whitelist. If you need to add additional domains, update the `allowedOrigins` array in `server/server.ts`.

### Environment Variables
No additional environment configuration is needed for the permanent URL. The application automatically works with the deployed environment.

---

## 📋 Quick Reference

| Purpose | URL |
|---------|-----|
| Main Application | https://preview-0hf1ju3b.ui.pythagora.ai |
| Health Check | https://preview-0hf1ju3b.ui.pythagora.ai/api/health |
| Search (GET) | https://preview-0hf1ju3b.ui.pythagora.ai/api/search?query={term} |
| Search (POST) | https://preview-0hf1ju3b.ui.pythagora.ai/api/search |

---

## 📊 Monitoring & Status

### Automated Checks
Use the verification script for automated health checks:
```bash
node scripts/verify-deployment.js
```

### Manual Checks
1. Visit the main URL to ensure the frontend loads
2. Check `/api/health` to verify the backend is responsive
3. Perform a test search to confirm scraping functionality

### Expected Response Times
- Frontend: < 1 second
- Health check: < 100ms
- Search queries: 5-15 seconds (depending on external sites)

---

## 🔒 Security Notes

- All traffic uses HTTPS encryption
- CORS is configured to allow only whitelisted origins
- No API keys or authentication required for basic search functionality
- Rate limiting may be implemented to prevent abuse

---

## 📞 Troubleshooting

### If the URL is not responding:
1. Check your internet connection
2. Verify DNS resolution
3. Run the verification script: `node scripts/verify-deployment.js`
4. Check server logs if you have access

### If searches are slow or failing:
- External scraping sites may be slow or temporarily unavailable
- Wait a few moments and try again
- Try a different search query
- Check server logs for specific error messages

---

## 📝 Notes

- This URL is permanent and stable
- Bookmark it for easy access
- Share it with team members or users
- No login or authentication required
- Real-time data fetching (no caching)

---

*Last Updated: 2024*
*Application: StreamRateHub - Movie & TV Show Ratings Aggregator*
