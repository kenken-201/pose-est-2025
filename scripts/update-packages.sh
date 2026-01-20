#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}📦 Starting package update process...${NC}"

# Check for npm-check-updates
if ! command -v npx &> /dev/null; then
    echo -e "${RED}Error: npx is required but not installed.${NC}"
    exit 1
fi

echo -e "${YELLOW}🔍 Checking for outdated packages...${NC}"
npm outdated || true

echo -e "${YELLOW}🔄 Updating packages (target: minor)...${NC}"
# Update only patch and minor versions to avoid breaking changes
# User can manually update major versions if needed
npx npm-check-updates -u --target minor

echo -e "${YELLOW}📥 Installing updates...${NC}"
npm install

echo -e "${GREEN}✅ Packages updated successfully.${NC}"

echo -e "${YELLOW}🧪 Running quality checks...${NC}"
if ./scripts/quality-check.sh; then
    echo -e "${GREEN}🎉 All checks passed! Update safe to commit.${NC}"
else
    echo -e "${RED}❌ Quality checks failed. Please review changes.${NC}"
    exit 1
fi
