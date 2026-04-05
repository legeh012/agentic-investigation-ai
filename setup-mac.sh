#!/bin/bash
set -e

echo ""
echo "  🎯 Agentic Investigation AI — macOS Setup"
echo "  ==========================================="
echo ""

# Check Node
if ! command -v node &> /dev/null; then
  echo "  ❌ Node.js not found."
  echo "  👉 Install it from: https://nodejs.org"
  echo "  👉 Or via Homebrew: brew install node"
  exit 1
fi

echo "  ✅ Node.js $(node -v) found"

# Install deps
echo "  📦 Installing dependencies..."
npm install --silent

echo ""
echo "  ✅ Dependencies installed."
echo ""
echo "  Choose an option:"
echo "  1) npm run electron:dev    — Launch in dev mode (hot reload)"
echo "  2) npm run electron:build  — Build .dmg installer for macOS"
echo ""
read -p "  Enter 1 or 2 (or press Enter to launch dev): " choice

if [ "$choice" = "2" ]; then
  echo "  🔨 Building macOS .dmg..."
  npm run electron:build
  echo ""
  echo "  ✅ Done! Find your installer in /release/"
  open release/
else
  echo "  🚀 Launching Agentic Investigation AI..."
  npm run electron:dev
fi
