import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/ProductDetailPage.css';
import { FiChevronLeft, FiChevronRight, FiShoppingCart, FiHeart, FiMessageCircle, FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
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
  // Image Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  
  // Delete Confirmation State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [addedToCart, setAddedToCart] = useState(false);
  const rentPrice = product ? Math.round(product.productPrice * 0.1) : 0;

  // Mock reviews (you can replace with API later)
  const reviews = [
    { id: 1, user: 'ชื่อบัญชีผู้ซื้อ', comment: 'เน้นแรก', rating: 5 },
    { id: 2, user: 'ชื่อบัญชีผู้ซื้อ', comment: 'เริ่ด', rating: 5 },
  ];

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

  // Combine main photo and additional photos for carousel
  const allImages = product.productphoto ? [product.productphoto] : [];
  if (product.productAdditionalImages && Array.isArray(product.productAdditionalImages)) {
    allImages.push(...product.productAdditionalImages);
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="product-page-container">
      {/* --- Header --- */}
      <header className="product-header">
        <div className="header-inner">
          <button className="btn-back" onClick={() => navigate(-1)}>
            <FiChevronLeft />
          </button>
          <h1 className="header-title">VELORA</h1>
          <button className="btn-cart" onClick={() => navigate('/cart')}>
            <FiShoppingCart />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="product-main">
        
        {/* Left Column: Product Image */}
        <div className="product-image-section">
          <div className="main-image-placeholder carousel-container">
            {allImages.length > 0 ? (
              <>
                <img 
                  src={allImages[currentImageIndex]} 
                  alt={`${product.productname} - view ${currentImageIndex + 1}`} 
                  style={{width: '100%', height: '100%', objectFit: 'cover'}} 
                />
                
                {/* Navigation Arrows (Only show if > 1 image) */}
                {allImages.length > 1 && (
                  <>
                    <button className="carousel-btn prev-btn" onClick={handlePrevImage}>
                      <FiChevronLeft />
                    </button>
                    <button className="carousel-btn next-btn" onClick={handleNextImage}>
                      <FiChevronRight />
                    </button>
                    
                    {/* Dots Indicator */}
                    <div className="carousel-dots">
                      {allImages.map((_, index) => (
                        <span 
                          key={index} 
                          className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                          onClick={() => setCurrentImageIndex(index)}
                        ></span>
                      ))}
                    </div>
                  </>
                )}
              </>
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
          
          {/* Title & Price */}
          <div className="info-header">
            <div className="price-group">
              <h2 className="buy-price">฿ {product.productPrice?.toLocaleString()}</h2>
              {product.productAllowedToRent && (
                <span className="rent-price">฿ {Math.round(product.productPrice * 0.1)}/วัน</span>
              )}
            </div>
            <button className="btn-favorite">
              <FiHeart />
            </button>
          </div>

          <h1 className="product-name">{product.productname}</h1>
          <p className="product-description">{product.productdetail}</p>
          
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
    </div>
  );
}

export default ProductDetailPage;