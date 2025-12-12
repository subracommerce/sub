#!/bin/bash

# Kill any existing process on port 4000
echo "🔪 Killing any process on port 4000..."
lsof -ti:4000 | xargs kill -9 2>/dev/null || echo "No process found"

echo "🚀 Starting SUBRA API..."
cd /Users/kingchief/Documents/SUB/apps/api
pnpm dev

