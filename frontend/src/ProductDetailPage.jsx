import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/ProductDetailPage.css';
import './assets/SharedNavbar.css';
import { FiChevronLeft, FiShoppingCart, FiHeart, FiMessageCircle, FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useCart } from './context/CartContext';
import API_URL from './config/api';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  
  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  
  // Delete Confirmation State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const rentPrice = product ? (product.productRentPrice || Math.round(product.productPrice * 0.1)) : 0;

  // โหลดสถานะ favorite จาก localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('velora_favorites') || '[]');
    if (id && favorites.includes(id)) {
      setIsFavorite(true);
    }
  }, [id]);

  const handleToggleFavorite = async () => {
    const favorites = JSON.parse(localStorage.getItem('velora_favorites') || '[]');
    let updatedFavorites;
    const action = isFavorite ? 'unlike' : 'like';
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }
    localStorage.setItem('velora_favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);

    // อัพเดท likeCount ใน DB
    try {
      await axios.post(`${API_URL}/product/${id}/like`, { action });
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  // Review State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const [userReviews, setUserReviews] = useState(() => {
    const saved = localStorage.getItem(`velora_reviews_${id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const reviews = userReviews;

  const handleSubmitReview = () => {
    if (!reviewComment.trim()) {
      alert('กรุณาเขียนความคิดเห็น');
      return;
    }
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const newReview = {
      id: Date.now(),
      user: userData.username || 'ผู้ใช้',
      comment: reviewComment,
      rating: reviewRating,
    };
    const updated = [...userReviews, newReview];
    setUserReviews(updated);
    localStorage.setItem(`velora_reviews_${id}`, JSON.stringify(updated));
    setReviewComment('');
    setReviewRating(5);
    setShowReviewModal(false);
  };

  // Fetch product data on mount
  useEffect(() => {
    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/product/${id}`);
      
      if (response.data.success) {
        const productData = response.data.payload;
        
        // Normalize data (Handle case sensitivity issues from old/manual data)
        if (!productData.productPrice && productData.productprice) {
          productData.productPrice = productData.productprice;
        }

        setProduct(productData);
        setEditFormData(productData);
        
        // Check if current user is owner
        const userType = localStorage.getItem('userType');
        // console.log('🔍 Debug - userType from localStorage:', userType);
        // console.log('🔍 Debug - isOwner will be:', userType === 'shop');
        setIsOwner(userType === 'shop');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('ไม่สามารถโหลดข้อมูลสินค้าได้');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  // Handle edit submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      const response = await axios.put(`${API_URL}/product/${id}`, editFormData);
      
      if (response.data.success) {
        alert('แก้ไขสินค้าสำเร็จ!');
        setShowEditModal(false);
        fetchProductData(); // Refresh data
      }
    } catch (err) {
      console.error('Edit error:', err);
      alert('เกิดข้อผิดพลาดในการแก้ไขสินค้า');
    } finally {
      setEditLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setDeleteLoading(true);

    try {
      const response = await axios.delete(`${API_URL}/product/${id}`);
      
      if (response.data.success) {
        alert('ลบสินค้าสำเร็จ!');
        navigate('/shop-profile'); // Navigate to shop page
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('เกิดข้อผิดพลาดในการลบสินค้า');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleVisitShop = () => {
    if (product?.shop?._id) {
      navigate(`/shop/${product.shop._id}`);
    } else {
      console.warn('Shop ID not found in product data');
      alert('ไม่พบข้อมูลร้านค้า');
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 'buy');
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleRentNow = () => {
    if (product) {
      addToCart(product, 'rent');
      navigate('/cart');
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, 'buy');
      navigate('/cart');
    }
  };

  if (loading) {
    return <div className="loading-container">กำลังโหลด...</div>;
  }

  if (error || !product) {
    return <div className="error-container">{error || 'ไม่พบสินค้า'}</div>;
  }

  return (
    <div className="product-page-container">
      {/* --- Header --- */}
      <header className="velora-navbar">
        <div className="nav-content">
          <button className="nav-back-btn" onClick={() => navigate(-1)}>
            <FiChevronLeft />
          </button>
          <h1 className="nav-title">รายละเอียดสินค้า</h1>
          <div className="nav-icons">
            <div className="cart-icon-wrapper" onClick={() => navigate('/cart')}>
              <FiShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="product-main">
        
        {/* Left Column: Product Image */}
        <div className="product-image-section">
          <div className="main-image-placeholder">
            {product.productphoto ? (
              <img src={product.productphoto} alt={product.productname} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            ) : (
              <>
                <div className="art-cloud"></div>
                <div className="art-mountain"></div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Product Info */}
        <div className="product-info-section">
          
          {/* Title & Description */}
          <h1 className="product-name">{product.productname}</h1>
          <p className="product-description">{product.productdetail}</p>
          
          {/* Price */}
          <div className="info-header">
            <div className="price-group">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>ราคาขาย</span>
                <h2 className="buy-price">฿ {product.productPrice?.toLocaleString()}</h2>
              </div>
              {product.productAllowedToRent && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                  <span style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>ราคาเช่า</span>
                  <span className="rent-price">฿ {(product.productRentPrice || Math.round(product.productPrice * 0.1))?.toLocaleString()}/วัน</span>
                </div>
              )}
            </div>
            <button className={`btn-favorite ${isFavorite ? 'active' : ''}`} onClick={handleToggleFavorite}>
              <FiHeart style={isFavorite ? { fill: '#e74c3c', color: '#e74c3c' } : {}} />
            </button>
          </div>

          <p style={{ 
            fontSize: '14px', 
            fontWeight: '500',
            color: (product.productStock || 99) > 0 ? '#4CAF50' : '#f44336',
            margin: '0 0 15px 0'
          }}>
            คงเหลือ: {product.productStock ?? 99} ชิ้น
          </p>
          
          {/* Owner Actions */}
          {isOwner && (
            <div className="owner-actions">
              <button className="btn-owner-action edit" onClick={() => setShowEditModal(true)}>
                <FiEdit /> แก้ไข
              </button>
              <button className="btn-owner-action delete" onClick={() => setShowDeleteConfirm(true)}>
                <FiTrash2 /> ลบ
              </button>
            </div>
          )}

          <hr className="divider" />

          {/* Seller Info */}
          <div className="seller-card">
            <div className="seller-avatar">
              {product?.shop?.photo ? (
                <img src={product.shop.photo} alt="Shop Profile" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
              ) : (
                <div className="art-mountain-mini"></div>
              )}
            </div>
            <div className="seller-details">
              <h3 className="seller-name">{product?.shop?.name || 'ชื่อร้านค้า'}</h3>
              <div className="seller-rating">
                <FaStar className="star-icon" /> {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 'ยังไม่มีรีวิว'}
              </div>
            </div>
            <button className="btn-visit-shop" onClick={handleVisitShop}>ดูร้านค้า</button>
          </div>

          <hr className="divider" />

          {/* Reviews Section */}
          <div className="reviews-section">
            <div className="reviews-header">
              <h3>รีวิว</h3>
              <button className="btn-add-review" onClick={() => setShowReviewModal(true)}><FiPlus /></button>
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
                      <FaStar key={i} className={i < review.rating ? 'star-yellow' : 'star-gray'} />
                    ))}
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
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
              <span className="buy-price-btn">฿ {product.productPrice?.toLocaleString()}</span>
            </button>
          </div>

        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>แก้ไขสินค้า</h2>
              <button className="btn-close-modal" onClick={() => setShowEditModal(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label>ชื่อสินค้า</label>
                <input
                  type="text"
                  name="productname"
                  value={editFormData.productname || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>รายละเอียด</label>
                <textarea
                  name="productdetail"
                  value={editFormData.productdetail || ''}
                  onChange={handleEditChange}
                  rows="4"
                  required
                />
              </div>
              <div className="form-group">
                <label>ราคา (฿)</label>
                <input
                  type="number"
                  name="productPrice"
                  value={editFormData.productPrice || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>สไตล์</label>
                <input
                  type="text"
                  name="productstyle"
                  value={editFormData.productstyle || ''}
                  onChange={handleEditChange}
                />
              </div>
              <div className="form-group">
                <label>ขนาด</label>
                <input
                  type="text"
                  name="productsize"
                  value={editFormData.productsize || ''}
                  onChange={handleEditChange}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn-save" disabled={editLoading}>
                  {editLoading ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h2>ยืนยันการลบสินค้า</h2>
            <p>คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)} disabled={deleteLoading}>
                ยกเลิก
              </button>
              <button className="btn-delete-confirm" onClick={handleDelete} disabled={deleteLoading}>
                {deleteLoading ? 'กำลังลบ...' : 'ลบสินค้า'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>เขียนรีวิว</h2>
              <button className="btn-close-modal" onClick={() => setShowReviewModal(false)}>
                <FiX />
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>ให้คะแนน</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      onClick={() => setReviewRating(star)}
                      style={{
                        cursor: 'pointer',
                        fontSize: '28px',
                        color: star <= reviewRating ? '#f5a623' : '#ddd',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>ความคิดเห็น</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows="4"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', resize: 'vertical' }}
                  placeholder="เขียนรีวิวของคุณ..."
                />
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowReviewModal(false)}>ยกเลิก</button>
                <button className="btn-save" onClick={handleSubmitReview}>ส่งรีวิว</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;