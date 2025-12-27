#!/bin/bash
set -e

echo "🔍 Starting Quality Checks..."

echo "--------------------------------------------------"
echo "1. Linting (ESLint)"
echo "--------------------------------------------------"
npm run lint

echo "--------------------------------------------------"
echo "2. Type Checking (TypeScript)"
echo "--------------------------------------------------"
npm run typecheck

echo "--------------------------------------------------"
echo "3. Unit Tests & Coverage (Vitest)"
echo "--------------------------------------------------"
npm run test:coverage

echo "✅ All checks passed successfully!"
