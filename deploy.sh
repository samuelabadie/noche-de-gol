#!/bin/bash

echo "🚀 Tournament App Deployment Script"
echo "=================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - Tournament app"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo ""
    echo "🔗 Please add your GitHub repository as remote origin:"
    echo "   git remote add origin https://github.com/yourusername/tournament-app.git"
    echo ""
    echo "📝 Then push your code:"
    echo "   git push -u origin main"
    echo ""
else
    echo "✅ Remote origin already configured"
    echo "📤 Pushing latest changes..."
    git add .
    git commit -m "Update tournament app" || echo "No changes to commit"
    git push
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Go to https://vercel.com"
echo "2. Sign up with your GitHub account"
echo "3. Click 'New Project'"
echo "4. Import your tournament-app repository"
echo "5. Click 'Deploy'"
echo ""
echo "🌐 Your app will be live at: https://your-app-name.vercel.app"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md" 