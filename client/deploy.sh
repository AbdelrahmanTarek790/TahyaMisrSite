#!/bin/bash

# Build and Deploy Script for TahyaMisr React SSR Application

set -e  # Exit on any error

echo "🚀 Starting TahyaMisr Frontend deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="tahyamisr/frontend"
CONTAINER_NAME="TahyaMisrFront"
VERSION=${1:-latest}

echo -e "${YELLOW}📦 Building Docker image...${NC}"

# Build the Docker image
docker build -t ${IMAGE_NAME}:${VERSION} .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker image built successfully${NC}"
else
    echo -e "${RED}❌ Docker build failed${NC}"
    exit 1
fi

echo -e "${YELLOW}🔍 Testing the built image...${NC}"

# Test the image
TEST_CONTAINER_ID=$(docker run -d --name test-container -p 3001:5173 ${IMAGE_NAME}:${VERSION})

# Wait for container to start
sleep 15

# Test health endpoint
if curl -f http://localhost:3001/api/sitemap/status > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Container health check passed${NC}"
    docker stop test-container > /dev/null 2>&1
    docker rm test-container > /dev/null 2>&1
else
    echo -e "${RED}❌ Container health check failed${NC}"
    echo -e "${YELLOW}📋 Container logs:${NC}"
    docker logs test-container
    docker stop test-container > /dev/null 2>&1
    docker rm test-container > /dev/null 2>&1
    exit 1
fi

echo -e "${YELLOW}🏷️ Tagging image...${NC}"

# Tag as latest if not specified
if [ "${VERSION}" != "latest" ]; then
    docker tag ${IMAGE_NAME}:${VERSION} ${IMAGE_NAME}:latest
fi

echo -e "${YELLOW}🗑️ Cleaning up old containers...${NC}"

# Stop and remove existing container if running
docker stop ${CONTAINER_NAME} 2>/dev/null || true
docker rm ${CONTAINER_NAME} 2>/dev/null || true

echo -e "${YELLOW}🚀 Starting new container...${NC}"

# Run the new container
docker run -d \
    --name ${CONTAINER_NAME} \
    --restart unless-stopped \
    -p 3000:5173 \
    -e NODE_ENV=production \
    -e SITE_URL=https://tahyamisryu.com \
    ${IMAGE_NAME}:${VERSION}

# Wait for container to be ready
sleep 15

# Final health check
if curl -f http://localhost:3000/api/sitemap/status > /dev/null 2>&1; then
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo -e "${GREEN}📍 Application is running at: http://localhost:3000${NC}"
    echo -e "${GREEN}🗺️ Sitemap available at: http://localhost:3000/sitemap.xml${NC}"
else
    echo -e "${RED}❌ Deployment failed - health check failed${NC}"
    docker logs ${CONTAINER_NAME}
    exit 1
fi

echo -e "${YELLOW}📊 Container status:${NC}"
docker ps | grep ${CONTAINER_NAME}

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"