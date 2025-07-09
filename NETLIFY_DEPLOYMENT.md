# 🌐 Netlify Deployment Guide

## 🚀 Deploy Your Tournament App on Netlify (FREE)

### Step 1: Prepare Your Code

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Tournament app"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it `tournament-app`
   - Make it **Public** (required for free hosting)
   - Don't initialize with README
   - Click "Create repository"

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/tournament-app.git
   git push -u origin main
   ```

### Step 2: Deploy on Netlify

1. **Go to Netlify**:
   - Visit [netlify.com](https://netlify.com)
   - Sign up with your GitHub account

2. **Create New Site**:
   - Click "Add new site"
   - Select "Import an existing project"
   - Choose "Deploy with GitHub"

3. **Select Your Repository**:
   - Find and select your `tournament-app` repository
   - Click "Connect"

4. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: `18` (or leave default)

5. **Environment Variables** (Optional):
   - Click "Show advanced" to expand
   - Add environment variables if needed:
     - `ADMIN_PASSWORD`: Your admin password
     - `DATABASE_URL`: If using external database

6. **Deploy**:
   - Click "Deploy site"
   - Wait 2-3 minutes for build to complete

### Step 3: Configure Your Site

1. **Custom Domain** (Optional):
   - Go to "Site settings" → "Domain management"
   - Add your custom domain
   - Netlify will provide SSL certificate automatically

2. **Environment Variables** (if not set during deployment):
   - Go to "Site settings" → "Environment variables"
   - Add:
     - `ADMIN_PASSWORD`: Your secure password
     - `DATABASE_URL`: If using external database

### Step 4: Database Setup

**Option A: Use Netlify's built-in SQLite** (Simplest)
- Netlify will handle the database automatically
- No additional setup needed

**Option B: Use external database** (Recommended for production)
1. **Sign up for free database**:
   - [Neon](https://neon.tech) - 3GB free PostgreSQL
   - [Supabase](https://supabase.com) - 500MB free PostgreSQL
   - [PlanetScale](https://planetscale.com) - 1GB free MySQL

2. **Update Prisma schema** (if switching to PostgreSQL):
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Add database URL to Netlify**:
   - Go to "Site settings" → "Environment variables"
   - Add `DATABASE_URL` with your connection string

### Step 5: Test Your Deployment

1. **Main Site**: `https://your-site-name.netlify.app`
2. **Admin Panel**: `https://your-site-name.netlify.app/admin`

### Troubleshooting

**Build Fails**:
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

**Database Issues**:
- Check environment variables are set correctly
- Verify database connection string
- Test locally first with `npm run build`

**Routing Issues**:
- The `netlify.toml` file handles Next.js routing
- If issues persist, check redirects configuration

### Netlify Free Tier Benefits

✅ **Unlimited personal projects**  
✅ **100GB bandwidth/month**  
✅ **300 build minutes/month**  
✅ **Automatic HTTPS**  
✅ **Custom domains**  
✅ **Form handling**  
✅ **Serverless functions**  
✅ **Continuous deployment**  

### Your App URLs

- **Main site**: `https://your-site-name.netlify.app`
- **Admin panel**: `https://your-site-name.netlify.app/admin`
- **Custom domain**: `https://yourdomain.com` (if configured)

### Next Steps

1. **Test all features**:
   - Team registration
   - Admin panel access
   - Database operations

2. **Customize**:
   - Add your logo
   - Update colors/branding
   - Configure admin password

3. **Monitor**:
   - Check Netlify analytics
   - Monitor build logs
   - Set up notifications

---

**🎉 Your tournament app is now live on Netlify!** 