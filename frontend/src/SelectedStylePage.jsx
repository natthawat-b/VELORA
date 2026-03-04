import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/SelectedStylePage.css';
import './assets/SharedNavbar.css';
import { FiChevronLeft, FiSearch, FiHome, FiUser, FiShoppingCart } from 'react-icons/fi';
import { useCart } from './context/CartContext.jsx';
import API_URL from './config/api';

function SelectedStylePage() {
  const { styleName } = useParams();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/product?style=${styleName}`);
        if (response.data.success) {
          setProducts(response.data.payload);
        }
      } catch (error) {
        console.error('Error fetching products by style:', error);
      } finally {
        setLoading(false);
      }
    };

    if (styleName) {
      fetchProducts();
    }
  }, [styleName]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="velora-navbar">
        <div className="nav-content">
          <button className="nav-back-btn" onClick={() => navigate(-1)}>
            <FiChevronLeft />
          </button>
          <h1 className="nav-title">สไตล์ {styleName}</h1>
          <div className="nav-icons">
            <div className="cart-icon-wrapper" onClick={() => navigate('/cart')}>
              <FiShoppingCart className="nav-icon" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content: Product Grid */}
      <main className="main-content">
        {loading ? (
             <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>
        ) : products.length > 0 ? (
            <div className="selected-style-product-grid">
              {products.map((item) => (
                <div key={item._id} className="product-card" onClick={() => handleProductClick(item._id)} style={{ cursor: 'pointer' }}>
                  <div className="card-image">
                    {item.productphoto ? (
                        <img src={item.productphoto} alt={item.productname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <div className="img-placeholder-content"></div>
                    )}
                  </div>
                  
                  <div className="card-details">
                    <h3 className="product-name">{item.productname}</h3>
                    <p className="product-desc">{item.productdetail}</p>
                    
                    <div className="price-row">
                      <span className="price-text">฿ {item.productPrice?.toLocaleString()}</span>
                    </div>
                    
                     {item.productAllowedToRent && (
                        <p className="rent-text">เช่า: {item.productRentPrice || Math.round(item.productPrice * 0.1)}/วัน</p>
                     )}
                  </div>
                </div>
              ))}
            </div>
        ) : (
             <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>ไม่พบสินค้าในสไตล์ {styleName}</div>
        )}
      </main>

      {/* Bottom Navigation */}
      <footer className="bottom-nav">
        <FiHome className="nav-icon" onClick={() => navigate('/home')} />
        <FiSearch className="nav-icon active" />
        <FiUser className="nav-icon" onClick={() => navigate(localStorage.getItem('userType') === 'shop' ? '/shop-owner-profile' : '/profile')} />
      </footer>
    </div>
  );
}

export default SelectedStylePage;