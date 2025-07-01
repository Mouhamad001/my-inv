@echo off
echo ========================================
echo    Inventory Tracking Application
echo ========================================
echo.

echo Starting Backend (Spring Boot)...
cd backend
start "Backend" cmd /k "mvnw.cmd spring-boot:run"
cd ..

echo.
echo Waiting for backend to start...
timeout /t 10 /nobreak > nul

echo.
echo Starting Frontend (React)...
cd frontend
start "Frontend" cmd /k "npm start"
cd ..

echo.
echo ========================================
echo    Applications Starting...
echo ========================================
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo H2 Console: http://localhost:8080/h2-console
echo.
echo Press any key to exit this window...
pause > nul 