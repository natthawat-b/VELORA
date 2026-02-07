import React, { useState } from 'react';
import './OrderListPage.css';
import { FiChevronLeft, FiSearch, FiBox, FiTruck, FiCheckCircle, FiFileText } from 'react-icons/fi';

function OrderListPage() {
  // State สำหรับจัดการ Tab ที่เลือก (ค่าเริ่มต้น: 'receive' ตามรูปที่ 15)
  const [activeTab, setActiveTab] = useState('receive');

  // ข้อมูล Tab ทั้งหมด
  const tabs = [
    { id: 'pay', label: 'ที่ต้องชำระ' },
    { id: 'ship', label: 'ที่ต้องจัดส่ง' },
    { id: 'receive', label: 'ที่ต้องได้รับ' },
    { id: 'completed', label: 'สำเร็จ' },
    { id: 'cancelled', label: 'ยกเลิก' },
  ];

  // ข้อมูลจำลอง (Mock Data) - ลองลบข้อมูลออกให้เหลือ [] เพื่อดูหน้า Empty State ได้ครับ
  const orders = [];

  // กรองข้อมูลตาม Tab ที่เลือก
  const filteredOrders = orders.filter(order => order.status === activeTab);

  return (
    <div className="order-page-container">
      {/* --- Navbar --- */}
      <header className="order-navbar">
        <div className="nav-inner">
          <div className="nav-left">
            <button className="btn-back">
              <FiChevronLeft /> ย้อนกลับ
            </button>
            <h1 className="page-title">รายการคำสั่งซื้อ</h1>
          </div>
          <div className="search-box">
            <FiSearch />
            <input type="text" placeholder="ค้นหาคำสั่งซื้อ..." />
          </div>
        </div>
      </header>

      {/* --- Status Tabs --- */}
      <div className="tabs-container">
        <div className="tabs-wrapper">
          {tabs.map((tab) => (
            <div 
              key={tab.id}
              className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>

      {/* --- Main Content --- */}
      <main className="order-content">
        {filteredOrders.length > 0 ? (
          // กรณีมีรายการคำสั่งซื้อ
          <div className="order-list">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="card-header">
                  <span className="shop-name">{order.shop}</span>
                  <span className="order-status">{order.statusText}</span>
                </div>
                
                {order.items.map((item, index) => (
                  <div key={index} className="product-row">
                    <div className="product-img"></div>
                    <div className="product-info">
                      <div className="p-name">{item.name}</div>
                      <div className="p-variant">{item.variant}</div>
                      <div className="p-qty">x{item.qty}</div>
                    </div>
                    <div className="p-price">฿{item.price}</div>
                  </div>
                ))}

                <div className="card-footer">
                  <div className="total-text">ยอดคำสั่งซื้อ: <span>฿{order.total}</span></div>
                  <div className="action-buttons">
                    <button className="btn-secondary">ติดต่อผู้ขาย</button>
                    {order.status === 'receive' && <button className="btn-primary">ฉันได้ตรวจสอบและรับสินค้า</button>}
                    {order.status === 'completed' && <button className="btn-primary">ซื้ออีกครั้ง</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // กรณีไม่มีรายการ (Empty State ตามรูป)
          <div className="empty-state">
            <div className="empty-icon">
              {activeTab === 'ship' ? <FiTruck /> : 
               activeTab === 'receive' ? <FiBox /> : 
               activeTab === 'completed' ? <FiCheckCircle /> : <FiFileText />}
            </div>
            <h3>ไม่มีคำสั่งซื้อในสถานะนี้</h3>
            <p>คุณยังไม่มีรายการคำสั่งซื้อในหมวดหมู่ "{tabs.find(t => t.id === activeTab)?.label}"</p>
            <button className="btn-shop-now">ไปช้อปปิ้งกันเลย</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default OrderListPage;