@echo off
title FinanceWise India - Startup
color 0A

echo.
echo =========================================
echo   Rs  FinanceWise India - Quick Start
echo =========================================
echo.

REM Check Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java not found. Install Java 17+ from https://adoptium.net
    pause
    exit /b 1
)
echo [OK] Java found

REM Check Node
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js found

echo.
echo [INFO] Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo [OK] Frontend ready

echo.
echo [INFO] Starting backend (Spring Boot)...
start "FinanceWise Backend" cmd /k "cd backend && mvnw.cmd spring-boot:run"

echo [INFO] Waiting 45 seconds for backend to start...
timeout /t 45 /nobreak >nul

echo.
echo [INFO] Starting frontend (React)...
start "FinanceWise Frontend" cmd /k "cd frontend && npm start"

echo.
echo =========================================
echo   FinanceWise India is Starting!
echo =========================================
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:8080/api
echo   Admin:     http://localhost:3000/admin
echo   Login:     admin / Admin@123
echo =========================================
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause
