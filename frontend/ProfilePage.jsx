import React from 'react';
import './ProfilePage.css';
import { FiShoppingCart, FiMessageSquare, FiBox, FiTruck, FiCheckCircle, FiHome, FiSearch, FiUser, FiEdit2, FiCamera } from 'react-icons/fi';

function ProfilePage() {
  return (
    <div className="profile-container">
      {/* Navbar (Header) */}
      <header className="navbar">
        <div className="nav-content">
          <h1 className="brand-logo">VELORA</h1>
          <div className="nav-icons">
            <FiShoppingCart className="nav-icon" />
            <FiMessageSquare className="nav-icon" />
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          
          {/* ส่วนที่ 1: การ์ดข้อมูลส่วนตัว */}
          <section className="profile-card">
            <div className="profile-image-wrapper">
              <div className="profile-img"></div>
              <button className="edit-img-btn">
                <FiCamera /> แก้ไข
              </button>
            </div>
            
            <div className="profile-details">
              <div className="profile-name-row">
                <h2 className="account-name">ชื่อแอคเค้าท์</h2>
                <span className="edit-text-link"><FiEdit2 /> แก้ไข</span>
              </div>
              <button className="btn-edit-profile">แก้ไขโปรไฟล์</button>
            </div>
          </section>

          {/* ส่วนที่ 2: สถานะคำสั่งซื้อ */}
          <section className="orders-card">
            <h3 className="section-title">รายการซื้อ</h3>
            <div className="order-status-group">
              <div className="status-item">
                <div className="status-icon"><FiBox /></div>
                <p>ที่ต้องได้รับ</p>
              </div>
              <div className="status-item">
                <div className="status-icon"><FiTruck /></div>
                <p>กำลังจัดส่ง</p>
              </div>
              <div className="status-item">
                <div className="status-icon completed"><FiCheckCircle /></div>
                <p>จัดส่งสำเร็จ</p>
              </div>
            </div>
          </section>

          {/* ส่วนที่ 3: ปุ่ม Logout */}
          <button className="btn-logout">LOG OUT</button>
          
        </div>
      </main>

      {/* Bottom Nav (คงไว้ตามเดิม หรือนำออกถ้าต้องการให้เหมือน Desktop App ทั่วไป) */}
      <footer className="bottom-nav">
        <div className="nav-item"><FiHome /></div>
        <div className="nav-item"><FiSearch /></div>
        <div className="nav-item active"><FiUser /></div>
      </footer>
    </div>
  );
}

export default ProfilePage;