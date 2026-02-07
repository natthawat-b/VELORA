import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/Home.css';

const API_URL = 'http://localhost:3001/api';

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/product/all`);
      if (response.data.success) {
        setProducts(response.data.payload || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('shopData');
    navigate('/');
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <h1 className="home-logo">VELORA</h1>
        <div className="header-actions">
          <button className="cart-btn" onClick={() => navigate('/cart')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Trending Banner */}
      <div className="trending-banner">
        <div className="trending-content">
          <div className="trending-label">
            <span>มาแรง</span>
            <span className="trending-icon">📈</span>
          </div>
          <div className="trending-price">
            <span className="price-tag sale">฿ 2,000 <small>ราคาขาย</small></span>
            <span className="price-tag rent">฿ 800 <small>ราคาเช่าต่อวัน</small></span>
          </div>
        </div>
        <div className="trending-image">
          <div className="placeholder-image"></div>
        </div>
        <div className="banner-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {loading ? (
          <p style={{textAlign: 'center', width: '100%', padding: '20px'}}>กำลังโหลดสินค้า...</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <div 
              key={product._id} 
              className="product-card"
              onClick={() => navigate(`/product/${product._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="product-image">
                {product.productphoto ? (
                  <img src={product.productphoto} alt={product.productname} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                ) : (
                  <div className="placeholder-image"></div>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.productname}</h3>
                <p className="product-description">{product.productdetail}</p>
                <div className="product-pricing">
                  <span className="product-price">฿ {product.productprice}</span>
                  <span className="product-rating">★ 4.9</span>
                </div>
                <span className="product-rent">เช่า {product.productrentprice}/วัน</span>
              </div>
            </div>
          ))
        ) : (
          <p style={{textAlign: 'center', width: '100%', padding: '20px'}}>ไม่พบสินค้า</p>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className="nav-item active">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </button>
        <button className="nav-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
        <button className="nav-item">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </nav>
    </div>
  );
}

export default Home;
