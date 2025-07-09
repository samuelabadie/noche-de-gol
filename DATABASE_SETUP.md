# 🗄️ Database Setup for Netlify Deployment

## ⚠️ Important: SQLite Won't Work on Netlify

Your current SQLite database (`file:./dev.db`) **will not persist** on Netlify because:
- Netlify uses serverless functions
- Files are not persisted between deployments
- Database will reset every time the app rebuilds

## 🚀 Solution: Free PostgreSQL Database

### Step 1: Create Free Database

**Option A: Neon (Recommended)**
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create new project
4. Copy the connection string

**Option B: Supabase**
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Create new project
4. Go to Settings → Database
5. Copy the connection string

### Step 2: Update Prisma Schema

1. **Edit `prisma/schema.prisma`**:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Comment out the SQLite section**:
   ```prisma
   // datasource db {
   //   provider = "sqlite"
   //   url      = env("DATABASE_URL")
   // }
   ```

### Step 3: Add Database URL to Netlify

1. Go to your Netlify dashboard
2. Site settings → Environment variables
3. Add:
   - **Name**: `DATABASE_URL`
   - **Value**: Your PostgreSQL connection string
   - **Example**: `postgresql://user:password@host:port/database`

### Step 4: Deploy Database Schema

After deployment, you'll need to run migrations:
1. Go to Netlify Functions (if available)
2. Or use a database migration service
3. Run: `npx prisma migrate deploy`

## 🔄 Alternative: Keep SQLite for Testing

If you want to test quickly without setting up PostgreSQL:

1. **Keep SQLite for now**
2. **Deploy to test the app structure**
3. **Set up PostgreSQL later** when you need persistent data

## 📋 Quick Setup Commands

```bash
# 1. Update schema for PostgreSQL
# Edit prisma/schema.prisma (see above)

# 2. Generate Prisma client
npx prisma generate

# 3. Push to GitHub
git add .
git commit -m "Add PostgreSQL support"
git push

# 4. Deploy on Netlify
# Add DATABASE_URL environment variable
```

## 🎯 Recommended Approach

1. **For quick testing**: Deploy with SQLite (data will reset)
2. **For production**: Set up Neon PostgreSQL database
3. **For development**: Keep using local SQLite

## 🔧 Environment Variables for Netlify

Add these in Netlify dashboard:
- `DATABASE_URL`: Your PostgreSQL connection string
- `ADMIN_PASSWORD`: Your admin password

---

**💡 Tip**: Start with SQLite deployment to test the app, then upgrade to PostgreSQL when you need persistent data! 