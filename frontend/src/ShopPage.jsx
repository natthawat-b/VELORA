import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './assets/SellerDashboard.css';

const API_URL = 'http://localhost:3001/api';

function ShopPage() {
  const navigate = useNavigate();
  const { shopId } = useParams();
  const [shopInfo, setShopInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shopId) {
      fetchShopInfo();
      fetchProducts();
    }
  }, [shopId]);

  const fetchShopInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/shop/${shopId}`);
      if (response.data.success) {
        setShopInfo(response.data.payload || response.data.data);
      }
    } catch (err) {
      console.error('Error fetching shop info:', err);
      // ใช้ข้อมูลตัวอย่างถ้าดึงไม่ได้
      setShopInfo({
        _id: shopId,
        shopname: 'ชื่อร้านค้า',
        rating: 4.9
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/product/shop/${shopId}`);
      if (response.data.success) {
        setProducts(response.data.payload || response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      // ใช้ข้อมูลตัวอย่าง
      setProducts([
        { _id: '1', productname: 'ชื่อสินค้า', productdetail: 'รายละเอียดสินค้า', productprice: 'XXXX', productrentprice: 'xxx' },
        { _id: '2', productname: 'ชื่อสินค้า', productdetail: 'รายละเอียดสินค้า', productprice: 'XXXX', productrentprice: 'xxx' },
        { _id: '3', productname: 'ชื่อสินค้า', productdetail: 'รายละเอียดสินค้า', productprice: 'XXXX', productrentprice: 'xxx' },
        { _id: '4', productname: 'ชื่อสินค้า', productdetail: 'รายละเอียดสินค้า', productprice: 'XXXX', productrentprice: 'xxx' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div className="header-actions">
          <button className="chat-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Shop Profile Section */}
      <div className="shop-profile">
        <div className="shop-avatar-large"></div>
        <div className="shop-info-section">
          <h1 className="shop-name-large">{shopInfo?.shopname || 'ชื่อร้านค้า'}</h1>
          <div className="shop-stats">
            <span className="shop-rating-badge">★ {shopInfo?.rating || 4.9}</span>
            <span className="shop-status online">ออนไลน์ 🟢</span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="seller-product-grid">
        {loading ? (
          <p className="loading-text">กำลังโหลด...</p>
        ) : products && products.length > 0 ? (
          products.map((product) => (
            <div 
              key={product._id} 
              className="seller-product-card"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="seller-product-image">
                {product.productphoto ? (
                  <img src={product.productphoto} alt={product.productname} />
                ) : (
                  <div className="placeholder-image"></div>
                )}
              </div>
              <div className="seller-product-info">
                <h3 className="seller-product-name">{product.productname}</h3>
                <p className="seller-product-desc">{product.productdetail}</p>
                <span className="seller-product-price">฿ {product.productprice}</span>
                {product.productrentprice && (
                  <span className="seller-product-rent">เช่า {product.productrentprice}/วัน</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">ยังไม่มีสินค้า</p>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => navigate('/home')}>
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

export default ShopPage;
