#!/bin/bash
# RealtySarv Complete Setup Script
# Run this script to set up everything in one go

echo "================================"
echo "RealtySarv Complete Setup"
echo "================================"
echo ""

# Step 1: Install Frontend Dependencies
echo "📦 Step 1: Installing Frontend Dependencies..."
npm install
echo "✅ Frontend dependencies installed!"
echo ""

# Step 2: Install Backend Dependencies
echo "📦 Step 2: Installing Backend Dependencies..."
cd server
npm install
cd ..
echo "✅ Backend dependencies installed!"
echo ""

# Step 3: Check MySQL Connection
echo "🔍 Step 3: Checking MySQL Connection..."
read -p "Enter MySQL Host [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}
read -p "Enter MySQL User [root]: " DB_USER
DB_USER=${DB_USER:-root}
read -sp "Enter MySQL Password [empty]: " DB_PASSWORD
DB_PASSWORD=${DB_PASSWORD:-}
echo ""

# Create .env file
echo "⚙️  Step 4: Creating .env file..."
cat > server/.env << EOF
# Server Port
PORT=4000

# Database Configuration
DB_HOST=$DB_HOST
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=realtysarv_db
DB_PORT=3306

# GoDaddy API
GODADDY_API_KEY=h2JzzdDRLFN5_UrEW3qcffdwxYpTumu38J
GODADDY_API_SECRET=R7QK49EfCKHMGxijK54PWj
GODADDY_DOMAIN=onlinesarv.com

# Firebase (Optional - add your credentials)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# Gemini API (Optional)
GEMINI_API_KEY=

NODE_ENV=development
LOG_LEVEL=debug
EOF
echo "✅ .env file created!"
echo ""

# Step 5: Create MySQL Database
echo "🗄️  Step 5: Creating MySQL Database..."
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD -e "CREATE DATABASE IF NOT EXISTS realtysarv_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Database created!"
else
    echo "⚠️  Could not create database. Make sure MySQL is running."
    echo "   Manual: mysql -u root -p -e 'CREATE DATABASE realtysarv_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;'"
fi
echo ""

# Step 6: Initialize Database Schema
echo "📊 Step 6: Initializing Database Schema..."
echo "   Running: cd server && npm run db:setup"
cd server
npm run db:setup
cd ..
echo ""

echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "📋 Next Steps:"
echo "1. Start Backend (Terminal 1):"
echo "   cd server && npm run dev"
echo ""
echo "2. Start Frontend (Terminal 2):"
echo "   npm run dev"
echo ""
echo "3. Access Application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:4000"
echo ""
echo "4. Initialize Firestore (Optional):"
echo "   npx ts-node firestore-init.ts"
echo ""
