#!/bin/bash
set -e

echo "🛠️  Setting up development environment (Bun)..."

# Check Bun installation
if ! command -v bun &> /dev/null; then
    echo "📦 Bun is not installed. Installing via Homebrew..."
    brew install oven-sh/bun/bun
fi

echo "Using Bun $(bun --version)"

# Check Node.js version (still required for some tools)
REQUIRED_NODE_VERSION=18
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$NODE_VERSION" -lt "$REQUIRED_NODE_VERSION" ]; then
    echo "❌ Error: Node.js version must be $REQUIRED_NODE_VERSION or higher. Current version: $(node -v)"
    exit 1
fi

echo "📦 Installing dependencies with Bun..."
bun install

echo "🐶 Setting up Git hooks..."
bun run prepare

echo "✅ Setup complete! You can now run:"
echo "   - bun run dev    : Start development server"
echo "   - bun run test   : Run tests"
echo "   - ./scripts/quality-check.sh : Run full quality check"
