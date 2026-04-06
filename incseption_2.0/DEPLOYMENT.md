# AgriChain - Deployment Guide

## 🌐 Deploying to Testnets (Sepolia)

### Prerequisites

1. Get Sepolia ETH from a faucet:
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia

2. Get an Alchemy API key:
   - Sign up at https://www.alchemy.com/
   - Create a new app (Ethereum → Sepolia)
   - Copy the API key

### Step 1: Configure Contracts

Update `contracts/.env`:
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_metamask_private_key_here
```

⚠️ **Never commit your private key to git!**

### Step 2: Deploy to Sepolia

```bash
cd contracts
npx hardhat run scripts/deploy.js --network sepolia
```

Note the deployed contract address.

### Step 3: Update Backend

Update `backend/.env`:
```env
CONTRACT_ADDRESS=0xYourDeployedContractAddress
BLOCKCHAIN_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
MONGODB_URI=your_mongodb_atlas_connection_string
```

### Step 4: Deploy Backend

#### Option A: Heroku

```bash
cd backend
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set CONTRACT_ADDRESS=0xYourAddress
git subtree push --prefix backend heroku main
```

#### Option B: Railway.app

1. Go to https://railway.app/
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Set root directory to `backend`
5. Add environment variables
6. Deploy

### Step 5: Deploy Frontend

#### Option A: Vercel

```bash
cd frontend
npm install -g vercel
vercel
```

Set environment variables:
- `VITE_API_URL=https://your-backend.herokuapp.com/api`
- `VITE_CONTRACT_ADDRESS=0xYourContractAddress`

#### Option B: Netlify

```bash
cd frontend
npm run build
```

Upload `dist/` folder to Netlify or connect GitHub repo.

## 📊 MongoDB Atlas Setup

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Add database user
4. Whitelist IP: 0.0.0.0/0 (for development)
5. Get connection string
6. Update `backend/.env`

## 🔒 Security Checklist

- [ ] Never commit `.env` files
- [ ] Use strong JWT_SECRET
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets
- [ ] Implement rate limiting in production
- [ ] Add input validation on all endpoints
- [ ] Use HTTPS in production
- [ ] Audit smart contracts before mainnet deployment

## 📝 Environment Variables Summary

### Contracts
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=0xYourPrivateKey
```

### Backend
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/agrichain
JWT_SECRET=super_secret_key_minimum_32_characters
CONTRACT_ADDRESS=0xDeployedContractAddress
BLOCKCHAIN_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
ADMIN_PRIVATE_KEY=0xAdminPrivateKey
```

### Frontend
```env
VITE_API_URL=https://your-backend-url.com/api
VITE_CONTRACT_ADDRESS=0xDeployedContractAddress
```

## 🧪 Production Testing Checklist

### Smart Contracts
- [ ] All tests pass (`npx hardhat test`)
- [ ] Contract deployed to testnet
- [ ] Contract verified on Etherscan
- [ ] Test user registration
- [ ] Test product creation
- [ ] Test full supply chain flow

### Backend
- [ ] MongoDB connection works
- [ ] User registration/login works
- [ ] JWT authentication works
- [ ] API endpoints respond correctly
- [ ] Blockchain integration works
- [ ] Error handling works

### Frontend
- [ ] Build completes without errors
- [ ] All pages load correctly
- [ ] MetaMask connects properly
- [ ] Forms submit successfully
- [ ] Routing works correctly
- [ ] Responsive on mobile

## 🚀 Performance Optimization

### Frontend
```bash
# Analyze bundle size
cd frontend
npm run build
npx vite-bundle-visualizer
```

### Backend
- Enable gzip compression
- Add Redis caching for frequent queries
- Index MongoDB collections
- Implement pagination

## 📱 Mobile Optimization

The frontend is already responsive, but for mobile:

1. Test on actual devices
2. Use WalletConnect for mobile wallet support
3. Optimize images and assets
4. Implement lazy loading

## 🔍 Monitoring & Logging

### Backend Logging
```javascript
// Add Winston logger
npm install winston

// In server.js
const winston = require('winston');
const logger = winston.createLogger({...});
```

### Error Tracking
- Sentry: https://sentry.io/
- LogRocket: https://logrocket.com/

### Blockchain Monitoring
- Etherscan API for transaction tracking
- The Graph for indexed blockchain data

## 🎯 Production Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Smart contracts deployed
- [ ] Backend deployed and tested
- [ ] Frontend deployed and tested
- [ ] SSL certificates configured
- [ ] Domain name configured
- [ ] MetaMask tested on production
- [ ] Full end-to-end test completed
- [ ] Documentation updated
- [ ] Backup strategy in place

## 🌟 Going to Mainnet

⚠️ **Only after thorough testing on testnets!**

1. **Security Audit**: Get smart contracts professionally audited
2. **Gas Optimization**: Optimize contract functions
3. **Insurance**: Consider smart contract insurance
4. **Gradual Rollout**: Start with limited users
5. **Monitoring**: Set up 24/7 monitoring
6. **Support**: Have support channels ready

## 📞 Support & Resources

- **Hardhat Network Issues**: https://hardhat.org/hardhat-network/docs
- **MetaMask Integration**: https://docs.metamask.io/
- **Ethereum Testnets**: https://ethereum.org/en/developers/docs/networks/
- **Solidity Best Practices**: https://docs.soliditylang.org/

## 🎓 Hackathon Submission

### What to Include

1. **Live Demo URL**
2. **GitHub Repository**
3. **Demo Video** (2-3 minutes)
4. **Deployed Contract Address**
5. **Test Credentials**
6. **Technical Documentation**

### Demo Video Script

1. Show homepage (5s)
2. Register user (15s)
3. Create product (20s)
4. Transfer through supply chain (45s)
5. View product history (20s)
6. Show QR code feature (10s)
7. Highlight key benefits (15s)

Total: ~2.5 minutes

Good luck! 🚀
