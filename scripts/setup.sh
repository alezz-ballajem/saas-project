#!/bin/bash

# Sonod Projects Manager Setup Script
# This script sets up the development environment for the Sonod Projects Manager

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Sonod Projects Manager Setup${NC}"
echo "Setting up the development environment..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18+ is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) is installed${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm -v) is installed${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL is not installed. Please install PostgreSQL 15+ first.${NC}"
    echo "Visit: https://www.postgresql.org/download/"
    echo ""
    echo "Or use Docker:"
    echo "docker run --name postgres -e POSTGRES_PASSWORD=sonod123 -p 5432:5432 -d postgres:15"
    echo ""
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${BLUE}🔐 Creating environment file...${NC}"
    cp env.example .env.local
    echo -e "${YELLOW}⚠️  Please update .env.local with your actual values${NC}"
else
    echo -e "${GREEN}✅ Environment file already exists${NC}"
fi

# Generate Prisma client
echo -e "${BLUE}🗄️  Generating Prisma client...${NC}"
npx prisma generate

echo -e "${GREEN}✅ Prisma client generated${NC}"

# Check if database is accessible
if command -v psql &> /dev/null; then
    echo -e "${BLUE}🔍 Checking database connection...${NC}"
    if psql -h localhost -U postgres -d postgres -c "SELECT 1;" &> /dev/null; then
        echo -e "${GREEN}✅ Database connection successful${NC}"
        
        # Create database if it doesn't exist
        echo -e "${BLUE}🗄️  Setting up database...${NC}"
        psql -h localhost -U postgres -c "CREATE DATABASE sonod_projects_manager;" 2>/dev/null || echo "Database already exists"
        
        # Run database migrations
        echo -e "${BLUE}🔄 Running database migrations...${NC}"
        npx prisma db push
        
        echo -e "${GREEN}✅ Database setup complete${NC}"
    else
        echo -e "${YELLOW}⚠️  Could not connect to database. Please ensure PostgreSQL is running.${NC}"
        echo "You can start PostgreSQL with:"
        echo "  - brew services start postgresql (macOS)"
        echo "  - sudo systemctl start postgresql (Linux)"
        echo "  - docker start postgres (Docker)"
    fi
else
    echo -e "${YELLOW}⚠️  PostgreSQL not found. Please set up your database manually.${NC}"
fi

# Build the application
echo -e "${BLUE}🔨 Building the application...${NC}"
npm run build

echo -e "${GREEN}✅ Application built successfully${NC}"

# Show next steps
echo ""
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Update your .env.local file with your actual values"
echo "2. Set up GitLab OAuth application"
echo "3. Configure your GitLab token and group ID"
echo "4. Start the development server: npm run dev"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "- Check README.md for detailed setup instructions"
echo "- Review the environment variables in .env.local"
echo "- Configure GitLab OAuth in your GitLab settings"
echo ""
echo -e "${YELLOW}⚠️  Important reminders:${NC}"
echo "- Never commit .env.local to version control"
echo "- Keep your GitLab tokens secure"
echo "- Test your GitLab integration before deploying"
echo ""
echo -e "${BLUE}🚀 Ready to start developing!${NC}"
echo "Run 'npm run dev' to start the development server."
