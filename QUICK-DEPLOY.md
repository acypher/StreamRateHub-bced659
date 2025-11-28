# CineCite - Quick Deployment Reference

## 🚀 Fastest Path to Production (30 minutes)

### Your Setup
- ✅ Domain: **acypher.com** (InMotion Hosting)
- ✅ GitHub account
- ✅ Free Supabase account (can be used for analytics later)

---

## 📋 Deployment Checklist

### ☐ Step 1: MongoDB Atlas (5 min) - **FREE FOREVER**
1. Sign up: https://www.mongodb.com/cloud/atlas/register
2. Create M0 Free cluster (512 MB - plenty for your app)
3. Create database user + password
4. Whitelist IP: `0.0.0.0/0`
5. Get connection string → **SAVE IT**

**Connection string format:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cinecite
```

---

### ☐ Step 2: Deploy Backend to Render (10 min) - **FREE**
1. Push code to GitHub
2. Sign up: https://render.com (use GitHub login)
3. New Web Service → Connect repo
4. Settings:
   - Root: `server`
   - Build: `npm install && npm run build`
   - Start: `node dist/server.js`
   - Free tier ✅
5. Environment variables:
   ```
   DATABASE_URL = (your MongoDB string)
   SESSION_SECRET = (any random 32+ char string)
   NODE_ENV = production
   PORT = 3000
   ```
6. Deploy → Get URL: `https://cinecite-api.onrender.com`

**⚠️ Free tier sleeps after 15 min idle (wakes in 30 sec)**

---

### ☐ Step 3: Deploy Frontend to Vercel (5 min) - **FREE**
1. Sign up: https://vercel.com (use GitHub login)
2. Import project from GitHub
3. Settings:
   - Root: `client`
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`
4. Environment variable:
   ```
   VITE_API_URL = https://cinecite-api.onrender.com
   ```
5. Deploy → Get URL: `https://cinecite-xyz.vercel.app`

---

### ☐ Step 4: Update CORS (5 min)
1. Open `server/server.ts`
2. Add your Vercel URL to `allowedOrigins` array (line ~26):
   ```typescript
   const allowedOrigins = [
     'http://localhost:5173',
     'https://preview-14ngc5z7.ui.pythagora.ai',
     'https://cinecite-xyz.vercel.app', // ← ADD THIS
   ];
   ```
3. Commit + push → Render auto-redeploys

---

### ☐ Step 5: Custom Domain (Optional, 10 min)
**Point subdomain to Vercel:**
1. Vercel: Settings → Domains → Add `cinecite.acypher.com`
2. InMotion cPanel → Zone Editor → Add CNAME:
   - Name: `cinecite`
   - Points to: `cname.vercel-dns.com`
3. Wait 10-60 min for DNS
4. Add domain to CORS in backend

**Your site:** https://cinecite.acypher.com ✅

---

## 💰 Cost: $0/month

| Service | Plan | Cost |
|---------|------|------|
| MongoDB Atlas | M0 Free | $0 |
| Render.com | Free | $0 |
| Vercel | Hobby | $0 |
| **Total** | | **$0** |

---

## 🔄 Update Your App

```bash
git add .
git commit -m "Update message"
git push origin main
```
→ Render + Vercel auto-deploy in ~3 min

---

## 🐛 Common Issues

### CORS Error
→ Add frontend URL to `allowedOrigins` in `server/server.ts`

### Backend Slow/Timeout
→ Normal on first request (free tier sleeps). Wait 30 sec.

### Can't Connect to DB
→ Check `DATABASE_URL` in Render env variables
→ Verify MongoDB Atlas IP whitelist: `0.0.0.0/0`

### Build Failed
→ Check logs in Render/Vercel dashboard
→ Try building locally: `npm install && npm run build`

---

## 📊 Monitor Your App (Free)

**Keep backend awake:**
→ UptimeRobot.com (free) - Ping every 5 min

**View logs:**
→ Render Dashboard (backend logs)
→ Vercel Dashboard (frontend logs)
→ MongoDB Atlas (database metrics)

---

## 🎯 Production-Ready Checklist

- ✅ MongoDB connection string secure (in env vars, not code)
- ✅ Strong SESSION_SECRET (32+ random characters)
- ✅ CORS configured for production domain
- ✅ SSL certificates (auto by Vercel/Render)
- ✅ Error logging working
- ✅ Environment variables set
- ✅ .env files in .gitignore

---

## 📈 When to Upgrade

**Render ($7/mo):**
- No sleep (instant response)
- Better CPU/RAM for scraping
- Worth it if >100 daily users

**MongoDB ($9/mo):**
- 2 GB storage (vs 512 MB free)
- Dedicated resources
- Needed when you hit 512 MB limit

---

## 🆘 Need Help?

1. Check full guide: `DEPLOYMENT.md`
2. Render docs: render.com/docs
3. Vercel docs: vercel.com/docs
4. MongoDB docs: docs.atlas.mongodb.com

---

**Your app will be live at:**
- Primary: `https://cinecite-xyz.vercel.app`
- Custom: `https://cinecite.acypher.com` (after DNS setup)
- Backend: `https://cinecite-api.onrender.com`

**Total setup time: ~30 minutes**
**Total cost: $0/month**

🎉 Happy deploying!
