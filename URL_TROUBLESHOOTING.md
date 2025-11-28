# 🔗 CineCite URL Troubleshooting Guide

## Understanding Your Permanent URL

Your CineCite application is hosted on Pythagora's cloud infrastructure with a **permanent, stable URL**:

### **Your Permanent URL: `https://preview-0ag1onvs.ui.pythagora.ai`**

✅ This URL will not expire
✅ This URL will not change
✅ You should bookmark this URL
✅ You can share this URL with others

---

## 🚨 Common Issue: URL Redirects

### Problem Description

If you're experiencing issues where accessing a URL like `https://preview-0hf1ju3b.ui.pythagora.ai` redirects you to `https://www.pythagora.ai/`, this is **NOT a problem with your application code**.

### Why This Happens

URL redirects to `pythagora.ai` typically occur when:

1. **Old/Expired Preview URL** - You're using an outdated preview URL that has been deactivated
2. **Wrong Deployment ID** - The URL you're accessing doesn't match your current deployment
3. **Stale Bookmark** - You bookmarked an old URL that's no longer active
4. **Deployment Rotation** - Pythagora may have rotated your deployment to a new URL

### The Root Cause

⚠️ **Important**: The redirect happens at the **Pythagora infrastructure level**, not within your application. Your application code cannot prevent or fix this type of redirect.

---

## ✅ Solution

### Step 1: Use the Correct URL

Always use your current permanent URL:

```
https://preview-0ag1onvs.ui.pythagora.ai
```

### Step 2: Verify Your URL

Visit the URL info page in your application:

```
https://preview-0ag1onvs.ui.pythagora.ai/url-info
```

This page will:
- ✅ Display your current active URL
- ✅ Show all API endpoints
- ✅ Allow you to copy the URL
- ✅ Provide troubleshooting guidance

### Step 3: Update Your Bookmarks

1. Delete any old bookmarks to preview URLs
2. Bookmark the current URL displayed in your application
3. Verify the bookmark works before closing the browser

### Step 4: Clear Browser Cache

If you're still experiencing redirects:

1. Clear your browser cache and cookies
2. Close all browser tabs for the old URL
3. Open a fresh tab with the new URL

---

## 🛠️ Tools We've Built for You

### 1. URL Info Page

Navigate to `/url-info` in your application to see:
- Your current permanent URL
- All available API endpoints
- Copy buttons for easy URL sharing
- Troubleshooting tips

**Access it at**: `https://preview-0ag1onvs.ui.pythagora.ai/url-info`

### 2. URL Monitoring Script

Run this script to check your URL health:

```bash
node scripts/monitor-url.js
```

This will:
- Test all endpoints
- Check for redirects
- Measure response times
- Report overall health status

### 3. API Endpoints

We've added three new API endpoints for URL management:

#### Get URL Info
```bash
GET /api/url-info
```

Returns current deployment URL and environment information.

#### Verify URL
```bash
GET /api/verify-url?expectedUrl=https://preview-0ag1onvs.ui.pythagora.ai
```

Checks if you're accessing from the correct URL.

#### Get Permanent URL
```bash
GET /api/permanent-url
```

Returns the permanent URL and all API endpoints.

---

## 🔍 Diagnosing URL Issues

### Test 1: Access the Application

Try accessing:
```
https://preview-0ag1onvs.ui.pythagora.ai
```

**Expected**: Application loads normally
**Problem**: Redirects to pythagora.ai → Use the URL info page to get the current URL

### Test 2: Check API Health

Try accessing:
```
https://preview-0ag1onvs.ui.pythagora.ai/api/health
```

**Expected**: JSON response with `{ "status": "healthy" }`
**Problem**: Error or redirect → Check if the application is running

### Test 3: Check URL Info

Try accessing:
```
https://preview-0ag1onvs.ui.pythagora.ai/api/url-info
```

**Expected**: JSON response with current URL
**Problem**: Error → Backend may be down

### Test 4: Run Monitoring Script

From your project directory:
```bash
node scripts/monitor-url.js
```

**Expected**: All tests pass
**Problem**: Some tests fail → Check the error messages for guidance

---

## 📋 Quick Reference

### Current Permanent URL
```
https://preview-0ag1onvs.ui.pythagora.ai
```

### Frontend Routes
- **Home**: `/`
- **URL Info**: `/url-info`

### API Endpoints
- **Health Check**: `/api/health`
- **Search**: `/api/search?query={term}`
- **URL Info**: `/api/url-info`
- **Verify URL**: `/api/verify-url`
- **Permanent URL**: `/api/permanent-url`

### Monitoring Commands
```bash
# Monitor URL health
node scripts/monitor-url.js

# Verify deployment
node scripts/verify-deployment.js

# Test API
node scripts/test-api.js
```

---

## 🤔 FAQ

### Q: Why can't you fix the redirect in my code?

**A**: The redirect from old preview URLs to `pythagora.ai` happens at Pythagora's infrastructure level (load balancer, reverse proxy, or DNS). Your application never receives these requests, so there's nothing in your code that can intercept or prevent these redirects.

### Q: Will my URL change again?

**A**: Your current permanent URL (`https://preview-0ag1onvs.ui.pythagora.ai`) should remain stable. However, always check the `/url-info` page to verify your current URL.

### Q: How do I ensure I always use the correct URL?

**A**:
1. Visit the `/url-info` page in your application
2. Bookmark the URL shown there
3. Run the monitoring script periodically
4. Check the URL info page if you experience issues

### Q: What if none of these solutions work?

**A**: If you're still experiencing issues:
1. Verify your internet connection
2. Check if the application is running (contact your hosting provider)
3. Review the deployment documentation in `DEPLOYMENT.md`
4. Check browser console for specific error messages

### Q: Can I use a custom domain?

**A**: Yes! You can configure a custom domain to point to your Pythagora deployment. See `DEPLOYMENT.md` for instructions on custom domain setup.

---

## 📞 Getting Help

### Self-Service Resources

1. **URL Info Page**: Visit `/url-info` in your application
2. **Monitoring Script**: Run `node scripts/monitor-url.js`
3. **Documentation**: Check `PERMANENT_URL.md` and `DEPLOYMENT.md`
4. **Browser Console**: Open DevTools and check for error messages

### Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| `ERR_NAME_NOT_RESOLVED` | DNS can't find the URL | Check URL spelling, verify deployment |
| `ERR_CONNECTION_REFUSED` | Server isn't responding | Check if application is running |
| `Redirected to pythagora.ai` | Using old/wrong URL | Use the current permanent URL |
| `CORS error` | Origin not allowed | URL might be wrong or CORS misconfigured |
| `404 Not Found` | Route doesn't exist | Check URL path is correct |

---

## 🎯 Summary

### The Key Points

1. ✅ Your permanent URL is: `https://preview-0ag1onvs.ui.pythagora.ai`
2. ✅ Redirects to `pythagora.ai` mean you're using an old/wrong URL
3. ✅ Always check `/url-info` page for your current URL
4. ✅ Bookmark and use only the current permanent URL
5. ✅ Run monitoring scripts to verify URL health

### Quick Actions

```bash
# Verify everything is working
node scripts/monitor-url.js

# Open the URL info page
# Visit: https://preview-0ag1onvs.ui.pythagora.ai/url-info

# Test the application
# Visit: https://preview-0ag1onvs.ui.pythagora.ai
```

---

**Last Updated**: 2024
**Application**: CineCite - Movie & TV Show Ratings Aggregator
**Permanent URL**: `https://preview-0ag1onvs.ui.pythagora.ai`
