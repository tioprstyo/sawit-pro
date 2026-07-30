# Deployment Guide

Complete guide for deploying the Fleet Manager application using Docker and deployment scripts.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Deployment Scripts](#deployment-scripts)
3. [Docker Deployment](#docker-deployment)
4. [Docker Compose Deployment](#docker-compose-deployment)
5. [Cloud Deployment](#cloud-deployment)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Quick Start

### Using the Start Script (Recommended)

```bash
# Make script executable (one time)
chmod +x scripts/start.sh

# Run the interactive starter
./scripts/start.sh
```

This script will:
- Install dependencies if needed
- Build the application
- Offer options to start dev, preview, or Docker

---

## Deployment Scripts

### Overview

Three deployment scripts are available in the `scripts/` directory:

| Script | Purpose | Usage |
|--------|---------|-------|
| `deploy.sh` | Full deployment automation | `./scripts/deploy.sh [command]` |
| `start.sh` | Interactive quick start | `./scripts/start.sh` |
| `healthcheck.sh` | Monitor deployed app | `./scripts/healthcheck.sh` |

### deploy.sh Usage

#### Available Commands

```bash
# Build application only (npm install, test, build)
./scripts/deploy.sh build

# Build and deploy with Docker
./scripts/deploy.sh docker

# Build and deploy with Docker Compose
./scripts/deploy.sh compose

# Full deployment (build + docker)
./scripts/deploy.sh full

# Stop running container
./scripts/deploy.sh stop

# Show container logs
./scripts/deploy.sh logs

# Show help
./scripts/deploy.sh help
```

#### Options

```bash
# Custom image name
./scripts/deploy.sh docker --image my-app

# Custom tag
./scripts/deploy.sh docker --tag v1.0.0

# Custom port
./scripts/deploy.sh docker --port 3000

# Custom environment
./scripts/deploy.sh docker --env staging
```

#### Examples

```bash
# Deploy to production on port 3000
./scripts/deploy.sh full --env production --port 3000

# Deploy staging version
./scripts/deploy.sh docker --tag staging --env staging

# Deploy with custom image name
./scripts/deploy.sh docker --image sawit-pro-company --tag latest
```

---

## Docker Deployment

### Manual Docker Deployment

#### 1. Build Docker Image

```bash
# Build image
docker build -t sawit-pro:latest .

# Build with custom tag
docker build -t sawit-pro:v1.0.0 .

# Build with custom image name
docker build -t my-registry/sawit-pro:latest .
```

#### 2. Run Container

```bash
# Basic deployment
docker run -d \
  --name sawit-pro \
  -p 3000:3000 \
  sawit-pro:latest

# With environment variables
docker run -d \
  --name sawit-pro \
  -p 3000:3000 \
  -e NODE_ENV=production \
  sawit-pro:latest

# With restart policy
docker run -d \
  --name sawit-pro \
  -p 3000:3000 \
  --restart unless-stopped \
  sawit-pro:latest

# With health check
docker run -d \
  --name sawit-pro \
  -p 3000:3000 \
  --restart unless-stopped \
  --health-cmd="curl -f http://localhost:3000 || exit 1" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  sawit-pro:latest
```

#### 3. Verify Container

```bash
# Check if container is running
docker ps

# View logs
docker logs sawit-pro

# Follow logs (live)
docker logs -f sawit-pro

# Check container stats
docker stats sawit-pro
```

#### 4. Stop and Remove Container

```bash
# Stop container
docker stop sawit-pro

# Remove container
docker rm sawit-pro

# Stop and remove in one command
docker stop sawit-pro && docker rm sawit-pro
```

---

## Docker Compose Deployment

### Using docker-compose.yml

#### Start Services

```bash
# Start in background
docker-compose up -d

# Start and view logs
docker-compose up

# Build before starting
docker-compose up -d --build
```

#### View Status

```bash
# List running services
docker-compose ps

# View service logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Logs for specific service
docker-compose logs app
```

#### Stop Services

```bash
# Stop services (keep containers)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove everything (including volumes)
docker-compose down -v
```

#### Scaling Services

```bash
# Start multiple instances
docker-compose up -d --scale app=3
```

---

## Cloud Deployment

### AWS Deployment

#### Using AWS ECR (Elastic Container Registry)

```bash
# 1. Create ECR repository
aws ecr create-repository --repository-name sawit-pro

# 2. Get login token
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789.dkr.ecr.us-east-1.amazonaws.com

# 3. Tag image
docker tag sawit-pro:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/sawit-pro:latest

# 4. Push to ECR
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/sawit-pro:latest
```

#### Using AWS ECS (Elastic Container Service)

```bash
# Use the image from ECR in your ECS task definition
# The image URL would be:
# 123456789.dkr.ecr.us-east-1.amazonaws.com/sawit-pro:latest
```

### Google Cloud Deployment

#### Using Google Cloud Run

```bash
# 1. Set up gcloud CLI
gcloud auth configure-docker

# 2. Tag image
docker tag sawit-pro:latest gcr.io/PROJECT_ID/sawit-pro:latest

# 3. Push to Google Container Registry
docker push gcr.io/PROJECT_ID/sawit-pro:latest

# 4. Deploy to Cloud Run
gcloud run deploy sawit-pro \
  --image gcr.io/PROJECT_ID/sawit-pro:latest \
  --platform managed \
  --region us-central1 \
  --port 3000
```

### Azure Deployment

#### Using Azure Container Registry

```bash
# 1. Create registry
az acr create --resource-group myResourceGroup \
  --name sawitpro --sku Basic

# 2. Build and push
az acr build --registry sawitpro \
  --image sawit-pro:latest .

# 3. Deploy to Container Instances
az container create \
  --resource-group myResourceGroup \
  --name sawit-pro \
  --image sawitpro.azurecr.io/sawit-pro:latest \
  --cpu 1 --memory 1 \
  --registry-login-server sawitpro.azurecr.io \
  --ports 3000
```

---

## Monitoring & Maintenance

### Health Checks

#### Using Provided Health Check Script

```bash
# Make script executable
chmod +x scripts/healthcheck.sh

# Run health check
./scripts/healthcheck.sh

# With custom port
PORT=3001 ./scripts/healthcheck.sh
```

#### Manual Health Check

```bash
# Check if application responds
curl http://localhost:3000

# Check specific endpoint
curl http://localhost:3000/api/vehicles

# Check with verbose output
curl -v http://localhost:3000
```

### Container Logs

```bash
# View recent logs
docker logs sawit-pro

# View last 50 lines
docker logs --tail 50 sawit-pro

# Follow logs (live update)
docker logs -f sawit-pro

# View logs with timestamps
docker logs -t sawit-pro

# View logs from specific time
docker logs --since 1h sawit-pro
```

### Resource Monitoring

```bash
# View container resource usage
docker stats sawit-pro

# View all containers stats
docker stats

# View disk usage
docker system df

# View detailed container info
docker inspect sawit-pro
```

### Cleanup

```bash
# Remove unused images
docker image prune

# Remove unused containers
docker container prune

# Remove unused volumes
docker volume prune

# Remove all unused resources
docker system prune -a

# Remove specific image
docker rmi sawit-pro:latest
```

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs sawit-pro

# Check if port is in use
lsof -i :3000

# Kill process on port
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Performance Issues

```bash
# Monitor CPU and memory
docker stats sawit-pro

# Increase container resources
docker update --cpus 2 --memory 4g sawit-pro

# Check disk space
df -h
```

### Network Issues

```bash
# Test connectivity to container
docker exec sawit-pro curl http://localhost:3000

# Check container network
docker network inspect bridge

# View container IP
docker inspect sawit-pro | grep IPAddress
```

---

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use `--restart unless-stopped` policy
- [ ] Enable health checks
- [ ] Set resource limits (CPU, memory)
- [ ] Configure logging
- [ ] Set up monitoring/alerts
- [ ] Use a reverse proxy (Nginx)
- [ ] Enable HTTPS/SSL
- [ ] Regular backups
- [ ] Update Docker images regularly

---

## Environment Variables

### Common Variables

```bash
# Set environment
-e NODE_ENV=production

# Set port
-e PORT=3000

# Set log level
-e LOG_LEVEL=info
```

---

## Quick Reference

### Most Common Commands

```bash
# Deploy with script
./scripts/deploy.sh full

# Deploy with Docker Compose
docker-compose up -d

# View logs
docker logs -f sawit-pro

# Stop all
docker-compose down

# Health check
./scripts/healthcheck.sh
```

---

## Support & Help

For detailed information:
- See [README.md](README.md) for setup
- See [ARCHITECTURE.md](ARCHITECTURE.md) for design
- See [API.md](API.md) for API reference
- See [TESTING.md](TESTING.md) for testing

---

**Last Updated**: July 2026
**Version**: 1.0.0
