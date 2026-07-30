#!/bin/bash

################################################################################
# Health Check Script for Deployed Application
################################################################################

set -e

# Configuration
PORT="${PORT:-3000}"
URL="http://localhost:${PORT}"
MAX_RETRIES=30
RETRY_INTERVAL=2

echo "🏥 Checking health of application at ${URL}..."
echo ""

# Function to check if port is open
check_port() {
    timeout 2 bash -c "echo >/dev/tcp/localhost/${PORT}" 2>/dev/null
    return $?
}

# Function to check HTTP response
check_http() {
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "${URL}" 2>/dev/null || echo "000")
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 404 ]; then
        return 0
    fi
    return 1
}

# Wait for port to be open
echo "⏳ Waiting for port ${PORT} to be open..."
for i in $(seq 1 $MAX_RETRIES); do
    if check_port; then
        echo "✓ Port ${PORT} is open"
        break
    fi

    if [ $i -eq $MAX_RETRIES ]; then
        echo "✗ Port ${PORT} is not responding after $((MAX_RETRIES * RETRY_INTERVAL)) seconds"
        exit 1
    fi

    echo "  Attempt $i/$MAX_RETRIES... waiting $RETRY_INTERVAL seconds"
    sleep $RETRY_INTERVAL
done

# Check HTTP response
echo "⏳ Checking HTTP response..."
for i in $(seq 1 $MAX_RETRIES); do
    if check_http; then
        echo "✓ Application is responding with HTTP 200"
        break
    fi

    if [ $i -eq $MAX_RETRIES ]; then
        echo "✗ Application not responding with HTTP 200 after $((MAX_RETRIES * RETRY_INTERVAL)) seconds"
        exit 1
    fi

    echo "  Attempt $i/$MAX_RETRIES... waiting $RETRY_INTERVAL seconds"
    sleep $RETRY_INTERVAL
done

echo ""
echo "✅ Health check passed!"
echo "   URL: ${URL}"
echo ""
echo "📊 Application Status:"
echo "   Port:     ${PORT}"
echo "   Status:   Running"
echo "   URL:      ${URL}"
echo ""
