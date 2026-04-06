import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { account, connectWallet, disconnectWallet, isConnected } = useWeb3();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    disconnectWallet();
    navigate('/login');
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      farmer: 'bg-green-100 text-green-800',
      distributor: 'bg-blue-100 text-blue-800',
      retailer: 'bg-purple-100 text-purple-800',
      consumer: 'bg-orange-100 text-orange-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">🌾 AgriChain</h1>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            )}

            {isConnected ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
                </span>
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Connect Wallet
              </button>
            )}

            {user && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
