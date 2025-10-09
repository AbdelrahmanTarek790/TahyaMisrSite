# Docker Deployment Guide for TahyaMisr React SSR

This guide covers deploying your React SSR application with Docker in production.

## 🏗️ Architecture Overview

Your application now runs as a **Node.js SSR server** (not static files), providing:
- ✅ Server-side rendering for SEO
- ✅ Dynamic sitemap generation
- ✅ API endpoints for webhooks
- ✅ Social media meta tags

## 📁 File Structure

```
TahyaMisr/Frontend/
├── Dockerfile                 # Main application container
├── docker-compose.yml         # Simple deployment
├── docker-compose.full.yml    # With nginx proxy
├── nginx.conf                 # Nginx configuration
├── .dockerignore             # Build optimization
├── deploy.sh                 # Linux/Mac deployment
├── deploy.bat                # Windows deployment
└── server/index.js           # SSR server
```

## 🚀 Deployment Options

### Option 1: Direct Node.js Container (Recommended)

**Update your docker-compose.yml:**
```yaml
version: '3.8'

services:
  tahyamisr-frontend:
    container_name: TahyaMisrFront
    build:
      context: ./TahyaMisr/Frontend
      dockerfile: Dockerfile
    ports:
      - "3000:5173"
    environment:
      - NODE_ENV=production
      - PORT=5173
      - SITE_URL=https://tahyamisryu.com
    volumes:
      - sitemap_data:/app/public
    restart: unless-stopped
    networks:
      - npm_internal

volumes:
  sitemap_data:

networks:
  npm_internal:
    external: true
```

### Option 2: With Nginx Reverse Proxy

**Use docker-compose.full.yml** for nginx + Node.js setup:
```bash
docker-compose -f docker-compose.full.yml up -d
```

## 🛠️ Deployment Commands

### Quick Deployment (Windows)
```cmd
# Build and deploy automatically
deploy.bat

# Or specify version
deploy.bat v1.0.0
```

### Quick Deployment (Linux/Mac)
```bash
# Make script executable
chmod +x deploy.sh

# Build and deploy automatically
./deploy.sh

# Or specify version
./deploy.sh v1.0.0
```

### Manual Deployment
```bash
# Build image
docker build -t tahyamisr/frontend:latest .

# Run container
docker run -d \
  --name TahyaMisrFront \
  --restart unless-stopped \
  -p 3000:5173 \
  -e NODE_ENV=production \
  -e SITE_URL=https://tahyamisryu.com \
  tahyamisr/frontend:latest
```

### Using Docker Compose
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Environment Variables

Configure these in your docker-compose.yml or deployment:

```yaml
environment:
  - NODE_ENV=production
  - PORT=5173
  - SITE_URL=https://tahyamisryu.com
  - SITEMAP_WEBHOOK_URL=https://your-cms.com/api/webhooks/sitemap-updated
```

## 📊 Monitoring & Health Checks

### Built-in Health Check
The container includes automatic health monitoring:
```bash
# Check container health
docker ps

# View health check logs
docker inspect TahyaMisrFront
```

### Manual Health Check
```bash
# Test application
curl http://localhost:3000/api/sitemap/status

# Test sitemap
curl http://localhost:3000/sitemap.xml
```

## 🗺️ Sitemap Management in Docker

### Automatic Sitemap Updates
Your containerized app supports:
- **Webhook updates**: `POST /api/sitemap/regenerate`
- **Health monitoring**: `GET /api/sitemap/status`
- **Persistent storage**: Mounted volume for sitemap data

### Manual Sitemap Regeneration
```bash
# Regenerate sitemap via API
curl -X POST http://localhost:3000/api/sitemap/regenerate

# Or exec into container
docker exec TahyaMisrFront node -e "import('./scripts/generate-sitemap.js').then(m => m.generate())"
```

## 🔄 Updates & Maintenance

### Update Application
```bash
# Pull latest changes
git pull

# Rebuild and redeploy
./deploy.sh v1.1.0

# Or use docker-compose
docker-compose up -d --build
```

### View Logs
```bash
# Application logs
docker logs TahyaMisrFront -f

# All services logs
docker-compose logs -f
```

### Backup Sitemap Data
```bash
# Backup sitemap volume
docker run --rm -v sitemap_data:/data -v $(pwd):/backup alpine tar czf /backup/sitemap-backup.tar.gz -C /data .

# Restore sitemap volume
docker run --rm -v sitemap_data:/data -v $(pwd):/backup alpine tar xzf /backup/sitemap-backup.tar.gz -C /data
```

## 🐛 Troubleshooting

### Container Won't Start
1. Check build logs: `docker build -t test .`
2. Test image: `docker run --rm test npm run serve:ssr`
3. Check port conflicts: `netstat -tulpn | grep 3000`

### SSR Not Working
1. Verify environment: `docker exec TahyaMisrFront env`
2. Check server logs: `docker logs TahyaMisrFront`
3. Test endpoints manually: `curl -I http://localhost:3000/`

### Sitemap Issues
1. Check sitemap API: `curl http://localhost:3000/api/sitemap/status`
2. Verify volume mounts: `docker inspect TahyaMisrFront`
3. Check file permissions: `docker exec TahyaMisrFront ls -la /app/public/`

## 📈 Performance Optimization

### Container Resources
```yaml
services:
  tahyamisr-frontend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### Nginx Caching (if using Option 2)
- Static assets: 1 year cache
- Sitemap: 1 hour cache  
- SSR pages: No cache (fresh meta tags)

## 🔒 Security Considerations

1. **Container Security**:
   - Runs as non-root user
   - Minimal alpine base image
   - No unnecessary packages

2. **Network Security**:
   - Internal Docker network
   - Rate limiting (if using nginx)
   - Health check endpoints

3. **Environment Security**:
   - No secrets in Dockerfile
   - Environment variable injection
   - Proper signal handling

## 🎯 Production Checklist

- [ ] Update `SITE_URL` environment variable
- [ ] Configure webhook URLs for CMS integration
- [ ] Set up proper logging/monitoring
- [ ] Configure backup strategy for volumes
- [ ] Test health check endpoints
- [ ] Verify SSL/TLS termination (if using nginx)
- [ ] Set up automated deployments
- [ ] Monitor container resource usage

Your React SSR application is now production-ready with Docker! 🎉