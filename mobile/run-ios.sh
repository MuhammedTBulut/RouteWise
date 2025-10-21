#!/bin/bash
# iOS Simulator Runner for RouteWise

echo "🚀 Starting RouteWise on iOS Simulator..."

# Set file limit
ulimit -n 4096

# Navigate to mobile directory
cd "$(dirname "$0")"

# Check if simulator is running
if ! xcrun simctl list devices booted | grep -q "Booted"; then
    echo "📱 Booting iOS Simulator..."
    xcrun simctl boot "iPhone 17 Pro" 2>/dev/null || xcrun simctl boot "iPhone 16 Pro" 2>/dev/null
    sleep 3
    open -a Simulator
fi

# Start Expo
echo "🎯 Starting Expo..."
npx expo start --ios

echo "✅ Done!"
