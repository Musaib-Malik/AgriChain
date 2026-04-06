const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getContract, getAdminAccount, web3 } = require('../config/web3');

const getRoleEnum = (role) => {
  const roles = { farmer: 1, distributor: 2, retailer: 3, consumer: 4 };
  return roles[role];
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, walletAddress, role, phone, address } = req.body;

    const existingUser = await User.findOne({ 
      $or: [{ email }, { walletAddress: walletAddress.toLowerCase() }] 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email or wallet' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      walletAddress: walletAddress.toLowerCase(),
      role,
      phone,
      address
    });

    await user.save();

    try {
      const contract = getContract();
      const adminAccount = getAdminAccount();
      
      const roleEnum = getRoleEnum(role);
      const tx = contract.methods.registerUser(walletAddress, roleEnum, name);
      const gas = await tx.estimateGas({ from: adminAccount.address });
      const gasPrice = await web3.eth.getGasPrice();

      const signedTx = await web3.eth.accounts.signTransaction(
        {
          to: process.env.CONTRACT_ADDRESS,
          data: tx.encodeABI(),
          gas,
          gasPrice
        },
        adminAccount.privateKey
      );

      await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      
      user.isBlockchainRegistered = true;
      await user.save();
    } catch (blockchainError) {
      console.error('Blockchain registration failed:', blockchainError);
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
        isBlockchainRegistered: user.isBlockchainRegistered
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
        isBlockchainRegistered: user.isBlockchainRegistered
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
