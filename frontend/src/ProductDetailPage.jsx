import React from 'react';
import './ProductDetailPage.css';
import { FiChevronLeft, FiShoppingCart, FiHeart, FiMessageCircle, FiPlus } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

function ProductDetailPage() {
  // ข้อมูลจำลอง (Mock Data)
  const reviews = [
    { id: 1, user: 'ชื่อบัญชีผู้ซื้อ', comment: 'เน้นแรก', rating: 5 },
    { id: 2, user: 'ชื่อบัญชีผู้ซื้อ', comment: 'เริ่ด', rating: 5 },
    { id: 3, user: 'ชื่อบัญชีผู้ซื้อ', comment: 'ผ้าดีมากค่ะ ยังไม่ได้สั่ง', rating: 5 },
    { id: 4, user: 'ชื่อบัญชีผู้ซื้อ', comment: 'ใส่สบายมากค่ะ เสื้อแฟน', rating: 5 },
  ];

  return (
    <div className="product-page-container">
      {/* --- Header --- */}
      <header className="product-header">
        <div className="header-inner">
          <button className="btn-back">
            <FiChevronLeft />
          </button>
          <h1 className="header-title">VELORA</h1> {/* เพิ่มโลโก้เพื่อให้ดูเต็มขึ้น */}
          <button className="btn-cart">
            <FiShoppingCart />
            <span className="cart-badge">1</span>
          </button>
        </div>
      </header>

      {/* --- Main Content (2 Columns Layout) --- */}
      <main className="product-main">
        
        {/* Left Column: Product Image */}
        <div className="product-image-section">
          <div className="main-image-placeholder">
            {/* CSS Art: Cloud & Mountain */}
            <div className="art-cloud"></div>
            <div className="art-mountain"></div>
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="product-info-section">
          
          {/* Title & Price Part */}
          <div className="info-header">
            <div className="price-group">
              <h2 className="buy-price">฿ X,XXX</h2>
              <span className="rent-price">฿ X,XXX/วัน</span>
            </div>
            <button className="btn-favorite">
              <FiHeart />
            </button>
          </div>

          <h1 className="product-name">ชื่อสินค้า</h1>
          <p className="product-description">รายละเอียดสินค้า....</p>

          <hr className="divider" />

          {/* Seller Info */}
          <div className="seller-card">
            <div className="seller-avatar">
              <div className="art-mountain-mini"></div>
            </div>
            <div className="seller-details">
              <h3 className="seller-name">ชื่อร้านค้า</h3>
              <div className="seller-rating">
                <FaStar className="star-icon" /> 4.9
              </div>
            </div>
            <button className="btn-visit-shop">ดูร้านค้า</button>
          </div>

          <hr className="divider" />

          {/* Reviews Section */}
          <div className="reviews-section">
            <div className="reviews-header">
              <h3>รีวิว</h3>
              <button className="btn-add-review"><FiPlus /></button>
            </div>
            
            <div className="reviews-grid">
              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-user">
                    <div className="user-avatar-small"></div>
                    <span className="user-name">{review.user}</span>
                  </div>
                  <div className="review-stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="star-yellow" />
                    ))}
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons (Desktop Style) */}
          <div className="action-buttons-container">
            <button className="btn-action chat">
              <FiMessageCircle /> สอบถามร้าน
            </button>
            <button className="btn-action add-cart">
              <FiShoppingCart /> เพิ่มลงตะกร้า
            </button>
            <button className="btn-action buy-now">
              <span className="buy-text">Buy</span>
              <span className="buy-price-btn">฿ X,XXX</span>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default ProductDetailPage;