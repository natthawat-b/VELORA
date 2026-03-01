import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/OrderListPage.css';
import './assets/SharedNavbar.css';
import { FiChevronLeft, FiSearch, FiBox, FiTruck, FiCheckCircle, FiFileText, FiShoppingCart } from 'react-icons/fi';
import { useCart } from './context/CartContext.jsx';
import API_URL from './config/api';

function OrderListPage() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [activeTab, setActiveTab] = useState('receive');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const tabs = [
    { id: 'pay', label: 'ที่ต้องชำระ' },
    { id: 'ship', label: 'ที่ต้องจัดส่ง' },
    { id: 'receive', label: 'ที่ต้องได้รับ' },
    { id: 'completed', label: 'สำเร็จ' },
    { id: 'cancelled', label: 'ยกเลิก' },
  ];

  // Map backend status to frontend tab
  const mapStatus = (status) => {
    switch (status) {
      case 'picked_up': return 'ship';
      case 'shipping': return 'receive';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      default: return 'receive';
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userDataStr = localStorage.getItem('userData');
        if (!userDataStr) {
          navigate('/');
          return;
        }

        const userData = JSON.parse(userDataStr);
        const userId = userData._id || userData.id;

        const response = await axios.get(`${API_URL}/order/user?userId=${userId}`);
        
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

  // Filter orders by tab and search
  const filteredOrders = orders.filter(order => {
    const mappedStatus = mapStatus(order.status);
    const matchesTab = mappedStatus === activeTab;
    
    if (!searchText.trim()) return matchesTab;
    
    const search = searchText.toLowerCase();
    const matchesSearch = 
      order.trackingNumber?.toLowerCase().includes(search) ||
      order.items?.some(item => item.productName?.toLowerCase().includes(search));
    
    return matchesTab && matchesSearch;
  });

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>กำลังโหลด...</div>;
  }

  return (
    <div className="order-page-container">
      {/* --- Navbar --- */}
      <header className="velora-navbar">
        <div className="nav-content">
          <button className="nav-back-btn" onClick={() => navigate(-1)}>
            <FiChevronLeft />
          </button>
          <h1 className="nav-title">รายการคำสั่งซื้อ</h1>
          <div className="nav-icons">
            <div className="cart-icon-wrapper" onClick={() => navigate('/cart')}>
              <FiShoppingCart className="nav-icon" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
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
              {orders.filter(o => mapStatus(o.status) === tab.id).length > 0 && (
                <span style={{
                  background: '#e74c3c',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  fontSize: '11px',
                  marginLeft: '5px',
                  fontWeight: 'bold'
                }}>
                  {orders.filter(o => mapStatus(o.status) === tab.id).length}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* --- Main Content --- */}
      <main className="order-content">
        {filteredOrders.length > 0 ? (
          <div className="order-list">
            {filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="card-header">
                  <span className="shop-name">
                    {order.items?.[0]?.shopName || 'ร้านค้า'}
                  </span>
                  <span className="order-status">
                    {tabs.find(t => t.id === mapStatus(order.status))?.label || order.status}
                  </span>
                </div>
                
                {order.items && order.items.map((item, index) => (
                  <div key={index} className="product-row">
                    <div className="product-img">
                      {item.productPhoto ? (
                        <img src={item.productPhoto} alt={item.productName} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px'}} />
                      ) : (
                        <div style={{width: '100%', height: '100%', background: '#f0f0f0', borderRadius: '6px'}}></div>
                      )}
                    </div>
                    <div className="product-info">
                      <div className="p-name">{item.productName}</div>
                      <div className="p-variant">
                        {item.type === 'rent' ? `เช่า (${item.rentalDays || 1} วัน)` : 'ซื้อ'}
                      </div>
                      <div className="p-qty">x{item.quantity}</div>
                    </div>
                    <div className="p-price">฿{item.price?.toLocaleString()}</div>
                  </div>
                ))}

                <div className="card-footer">
                  <div className="total-text">
                    <span style={{ color: '#888', fontSize: '13px' }}>
                      {order.paymentMethod === 'cod' ? 'เก็บเงินปลายทาง' : 
                       order.paymentMethod === 'credit_cart' ? 'บัตรเครดิต' : 'PromptPay'}
                    </span>
                    <span style={{ marginLeft: '10px' }}>ยอดรวม: <strong>฿{order.totalPrice?.toLocaleString()}</strong></span>
                  </div>
                  <div className="action-buttons">
                    {order.trackingNumber && (
                      <span style={{ fontSize: '12px', color: '#888', marginRight: '10px' }}>
                        Tracking: {order.trackingNumber}
                      </span>
                    )}
                    <button className="btn-secondary" onClick={() => navigate('/order-tracking')}>ติดตามพัสดุ</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              {activeTab === 'ship' ? <FiTruck /> : 
               activeTab === 'receive' ? <FiBox /> : 
               activeTab === 'completed' ? <FiCheckCircle /> : <FiFileText />}
            </div>
            <h3>ไม่มีคำสั่งซื้อในสถานะนี้</h3>
            <p>คุณยังไม่มีรายการคำสั่งซื้อในหมวดหมู่ "{tabs.find(t => t.id === activeTab)?.label}"</p>
            <button className="btn-shop-now" onClick={() => navigate('/home')}>ไปช้อปปิ้งกันเลย</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default OrderListPage;