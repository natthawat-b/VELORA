import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/OrderTrackingPage.css';
import { FiChevronLeft, FiSearch, FiBox, FiTruck, FiCheckCircle, FiPackage } from 'react-icons/fi';

function OrderTrackingPage() {
  const navigate = useNavigate();
  // State สำหรับเก็บ Tab ที่เลือก (ค่าเริ่มต้น: 'picked_up' ตามรูปที่ 19)
  const [activeTab, setActiveTab] = useState('shipping');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ข้อมูล Tab ตามสถานะในรูปภาพ
  const tabs = [
    { id: 'picked_up', label: 'เข้ารับพัสดุแล้ว', icon: <FiBox /> },   // รูปที่ 19
    { id: 'shipping', label: 'กำลังจัดส่ง', icon: <FiTruck /> },       // รูปที่ 20
    { id: 'completed', label: 'จัดส่งสำเร็จ', icon: <FiCheckCircle /> }, // รูปที่ 21
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userDataStr = localStorage.getItem('userData');
        if (!userDataStr) {
            // ถ้าไม่มี user ให้กลับไปหน้า login หรือ home
            navigate('/');
            return;
        }
        
        const userData = JSON.parse(userDataStr);
        const userId = userData.id || userData._id; // รองรับทั้ง id และ _id
        
        // เรียก API
        const apiUrl = import.meta.env.VITE_API_URL || 'https://velora-1.onrender.com';
        const response = await axios.get(`${apiUrl}/api/order/user?userId=${userId}`);
        
        if (response.data.success) {
            setOrders(response.data.payload || []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // กรองข้อมูลตาม Tab ที่เลือก
  // หมายเหตุ: ต้องมั่นใจว่า status จาก backend ตรงกับ id ของ tabs (picked_up, shipping, completed)
  // ถ้า backend ส่งมาไม่ตรง อาจต้องมีการ map status ก่อน
  const filteredOrders = orders.filter(order => order.status === activeTab);

  if (loading) {
      return <div className="loading-container" style={{textAlign: 'center', marginTop: '50px'}}>กำลังโหลด...</div>;
  }

  return (
    <div className="tracking-page-container">
      {/* --- Navbar --- */}
      <header className="tracking-navbar">
        <div className="nav-inner">
          <div className="nav-left">
            <button className="btn-back" onClick={() => navigate(-1)}>
              <FiChevronLeft />
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
              <div key={order._id || order.id} className="tracking-card">
                <div className="card-header">
                  <div className="shop-info">
                    <FiPackage className="shop-icon" />
                    <span className="shop-name">{order.shopName || order.shop?.name || 'ร้านค้า'}</span>
                  </div>
                  <div className="tracking-number">
                    Tracking: <span>{order.trackingNumber || '-'}</span>
                  </div>
                </div>

                <div className="status-banner">
                  <FiTruck /> {order.statusText || tabs.find(t => t.id === order.status)?.label || order.status}
                </div>
                
                {order.items && order.items.map((item, index) => (
                  <div key={index} className="product-row">
                    <div className="product-img">
                        {item.productPhoto ? (
                            <img src={item.productPhoto} alt={item.productName} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        ) : (
                            <div className="img-placeholder"></div>
                        )}
                    </div>
                    <div className="product-info">
                      <div className="p-name">{item.productName}</div>
                      <div className="p-variant">{item.variant || '-'}</div>
                      <div className="p-qty">x{item.quantity}</div>
                    </div>
                    <div className="p-price">฿{item.price?.toLocaleString()}</div>
                  </div>
                ))}

                <div className="card-footer">
                  <div className="total-text">ยอดรวม: <span>฿{order.totalPrice?.toLocaleString()}</span></div>
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
            <button className="btn-back-home" onClick={() => navigate('/home')}>ไปช้อปปิ้ง</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default OrderTrackingPage;