import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/HomePage.css';
import { FiShoppingCart, FiHome, FiSearch, FiUser, FiLogOut } from 'react-icons/fi';
import axios from 'axios';
import { useCart } from './context/CartContext.jsx';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { cartCount } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://velora-x8m0.onrender.com/api/user/register/product');
        if (response.data.success) {
          setProducts(response.data.payload);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบหรือไม่?')) {
      navigate('/');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  } 

  return (
    <div className="home-container">
      {/* Navbar ด้านบน */}
      <header className="navbar">
        <div className="nav-content">
          <h1 className="brand-logo">VELORA</h1>
          <div className="nav-icons">
            {/* คุณอาจจะย้ายเมนูค้นหาหรือ User มาไว้ตรงนี้สำหรับ Desktop ก็ได้ */}
            <div className="cart-wrapper" onClick={() => navigate('/cart')}>
              <FiShoppingCart className="icon-cart" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
            <FiLogOut className="icon-logout" onClick={handleLogout} title="ออกจากระบบ" />
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Banner */}
        <section className="trending-banner" onClick={() => products.length > 0 && handleProductClick(products[0]._id)} style={{ cursor: products.length > 0 ? 'pointer' : 'default' }}>
          <div className="banner-text">
            <h2>มาแรง 📈</h2>
            {products.length > 0 ? (
              <>
                 <h3 style={{fontSize: '1.5rem', marginBottom: '10px'}}>{products[0].productname}</h3>
                <div className="price-tag main-price">
                  <span>฿ {(products[0].productPrice || products[0].productprice)?.toLocaleString()}</span> <small>ราคาขาย</small>
                </div>
                <div className="price-tag sub-price">
                  <span>฿ {Math.round((products[0].productPrice || products[0].productprice) * 0.1)?.toLocaleString()}</span> <small>ราคาเช่าต่อวัน</small>
                </div>
              </>
            ) : (
              <p>กำลังโหลดสินค้าแนะนำ...</p>
            )}
          </div>
          <div className="banner-image">
             {products.length > 0 && products[0].productphoto ? (
              <img src={products[0].productphoto} alt={products[0].productname} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px'}} />
            ) : (
              <div className="placeholder-img"></div>
            )}
          </div>
        </section>

        {/* Product Grid เต็มหน้าจอ */}
        <section className="product-grid">
          {products.filter(item => item.productname && item.productphoto).length > 0 ? (
            products.filter(item => item.productname && item.productphoto).map((item) => (
              <div 
                key={item._id} 
                className="product-card"
                onClick={() => handleProductClick(item._id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-img-holder">
                  {/* แสดงรูปภาพสินค้าถ้ามี หรือใช้สีพื้นหลังถ้าไม่มี */}
                  {item.productphoto ? <img src={item.productphoto} alt={item.productname} className="product-img" /> : null}
                </div>
                <div className="product-info">
                  <p className="p-category">{item.productstyle || 'Category'}</p>
                  <h3 className="p-title">{item.productname}</h3>
                  <div className="p-footer">
                    <span className="p-price">฿ {(item.productPrice || item.productprice)?.toLocaleString()}</span>
                    <span className="p-rating">★ 4.9</span>
                  </div>
                  <p className="p-rent">เช่า: {Math.round((item.productPrice || item.productprice) * 0.1)}/วัน</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">ไม่มีสินค้าในขณะนี้</div>
          )}
        </section>
      </main>

      {/* เมนูด้านล่าง */}
      <footer className="bottom-nav">
        <FiHome className="nav-icon active" />
        <FiSearch className="nav-icon" onClick={() => navigate('/search')} />
        <FiUser className="nav-icon" onClick={() => navigate('/profile')} />
      </footer>
    </div>
  );
}

export default HomePage;