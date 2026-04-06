# 🌾 AgriChain - Blockchain Agricultural Supply Chain Tracker

> A complete blockchain-enabled system that tracks agricultural produce from farm to consumer, ensuring full transparency in product movement, pricing, and stakeholder transactions.

[![Built with React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Smart Contracts](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat&logo=solidity)](https://soliditylang.org/)
[![Tests Passing](https://img.shields.io/badge/tests-9%20passing-success)](./contracts/test)

## ✨ Features

### 🔐 Blockchain Integration
- **Immutable Records**: Every transaction recorded permanently on Ethereum
- **Smart Contracts**: Automated ownership transfers and validation
- **MetaMask Support**: Secure wallet integration for all transactions

### 👥 Role-Based Access Control
- **Farmers**: Create and register agricultural products
- **Distributors**: Transport products from farms to retailers
- **Retailers**: Receive products and sell to consumers
- **Consumers**: Purchase and verify product authenticity

### 📊 Supply Chain Transparency
- **Real-Time Tracking**: Monitor product movement at every stage
- **Price History**: View pricing changes through the supply chain
- **Location Tracking**: Geographic tracking from farm to table
- **QR Code Verification**: Instant product authenticity verification

### 🎨 Modern User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Intuitive Dashboard**: Role-specific interfaces for each user type
- **Real-Time Updates**: Live blockchain transaction status
- **Loading States**: Clear feedback during blockchain operations

## 🛠️ Technology Stack

### Frontend
- **React 19** with Vite for blazing-fast builds
- **Tailwind CSS** for modern, responsive styling
- **Web3.js** for blockchain interaction
- **React Router** for seamless navigation
- **Axios** for API communication

### Backend
- **Node.js** + **Express** for RESTful API
- **MongoDB** with Mongoose for data persistence
- **JWT** authentication with bcrypt hashing
- **Web3.js** for smart contract integration

### Blockchain
- **Solidity 0.8.20** for smart contracts
- **Hardhat** development environment
- **Ethereum** blockchain platform
- **OpenZeppelin** security libraries

## 🚀 Quick Start

### Automated Setup (Recommended)

```bash
# 1. Navigate to project directory
cd incseption_2.0

# 2. Run setup script
./setup.sh

# 3. Follow the instructions in GETTING_STARTED.md
```

### Manual Setup

See [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed setup instructions.

## 📚 Documentation

- **[Getting Started Guide](./GETTING_STARTED.md)** - Complete setup and usage instructions
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment steps
- **[Project Summary](./PROJECT_SUMMARY.md)** - Technical overview and architecture

## 🧪 Testing

All smart contract tests passing ✅

```bash
cd contracts
npx hardhat test
```

**Test Results:**
- ✅ User registration with different roles
- ✅ Duplicate registration prevention
- ✅ Admin-only user registration
- ✅ Farmer product creation
- ✅ Role-based access restrictions
- ✅ Supply chain transfers (Farmer → Distributor → Retailer → Consumer)
- ✅ Complete product history tracking

## 📁 Project Structure

```
incseption_2.0/
├── contracts/              # Solidity smart contracts
│   ├── contracts/
│   │   └── SupplyChain.sol
│   ├── test/
│   └── scripts/
├── backend/                # Express API server
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/               # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
│   └── index.html
└── README.md
```

## 💻 Running the Application

**Terminal 1 - Blockchain:**
```bash
cd contracts
npx hardhat node
```

**Terminal 2 - Backend:**
```bash
npm run dev:backend
```

**Terminal 3 - Frontend:**
```bash
npm run dev:frontend
```

Then open **http://localhost:3000** in your browser.

## 🎯 Use Cases

### For Farmers
- Register products with blockchain verification
- Set initial prices
- Transfer to distributors with transparent pricing

### For Distributors
- Receive products from multiple farmers
- Track inventory on blockchain
- Transfer to retailers with markup transparency

### For Retailers
- Receive verified products
- View complete supply chain history
- Sell to consumers with full traceability

### For Consumers
- Verify product authenticity via QR code
- View complete farm-to-table journey
- See price breakdown at each stage
- Make informed purchasing decisions

## 🔒 Security Features

- Smart contract security with OpenZeppelin libraries
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation on all endpoints
- Protected routes in frontend
- Secure wallet integration

## 🌐 Deployment

The application can be deployed to:
- **Smart Contracts**: Ethereum testnets (Sepolia, Goerli) or mainnet
- **Backend**: Heroku, Railway, DigitalOcean
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: MongoDB Atlas

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

## 🎓 Hackathon Ready

This project is optimized for hackathon presentations:
- ✅ Complete working demo
- ✅ Professional documentation
- ✅ Clean, modern UI
- ✅ Full test coverage
- ✅ Easy setup process
- ✅ Clear use cases

## 📊 Key Metrics

- **Smart Contracts**: 1 (SupplyChain.sol)
- **Backend Endpoints**: 12+
- **Frontend Pages**: 4
- **Components**: 6+
- **Tests**: 9 (all passing)
- **Lines of Code**: ~3,000+

## 🤝 Contributing

This is a hackathon project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

Built for the hackathon - Demonstrating blockchain's potential in agricultural supply chain transparency.

## 🙏 Acknowledgments

- OpenZeppelin for secure smart contract libraries
- Hardhat for excellent development tools
- The Ethereum community for blockchain infrastructure
- MetaMask for wallet integration

---

**🌾 AgriChain - Bringing Transparency to Agriculture Through Blockchain 🌾**

*For detailed setup instructions, see [GETTING_STARTED.md](./GETTING_STARTED.md)*
