# AgriChain - Getting Started Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **MetaMask** browser extension - [Install](https://metamask.io/)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Quick Start

### Step 1: Clone and Setup

```bash
# Navigate to the project directory
cd incseption_2.0

# Run the automated setup script
./setup.sh
```

### Step 2: Start MongoDB

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
MongoDB should start automatically after installation.

### Step 3: Start Local Blockchain

Open **Terminal 1**:
```bash
cd contracts
npx hardhat node
```

This will start a local Ethereum blockchain and display 20 test accounts with private keys.

**Important:** Keep this terminal open! Note the first account's private key for MetaMask.

### Step 4: Deploy Smart Contracts

Open **Terminal 2** (while Terminal 1 is still running):
```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

You'll see output like:
```
SupplyChain deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Copy this contract address!**

### Step 5: Configure Environment Variables

Update the contract address in both files:

**backend/.env:**
```env
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**frontend/.env:**
```env
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Step 6: Start Backend Server

In **Terminal 2** (or a new terminal):
```bash
npm run dev:backend
```

You should see:
```
Server running on port 5001
MongoDB Connected: localhost
```

### Step 7: Start Frontend

Open **Terminal 3**:
```bash
npm run dev:frontend
```

The frontend will start at: **http://localhost:3001**

### Step 8: Configure MetaMask

1. Open MetaMask extension
2. Click the network dropdown (usually shows "Ethereum Mainnet")
3. Click "Add Network" → "Add a network manually"
4. Fill in:
   - **Network Name:** Hardhat Local
   - **RPC URL:** http://127.0.0.1:8545
   - **Chain ID:** 1337
   - **Currency Symbol:** ETH
5. Click "Save"

6. Import a test account:
   - Click account icon → "Import Account"
   - Paste one of the private keys from Terminal 1 (Hardhat node)
   - Example: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

## 🎯 Using the Application

### 1. Register an Account

1. Go to **http://localhost:3001**
2. Click "Register here"
3. Fill in your details:
   - Choose a role: Farmer, Distributor, Retailer, or Consumer
4. Click "Connect MetaMask" 
5. Approve the connection in MetaMask
6. Click "Create Account"

### 2. Farmer Workflow

**Create a Product:**
1. Login as a Farmer
2. Click "Create Product" button
3. Fill in product details:
   - Name: "Organic Tomatoes"
   - Description: "Fresh organic tomatoes from California"
   - Quantity: 100
   - Unit: kg
   - Location: "Farm A, California"
4. Approve the transaction in MetaMask
5. Wait for blockchain confirmation

**Transfer to Distributor:**
1. Click on the product card
2. Click "Transfer Product"
3. Enter distributor's wallet address
4. Set price (in ETH)
5. Enter current location
6. Approve transaction

### 3. Distributor Workflow

1. Register as Distributor
2. View products in "My Products" tab
3. Transfer products to Retailers

### 4. Retailer Workflow

1. Register as Retailer
2. View received products
3. Sell to Consumers

### 5. Consumer Workflow

1. Register as Consumer
2. View all available products
3. Check product history and supply chain
4. Scan QR codes to verify authenticity

## 🔍 Testing the Full Supply Chain

To test the complete flow:

1. **Create 4 accounts:**
   - Account 1: Farmer
   - Account 2: Distributor  
   - Account 3: Retailer
   - Account 4: Consumer

2. **Farmer creates product**
   - Login as Farmer
   - Create "Organic Tomatoes"
   - Note the wallet address of Distributor account

3. **Transfer to Distributor**
   - Farmer transfers to Distributor's wallet
   - Price: 0.5 ETH

4. **Transfer to Retailer**
   - Login as Distributor
   - Transfer to Retailer's wallet
   - Price: 0.8 ETH

5. **Sell to Consumer**
   - Login as Retailer
   - Sell to Consumer's wallet
   - Price: 1.2 ETH

6. **View Complete History**
   - Login as any user
   - Click on the product
   - See full supply chain history with:
     - All transfers
     - Price at each stage
     - Locations
     - Timestamps

## 🐛 Troubleshooting

### MetaMask shows wrong nonce

**Solution:** Reset your MetaMask account:
1. MetaMask → Settings → Advanced
2. Scroll down and click "Clear activity tab data"

### "User already registered" error

Each wallet address can only be registered once. Use a different account or reset the database:
```bash
# In MongoDB shell
use agrichain
db.dropDatabase()
```

### Contract deployment failed

Make sure:
1. Hardhat node is running in Terminal 1
2. You're deploying to the correct network: `--network localhost`

### Frontend can't connect to backend

Check:
1. Backend is running on port 5001
2. No CORS errors in browser console
3. `.env` files are correctly configured

### Transactions fail in MetaMask

Ensure:
1. You have test ETH (provided by Hardhat)
2. You're connected to "Hardhat Local" network
3. The contract address is correct in `.env` files

## 📱 Features Demo

### QR Code Scanning

Each product has a unique QR code that can be scanned to verify its authenticity and view its complete supply chain history.

### Supply Chain Tracking

View the complete journey of products:
- **Farm** → **Distributor** → **Retailer** → **Consumer**
- Track price changes at each stage
- See geographical movement
- Verify timestamps on blockchain

### Role-Based Access

Different capabilities for each role:
- **Farmers:** Create and list products
- **Distributors:** Receive from farmers, transfer to retailers
- **Retailers:** Receive from distributors, sell to consumers
- **Consumers:** View and verify products

## 🎓 For Hackathon Presentation

### Demo Script (5 minutes)

1. **Introduction (30s)**
   - Show homepage
   - Explain blockchain supply chain concept

2. **Farmer Flow (1m)**
   - Register farmer account
   - Create a product
   - Show MetaMask transaction

3. **Supply Chain Movement (2m)**
   - Transfer through supply chain
   - Show each step on blockchain
   - Demonstrate price transparency

4. **Consumer Verification (1m)**
   - Consumer views product
   - Check complete history
   - Scan QR code

5. **Key Benefits (30s)**
   - Immutable records
   - Full transparency
   - Fraud prevention
   - Consumer trust

## 📚 Additional Resources

- **Hardhat Documentation:** https://hardhat.org/
- **Web3.js Guide:** https://web3js.readthedocs.io/
- **React Documentation:** https://react.dev/
- **MongoDB Manual:** https://www.mongodb.com/docs/

## 🤝 Need Help?

If you encounter issues:
1. Check all terminals are running
2. Verify MongoDB connection
3. Confirm MetaMask is on correct network
4. Check browser console for errors
5. Review `.env` file configurations

Happy Building! 🚀🌾
