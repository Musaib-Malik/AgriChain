const Product = require('../models/Product');
const User = require('../models/User');
const { getContract, web3 } = require('../config/web3');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, quantity, unit, location, imageUrl, category } = req.body;

    if (req.user.role !== 'farmer') {
      return res.status(403).json({ error: 'Only farmers can create products' });
    }

    const contract = getContract();
    const accounts = await web3.eth.getAccounts();
    
    const tx = await contract.methods
      .createProduct(name, description, quantity, unit, location)
      .send({ from: req.user.walletAddress, gas: 500000 });

    const productId = Number(tx.events.ProductCreated.returnValues.productId);

    const product = new Product({
      blockchainId: productId,
      name,
      description,
      quantity,
      unit,
      farmer: req.userId,
      currentOwner: req.user.walletAddress.toLowerCase(),
      state: 'Created',
      imageUrl,
      category
    });

    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product,
      transactionHash: tx.transactionHash
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { state, farmer } = req.query;
    const filter = {};

    if (state) filter.state = state;
    if (farmer) filter.farmer = farmer;

    const products = await Product.find(filter)
      .populate('farmer', 'name email walletAddress')
      .sort({ createdAt: -1 });

    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ blockchainId: id })
      .populate('farmer', 'name email walletAddress');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const contract = getContract();
    const blockchainProduct = await contract.methods.getProduct(id).call();
    const history = await contract.methods.getProductHistory(id).call();

    const enrichedHistory = await Promise.all(
      history.map(async (tx) => {
        const fromUser = await User.findOne({ walletAddress: tx.from.toLowerCase() });
        const toUser = await User.findOne({ walletAddress: tx.to.toLowerCase() });
        
        return {
          from: tx.from,
          fromName: fromUser?.name || 'Unknown',
          to: tx.to,
          toName: toUser?.name || 'Unknown',
          price: web3.utils.fromWei(tx.price, 'ether'),
          timestamp: Number(tx.timestamp),
          state: ['Created', 'WithDistributor', 'WithRetailer', 'Sold'][Number(tx.newState)],
          location: tx.location
        };
      })
    );

    res.json({
      product,
      blockchain: {
        currentOwner: blockchainProduct.currentOwner,
        state: ['Created', 'WithDistributor', 'WithRetailer', 'Sold'][Number(blockchainProduct.state)]
      },
      history: enrichedHistory
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product', details: error.message });
  }
};

exports.transferToDistributor = async (req, res) => {
  try {
    const { productId, distributorAddress, price, location } = req.body;

    if (req.user.role !== 'farmer') {
      return res.status(403).json({ error: 'Only farmers can transfer to distributors' });
    }

    const contract = getContract();
    const priceInWei = web3.utils.toWei(price.toString(), 'ether');

    const tx = await contract.methods
      .transferToDistributor(productId, distributorAddress, priceInWei, location)
      .send({ from: req.user.walletAddress, gas: 500000 });

    await Product.findOneAndUpdate(
      { blockchainId: productId },
      { 
        currentOwner: distributorAddress.toLowerCase(),
        state: 'WithDistributor'
      }
    );

    res.json({
      message: 'Product transferred to distributor',
      transactionHash: tx.transactionHash
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ error: 'Transfer failed', details: error.message });
  }
};

exports.transferToRetailer = async (req, res) => {
  try {
    const { productId, retailerAddress, price, location } = req.body;

    if (req.user.role !== 'distributor') {
      return res.status(403).json({ error: 'Only distributors can transfer to retailers' });
    }

    const contract = getContract();
    const priceInWei = web3.utils.toWei(price.toString(), 'ether');

    const tx = await contract.methods
      .transferToRetailer(productId, retailerAddress, priceInWei, location)
      .send({ from: req.user.walletAddress, gas: 500000 });

    await Product.findOneAndUpdate(
      { blockchainId: productId },
      { 
        currentOwner: retailerAddress.toLowerCase(),
        state: 'WithRetailer'
      }
    );

    res.json({
      message: 'Product transferred to retailer',
      transactionHash: tx.transactionHash
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ error: 'Transfer failed', details: error.message });
  }
};

exports.sellToConsumer = async (req, res) => {
  try {
    const { productId, consumerAddress, price, location } = req.body;

    if (req.user.role !== 'retailer') {
      return res.status(403).json({ error: 'Only retailers can sell to consumers' });
    }

    const contract = getContract();
    const priceInWei = web3.utils.toWei(price.toString(), 'ether');

    const tx = await contract.methods
      .sellToConsumer(productId, consumerAddress, priceInWei, location)
      .send({ from: req.user.walletAddress, gas: 500000 });

    await Product.findOneAndUpdate(
      { blockchainId: productId },
      { 
        currentOwner: consumerAddress.toLowerCase(),
        state: 'Sold'
      }
    );

    res.json({
      message: 'Product sold to consumer',
      transactionHash: tx.transactionHash
    });
  } catch (error) {
    console.error('Sale error:', error);
    res.status(500).json({ error: 'Sale failed', details: error.message });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
      currentOwner: req.user.walletAddress.toLowerCase() 
    }).populate('farmer', 'name email');

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
