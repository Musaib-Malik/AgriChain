import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/config';
import Navbar from '../components/Navbar';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferData, setTransferData] = useState({
    recipientAddress: '',
    price: '',
    location: ''
  });
  const [transferring, setTransferring] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProduct(response.data);
      setHistory(response.data.history || []);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const canTransfer = () => {
    if (!product || !user) return false;
    
    const isOwner = product.currentOwner.toLowerCase() === user.walletAddress.toLowerCase();
    
    if (user.role === 'farmer' && product.status === 'Created' && isOwner) return true;
    if (user.role === 'distributor' && product.status === 'WithDistributor' && isOwner) return true;
    if (user.role === 'retailer' && product.status === 'WithRetailer' && isOwner) return true;
    
    return false;
  };

  const getTransferEndpoint = () => {
    if (user.role === 'farmer') return '/products/transfer-to-distributor';
    if (user.role === 'distributor') return '/products/transfer-to-retailer';
    if (user.role === 'retailer') return '/products/sell-to-consumer';
    return '';
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    setTransferring(true);

    try {
      const endpoint = getTransferEndpoint();
      await axios.post(
        `${API_URL}${endpoint}`,
        {
          productId: product.blockchainId,
          distributorAddress: transferData.recipientAddress,
          retailerAddress: transferData.recipientAddress,
          consumerAddress: transferData.recipientAddress,
          price: transferData.price,
          location: transferData.location
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setShowTransferModal(false);
      setTransferData({ recipientAddress: '', price: '', location: '' });
      fetchProductDetails();
    } catch (error) {
      setError(error.response?.data?.error || 'Transfer failed');
    } finally {
      setTransferring(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600">Product not found</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 text-primary-600 hover:text-primary-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-6 text-primary-600 hover:text-primary-700 flex items-center"
          >
            ← Back to Dashboard
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.state === 'Created' ? 'bg-yellow-100 text-yellow-800' :
                    product.state === 'WithDistributor' ? 'bg-blue-100 text-blue-800' :
                    product.state === 'WithRetailer' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {product.state}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Blockchain ID</p>
                  <p className="text-lg font-semibold text-gray-900">#{product.blockchainId}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Quantity</p>
                  <p className="text-lg font-semibold text-gray-900">{product.quantity} {product.unit}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="text-lg font-semibold text-gray-900">{product.category || 'N/A'}</p>
                </div>
              </div>

              {canTransfer() && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowTransferModal(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-bold"
                    style={{ backgroundColor: '#16a34a', color: 'white', padding: '12px 24px', fontSize: '16px', fontWeight: 'bold' }}
                  >
                    Transfer Product
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-4">Supply Chain History</h2>
                <div className="space-y-4">
                  {history.map((tx, index) => (
                    <div key={index} className="border-l-4 border-primary-500 pl-4 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {['Created', 'WithDistributor', 'WithRetailer', 'Sold'][index] || tx.state}
                          </p>
                          <p className="text-sm text-gray-600">
                            {tx.from === '0x0000000000000000000000000000000000000000' 
                              ? `Created by ${tx.toName}` 
                              : `From ${tx.fromName} → To ${tx.toName}`}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(Number(tx.timestamp) * 1000).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">📍 {tx.location}</p>
                      {tx.price !== '0' && (
                        <p className="text-sm text-primary-600 font-medium">
                          Price: {tx.price} ETH
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">QR Code</h2>
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex justify-center">
                  <QRCodeSVG 
                    value={`${window.location.origin}/product/${product.blockchainId}`}
                    size={200}
                    level="H"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Scan to verify product authenticity
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Transfer Product</h3>
            
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Wallet Address
                </label>
                <input
                  type="text"
                  required
                  value={transferData.recipientAddress}
                  onChange={(e) => setTransferData({ ...transferData, recipientAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0x..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (ETH)
                </label>
                <input
                  type="number"
                  step="0.001"
                  required
                  value={transferData.price}
                  onChange={(e) => setTransferData({ ...transferData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={transferData.location}
                  onChange={(e) => setTransferData({ ...transferData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Warehouse B, New York"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={transferring}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {transferring ? 'Transferring...' : 'Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
