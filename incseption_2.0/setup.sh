#!/bin/bash

echo "🚀 AgriChain Setup Script"
echo "=========================="
echo ""

# Check if MongoDB is running
echo "📦 Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   Run: brew services start mongodb-community (on macOS)"
    echo "   Or: sudo systemctl start mongod (on Linux)"
    exit 1
fi
echo "✅ MongoDB is running"
echo ""

# Create .env files if they don't exist
echo "📝 Setting up environment files..."

if [ ! -f contracts/.env ]; then
    cp contracts/.env.example contracts/.env
    echo "✅ Created contracts/.env"
else
    echo "✅ contracts/.env already exists"
fi

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
else
    echo "✅ backend/.env already exists"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env"
else
    echo "✅ frontend/.env already exists"
fi

echo ""
echo "📦 Installing dependencies (this may take a few minutes)..."
echo ""

# Install contract dependencies
echo "Installing smart contract dependencies..."
cd contracts && npm install --silent && cd ..
echo "✅ Contract dependencies installed"

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend && npm install --silent && cd ..
echo "✅ Backend dependencies installed"

# Install frontend dependencies (already done)
echo "✅ Frontend dependencies already installed"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "==========="
echo "1. Start the local blockchain:"
echo "   Terminal 1: npm run dev:contracts"
echo ""
echo "2. Deploy contracts and note the contract address"
echo "   Terminal 1: cd contracts && npx hardhat run scripts/deploy.js --network localhost"
echo ""
echo "3. Update CONTRACT_ADDRESS in backend/.env and frontend/.env"
echo ""
echo "4. Start the backend server:"
echo "   Terminal 2: npm run dev:backend"
echo ""
echo "5. Start the frontend:"
echo "   Terminal 3: npm run dev:frontend"
echo ""
echo "6. Open http://localhost:3000 in your browser"
echo ""
echo "Note: Make sure MetaMask is installed and connected to localhost:8545"
echo ""
