#!/bin/bash

# EXPENDABLES - Complete Setup Script
# This script will set up and run the entire ecommerce application

echo "╔════════════════════════════════════════════════════════╗"
echo "║   EXPENDABLES E-Commerce Platform Setup              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not installed or not in PATH."
    echo "Please make sure MySQL is installed and running."
    echo ""
fi

# Step 1: Setup MySQL Database
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Database Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Please create a MySQL database manually if not already done:"
echo ""
echo "mysql -u root -p"
echo "CREATE DATABASE expendables_db;"
echo "CREATE USER 'expendables_user'@'localhost' IDENTIFIED BY 'your_password';"
echo "GRANT ALL PRIVILEGES ON expendables_db.* TO 'expendables_user'@'localhost';"
echo "FLUSH PRIVILEGES;"
echo "EXIT;"
echo ""
read -p "Have you created the database? (y/n): " db_created

if [ "$db_created" != "y" ]; then
    echo "Please create the database first and run this script again."
    exit 1
fi

# Step 2: Backend Setup
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Backend Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd backend

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cp ../.env.example .env
    echo "⚠️  Please update backend/.env with your database credentials!"
    read -p "Press Enter after updating .env file..."
fi

echo "Installing backend dependencies..."
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Running database migrations..."
npx prisma migrate dev --name init

echo "Seeding database with sample data..."
npx prisma db seed

echo "✅ Backend setup complete!"

# Step 3: Frontend Setup
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Frontend Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd ../frontend

if [ ! -f ".env.local" ]; then
    echo "Creating frontend .env.local file..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:5030/api" > .env.local
    echo "NEXT_PUBLIC_SITE_NAME=EXPENDABLES" >> .env.local
fi

echo "Installing frontend dependencies..."
npm install

echo "✅ Frontend setup complete!"

# Step 4: Instructions to Run
cd ..

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║   Setup Complete!                                      ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 To start the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm run dev"
echo "  (Backend will run on http://localhost:5030)"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo "  (Frontend will run on http://localhost:3000)"
echo ""
echo "📝 Default Credentials:"
echo "  Admin: admin@expendables.com / Admin@123"
echo "  Customer: customer@test.com / Customer@123"
echo ""
echo "📚 Visit http://localhost:3000 to see your site!"
echo "📚 Visit http://localhost:3000/admin to access admin dashboard!"
echo ""
