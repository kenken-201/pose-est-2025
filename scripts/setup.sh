#!/bin/bash
set -e

echo "🛠️  Setting up development environment..."

# Check Node.js version
REQUIRED_NODE_VERSION=18
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$NODE_VERSION" -lt "$REQUIRED_NODE_VERSION" ]; then
    echo "❌ Error: Node.js version must be $REQUIRED_NODE_VERSION or higher. Current version: $(node -v)"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🐶 Setting up Git hooks..."
npm run prepare

echo "✅ Setup complete! You can now run:"
echo "   - npm run dev : Start development server"
echo "   - ./test.sh   : Run full test suite"
