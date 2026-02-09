import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/ShopProfilePage.css';
import { FiChevronLeft, FiMessageCircle, FiShoppingCart, FiSearch, FiUser, FiMoreHorizontal } from 'react-icons/fi';
import { FaStar, FaCircle } from 'react-icons/fa';
import { useCart } from './context/CartContext';

const API_URL = 'https://velora-x8m0.onrender.com/api/user/register';

function ShopProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const [shopData, setShopData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('userId'));

  // Fetch shop data and products on mount or when shop ID changes
  useEffect(() => {
    fetchShopData();
    fetchShopProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Listen for userId changes and re-fetch shop data
  useEffect(() => {
    const checkUserIdChange = () => {
      const newUserId = localStorage.getItem('userId');
      if (newUserId !== currentUserId) {
        console.log('🔄 User changed from', currentUserId, 'to', newUserId);
        setCurrentUserId(newUserId);
        // Directly re-fetch shop data to update follow status
        fetchShopData();
      }
    };

    // Check every second for userId changes
    const interval = setInterval(checkUserIdChange, 1000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]);

  const fetchShopData = async () => {
    try {
      const response = await axios.get(`${API_URL}/shop/${id}`);
      
      if (response.data.success) {
        const shop = response.data.payload;
        setShopData(shop);
        
        // Set follower count
        const followers = shop.followers || [];
        setFollowerCount(followers.length);
        
        // Check if current user is following
        const currentUserId = localStorage.getItem('userId');
        if (currentUserId) {
          setIsFollowing(followers.includes(currentUserId));
        } else {
          // Reset follow state if no user is logged in
          setIsFollowing(false);
        }
      } else {
        setError('ไม่พบข้อมูลร้านค้า');
      }
    } catch (err) {
      console.error('Error fetching shop data:', err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูลร้านค้า');
    }
  };

  const fetchShopProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/product`);
      
      if (response.data.success) {
        // Filter products by shopId
        const shopProducts = response.data.payload.filter(
          product => product.shopId === id
        );
        setProducts(shopProducts);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleFollowToggle = async () => {
    const currentUserId = localStorage.getItem('userId');
    
    if (!currentUserId) {
      alert('กรุณาเข้าสู่ระบบก่อนติดตามร้านค้า');
      return;
    }

    setFollowLoading(true);
    
    try {
      const action = isFollowing ? 'unfollow' : 'follow';
      
      const requestData = {
        userId: currentUserId,
        action: action
      };
      
      const response = await axios.put(`${API_URL}/shop/${id}/follow`, requestData);

      if (response.data.success) {
        const { followerCount: newCount, isFollowing: newFollowStatus } = response.data.payload;
        setFollowerCount(newCount);
        setIsFollowing(newFollowStatus);
      } else {
        console.error('❌ API returned success:false');
      }
    } catch (err) {
      console.error('❌ Error toggling follow:', err);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="shop-page-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>กำลังโหลด...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shop-page-container">
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="shop-page-container">
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
          <FiUser className="nav-icon" onClick={() => navigate('/shop-owner-profile')} style={{ cursor: 'pointer' }} />
        </div>
      </header>

      <main className="shop-main-content">
        
        {/* ส่วนหัวข้อมูลร้านค้า (Shop Header) */}
        <section className="shop-profile-header">
          <div className="shop-info-wrapper">
            {/* รูปโปรไฟล์ร้าน */}
            <div className="shop-avatar-container">
              <div className="shop-avatar-placeholder">
                {shopData?.shopPhoto ? (
                  <img 
                    src={shopData.shopPhoto} 
                    alt={shopData.shopname} 
                    style={{
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      borderRadius: '50%'
                    }} 
                  />
                ) : (
                  <>
                    {/* CSS Art: Cloud & Mountain */}
                    <div className="art-cloud-mini"></div>
                    <div className="art-mountain-mini"></div>
                  </>
                )}
              </div>
            </div>

            {/* รายละเอียดร้าน */}
            <div className="shop-text-info">
              <div className="shop-name-row">
                <h2 className="shop-name">{shopData?.shopname || 'ชื่อร้านค้า'}</h2>
                <div className="status-badge">
                  <FaCircle className="dot-icon" /> <span>ออนไลน์</span>
                </div>
              </div>

              <div className="shop-stats">
                <div className="stat-item">
                  <FaStar className="star-icon" />
                  <span>4.9 คะแนนร้านค้า</span>
                </div>
                <div className="stat-divider">|</div>
                <div className="stat-item">
                  <span>ผู้ติดตาม {followerCount}</span>
                </div>
              </div>
            </div>

            {/* ปุ่มดำเนินการ (Chat / Follow) */}
            <div className="shop-actions">
               <button className="btn-shop-action chat">
                 <FiMessageCircle /> แชทเลย
               </button>
               <button 
                 className="btn-shop-action outline" 
                 onClick={handleFollowToggle}
                 disabled={followLoading}
               >
                 {followLoading ? 'กำลังโหลด...' : (isFollowing ? 'เลิกติดตาม' : 'ติดตาม')}
               </button>
               <button className="btn-more">
                 <FiMoreHorizontal />
               </button>
            </div>
          </div>
        </section>

        {/* ตารางสินค้าของร้าน (Product Grid) */}
        <section className="shop-products-section">
          <h3 className="section-title">รายการสินค้า ({products.length})</h3>
          
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
              ร้านนี้ยังไม่มีสินค้า
            </div>
          ) : (
            <div className="shop-profile-product-grid">
              {products.map((item) => (
                <div 
                  key={item._id} 
                  className="product-card"
                  onClick={() => handleProductClick(item._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-image">
                    {item.productphoto ? (
                      <img 
                        src={item.productphoto} 
                        alt={item.productname}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div className="img-placeholder-content">
                        {/* CSS Art Background */}
                      </div>
                    )}
                  </div>
                  <div className="card-details">
                    <h4 className="product-name">{item.productname}</h4>
                    <p className="product-desc">{item.productdetail}</p>
                    
                    <div className="price-info">
                      <span className="sell-price">฿ {item.productPrice?.toLocaleString()}</span>
                      {item.productAllowedToRent && (
                        <span className="rent-price">เช่า: {Math.round(item.productPrice * 0.1)}/วัน</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default ShopProfilePage;
