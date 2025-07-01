#!/bin/bash

echo "========================================"
echo "   Inventory Tracking Application"
echo "========================================"
echo

echo "Starting Backend (Spring Boot)..."
cd backend
gnome-terminal --title="Backend" -- bash -c "./mvnw spring-boot:run; exec bash" &
cd ..

echo
echo "Waiting for backend to start..."
sleep 10

echo
echo "Starting Frontend (React)..."
cd frontend
gnome-terminal --title="Frontend" -- bash -c "npm start; exec bash" &
cd ..

echo
echo "========================================"
echo "   Applications Starting..."
echo "========================================"
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:3000"
echo "H2 Console: http://localhost:8080/h2-console"
echo
echo "Press Ctrl+C to stop all applications"
echo

# Wait for user to stop
wait 