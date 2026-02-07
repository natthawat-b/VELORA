import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './assets/ShopProfilePage.css';
import { FiChevronLeft, FiMessageCircle, FiShoppingCart, FiSearch, FiUser, FiMoreHorizontal } from 'react-icons/fi';
import { FaStar, FaCircle } from 'react-icons/fa';
import { useCart } from './context/CartContext';

function ShopProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  // Log shop ID for debugging (จะใช้ fetch ข้อมูลจาก API ในอนาคต)
  console.log('Shop ID:', id);
  const shopInfo = {
    name: 'ชื่อร้านค้า',
    rating: 4.9,
    status: 'ออนไลน์',
    followers: '1.2k',
    joined: '2 ปีที่แล้ว'
  };

  // ข้อมูลจำลองสินค้า
  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: 'ชื่อสินค้า',
    desc: 'รายละเอียดสินค้า',
    price: 'XXXX',
    rent: 'xxx'
  }));

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="shop-page-container">
      {/* Navbar หลัก */}
      {/* Navbar หลัก */}
      <header className="main-navbar">
        <div className="nav-left">
          <button className="btn-back" onClick={handleGoBack}>
            <FiChevronLeft />
          </button>
        </div>
        <h1 className="brand-logo">VELORA</h1>
        <div className="nav-right">
          <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} onClick={() => navigate('/cart')}>
            <FiShoppingCart className="nav-icon" />
            {cartCount > 0 && <span className="cart-badge" style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'red',
                color: 'white',
                fontSize: '10px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 'bold'
              }}>{cartCount}</span>}
          </div>
          <FiUser className="nav-icon" />
        </div>
      </header>

      <main className="shop-main-content">
        
        {/* ส่วนหัวข้อมูลร้านค้า (Shop Header) */}
        <section className="shop-profile-header">
          <div className="shop-info-wrapper">
            {/* รูปโปรไฟล์ร้าน */}
            <div className="shop-avatar-container">
              <div className="shop-avatar-placeholder">
                 {/* CSS Art: Cloud & Mountain */}
                 <div className="art-cloud-mini"></div>
                 <div className="art-mountain-mini"></div>
              </div>
            </div>

            {/* รายละเอียดร้าน */}
            <div className="shop-text-info">
              <div className="shop-name-row">
                <h2 className="shop-name">{shopInfo.name}</h2>
                <div className="status-badge">
                  <FaCircle className="dot-icon" /> <span>{shopInfo.status}</span>
                </div>
              </div>

              <div className="shop-stats">
                <div className="stat-item">
                  <FaStar className="star-icon" />
                  <span>{shopInfo.rating} คะแนนร้านค้า</span>
                </div>
                <div className="stat-divider">|</div>
                <div className="stat-item">
                  <span>ผู้ติดตาม {shopInfo.followers}</span>
                </div>
              </div>
            </div>

            {/* ปุ่มดำเนินการ (Chat / Follow) */}
            <div className="shop-actions">
               <button className="btn-shop-action chat">
                 <FiMessageCircle /> แชทเลย
               </button>
               <button className="btn-shop-action outline">
                 ติดตาม
               </button>
               <button className="btn-more">
                 <FiMoreHorizontal />
               </button>
            </div>
          </div>
        </section>

        {/* ตารางสินค้าของร้าน (Product Grid) */}
        <section className="shop-products-section">
          <h3 className="section-title">รายการสินค้า</h3>
          
          <div className="shop-profile-product-grid">
            {products.map((item) => (
              <div key={item.id} className="product-card">
                <div className="card-image">
                  <div className="img-placeholder-content">
                    {/* CSS Art Background */}
                  </div>
                </div>
                <div className="card-details">
                  <h4 className="product-name">{item.name}</h4>
                  <p className="product-desc">{item.desc}</p>
                  
                  <div className="price-info">
                    <span className="sell-price">฿ {item.price}</span>
                    <span className="rent-price">เช่า: {item.rent}/วัน</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

export default ShopProfilePage;