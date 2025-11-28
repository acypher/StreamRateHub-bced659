# CineCite Deployment Guide

## Quick Start - Free Deployment (Recommended)

This guide will help you deploy CineCite to production using free services.

### Prerequisites
- ✅ GitHub account (you have this)
- ✅ Domain: acypher.com (you own this)
- ✅ InMotion Hosting account (you have this)

---

## Step-by-Step Deployment

### Step 1: Set Up MongoDB Atlas (Free Database)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google or email (free, no credit card required)
3. Create a new cluster:
   - Click **"Build a Database"**
   - Select **"M0 FREE"** tier
   - Choose cloud provider and region closest to you
   - Name cluster: `cinecite`
   - Click **"Create"**

4. Create database user:
   - Click **"Security" → "Database Access"**
   - Click **"Add New Database User"**
   - Authentication Method: Password
   - Username: `cinecite_user`
   - Password: (Click "Autogenerate Secure Password" and SAVE IT)
   - User Privileges: "Read and write to any database"
   - Click **"Add User"**

5. Whitelist IP addresses:
   - Click **"Security" → "Network Access"**
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (adds 0.0.0.0/0)
   - Click **"Confirm"**

6. Get connection string:
   - Click **"Database" → "Connect"**
   - Click **"Connect your application"**
   - Copy the connection string (looks like):
     ```
     mongodb+srv://cinecite_user:<password>@cluster0.xxxxx.mongodb.net/
     ```
   - Replace `<password>` with your actual password
   - Add database name at the end: `/cinecite`
   - Final string should look like:
     ```
     mongodb+srv://cinecite_user:YourPassword123@cluster0.xxxxx.mongodb.net/cinecite
     ```
   - **SAVE THIS** - you'll need it in Step 2

---

### Step 2: Deploy Backend to Render.com

1. **Push your code to GitHub** (if not already there):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. Go to https://render.com and click **"Get Started for Free"**

3. Sign up with GitHub

4. Click **"New +"** → **"Web Service"**

5. Click **"Connect GitHub"** and authorize Render

6. Select your CineCite repository

7. Configure the service:
   - **Name**: `cinecite-api`
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `server`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/server.js`
   - **Instance Type**: Free

8. Click **"Advanced"** and add environment variables:
   - Click **"Add Environment Variable"** for each:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Your MongoDB connection string from Step 1 |
   | `SESSION_SECRET` | Generate random string: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
   | `NODE_ENV` | `production` |
   | `PORT` | `3000` |

9. Click **"Create Web Service"**

10. Wait 5-10 minutes for first deployment

11. Once deployed, copy your backend URL (e.g., `https://cinecite-api.onrender.com`)

12. **Test your backend**:
    - Visit: `https://cinecite-api.onrender.com/`
    - You should see: "CineCite API is running"

---

### Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com and click **"Sign Up"**

2. Sign up with GitHub

3. Click **"Add New..."** → **"Project"**

4. Click **"Import"** next to your CineCite repository

5. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: Click "Edit" and enter `client`
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

6. Click **"Environment Variables"** and add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | Your Render backend URL (e.g., `https://cinecite-api.onrender.com`) |

7. Click **"Deploy"**

8. Wait 2-5 minutes for deployment

9. Once deployed, you'll get a URL like: `https://cinecite-abc123.vercel.app`

10. **Test your frontend**:
    - Visit your Vercel URL
    - Try searching for a movie (e.g., "Inception")
    - Results should load successfully

---

### Step 4: Update Backend CORS

Now that you have your frontend URL, you need to add it to the backend's allowed origins:

1. Open `server/server.ts` in your code editor

2. Find the `allowedOrigins` array (around line 26)

3. Uncomment and update with your Vercel URL:
   ```typescript
   const allowedOrigins = [
     'http://localhost:5173', // Development
     'http://localhost:3000', // Development alternative
     'https://preview-14ngc5z7.ui.pythagora.ai', // Pythagora preview
     'https://cinecite-abc123.vercel.app', // Your Vercel URL
   ];
   ```

4. Commit and push:
   ```bash
   git add server/server.ts
   git commit -m "Add production frontend URL to CORS"
   git push origin main
   ```

5. Render will automatically redeploy your backend (2-3 minutes)

---

### Step 5: Connect Custom Domain (Optional)

#### Option A: Point subdomain to Vercel

1. In Vercel dashboard, go to your project → **Settings** → **Domains**

2. Click **"Add"** and enter: `cinecite.acypher.com`

3. Vercel will show you DNS records to add

4. Log into InMotion cPanel:
   - Go to **"Domains"** → **"Zone Editor"**
   - Find `acypher.com`
   - Click **"Manage"**
   - Click **"Add Record"**
   - Select **"CNAME"**
   - **Name**: `cinecite`
   - **Record**: `cname.vercel-dns.com` (or value Vercel provides)
   - **TTL**: 14400
   - Click **"Add Record"**

5. Wait 5-60 minutes for DNS propagation

6. Vercel will automatically provision SSL certificate

7. Update CORS in backend to include: `https://cinecite.acypher.com`

#### Option B: Deploy frontend to InMotion

1. Build your frontend locally:
   ```bash
   cd client
   echo "VITE_API_URL=https://cinecite-api.onrender.com" > .env.production
   npm install
   npm run build
   ```

2. Upload to InMotion:
   - Log into InMotion cPanel
   - Go to **File Manager**
   - Navigate to `public_html`
   - Create folder: `cinecite`
   - Upload all files from `client/dist/*` to this folder

3. Access your site at: `https://acypher.com/cinecite`

4. (Optional) Create subdomain:
   - In cPanel → **Domains** → **Subdomains**
   - Create subdomain: `cinecite.acypher.com`
   - Point it to `/public_html/cinecite`

---

## Important Notes

### MongoDB Atlas Free Tier Limits
- 512 MB storage (plenty for your app)
- Shared CPU/RAM
- If you exceed limits, you'll be notified

### Render Free Tier Limitations
- Automatically sleeps after 15 minutes of inactivity
- Wakes up in ~30 seconds on first request
- 750 hours/month (enough for 24/7 in a 30-day month)
- Web scraping might be slower due to shared resources

### Vercel Free Tier Limitations
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic SSL certificates

---

## Troubleshooting

### Backend Issues

1. **"Cannot connect to MongoDB"**
   - Check DATABASE_URL in Render environment variables
   - Verify MongoDB Atlas allows IP 0.0.0.0/0
   - Check database user credentials

2. **Backend sleeps/slow first request**
   - Normal on Render free tier
   - Consider upgrading or using cron job to ping every 14 minutes
   - Use service like UptimeRobot.com (free) to ping your backend

3. **CORS errors**
   - Add your frontend URL to `allowedOrigins` array in `server/server.ts`
   - Redeploy backend after changes

### Frontend Issues

1. **"Network Error" or "Failed to fetch"**
   - Check VITE_API_URL environment variable in Vercel
   - Make sure it points to your Render backend URL
   - Verify backend is running

2. **Deployment fails**
   - Check build logs in Vercel
   - Ensure `package.json` has correct build script
   - Try building locally first: `cd client && npm run build`

---

## Monitoring Your App

### Free Monitoring Tools

1. **Render Dashboard**
   - View logs, metrics, deploy status
   - Set up email notifications

2. **Vercel Dashboard**
   - View deployment history, analytics
   - Monitor function invocations

3. **MongoDB Atlas Dashboard**
   - Monitor database usage, performance
   - Set up alerts

4. **UptimeRobot** (free)
   - https://uptimerobot.com
   - Ping your backend every 5 minutes
   - Keeps Render from sleeping
   - Email alerts if down

---

## Updating Your App

### Deploy Updates

1. Make changes to your code locally

2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```

3. Render and Vercel will automatically redeploy (3-5 minutes)

4. Check deployment status in their dashboards

---

## Cost Breakdown

| Service | Tier | Cost |
|---------|------|------|
| MongoDB Atlas | M0 Free | $0/month |
| Render | Free | $0/month |
| Vercel | Hobby | $0/month |
| **Total** | | **$0/month** |

### When to Upgrade

- **MongoDB**: When you exceed 512 MB storage
- **Render**: If you need faster response times or don't want sleep
- **Vercel**: If you exceed 100 GB bandwidth (unlikely)

Render upgrade: $7/month (no sleep, better performance)
MongoDB upgrade: $9/month (2 GB storage, dedicated resources)

---

## Security Checklist

Before going live:

- ✅ Strong SESSION_SECRET set
- ✅ MongoDB credentials secure
- ✅ CORS properly configured
- ✅ MongoDB IP whitelist set (0.0.0.0/0 is fine for Atlas)
- ✅ Environment variables not in code
- ✅ .env files in .gitignore
- ✅ SSL certificates (Vercel/Render auto-provision)

---

## Next Steps After Deployment

1. **Test thoroughly**: Search for multiple movies/shows
2. **Monitor performance**: Check logs for errors
3. **Set up monitoring**: Use UptimeRobot
4. **Optimize**: Add caching for frequently searched movies
5. **Analytics**: Consider adding Google Analytics
6. **SEO**: Add meta tags, sitemap

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **InMotion Support**: https://www.inmotionhosting.com/support/

---

## Alternative: Deploy Everything to InMotion

If you prefer to use only InMotion hosting:

1. **Backend**: Use Node.js app setup in cPanel
2. **Frontend**: Upload build files to public_html
3. **Database**: Either use MongoDB Atlas (free) or install MongoDB on InMotion VPS (requires VPS plan)

Contact InMotion support for Node.js setup assistance.

---

Good luck with your deployment! 🚀
