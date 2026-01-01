#!/bin/bash

# Frontend Build and Deploy Script for API Gateway Setup
# Usage: ./build-frontend.sh

set -e  # Exit on error

API_GATEWAY_URL="${VITE_API_BASE_URL:-https://k05jtur8ml.execute-api.us-east-1.amazonaws.com/api}"
PROJECT_DIR="/home/ec2-user/app/growfitness-2.0"
FRONTEND_DIR="$PROJECT_DIR/apps/admin-web"
WEB_DIR="/var/www/growfitness-admin"

echo "🚀 Building frontend with API Gateway URL: $API_GATEWAY_URL"

# Navigate to frontend directory
cd "$FRONTEND_DIR"

# Build the frontend
echo "📦 Building frontend..."
export VITE_API_BASE_URL="$API_GATEWAY_URL"
pnpm build

# Create web directory if it doesn't exist
echo "📁 Preparing web directory..."
sudo mkdir -p "$WEB_DIR"

# Copy build files
echo "📋 Copying build files..."
sudo cp -r dist/* "$WEB_DIR/"

# Set permissions
echo "🔒 Setting permissions..."
sudo chown -R www-data:www-data "$WEB_DIR" 2>/dev/null || sudo chown -R nginx:nginx "$WEB_DIR"
sudo chmod -R 755 "$WEB_DIR"

# Reload nginx
echo "🔄 Reloading nginx..."
sudo systemctl reload nginx

echo "✅ Frontend deployed successfully!"
echo "🌐 Frontend should be accessible at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "🔗 API Gateway: $API_GATEWAY_URL"

