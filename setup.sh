#!/bin/bash

echo "========================================"
echo "   Inventory App Setup (Linux/Mac)"
echo "========================================"
echo

echo "Checking prerequisites..."

# Check Java
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed or not in PATH"
    echo "Please install Java 17 or higher"
    exit 1
else
    echo "✅ Java found"
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    echo "Please install Node.js 16 or higher"
    exit 1
else
    echo "✅ Node.js found"
fi

echo
echo "Installing Frontend Dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo
echo "Setting up Backend..."
cd backend
echo "Downloading Maven wrapper..."
chmod +x mvnw
./mvnw --version > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Failed to setup Maven wrapper"
    exit 1
fi
cd ..

echo
echo "========================================"
echo "   Setup Complete! 🎉"
echo "========================================"
echo
echo "You can now run the application with:"
echo "  ./start.sh"
echo
echo "Or manually:"
echo "  Backend: cd backend && ./mvnw spring-boot:run"
echo "  Frontend: cd frontend && npm start"
echo 