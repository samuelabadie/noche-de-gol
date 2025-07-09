# ⚡ Quick Start - Deploy Your Tournament App

## 🚀 Fastest Way to Go Live (5 minutes)

### Step 1: Prepare Your Code
```bash
# Run the deployment script
./deploy.sh
```

### Step 2: Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it `tournament-app`
4. Make it **Public** (required for free hosting)
5. Don't initialize with README (we already have one)
6. Click "Create repository"

### Step 3: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/tournament-app.git
git push -u origin main
```

### Step 4: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your `tournament-app` repository
5. Click "Deploy"

**🎉 Your app will be live in 2-3 minutes!**

## 🔧 Environment Variables (Optional)

If you want to customize the admin password, add this in Vercel:
1. Go to your project settings
2. Click "Environment Variables"
3. Add:
   - Name: `ADMIN_PASSWORD`
   - Value: `your-secure-password`

## 🌐 Your App URLs

- **Main site**: `https://your-app-name.vercel.app`
- **Admin panel**: `https://your-app-name.vercel.app/admin`

## 📱 Features Ready to Use

✅ Team registration with WhatsApp for bizum payments  
✅ 10-team limit with real-time counter  
✅ Admin panel for tournament management  
✅ Group generation and match scheduling  
✅ Live standings and statistics  
✅ Professional logo and branding  

## 🆘 Need Help?

1. Check the build logs in Vercel
2. Make sure your GitHub repo is public
3. Verify all files are committed and pushed
4. See `DEPLOYMENT.md` for detailed instructions

---

**🎯 You're ready to host your tournament online!** 