import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './assets/ProductDetail.css';

const API_URL = 'http://localhost:3001/api';

function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State สำหรับ Purchase Modal
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [rentalDays, setRentalDays] = useState(1);
  const [purchaseMode, setPurchaseMode] = useState('buy'); // 'buy' หรือ 'rent'

  const sizes = ['S', 'M', 'L', 'XL'];
  const rentalDaysOptions = [1, 3, 5, 7];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      console.log('Fetching product with id:', id);
      const response = await axios.get(`${API_URL}/product/${id}`);
      console.log('Product API response:', response.data);
      
      // ดึงข้อมูลจาก payload
      if (response.data.success && response.data.payload) {
        console.log('Product data:', response.data.payload);
        console.log('Shop ID:', response.data.payload.shopId);
        setProduct(response.data.payload);
      } else {
        console.log('No product data, using placeholder');
        throw new Error('No product data');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      // ใช้ข้อมูลตัวอย่างถ้าดึงไม่ได้
      setProduct({
        _id: id,
        productname: 'ชื่อสินค้า',
        productdetail: 'รายละเอียดสินค้า....',
        productprice: 'X,XXX',
        productrentprice: 'X,XXX',
        shopId: {
          _id: 'test123',
          shopname: 'ชื่อร้านค้า',
          rating: 4.9
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // รีวิวตัวอย่าง (ในอนาคตจะดึงจาก API)
  const reviews = [
    { id: 1, username: 'ชื่อบัญชีผู้ซื้อ', rating: 5, comment: 'เนื้อแน่น' },
    { id: 2, username: 'ชื่อบัญชีผู้ซื้อ', rating: 5, comment: 'เร็วมาก' },
    { id: 3, username: 'ชื่อบัญชีผู้ซื้อ', rating: 4, comment: 'ผ้าดีมากค่ะ ยังไม่ได้ส่ง' },
    { id: 4, username: 'ชื่อบัญชีผู้ซื้อ', rating: 5, comment: 'ใส่สบายมากค่ะ เสื้อแฟน' },
  ];

  const renderStars = (rating) => {
    // ป้องกันกรณี rating เป็น undefined หรือ null
    const stars = rating || 0;
    return '★'.repeat(Math.round(stars)) + '☆'.repeat(5 - Math.round(stars));
  };

  // คำนวณราคาเช่า
  const calculateRentalPrice = () => {
    const pricePerDay = parseFloat(String(product.productrentprice).replace(/,/g, '')) || 0;
    return (pricePerDay * rentalDays).toLocaleString();
  };

  // เปิด modal ซื้อ/เช่า
  const openPurchaseModal = (mode) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      alert('กรุณาเข้าสู่ระบบก่อน');
      navigate('/');
      return;
    }
    setPurchaseMode(mode);
    setShowPurchaseModal(true);
  };

  // ดำเนินการซื้อหรือเช่า
  const handlePurchase = () => {
    if (!selectedSize) {
      alert('กรุณาเลือกขนาดสินค้า');
      return;
    }

    const purchaseData = {
      product: {
        _id: product._id,
        productname: product.productname,
        productprice: product.productprice,
        productrentprice: product.productrentprice,
        productphoto: product.productphoto,
        shopId: product.shopId
      },
      size: selectedSize,
      mode: purchaseMode,
      rentalDays: purchaseMode === 'rent' ? rentalDays : null,
      totalPrice: purchaseMode === 'buy' ? product.productprice : calculateRentalPrice()
    };

    // นำทางไปหน้า checkout
    navigate('/checkout', { 
      state: { 
        buyNow: true,
        ...purchaseData
      } 
    });
  };

  // ฟังก์ชันเพิ่มลงตะกร้า
  const handleAddToCart = async () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      alert('กรุณาเข้าสู่ระบบก่อน');
      navigate('/'); // หรือเปิด modal login
      return;
    }

    try {
      console.log('Sending Add to Cart request:', {
        userId: userData._id,
        productId: product._id,
        quantity: 1
      });

      // API call
      const response = await axios.post(`${API_URL}/cart/add`, {
        userId: userData._id,
        productId: product._id,
        quantity: 1,
      });

      console.log('Add to Cart response:', response.data);

      if (response.data.success) {
        alert('เพิ่มลงตะกร้าสำเร็จ!');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      const errorMessage = err.response?.data?.message || err.message;
      alert(`เกิดข้อผิดพลาดในการเพิ่มลงตะกร้า: ${errorMessage}`);
    }
  };

  if (loading) {
    return <div className="product-detail-container"><p style={{textAlign: 'center', padding: '50px'}}>กำลังโหลด...</p></div>;
  }

  if (!product) {
    return <div className="product-detail-container"><p style={{textAlign: 'center', padding: '50px'}}>ไม่พบสินค้า</p></div>;
  }

  return (
    <div className="product-detail-container">
      {/* Header */}
      <header className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <button className="cart-btn" onClick={() => navigate('/cart')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </button>
      </header>

      {/* Product Image */}
      <div className="product-image-section">
        <div className="product-image-large">
          {product.productphoto ? (
             <img src={product.productphoto} alt={product.productname} style={{width:'100%', height:'100%', objectFit:'cover'}} />
          ) : (
             <div className="placeholder-image"></div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info-section">
        <div className="price-row">
          <div className="prices">
            <span className="main-price">฿ {product.productprice}</span>
            <span className="rent-price">฿ {product.productrentprice}/วัน</span>
          </div>
          <button 
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>

        <h1 className="product-title">{product.productname}</h1>
        <p className="product-desc">{product.productdetail}</p>

        {/* Shop Info - คลิกเพื่อไปหน้าร้านค้า */}
        <div 
          className="shop-info" 
          onClick={() => {
            // รองรับทั้งกรณี shopId เป็น object หรือ string
            const shopIdValue = typeof product.shopId === 'string' 
              ? product.shopId 
              : product.shopId?._id;
            console.log('Shop clicked:', product.shopId, 'shopIdValue:', shopIdValue);
            if (shopIdValue) {
              navigate(`/shop/${shopIdValue}`);
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="shop-avatar"></div>
          <div className="shop-details">
            <span className="shop-name">{product.shopId?.shopname || 'ชื่อร้านค้า'}</span>
            <span className="shop-rating">★ {product.shopId?.rating || 4.9}</span>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <div className="reviews-header">
            <span className="reviews-title">รีวิว</span>
            <button className="add-review-btn">+</button>
          </div>
          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-user">
                  <div className="user-avatar-small"></div>
                  <span className="user-name">{review.username}</span>
                </div>
                <div className="review-stars">{renderStars(review.rating)}</div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bottom-action-bar">
        <button className="action-btn chat-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>สอบถามร้าน</span>
        </button>
        <button className="action-btn cart-add-btn" onClick={handleAddToCart}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span>เพิ่มลงตระกร้า</span>
        </button>
        <button 
          className="rent-btn"
          onClick={() => openPurchaseModal('rent')}
        >
          <span className="rent-label">เช่า</span>
          <span className="rent-price-btn">฿ {product.productrentprice}/วัน</span>
        </button>
        <button 
          className="buy-btn"
          onClick={() => openPurchaseModal('buy')}
        >
          <span className="buy-label">Buy</span>
          <span className="buy-price">฿ {product.productprice}</span>
        </button>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="purchase-modal-overlay" onClick={() => setShowPurchaseModal(false)}>
          <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-product-name">{product.productname}</h2>
            
            <div className="modal-content">
              <div className="modal-product-image">
                {product.productphoto ? (
                  <img src={product.productphoto} alt={product.productname} />
                ) : (
                  <div className="placeholder-image"></div>
                )}
              </div>
              
              <div className="modal-options">
                {/* Size Selection */}
                <div className="option-group">
                  <label className="option-label">ขนาดสินค้า</label>
                  <div className="size-options">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rental Days Selection (only show for rent mode) */}
                {purchaseMode === 'rent' && (
                  <div className="option-group">
                    <label className="option-label">จำนวนวันที่เช่า</label>
                    <div className="rental-days-options">
                      {rentalDaysOptions.map((days) => (
                        <button
                          key={days}
                          className={`days-btn ${rentalDays === days ? 'active' : ''}`}
                          onClick={() => setRentalDays(days)}
                        >
                          {days}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="modal-actions">
              <button 
                className="modal-rent-btn"
                onClick={() => {
                  setPurchaseMode('rent');
                  if (selectedSize) handlePurchase();
                }}
              >
                <span>เช่า</span>
                <span className="modal-price">฿ {calculateRentalPrice()}</span>
              </button>
              <button 
                className="modal-buy-btn"
                onClick={() => {
                  setPurchaseMode('buy');
                  if (selectedSize) handlePurchase();
                }}
              >
                <span>Buy</span>
                <span className="modal-price">฿ {product.productprice}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
