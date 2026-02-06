import React, { useState } from 'react';
import './OrderTrackingPage.css';
import { FiChevronLeft, FiSearch, FiBox, FiTruck, FiCheckCircle, FiPackage } from 'react-icons/fi';

function OrderTrackingPage() {
  // State สำหรับเก็บ Tab ที่เลือก (ค่าเริ่มต้น: 'picked_up' ตามรูปที่ 19)
  const [activeTab, setActiveTab] = useState('shipping');

  // ข้อมูล Tab ตามสถานะในรูปภาพ
  const tabs = [
    { id: 'picked_up', label: 'เข้ารับพัสดุแล้ว', icon: <FiBox /> },   // รูปที่ 19
    { id: 'shipping', label: 'กำลังจัดส่ง', icon: <FiTruck /> },       // รูปที่ 20
    { id: 'completed', label: 'จัดส่งสำเร็จ', icon: <FiCheckCircle /> }, // รูปที่ 21
  ];

  // ข้อมูลจำลอง (Mock Data) 
  // ใส่ข้อมูลเฉพาะ Tab 'shipping' เพื่อให้เห็นตัวอย่างการ์ดสินค้า
  const orders = [
    {
      id: 'TRK-888',
      shop: 'Velora Official',
      status: 'shipping',
      statusText: 'กำลังนำส่งพัสดุให้คุณ',
      trackNumber: 'TH0123456789',
      items: [
        { name: 'เสื้อยืด Vintage Cotton', variant: 'Size L', price: 450, qty: 1 }
      ],
      total: 500
    }
  ];

  // กรองข้อมูลตาม Tab ที่เลือก
  const filteredOrders = orders.filter(order => order.status === activeTab);

  return (
    <div className="tracking-page-container">
      {/* --- Navbar --- */}
      <header className="tracking-navbar">
        <div className="nav-inner">
          <div className="nav-left">
            <button className="btn-back">
              <FiChevronLeft /> ย้อนกลับ
            </button>
            <h1 className="page-title">ติดตามสถานะ</h1>
          </div>
          <div className="search-box">
            <FiSearch />
            <input type="text" placeholder="ค้นหาเลขพัสดุ / ชื่อสินค้า..." />
          </div>
        </div>
      </header>

      {/* --- Status Steps / Tabs --- */}
      <div className="steps-container">
        <div className="steps-wrapper">
          {tabs.map((tab, index) => (
            <div 
              key={tab.id}
              className={`step-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="step-icon-circle">
                {tab.icon}
              </div>
              <span className="step-label">{tab.label}</span>
              {/* เส้นเชื่อมระหว่างจุด (ยกเว้นตัวสุดท้าย) */}
              {index < tabs.length - 1 && <div className="step-line"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* --- Main Content --- */}
      <main className="tracking-content">
        {filteredOrders.length > 0 ? (
          // กรณีมีรายการ (แสดงการ์ดสินค้า)
          <div className="order-list">
            {filteredOrders.map((order) => (
              <div key={order.id} className="tracking-card">
                <div className="card-header">
                  <div className="shop-info">
                    <FiPackage className="shop-icon" />
                    <span className="shop-name">{order.shop}</span>
                  </div>
                  <div className="tracking-number">
                    Tracking: <span>{order.trackNumber}</span>
                  </div>
                </div>

                <div className="status-banner">
                  <FiTruck /> {order.statusText}
                </div>
                
                {order.items.map((item, index) => (
                  <div key={index} className="product-row">
                    <div className="product-img">
                       <div className="img-placeholder"></div>
                    </div>
                    <div className="product-info">
                      <div className="p-name">{item.name}</div>
                      <div className="p-variant">{item.variant}</div>
                      <div className="p-qty">x{item.qty}</div>
                    </div>
                    <div className="p-price">฿{item.price}</div>
                  </div>
                ))}

                <div className="card-footer">
                  <div className="total-text">ยอดรวม: <span>฿{order.total}</span></div>
                  <button className="btn-track-detail">ดูรายละเอียดขนส่ง</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // กรณีไม่มีรายการ (Empty State ตามรูป)
          <div className="empty-state">
            <div className="empty-icon-large">
               {/* แสดงไอคอนตาม Tab ที่เลือก */}
               {tabs.find(t => t.id === activeTab)?.icon}
            </div>
            <h3>ไม่มีพัสดุในสถานะนี้</h3>
            <p>ขณะนี้ไม่มีรายการคำสั่งซื้อที่อยู่ในขั้นตอน "{tabs.find(t => t.id === activeTab)?.label}"</p>
            <button className="btn-back-home">กลับสู่หน้าหลัก</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default OrderTrackingPage;