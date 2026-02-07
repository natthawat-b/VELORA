import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/ProductDetailPage.css';
import { FiChevronLeft, FiShoppingCart, FiHeart, FiMessageCircle, FiPlus } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useCart } from './context/CartContext.jsx';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  // ข้อมูลจำลอง (Mock Data) สำหรับรีวิว
  const reviews = [
    { id: 1, user: 'ชื่อบัญชีผู้ซื้อ', comment: 'เน้นแรก', rating: 5 },
    { id: 2, user: 'ชื่อบัญชีผู้ซื้อ', comment: 'เริ่ด', rating: 5 },
    { id: 3, user: 'ชื่อบัญชีผู้ซื้อ', comment: 'ผ้าดีมากค่ะ ยังไม่ได้สั่ง', rating: 5 },
    { id: 4, user: 'ชื่อบัญชีผู้ซื้อ', comment: 'ใส่สบายมากค่ะ เสื้อแฟน', rating: 5 },
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/product/${id}`);
        if (response.data.success) {
          setProduct(response.data.payload);
        } else {
          setError('ไม่พบสินค้า');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  // ใช้ mock shopId ก่อน (ในอนาคตจะใช้ product.shopId จริง)
  const handleVisitShop = () => {
    // TODO: เมื่อ Product มี shopId ให้ใช้ product.shopId แทน
    navigate('/shop/demo');
  };

  // Function สำหรับกดซื้อสินค้า
  const handleBuyNow = () => {
    // ส่งข้อมูลสินค้าไปยังหน้า Checkout
    navigate('/checkout', {
      state: {
        product: product,
        type: 'buy',
        price: product?.productPrice || 0
      }
    });
  };

  // Function สำหรับกดเช่าสินค้า
  const handleRentNow = () => {
    // ส่งข้อมูลสินค้าไปยังหน้า Checkout แบบเช่า
    navigate('/checkout', {
      state: {
        product: product,
        type: 'rent',
        price: rentPrice
      }
    });
  };

  // Function สำหรับเพิ่มสินค้าลงตะกร้า
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 'buy');
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (loading) {
    return <div className="loading">กำลังโหลด...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={handleGoBack}>กลับหน้าหลัก</button>
      </div>
    );
  }

  const rentPrice = product?.productPrice ? Math.round(product.productPrice * 0.1) : 0;

  return (
    <div className="product-page-container">
      {/* --- Header --- */}
      <header className="product-header">
        <div className="header-inner">
          <button className="btn-back" onClick={handleGoBack}>
            <FiChevronLeft />
          </button>
          <h1 className="header-title">VELORA</h1>
          <button className="btn-cart" onClick={() => navigate('/cart')}>
            <FiShoppingCart />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* --- Main Content (2 Columns Layout) --- */}
      <main className="product-main">
        
        {/* Left Column: Product Image */}
        <div className="product-image-section">
          <div className="main-image-placeholder">
            {product?.productphoto ? (
              <img src={product.productphoto} alt={product.productname} className="product-main-img" />
            ) : (
              <>
                {/* CSS Art: Cloud & Mountain */}
                <div className="art-cloud"></div>
                <div className="art-mountain"></div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="product-info-section">
          
          {/* Title & Price Part */}
          <div className="info-header">
            <div className="price-group">
              <h2 className="buy-price">฿ {product?.productPrice?.toLocaleString() || '0'}</h2>
              <span className="rent-price">฿ {rentPrice?.toLocaleString()}/วัน</span>
            </div>
            <button className="btn-favorite">
              <FiHeart />
            </button>
          </div>

          <h1 className="product-name">{product?.productname || 'ชื่อสินค้า'}</h1>
          <p className="product-description">{product?.productdetail || 'รายละเอียดสินค้า....'}</p>

          <hr className="divider" />

          {/* Seller Info */}
          <div className="seller-card">
            <div className="seller-avatar">
              <div className="art-mountain-mini"></div>
            </div>
            <div className="seller-details">
              <h3 className="seller-name">{product?.shop?.name || 'ชื่อร้านค้า'}</h3>
              <div className="seller-rating">
                <FaStar className="star-icon" /> 4.9
              </div>
            </div>
            <button className="btn-visit-shop" onClick={handleVisitShop}>ดูร้านค้า</button>
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
            <button className="btn-action add-cart" onClick={handleAddToCart}>
              <FiShoppingCart /> {addedToCart ? 'เพิ่มแล้ว ✓' : 'เพิ่มลงตะกร้า'}
            </button>
            <button className="btn-action rent" onClick={handleRentNow}>
              <span className="rent-text">เช่า</span>
              <span className="rent-price-btn">฿ {rentPrice?.toLocaleString()}/วัน</span>
            </button>
            <button className="btn-action buy-now" onClick={handleBuyNow}>
              <span className="buy-text">Buy</span>
              <span className="buy-price-btn">฿ {product?.productPrice?.toLocaleString() || '0'}</span>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

export default ProductDetailPage;