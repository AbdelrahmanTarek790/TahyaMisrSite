@echo off
REM Build and Deploy Script for TahyaMisr React SSR Application (Windows)

echo 🚀 Starting TahyaMisr Frontend deployment...

REM Configuration
set IMAGE_NAME=tahyamisr/frontend
set CONTAINER_NAME=TahyaMisrFront
set VERSION=%1
if "%VERSION%"=="" set VERSION=latest

echo 📦 Building Docker image...

REM Build the Docker image
docker build -t %IMAGE_NAME%:%VERSION% .

if %ERRORLEVEL% neq 0 (
    echo ❌ Docker build failed
    exit /b 1
)

echo ✅ Docker image built successfully

echo 🔍 Testing the built image...

REM Test the image
docker run --rm -d --name test-container -p 3001:5173 %IMAGE_NAME%:%VERSION%

REM Wait for container to start
timeout /t 10 /nobreak > nul

REM Test health endpoint
curl -f http://localhost:3001/api/sitemap/status > nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ Container health check passed
    docker stop test-container > nul
) else (
    echo ❌ Container health check failed
    docker stop test-container > nul
    exit /b 1
)

echo 🏷️ Tagging image...

REM Tag as latest if not specified
if not "%VERSION%"=="latest" (
    docker tag %IMAGE_NAME%:%VERSION% %IMAGE_NAME%:latest
)

echo 🗑️ Cleaning up old containers...

REM Stop and remove existing container if running
docker stop %CONTAINER_NAME% > nul 2>&1
docker rm %CONTAINER_NAME% > nul 2>&1

echo 🚀 Starting new container...

REM Run the new container
docker run -d ^
    --name %CONTAINER_NAME% ^
    --restart unless-stopped ^
    -p 3000:5173 ^
    -e NODE_ENV=production ^
    -e SITE_URL=https://tahyamisryu.com ^
    %IMAGE_NAME%:%VERSION%

REM Wait for container to be ready
timeout /t 15 /nobreak > nul

REM Final health check
curl -f http://localhost:3000/api/sitemap/status > nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo 🎉 Deployment successful!
    echo 📍 Application is running at: http://localhost:3000
    echo 🗺️ Sitemap available at: http://localhost:3000/sitemap.xml
) else (
    echo ❌ Deployment failed - health check failed
    docker logs %CONTAINER_NAME%
    exit /b 1
)

echo 📊 Container status:
docker ps | findstr %CONTAINER_NAME%

echo ✅ Deployment completed successfully!