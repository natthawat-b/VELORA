import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/UserProfilePage.css';
import { FiHome, FiSearch, FiUser, FiShoppingCart, FiMessageCircle, FiBox, FiTruck, FiCheckCircle, FiEdit2, FiChevronLeft } from 'react-icons/fi';
import { useCart } from './context/CartContext';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { cartCount } = useCart();
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    
    // Editing States
    const [showEditMenu, setShowEditMenu] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    
    const fileInputRef = React.useRef(null);

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setNewName(parsedUser.username);
        } else {
            navigate('/');
        }
        
        const savedImage = localStorage.getItem('userProfileImage');
        if (savedImage) {
            setProfileImage(savedImage);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userData');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        localStorage.removeItem('velora_cart');
        localStorage.removeItem('velora_favorites');
        localStorage.removeItem('velora_addresses');
        localStorage.removeItem('userProfileImage');
        navigate('/');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                localStorage.setItem('userProfileImage', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Edit Handlers ---
    const handleEditProfileClick = () => {
        setShowEditMenu(true);
    };

    const handleCloseMenu = () => {
        setShowEditMenu(false);
    };

    const handleSelectImageEdit = () => {
        setShowEditMenu(false);
        fileInputRef.current.click();
    };

    const handleSelectNameEdit = () => {
        setShowEditMenu(false);
        setIsEditingName(true);
        setNewName(user.username);
    };

    const handleNameSave = () => {
        const updatedUser = { ...user, username: newName };
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setIsEditingName(false);
    };

    const handleNameCancel = () => {
        setIsEditingName(false);
        setNewName(user.username);
    };

  return (
    <div className="user-profile-container">
      {/* ... Navbar ... */}
      <header className="navbar">
        <div className="nav-content">
          <button className="nav-back-btn" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '8px' }}>
            <FiChevronLeft />
          </button>
          <h1 className="brand-logo" style={{ flex: 1, textAlign: 'center', fontSize: '18px', fontWeight: '700' }}>โปรไฟล์</h1>
          <div className="nav-icons">
            <div style={{ position: 'relative', display: 'inline-block' }} onClick={() => navigate('/cart')}>
              <FiShoppingCart className="nav-icon" />
              {cartCount > 0 && <span className="cart-badge" style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: 'red',
                color: 'white',
                fontSize: '10px',
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>{cartCount}</span>}
            </div>
          </div>
        </div>
      </header>

      {/* ... Main Content ... */}
      <main className="main-content">
        <div className="content-wrapper">
          
          {/* Section 1: Profile Card */}
          <section className="profile-card">
            <div className="profile-image-section">
              <div className="profile-img-placeholder">
                {profileImage ? (
                    <img src={profileImage} alt="Profile" className="profile-uploaded-img" />
                ) : (
                    <>
                    <div className="art-cloud"></div>
                    <div className="art-mountain"></div>
                    </>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                style={{ display: 'none' }} 
                accept="image/*"
              />
              {/* Removed small edit button */}
            </div>
            
            <div className="profile-info-section">
              <div className="name-row">
                {isEditingName ? (
                    <div className="edit-name-container">
                        <input 
                            type="text" 
                            className="name-edit-input"
                            value={newName} 
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <div className="name-edit-actions">
                            <button className="btn-save-name" onClick={handleNameSave}>บันทึก</button>
                            <button className="btn-cancel-name" onClick={handleNameCancel}>ยกเลิก</button>
                        </div>
                    </div>
                ) : (
                    <h2 className="shop-account-name">{user ? user.username : 'Loading...'}</h2>
                )}
                {/* Removed small edit button next to name */}
              </div>
              
              {!isEditingName && (
                  <button className="btn-my-products edit-profile-btn" style={{marginTop: '15px' }} onClick={handleEditProfileClick}>
                    แก้ไขโปรไฟล์
                  </button>
              )}
            </div>
          </section>

          {/* Edit Menu Modal */}
          {showEditMenu && (
              <div className="modal-overlay" onClick={handleCloseMenu}>
                  <div className="edit-menu-modal" onClick={(e) => e.stopPropagation()}>
                    <h3>แก้ไขโปรไฟล์</h3>
                    <button onClick={handleSelectImageEdit}>แก้ไขรูปภาพ</button>
                    <button onClick={handleSelectNameEdit}>แก้ไขชื่อผู้ใช้</button>
                    <button className="btn-menu-cancel" onClick={handleCloseMenu}>ยกเลิก</button>
                  </div>
              </div>
          )}

          {/* Section 2: Status Dashboard */}
          <section className="status-dashboard">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="section-title">รายการซื้อ</h3>
              <span style={{ color: '#888', cursor: 'pointer', fontSize: '14px' }} onClick={() => navigate('/order-list')}>ดูทั้งหมด &gt;</span>
            </div>
            <div className="status-grid">
              <div className="status-item" onClick={() => navigate('/order-list')} style={{ cursor: 'pointer' }}>
                <div className="status-icon-box">
                  <FiBox />
                </div>
                <p>ที่ต้องได้รับ</p>
              </div>
              
              <div className="status-item" onClick={() => navigate('/order-tracking')} style={{ cursor: 'pointer' }}>
                <div className="status-icon-box">
                  <FiTruck />
                </div>
                <p>กำลังจัดส่ง</p>
              </div>
              
              <div className="status-item" onClick={() => navigate('/order-list')} style={{ cursor: 'pointer' }}>
                <div className="status-icon-box completed">
                  <FiCheckCircle />
                </div>
                <p>จัดส่งสำเร็จ</p>
              </div>
            </div>
          </section>

          {/* Section 3: Logout */}
          <div className="logout-section">
            <button className="btn-logout" onClick={handleLogout}>LOG OUT</button>
          </div>
          
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <FiHome className="nav-icon" onClick={() => navigate('/home')} />
        <FiSearch className="nav-icon" onClick={() => navigate('/search')} />
        <FiUser className="nav-icon active" />
      </nav>
    </div>
  );
};

export default ProfilePage;
