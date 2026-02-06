import React, { useState, useEffect } from 'react';
import './pages.css';
import { getRecommendedProducts } from '../function.js';

const HomePage = ({ onNavigate }) => {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    const data = await getRecommendedProducts();
    if (Array.isArray(data) && data.length > 0) {
      setProducts(data);
    } else {
      // Mock data for demo
      setProducts([
        { id: 1, name: 'ชื่อสินค้า', desc: 'รายละเอียดสินค้า', price: 'XXXX', rentPrice: 'xxx', rating: '4.9' },
        { id: 2, name: 'ชื่อสินค้า', desc: 'รายละเอียดสินค้า', price: 'XXXX', rentPrice: 'xxx', rating: '4.9' },
        { id: 3, name: 'ชื่อสินค้า', desc: 'รายละเอียดสินค้า', price: 'XXXX', rentPrice: 'xxx', rating: '4.9' },
        { id: 4, name: 'ชื่อสินค้า', desc: 'รายละเอียดสินค้า', price: 'XXXX', rentPrice: 'xxx', rating: '4.9' },
      ]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="page-container">
      {/* Header */}
      <header className="home-header">
        <div className="logo-text">VELORA</div>
        <div className="cart-icon">🛒</div>
      </header>

      {/* Trending Section */}
      <div className="trending-section">
        <div className="trending-info">
          <h3>มาแรง 📈</h3>
          <div><span className="price-buy">฿ 2,000</span><span className="price-label">ราคาขาย</span></div>
          <div><span className="price-rent">฿ 800</span><span className="price-label">ราคาเช่าต่อวัน</span></div>
        </div>
        <div className="trending-image"></div>
      </div>
      <div className="dots-indicator">
        <span className="dot active"></span>
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>

      {/* Product Grid */}
      <div className="product-grid" style={{marginTop: '20px'}}>
        {products.map((product) => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => onNavigate && onNavigate('product', product.id)}
          >
            <div className="product-image"></div>
            <div className="product-info">
              <div className="product-name">{product.name}</div>
              <div className="product-desc">{product.desc}</div>
              <div className="product-price-row">
                <div>
                  <div className="product-price">฿ {product.price}</div>
                  <div className="product-rent">เช่า: {product.rentPrice}/วัน</div>
                </div>
                <div className="product-rating">★ {product.rating}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="nav-item active">
          <span>🏠</span>
        </div>
        <div className="nav-item">
          <span>🔍</span>
        </div>
        <div className="nav-item" onClick={() => onNavigate && onNavigate('customer-register')}>
          <span>👤</span>
        </div>
      </nav>
    </div>
  );
};

export default HomePage;
