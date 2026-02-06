import React, { useState } from 'react';
import '../styles/SellerDashboard.css';

function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('received');

  const tabs = [
    { id: 'products', label: 'สินค้าของฉัน' },
    { id: 'orders', label: 'รายการจัดส่ง' },
    { id: 'received', label: 'เข้ารับผัสดุแล้ว' },
    { id: 'shipping', label: 'กำลังจัดส่ง' },
    { id: 'completed', label: 'จัดส่งสำเร็จ' }
  ];

  return (
    <div className="seller-dashboard-container">
      <header className="dashboard-header">
        <h1 className="logo">VELORA</h1>
        <button className="logout-button">LOG OUT</button>
      </header>

      <div className="dashboard-content">
        <aside className="dashboard-sidebar">
          <div className="shop-info">
            <div className="shop-avatar"></div>
            <h2>ชื่อแอคเค้าท์ร้าน</h2>
            <button className="btn-edit">แก้ไข</button>
          </div>

          <nav className="dashboard-nav">
            <button 
              className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              สินค้าของฉัน
            </button>
            <button 
              className={`nav-item ${activeTab.includes('orders') || activeTab === 'received' || activeTab === 'shipping' || activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              รายการจัดส่ง
            </button>
          </nav>
        </aside>

        <main className="dashboard-main">
          {activeTab === 'products' && (
            <div className="products-section">
              <div className="section-header">
                <h2>รายการสินค้า</h2>
                <button className="btn-primary">+ เพิ่มสินค้า</button>
              </div>

              <div className="balance-card">
                <h3>ยอดเงินคงเหลือ</h3>
                <p className="balance-amount">฿0</p>
                <button className="btn-secondary">ถอน</button>
              </div>

              <div className="products-list">
                <div className="product-item">
                  <img src="/images/product1.jpg" alt="Product" />
                  <div className="product-details">
                    <h3>ชื่อสินค้า</h3>
                    <p>รายละเอียดสินค้า</p>
                    <p className="price">฿5000</p>
                  </div>
                  <button className="btn-edit">แก้ไข</button>
                </div>

                <div className="product-item">
                  <img src="/images/product2.jpg" alt="Product" />
                  <div className="product-details">
                    <h3>ชื่อสินค้า</h3>
                    <p>รายละเอียดสินค้า</p>
                    <p className="price">฿5000</p>
                  </div>
                  <button className="btn-edit">แก้ไข</button>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'orders' || activeTab === 'received' || activeTab === 'shipping' || activeTab === 'completed') && (
            <div className="orders-section">
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'received' ? 'active' : ''}`}
                  onClick={() => setActiveTab('received')}
                >
                  เข้ารับผัสดุแล้ว
                </button>
                <button
                  className={`tab ${activeTab === 'shipping' ? 'active' : ''}`}
                  onClick={() => setActiveTab('shipping')}
                >
                  กำลังจัดส่ง
                </button>
                <button
                  className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                  onClick={() => setActiveTab('completed')}
                >
                  จัดส่งสำเร็จ
                </button>
              </div>

              <div className="orders-content">
                <p className="empty-message">ไม่มีรายการ</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default SellerDashboard;