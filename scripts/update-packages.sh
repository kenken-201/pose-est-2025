#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}📦 Starting package update process (Bun)...${NC}"

# Check for bun
if ! command -v bun &> /dev/null; then
    echo -e "${RED}Error: bun is required but not installed.${NC}"
    echo -e "${YELLOW}Install with: brew install oven-sh/bun/bun${NC}"
    exit 1
fi

echo -e "${YELLOW}🔍 Checking for outdated packages...${NC}"
# Note: bun doesn't have a native 'outdated' command, using npm for this
npm outdated || true

echo -e "${YELLOW}🔄 Updating packages (target: minor)...${NC}"
# Update only patch and minor versions to avoid breaking changes
bunx npm-check-updates -u --target minor

echo -e "${YELLOW}📥 Installing updates...${NC}"
bun install

echo -e "${GREEN}✅ Packages updated successfully.${NC}"

echo -e "${YELLOW}🧪 Running quality checks...${NC}"
if ./scripts/quality-check.sh; then
    echo -e "${GREEN}🎉 All checks passed! Update safe to commit.${NC}"
else
    echo -e "${RED}❌ Quality checks failed. Please review changes.${NC}"
    exit 1
fi
