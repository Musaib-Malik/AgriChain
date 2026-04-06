#!/bin/bash

echo "🚀 AgriChain Lite Setup"
echo "======================="
echo ""

echo "📝 Setting up environment files..."

if [ ! -f contracts/.env ]; then
    cp contracts/.env.example contracts/.env
    echo "✅ Created contracts/.env"
fi

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📦 Dependencies are already installed."
echo ""
echo "🎉 Next steps:"
echo "=============="
echo "1. Start MongoDB (if not running)"
echo "2. Start local blockchain:"
echo "   Terminal 1: cd contracts && npx hardhat node"
echo ""
echo "3. Deploy contracts:"
echo "   Terminal 2: cd contracts && npx hardhat run scripts/deploy.js --network localhost"
echo ""
echo "4. Start backend:"
echo "   Terminal 2: npm run dev:backend"
echo ""
echo "5. Start frontend:"
echo "   Terminal 3: npm run dev:frontend"
echo ""
echo "6. Open http://localhost:3000 🎉"
echo ""
