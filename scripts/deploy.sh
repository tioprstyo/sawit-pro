#!/bin/bash

################################################################################
# Fleet Manager - Deployment Script
# Handles building and deploying the application with Docker
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="${IMAGE_NAME:-sawit-pro}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
CONTAINER_NAME="${CONTAINER_NAME:-sawit-pro-app}"
PORT="${PORT:-3000}"
ENVIRONMENT="${ENVIRONMENT:-production}"

################################################################################
# Functions
################################################################################

print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

check_requirements() {
    print_header "Checking Requirements"

    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    print_success "Docker is installed"

    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm is installed"

    print_success "All requirements met"
}

build_application() {
    print_header "Building Application"

    print_info "Installing dependencies..."
    npm install

    print_info "Running tests..."
    npm test -- --passWithNoTests

    print_info "Building for production..."
    npm run build

    print_success "Application built successfully"
}

build_docker_image() {
    print_header "Building Docker Image"

    print_info "Building image: ${IMAGE_NAME}:${IMAGE_TAG}"
    docker build -t "${IMAGE_NAME}:${IMAGE_TAG}" .

    print_success "Docker image built: ${IMAGE_NAME}:${IMAGE_TAG}"
}

stop_running_container() {
    print_header "Stopping Running Container"

    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_info "Found running container: ${CONTAINER_NAME}"
        docker stop "${CONTAINER_NAME}" 2>/dev/null || true
        docker rm "${CONTAINER_NAME}" 2>/dev/null || true
        print_success "Container stopped and removed"
    else
        print_info "No running container found"
    fi
}

deploy_docker() {
    print_header "Deploying with Docker"

    stop_running_container

    print_info "Starting container: ${CONTAINER_NAME}"
    docker run -d \
        --name "${CONTAINER_NAME}" \
        -p "${PORT}:3000" \
        -e NODE_ENV="${ENVIRONMENT}" \
        --restart unless-stopped \
        "${IMAGE_NAME}:${IMAGE_TAG}"

    print_success "Container started"
    sleep 2

    # Verify container is running
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_success "Container is running"
    else
        print_error "Container failed to start"
        docker logs "${CONTAINER_NAME}"
        exit 1
    fi
}

deploy_docker_compose() {
    print_header "Deploying with Docker Compose"

    print_info "Building and starting services..."
    docker-compose up -d

    print_success "Services started with Docker Compose"
    sleep 2

    print_info "Checking service health..."
    docker-compose ps

    print_success "Docker Compose deployment complete"
}

display_summary() {
    print_header "Deployment Summary"

    echo -e "${BLUE}Application:${NC}"
    echo "  Name:     ${IMAGE_NAME}"
    echo "  Tag:      ${IMAGE_TAG}"
    echo "  Port:     ${PORT}"
    echo "  URL:      http://localhost:${PORT}"
    echo ""
    echo -e "${BLUE}Environment:${NC}"
    echo "  Type:     ${ENVIRONMENT}"
    echo ""
    echo -e "${BLUE}Container:${NC}"
    echo "  Name:     ${CONTAINER_NAME}"
    echo ""

    if [ "$1" == "compose" ]; then
        echo -e "${BLUE}To view logs:${NC}"
        echo "  docker-compose logs -f"
        echo ""
        echo -e "${BLUE}To stop services:${NC}"
        echo "  docker-compose down"
    else
        echo -e "${BLUE}To view logs:${NC}"
        echo "  docker logs -f ${CONTAINER_NAME}"
        echo ""
        echo -e "${BLUE}To stop container:${NC}"
        echo "  docker stop ${CONTAINER_NAME}"
    fi

    echo ""
    print_success "Deployment complete!"
}

usage() {
    cat << EOF
${BLUE}Fleet Manager - Deployment Script${NC}

${YELLOW}Usage:${NC}
  ./scripts/deploy.sh [OPTIONS] [COMMAND]

${YELLOW}Commands:${NC}
  build           Build application (npm install, test, build)
  docker          Build and deploy with Docker
  compose         Build and deploy with Docker Compose
  full            Full deployment (build + docker)
  stop            Stop running container
  logs            Show container logs
  help            Show this help message

${YELLOW}Options:${NC}
  --image NAME    Docker image name (default: sawit-pro)
  --tag TAG       Docker image tag (default: latest)
  --port PORT     Port to expose (default: 3000)
  --env ENV       Environment (default: production)

${YELLOW}Examples:${NC}
  ./scripts/deploy.sh build
  ./scripts/deploy.sh docker
  ./scripts/deploy.sh compose
  ./scripts/deploy.sh docker --tag v1.0.0 --port 3000
  ./scripts/deploy.sh full --image my-app --env staging

EOF
}

################################################################################
# Main Script
################################################################################

# Parse arguments
COMMAND="full"
while [[ $# -gt 0 ]]; do
    case $1 in
        build)
            COMMAND="build"
            shift
            ;;
        docker)
            COMMAND="docker"
            shift
            ;;
        compose)
            COMMAND="compose"
            shift
            ;;
        full)
            COMMAND="full"
            shift
            ;;
        stop)
            COMMAND="stop"
            shift
            ;;
        logs)
            COMMAND="logs"
            shift
            ;;
        help)
            usage
            exit 0
            ;;
        --image)
            IMAGE_NAME="$2"
            shift 2
            ;;
        --tag)
            IMAGE_TAG="$2"
            shift 2
            ;;
        --port)
            PORT="$2"
            shift 2
            ;;
        --env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        *)
            print_error "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# Execute command
case $COMMAND in
    build)
        check_requirements
        build_application
        ;;
    docker)
        check_requirements
        build_application
        build_docker_image
        deploy_docker
        display_summary "docker"
        ;;
    compose)
        check_requirements
        build_application
        build_docker_image
        deploy_docker_compose
        display_summary "compose"
        ;;
    full)
        check_requirements
        build_application
        build_docker_image
        deploy_docker
        display_summary "docker"
        ;;
    stop)
        stop_running_container
        print_success "Container stopped"
        ;;
    logs)
        print_info "Showing logs from ${CONTAINER_NAME}..."
        docker logs -f "${CONTAINER_NAME}"
        ;;
    *)
        print_error "Unknown command: $COMMAND"
        usage
        exit 1
        ;;
esac
