#!/bin/bash

echo "🌐 Netlify Deployment Script"
echo "============================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - Tournament app for Netlify"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo ""
    echo "🔗 Please create a GitHub repository and add it as remote origin:"
    echo "   1. Go to https://github.com"
    echo "   2. Click 'New repository'"
    echo "   3. Name it 'tournament-app'"
    echo "   4. Make it PUBLIC (required for free hosting)"
    echo "   5. Don't initialize with README"
    echo "   6. Copy the repository URL"
    echo ""
    echo "   Then run:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/tournament-app.git"
    echo "   git push -u origin main"
    echo ""
else
    echo "✅ Remote origin already configured"
    echo "📤 Pushing latest changes..."
    git add .
    git commit -m "Update tournament app for Netlify deployment" || echo "No changes to commit"
    git push
fi

echo ""
echo "🎯 Next Steps for Netlify Deployment:"
echo "1. Go to https://netlify.com"
echo "2. Sign up with your GitHub account"
echo "3. Click 'Add new site'"
echo "4. Select 'Import an existing project'"
echo "5. Choose 'Deploy with GitHub'"
echo "6. Select your 'tournament-app' repository"
echo "7. Configure build settings:"
echo "   - Build command: npm run build"
echo "   - Publish directory: .next"
echo "8. Click 'Deploy site'"
echo ""
echo "🌐 Your app will be live at: https://your-site-name.netlify.app"
echo ""
echo "📚 For detailed instructions, see NETLIFY_DEPLOYMENT.md" 