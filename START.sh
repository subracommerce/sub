#!/bin/bash

# SUBRA Startup Script
# This will start all required services

echo "🚀 Starting SUBRA Platform..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if PostgreSQL is running
echo -e "${YELLOW}Checking PostgreSQL...${NC}"
if brew services list | grep -q "postgresql@14.*started"; then
  echo -e "${GREEN}✅ PostgreSQL is running${NC}"
else
  echo "Starting PostgreSQL..."
  brew services start postgresql@14
fi

# Check if Redis is running
echo -e "${YELLOW}Checking Redis...${NC}"
if brew services list | grep -q "redis.*started"; then
  echo -e "${GREEN}✅ Redis is running${NC}"
else
  echo "Starting Redis..."
  brew services start redis
fi

echo ""
echo -e "${GREEN}✅ Infrastructure ready!${NC}"
echo ""
echo "Now start the servers in separate terminals:"
echo ""
echo "Terminal 1 (API):"
echo "  cd /Users/kingchief/Documents/SUB/apps/api && pnpm dev"
echo ""
echo "Terminal 2 (Web):"
echo "  cd /Users/kingchief/Documents/SUB/apps/web && pnpm dev"
echo ""
echo "Then visit: http://localhost:3000"

