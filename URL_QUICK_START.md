# 🚀 StreamRateHub - Quick Start

## Your Permanent URL

### **https://preview-0ag1onvs.ui.pythagora.ai**

Bookmark this URL - it's your permanent access point to StreamRateHub!

---

## 🎯 Quick Actions

### Access the Application
Simply visit: **https://preview-0ag1onvs.ui.pythagora.ai**

### Test the API Health
Visit: **https://preview-0ag1onvs.ui.pythagora.ai/api/health**

### Search for a Movie (Browser)
Visit: **https://preview-0ag1onvs.ui.pythagora.ai/api/search?query=Inception**
(Replace "Inception" with any movie or TV show name)

---

## 🛠️ Developer Tools

### Verify Everything is Working
From the project root directory:
```bash
node scripts/verify-deployment.js
```

This will:
- ✅ Check if the frontend is accessible
- ✅ Verify the API health endpoint
- ✅ Test a sample search query
- ✅ Show response times

### Available Scripts
```bash
node scripts/verify-deployment.js  # Verify the deployment
node scripts/check-dependencies.js # Check project setup
node scripts/test-api.js           # Test API endpoints
node scripts/test-cors.js          # Test CORS configuration
node scripts/seed-data.js          # Seed database (placeholder)
node scripts/cleanup-database.js   # Cleanup database (placeholder)
```

---

## 📚 More Information

- **Full API Documentation**: See `PERMANENT_URL.md`
- **Script Documentation**: See `scripts/README.md`
- **Quick Reference**: See `SCRIPTS_USAGE.md`
- **Deployment Guide**: See `DEPLOYMENT.md`

---

## 🔗 API Endpoints Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Homepage |
| `/api/health` | GET | Health check |
| `/api/search` | POST | Search movies/TV shows (JSON body) |
| `/api/search?query=...` | GET | Search movies/TV shows (URL param) |

---

## 💡 Usage Examples

### Using cURL
```bash
# Health check
curl https://preview-0ag1onvs.ui.pythagora.ai/api/health

# Search (GET)
curl "https://preview-0ag1onvs.ui.pythagora.ai/api/search?query=The%20Matrix"

# Search (POST)
curl -X POST https://preview-0ag1onvs.ui.pythagora.ai/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "The Matrix"}'
```

### Using JavaScript (Frontend)
```javascript
// Search for a movie
const response = await fetch(
  'https://preview-0ag1onvs.ui.pythagora.ai/api/search',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'The Matrix' })
  }
);
const data = await response.json();
console.log(data);
```

---

**That's it! Your permanent URL is live and ready to use. 🎉**
