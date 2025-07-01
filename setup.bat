@echo off
echo ========================================
echo    Inventory App Setup (Windows)
echo ========================================
echo.

echo Checking prerequisites...

REM Check Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
) else (
    echo ✅ Java found
)

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js 16 or higher
    pause
    exit /b 1
) else (
    echo ✅ Node.js found
)

echo.
echo Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Setting up Backend...
cd backend
echo Downloading Maven wrapper...
call mvnw.cmd --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Failed to setup Maven wrapper
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo    Setup Complete! 🎉
echo ========================================
echo.
echo You can now run the application with:
echo   start.bat
echo.
echo Or manually:
echo   Backend: cd backend && mvnw.cmd spring-boot:run
echo   Frontend: cd frontend && npm start
echo.
pause 