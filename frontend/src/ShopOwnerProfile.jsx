import React from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/ShopOwnerProfile.css';
import { FiShoppingCart, FiMessageSquare, FiBox, FiTruck, FiCheckCircle, FiHome, FiSearch, FiUser, FiEdit2, FiCamera, FiShoppingBag } from 'react-icons/fi';

function ShopOwnerProfile() {
  const navigate = useNavigate();
  return (
    <div className="shop-owner-container">
      {/* --- Navbar --- */}
      <header className="navbar">
        <div className="nav-content">
          <h1 className="brand-logo">VELORA</h1>
          <div className="nav-icons">
            <FiShoppingCart className="nav-icon" />
            <FiMessageSquare className="nav-icon" />
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="main-content">
        <div className="content-wrapper">
          
          {/* ส่วนที่ 1: การ์ดข้อมูลร้านค้า */}
          <section className="profile-card">
            <div className="profile-image-section">
              <div className="profile-img-placeholder">
                {/* CSS Art: ภูเขาและเมฆ */}
                <div className="art-cloud"></div>
                <div className="art-mountain"></div>
              </div>
              <button className="btn-edit-img">
                <span className="edit-text">แก้ไข</span>
              </button>
            </div>
            
            <div className="profile-info-section">
              <div className="name-row">
                <h2 className="shop-account-name">ชื่อแอคเค้าท์ร้าน</h2>
                <button className="btn-edit-text"><FiEdit2 /> แก้ไข</button>
              </div>
              
              <button className="btn-my-products" onClick={() => navigate('/seller-products')}>
                <FiShoppingBag className="btn-icon" /> สินค้าของฉัน
              </button>
            </div>
          </section>

          {/* ส่วนที่ 2: สถานะการจัดส่ง (Dashboard) */}
          <section className="status-dashboard">
            <h3 className="section-title">รายการจัดส่ง</h3>
            <div className="status-grid">
              <div className="status-item">
                <div className="status-icon-box">
                  <FiBox />
                </div>
                <p>เข้ารับพัสดุแล้ว</p>
              </div>
              
              <div className="status-item">
                <div className="status-icon-box">
                  <FiTruck />
                </div>
                <p>กำลังจัดส่ง</p>
              </div>
              
              <div className="status-item">
                <div className="status-icon-box completed">
                  <FiCheckCircle />
                </div>
                <p>จัดส่งสำเร็จ</p>
              </div>
            </div>
          </section>

          {/* ส่วนที่ 3: ปุ่ม Logout */}
          <div className="logout-section">
            <button className="btn-logout">LOG OUT</button>
          </div>
          
        </div>
      </main>

      {/* Bottom Nav - Only Profile Button */}
      <footer className="bottom-nav">
        <div className="nav-item active"><FiUser /></div>
      </footer>
    </div>
  );
}

export default ShopOwnerProfile;