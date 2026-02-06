import React, { useState } from 'react';
import './dashboard.css';
import AuthSection from './sections/AuthSection';
import ProductSection from './sections/ProductSection';
import StoreSection from './sections/StoreSection';
import CartSection from './sections/CartSection';
import OrderSection from './sections/OrderSection';
import SellerSection from './sections/SellerSection';

const FunctionDashboard = () => {
  const [activeTab, setActiveTab] = useState('auth');

  const renderContent = () => {
    switch (activeTab) {
      case 'auth':
        return <AuthSection />;
      case 'products':
        return <ProductSection />;
      case 'store':
        return <StoreSection />;
      case 'cart':
        return <CartSection />;
      case 'orders':
        return <OrderSection />;
      case 'seller':
        return <SellerSection />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-sidebar">
        <h1 className="logo">VELORA <span>Dev</span></h1>
        <ul className="nav-links">
          <li className={activeTab === 'auth' ? 'active' : ''} onClick={() => setActiveTab('auth')}>
            Auth & Profile
          </li>
          <li className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
            Products
          </li>
          <li className={activeTab === 'store' ? 'active' : ''} onClick={() => setActiveTab('store')}>
            Storefront
          </li>
          <li className={activeTab === 'cart' ? 'active' : ''} onClick={() => setActiveTab('cart')}>
            Cart & Checkout
          </li>
          <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            Orders
          </li>
          <li className={activeTab === 'seller' ? 'active' : ''} onClick={() => setActiveTab('seller')}>
            Seller Center
          </li>
        </ul>
      </nav>
      <main className="dashboard-content">
        <div className="content-header">
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
        </div>
        <div className="content-body">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default FunctionDashboard;
