const { Web3 } = require('web3');
const contractABI = require('./contractABI.json');

const web3 = new Web3(process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545');

const getContract = () => {
  if (!process.env.CONTRACT_ADDRESS) {
    throw new Error('CONTRACT_ADDRESS not set in environment');
  }
  return new web3.eth.Contract(contractABI, process.env.CONTRACT_ADDRESS);
};

const getAdminAccount = () => {
  if (!process.env.ADMIN_PRIVATE_KEY) {
    throw new Error('ADMIN_PRIVATE_KEY not set in environment');
  }
  return web3.eth.accounts.privateKeyToAccount(process.env.ADMIN_PRIVATE_KEY);
};

module.exports = {
  web3,
  getContract,
  getAdminAccount
};
