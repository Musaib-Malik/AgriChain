import React from 'react';

const ProductCard = ({ product, onClick }) => {
  const getStateColor = (state) => {
    const colors = {
      Created: 'bg-yellow-100 text-yellow-800',
      WithDistributor: 'bg-blue-100 text-blue-800',
      WithRetailer: 'bg-purple-100 text-purple-800',
      Sold: 'bg-green-100 text-green-800',
    };
    return colors[state] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer p-4 border border-gray-200"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStateColor(product.state)}`}>
          {product.state}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
      
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500">
          {product.quantity} {product.unit}
        </span>
        <span className="text-primary-600 font-medium">
          ID: #{product.blockchainId}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
