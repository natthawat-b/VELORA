import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import CustomerRegister from './pages/CustomerRegister';
import SellerRegister from './pages/SellerRegister';
import ProductDetail from './pages/ProductDetail';
import LoginPage from './pages/LoginPage';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [user, setUser] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setCurrentPage('home');
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleNavigate = (page, productId = null) => {
    // Protected pages - require login
    const protectedPages = ['home', 'product'];
    
    if (protectedPages.includes(page) && !user) {
      setCurrentPage('login');
      return;
    }
    
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setCurrentPage('login');
  };

  const handleRegisterSuccess = () => {
    // After registration, go to login
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
      case 'home':
        return <HomePage onNavigate={handleNavigate} user={user} onLogout={handleLogout} />;
      case 'customer-register':
        return <CustomerRegister onNavigate={handleNavigate} onSuccess={handleRegisterSuccess} />;
      case 'seller-register':
        return <SellerRegister onNavigate={handleNavigate} onSuccess={handleRegisterSuccess} />;
      case 'product':
        return <ProductDetail productId={selectedProductId} onNavigate={handleNavigate} />;
      default:
        return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
    }
  };

  // Show user info bar if logged in
  const showUserBar = user && !['login', 'customer-register', 'seller-register'].includes(currentPage);

  return (
    <div>
      {/* User Info Bar */}
      {showUserBar && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          background: '#1A1A1A',
          color: '#fff',
          fontSize: '14px',
          fontFamily: 'Prompt, sans-serif'
        }}>
          <span>👤 สวัสดี, {user.name || user.email}</span>
          <button 
            onClick={handleLogout}
            style={{
              padding: '6px 16px',
              background: 'transparent',
              border: '1px solid #fff',
              color: '#fff',
              borderRadius: '20px',
              fontSize: '12px',
              fontFamily: 'Prompt, sans-serif',
              cursor: 'pointer'
            }}
          >
            ออกจากระบบ
          </button>
        </div>
      )}
      
      {renderPage()}
    </div>
  );
}

export default App;
