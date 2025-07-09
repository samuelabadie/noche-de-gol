# 🚀 Deployment Guide - Tournament App

## Free Hosting Options

### Option 1: Vercel (Recommended) - FREE

Vercel is the best option for Next.js applications and offers a generous free tier.

#### Step 1: Prepare Your Project

1. **Create a GitHub repository** (if you haven't already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/yourusername/tournament-app.git
   git push -u origin main
   ```

#### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign up with your GitHub account

2. **Click "New Project"**

3. **Import your GitHub repository**

4. **Configure the project**:
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. **Environment Variables** (if needed):
   - `DATABASE_URL`: For production database
   - `ADMIN_PASSWORD`: Your admin password

6. **Click "Deploy"**

#### Step 3: Database Setup

**Option A: Use Vercel's built-in SQLite** (Simplest)
- Vercel will automatically handle the SQLite database
- No additional setup needed

**Option B: Use a free PostgreSQL database**
1. Sign up for [Neon](https://neon.tech) (free tier)
2. Create a new database
3. Get your connection string
4. Add it as `DATABASE_URL` in Vercel environment variables

### Option 2: Netlify - FREE

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up and connect your GitHub**
3. **Import your repository**
4. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. **Deploy**

### Option 3: Railway - FREE

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Create new project from GitHub repo**
4. **Add PostgreSQL database** (free tier)
5. **Set environment variables**
6. **Deploy**

## Environment Variables

Create a `.env.local` file in your project root:

```env
# Database (for local development)
DATABASE_URL="file:./dev.db"

# Admin password (change this!)
ADMIN_PASSWORD="your-secure-password-here"
```

## Production Database Options

### Free PostgreSQL Databases:
1. **Neon** (neon.tech) - 3GB free
2. **Supabase** (supabase.com) - 500MB free
3. **PlanetScale** (planetscale.com) - 1GB free

### Database Migration:
If you switch to PostgreSQL, update your `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run:
```bash
npx prisma migrate deploy
```

## Custom Domain (Optional)

After deployment, you can add a custom domain:
1. **Vercel**: Go to project settings → Domains
2. **Netlify**: Go to site settings → Domain management
3. **Railway**: Go to project settings → Domains

## Security Notes

1. **Change the admin password** in production
2. **Use environment variables** for sensitive data
3. **Enable HTTPS** (automatic on most platforms)
4. **Set up proper CORS** if needed

## Monitoring

Most platforms provide:
- **Analytics**: Page views, performance
- **Logs**: Error tracking
- **Uptime monitoring**: Site availability

## Support

If you encounter issues:
1. Check the platform's documentation
2. Look at build logs for errors
3. Verify environment variables are set correctly
4. Test locally with `npm run build` first

---

**Recommended: Start with Vercel** - it's the easiest and most reliable for Next.js apps! 