import React, { useState } from 'react';
import '../styles/ProductDetail.css';

function ProductDetail() {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const reviews = [
    { id: 1, user: 'ชื่อบัญชีผู้ซื้อ', comment: 'เม้นแรก', rating: 4.9 },
    { id: 2, user: 'ชื่อบัญชีผู้ซื้อ', comment: 'ผ้าดีมากค่ะ ยังไม่ได้สั่ง', rating: 4.9 },
    { id: 3, user: 'ชื่อบัญชีผู้ซื้อ', comment: 'เริ่ด', rating: 4.9 },
    { id: 4, user: 'ชื่อบัญชีผู้ซื้อ', comment: 'ใส่สบายมากค่ะ เสื้อแฟน', rating: 4.9 }
  ];

  return (
    <div className="product-detail-container">
      <button className="back-button">&lt;</button>

      <div className="product-main">
        <div className="product-images">
          <div className="main-image">
            <img src="/images/product-main.jpg" alt="Product" />
          </div>
          <div className="image-thumbnails">
            <img src="/images/thumb1.jpg" alt="Thumbnail 1" />
            <img src="/images/thumb2.jpg" alt="Thumbnail 2" />
            <img src="/images/thumb3.jpg" alt="Thumbnail 3" />
          </div>
        </div>

        <div className="product-info">
          <div className="price-section">
            <h2 className="price">฿ X,XXX</h2>
            <p className="rental-price">฿ X,XXX/วัน</p>
          </div>

          <h1 className="product-name">ชื่อสินค้า</h1>
          <p className="product-description">รายละเอียดสินค้า....</p>

          <div className="shop-info">
            <div className="shop-rating">
              <span className="rating">4.9</span>
              <h3>ชื่อร้านค้า</h3>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-secondary">Buy</button>
            <button className="btn-outline">สอบถามร้าน</button>
            <button className="btn-primary">เพิ่มลงตระกร้า ฿ x,xxx</button>
          </div>
        </div>
      </div>

      <section className="reviews-section">
        <h2>รีวิว</h2>
        <div className="rating-summary">
          <span className="rating-large">4.9</span>
        </div>
        
        <div className="reviews-list">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="user-avatar"></div>
                <span className="username">{review.user}</span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="related-products">
        <div className="shop-header">
          <h3>ชื่อร้านค้า</h3>
          <span className="status">ออนไลน์</span>
          <span className="rating">4.9</span>
        </div>
        
        <div className="products-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="product-card-small">
              <img src={`/images/product${i}.jpg`} alt={`Product ${i}`} />
              <h4>ชื่อสินค้า</h4>
              <p>รายละเอียดสินค้า</p>
              <p className="price">฿ XXXX</p>
              <p className="rental">เช่า: xxx/วัน</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProductDetail;