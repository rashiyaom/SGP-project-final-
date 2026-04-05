#!/bin/bash
# Memory cleanup script - run this when you get OOM errors

echo "🗑️  Cleaning VS Code cache and build artifacts..."

# Kill Node processes
echo "Stopping Node processes..."
pkill -f "node" || true
pkill -f "next" || true

# Clear Next.js build cache
echo "Clearing .next directory..."
rm -rf .next/

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Optional: Remove node_modules and reinstall (only if needed)
# echo "Reinstalling dependencies..."
# rm -rf node_modules/
# npm install

echo "✅ Cleanup complete! Try:'
echo "   npm run dev"
echo ""
echo "If issues persist, increase Node heap size:"
echo "   $env:NODE_OPTIONS = '--max-old-space-size=4096'; npm run dev  # PowerShell"
echo "   set NODE_OPTIONS=--max-old-space-size=4096 && npm run dev    # CMD"
