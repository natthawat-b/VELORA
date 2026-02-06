import React, { useState, useEffect } from 'react';
import './pages.css';
import { getProductDetails, addToCart } from '../function.js';

const ProductDetail = ({ productId, onNavigate }) => {
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);

  const loadProduct = async () => {
    const data = await getProductDetails(productId);
    if (data) {
      setProduct(data);
    } else {
      // Mock data for demo
      setProduct({
        id: productId || 1,
        name: 'ชื่อสินค้า',
        desc: 'รายละเอียดสินค้า....',
        price: 'X,XXX',
        rentPrice: 'X,XXX',
        storeName: 'ชื่อร้านค้า',
        storeRating: '4.9',
        reviews: [
          { id: 1, user: 'ชื่อบัญชีผู้ซื้อ', stars: 5, text: 'เน้นแรก' },
          { id: 2, user: 'ชื่อบัญชีผู้ซื้อ', stars: 5, text: 'เร็ด' },
          { id: 3, user: 'ชื่อบัญชีผู้ซื้อ', stars: 4, text: 'ผ้าดีมากค่ะ ยังไม่ได้ส่ง' },
          { id: 4, user: 'ชื่อบัญชีผู้ซื้อ', stars: 5, text: 'ใส่สบายมากค่ะ เสื้อแฟน' },
        ]
      });
    }
  };

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      const newCart = addToCart(cart, product, 'M', 'buy', 0);
      setCart(newCart);
      alert('เพิ่มลงตะกร้าแล้ว!');
    }
  };

  if (!product) {
    return <div className="page-container" style={{padding: '50px', textAlign: 'center'}}>กำลังโหลด...</div>;
  }

  return (
    <div className="page-container">
      {/* Header */}
      <header className="detail-header">
        <button className="back-btn" onClick={() => onNavigate && onNavigate('home')}>
          &lt;
        </button>
        <div className="cart-icon">🛒</div>
      </header>

      {/* Product Image */}
      <div className="detail-image">
        <div className="detail-image-inner"></div>
      </div>

      {/* Product Content */}
      <div className="detail-content">
        <div className="detail-price-row">
          <span className="detail-price">฿ {product.price}</span>
          <span className="detail-rent-price">฿ {product.rentPrice}/วัน</span>
          <span className="detail-favorite">♡</span>
        </div>
        
        <h1 className="detail-name">{product.name}</h1>
        <p className="detail-desc">{product.desc}</p>

        {/* Store Info */}
        <div className="store-info">
          <div className="store-avatar"></div>
          <div>
            <div className="store-name">{product.storeName}</div>
            <div className="store-rating">★ {product.storeRating}</div>
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-header">
          <span className="reviews-title">รีวิว</span>
          <span className="reviews-add">+</span>
        </div>
        <div className="reviews-grid">
          {product.reviews?.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-user">{review.user}</div>
              <div className="review-stars">{'★'.repeat(review.stars)}</div>
              <div className="review-text">{review.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bottom-action">
        <div className="action-chat">
          💬 สอบถามร้าน
        </div>
        <div className="action-cart" onClick={handleAddToCart}>
          🛒 เพิ่มลงตะกร้า
        </div>
        <button className="action-buy">
          Buy
          <span className="price">฿ {product.price}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
