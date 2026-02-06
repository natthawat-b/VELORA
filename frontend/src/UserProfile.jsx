import React, { useState } from 'react';
import '../styles/UserProfile.css';

function UserProfile() {
  const [activeTab, setActiveTab] = useState('pending');

  const tabs = [
    { id: 'pending', label: 'ที่ต้องได้รับ' },
    { id: 'shipping', label: 'กำลังจัดส่ง' },
    { id: 'completed', label: 'จัดส่งสำเร็จ' }
  ];

  return (
    <div className="user-profile-container">
      <header className="profile-header">
        <h1 className="logo">VELORA</h1>
        <button className="logout-button">LOG OUT</button>
      </header>

      <div className="profile-content">
        <aside className="profile-sidebar">
          <div className="user-info">
            <div className="user-avatar"></div>
            <h2>ชื่อแอคเค้าท์</h2>
            <button className="btn-edit">แก้ไข</button>
          </div>

          <nav className="profile-nav">
            <button className="nav-item active">รายการซื้อ</button>
          </nav>

          <button className="btn-edit-profile">แก้ไขโปรไฟล์</button>
        </aside>

        <main className="profile-main">
          <div className="orders-section">
            <div className="tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="orders-content">
              {activeTab === 'pending' && (
                <div className="orders-list">
                  <p className="empty-message">ไม่มีรายการที่ต้องได้รับ</p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="orders-list">
                  <p className="empty-message">ไม่มีรายการที่กำลังจัดส่ง</p>
                </div>
              )}

              {activeTab === 'completed' && (
                <div className="orders-list">
                  <p className="empty-message">ไม่มีรายการที่จัดส่งสำเร็จ</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default UserProfile;