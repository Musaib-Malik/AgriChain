require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// In-memory storage for demo
const users = [];
const products = [];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key-change-in-production';

// Auth middleware
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No authentication token' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ROUTES

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, walletAddress, role, phone, address } = req.body;

    // Check if user exists
    const existing = users.find(u => u.email === email || u.walletAddress === walletAddress.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'User already exists with this email or wallet' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      walletAddress: walletAddress.toLowerCase(),
      role,
      phone,
      address,
      isBlockchainRegistered: true // Simulate blockchain registration
    };

    users.push(user);

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, walletAddress: user.walletAddress },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, walletAddress: user.walletAddress },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get profile
app.get('/api/auth/profile', auth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    walletAddress: user.walletAddress,
    phone: user.phone,
    address: user.address
  });
});

// Create product
app.post('/api/products', auth, (req, res) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ error: 'Only farmers can create products' });
    }

    const { name, description, quantity, originLocation } = req.body;

    const product = {
      id: products.length + 1,
      blockchainId: products.length + 1,
      name,
      description,
      quantity,
      originLocation,
      currentOwner: req.user.walletAddress,
      createdBy: req.user.id,
      status: 'Created',
      history: [{
        from: '0x0000000000000000000000000000000000000000',
        to: req.user.walletAddress,
        price: '0',
        location: originLocation,
        timestamp: new Date().toISOString(),
        userName: req.user.name || 'Farmer'
      }],
      createdAt: new Date().toISOString()
    };

    products.push(product);

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Get all products
app.get('/api/products', auth, (req, res) => {
  res.json(products);
});

// Get user's products
app.get('/api/products/my-products', auth, (req, res) => {
  const userProducts = products.filter(p => p.currentOwner === req.user.walletAddress);
  res.json(userProducts);
});

// Get single product
app.get('/api/products/:id', auth, (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Transfer product
app.post('/api/products/:id/transfer', auth, (req, res) => {
  try {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.currentOwner !== req.user.walletAddress) {
      return res.status(403).json({ error: 'Only current owner can transfer' });
    }

    const { recipientAddress, price, location } = req.body;

    // Find recipient
    const recipient = users.find(u => u.walletAddress === recipientAddress.toLowerCase());

    // Update product
    product.currentOwner = recipientAddress.toLowerCase();
    product.history.push({
      from: req.user.walletAddress,
      to: recipientAddress.toLowerCase(),
      price: price || '0',
      location: location || 'Unknown',
      timestamp: new Date().toISOString(),
      userName: recipient ? recipient.name : 'Unknown User'
    });

    // Update status based on recipient role
    if (recipient) {
      if (recipient.role === 'distributor') product.status = 'WithDistributor';
      else if (recipient.role === 'retailer') product.status = 'WithRetailer';
      else if (recipient.role === 'consumer') product.status = 'Sold';
    }

    res.json(product);
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ error: 'Transfer failed' });
  }
});

// Get product history
app.get('/api/products/:id/history', auth, (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product.history || []);
});

// Get all users
app.get('/api/users', auth, (req, res) => {
  const publicUsers = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    walletAddress: u.walletAddress
  }));
  res.json(publicUsers);
});

// Get user by wallet
app.get('/api/users/:walletAddress', auth, (req, res) => {
  const user = users.find(u => u.walletAddress === req.params.walletAddress.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    walletAddress: user.walletAddress
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AgriChain API is running in DEMO MODE',
    users: users.length,
    products: products.length
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🌾 AgriChain Demo Server running on port ${PORT}`);
  console.log(`⚠️  DEMO MODE: Using in-memory storage (data will not persist)`);
  console.log(`✅ No MongoDB or blockchain required for demo`);
});
