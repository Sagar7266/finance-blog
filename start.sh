#!/bin/bash

# FinanceWise India — Quick Start Script
# Usage: chmod +x start.sh && ./start.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ₹  FinanceWise India — Startup      ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java not found. Install Java 17+ from https://adoptium.net${NC}"
    exit 1
fi
JAVA_VER=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
echo -e "${GREEN}✅ Java $JAVA_VER found${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Install from https://nodejs.org${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) found${NC}"

if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}⚠️  MySQL CLI not found in PATH. Make sure MySQL server is running.${NC}"
else
    echo -e "${GREEN}✅ MySQL found${NC}"
fi

echo ""
echo -e "${BLUE}🗄️  Setting up database...${NC}"
echo -e "${YELLOW}Enter your MySQL root password (or press Enter if no password):${NC}"
read -s MYSQL_PASS

if [ -z "$MYSQL_PASS" ]; then
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS finance_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || true
else
    mysql -u root -p"$MYSQL_PASS" -e "CREATE DATABASE IF NOT EXISTS finance_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || true
fi
echo -e "${GREEN}✅ Database ready${NC}"

# Update application.properties
if [ ! -z "$MYSQL_PASS" ]; then
    sed -i.bak "s/spring.datasource.password=root/spring.datasource.password=$MYSQL_PASS/" backend/src/main/resources/application.properties
    echo -e "${GREEN}✅ Database credentials updated${NC}"
fi

echo ""
echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
cd frontend && npm install --silent && cd ..
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

echo ""
echo -e "${BLUE}🚀 Starting backend (Spring Boot)...${NC}"
cd backend && ./mvnw spring-boot:run -q &
BACKEND_PID=$!
cd ..

echo -e "${YELLOW}⏳ Waiting for backend to start (up to 60s)...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:8080/api/categories > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend started at http://localhost:8080/api${NC}"
        break
    fi
    sleep 2
done

echo ""
echo -e "${BLUE}🎨 Starting frontend (React)...${NC}"
cd frontend && npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         🎉 FinanceWise India is Running!       ║${NC}"
echo -e "${GREEN}╠═══════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  🌐 Frontend:  http://localhost:3000           ║${NC}"
echo -e "${GREEN}║  🔧 Backend:   http://localhost:8080/api       ║${NC}"
echo -e "${GREEN}║  🔑 Admin:     http://localhost:3000/admin     ║${NC}"
echo -e "${GREEN}╠═══════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  Username: admin  |  Password: Admin@123       ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"

# Wait and cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Servers stopped.'" EXIT
wait
