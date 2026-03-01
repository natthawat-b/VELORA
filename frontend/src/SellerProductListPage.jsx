import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/SellerProductListPage.css';
import { FiChevronLeft, FiPlus, FiGrid, FiList, FiEdit, FiTrash2, FiDollarSign, FiShoppingBag, FiTruck, FiCheckCircle, FiClock, FiPackage, FiXCircle } from 'react-icons/fi';
import API_URL from './config/api';

function SellerProductListPage() {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);

  // Fetch products function
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get shop ID from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const shopId = userData._id;
      
      if (!shopId) {
        setError('ไม่พบข้อมูลร้านค้า กรุณา login ใหม่');
        setLoading(false);
        return;
      }

      // Fetch products filtered by shopId directly from backend
      const response = await axios.get(`${API_URL}/product/?shopId=${shopId}`);
      
      if (response.data.success) {
        setProducts(response.data.payload);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า');
    } finally {
      setLoading(false);
    }
  }, []); // เอา API_URL ออกจาก dependencies เพราะเป็น constant

  // Fetch orders for this shop
  const fetchOrders = useCallback(async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const shopId = userData._id;
      if (!shopId) return;

      const response = await axios.get(`${API_URL}/order/shop/${shopId}`);
      if (response.data.success) {
        setOrders(response.data.payload);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  }, []);

  // Fetch wallet balance
  const fetchWallet = useCallback(async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const shopId = userData._id;
      if (!shopId) return;

      const response = await axios.get(`${API_URL}/wallet/${shopId}`);
      if (response.data.success) {
        setWalletBalance(response.data.payload.balance || 0);
      }
    } catch (err) {
      console.error('Error fetching wallet:', err);
    }
  }, []);

  // Fetch all data on mount
  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchWallet();
  }, [fetchProducts, fetchOrders, fetchWallet]);

  // Helper: format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
      + ' ' + d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  // Helper: status label & icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending': return { label: 'รอดำเนินการ', icon: <FiClock />, className: 'status-pending' };
      case 'paid': return { label: 'ชำระแล้ว', icon: <FiDollarSign />, className: 'status-paid' };
      case 'shipping': return { label: 'กำลังจัดส่ง', icon: <FiTruck />, className: 'status-shipping' };
      case 'completed': return { label: 'สำเร็จ', icon: <FiCheckCircle />, className: 'status-completed' };
      case 'cancelled': return { label: 'ยกเลิก', icon: <FiXCircle />, className: 'status-cancelled' };
      default: return { label: status, icon: <FiPackage />, className: 'status-pending' };
    }
  };

  // Compute order stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => {
    // Only sum items belonging to this shop
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const shopId = userData._id;
    const shopItems = order.items?.filter(i => i.shopId === shopId) || [];
    return sum + shopItems.reduce((s, item) => {
      const itemTotal = item.type === 'rent'
        ? item.price * (item.rentalDays || 1) * item.quantity
        : item.price * item.quantity;
      return s + itemTotal;
    }, 0);
  }, 0);
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  // Handle delete product
  const handleDelete = async (productId, productName) => {
    const confirmDelete = window.confirm(
      `คุณต้องการลบสินค้า "${productName}" ใช่หรือไม่?`
    );
    
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${API_URL}/product/${productId}`);
      
      if (response.data.success) {
        alert('ลบสินค้าสำเร็จ!');
        // Refresh product list
        fetchProducts();
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('เกิดข้อผิดพลาดในการลบสินค้า');
    }
  };

  // Handle edit product
  const handleEdit = (productId) => {
    // Navigate to edit page with product ID
    navigate(`/edit-product/${productId}`);
  };

  return (
    <div className="seller-page-container">
      
      {/* --- Top Section (Black Background) --- */}
      <header className="seller-header-section">
        {/* Navbar inside header */}
        <div className="seller-navbar">
          <button className="btn-back-dark" onClick={() => navigate('/shop-owner-profile')}>
            <FiChevronLeft /> กลับ
          </button>
          <h1 className="header-title-gold">รายการสินค้า</h1>
          <div className="spacer"></div> {/* เพื่อจัดกึ่งกลาง */}
        </div>

        {/* Wallet / Balance Section */}
        <div className="balance-container">
          <div className="balance-info">
            <span className="balance-label">ยอดเงินคงเหลือ</span>
            <div className="balance-amount">
              <span className="currency">฿</span>
              <span className="amount">{walletBalance.toLocaleString()}</span>
            </div>
          </div>
          <button className="btn-withdraw" onClick={() => navigate('/wallet')}>
            ถอนเงิน
          </button>
        </div>
      </header>

      {/* --- Main Content (White/Grey Area) --- */}
      <main className="seller-content">

        {/* Order Stats Summary */}
        <div className="order-stats-grid">
          <div className="order-stat-card">
            <div className="stat-icon-box stat-orders"><FiShoppingBag /></div>
            <div className="stat-info">
              <span className="stat-value">{totalOrders}</span>
              <span className="stat-label">คำสั่งซื้อทั้งหมด</span>
            </div>
          </div>
          <div className="order-stat-card">
            <div className="stat-icon-box stat-revenue"><FiDollarSign /></div>
            <div className="stat-info">
              <span className="stat-value">฿{totalRevenue.toLocaleString()}</span>
              <span className="stat-label">รายได้รวม</span>
            </div>
          </div>
          <div className="order-stat-card">
            <div className="stat-icon-box stat-completed"><FiCheckCircle /></div>
            <div className="stat-info">
              <span className="stat-value">{completedOrders}</span>
              <span className="stat-label">สำเร็จแล้ว</span>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="recent-orders-section">
          <h2 className="section-title">รายการสั่งซื้อล่าสุด ({orders.length})</h2>
          {orders.length === 0 ? (
            <div className="empty-orders">
              <FiShoppingBag style={{ fontSize: 40, color: '#ccc', marginBottom: 10 }} />
              <p>ยังไม่มีคำสั่งซื้อ</p>
            </div>
          ) : (
            <div className="seller-orders-list">
              {orders.slice(0, 10).map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const userData2 = JSON.parse(localStorage.getItem('userData') || '{}');
                const shopItems = order.items?.filter(i => i.shopId === userData2._id) || [];
                const orderTotal = shopItems.reduce((s, item) => {
                  const t = item.type === 'rent'
                    ? item.price * (item.rentalDays || 1) * item.quantity
                    : item.price * item.quantity;
                  return s + t;
                }, 0);
                return (
                  <div key={order._id} className="order-card">
                    <div className="order-card-header">
                      <span className="order-id">{order.orderId}</span>
                      <span className={`order-status-badge ${statusInfo.className}`}>
                        {statusInfo.icon} {statusInfo.label}
                      </span>
                    </div>
                    <div className="order-card-body">
                      <div className="order-items-list">
                        {shopItems.map((item, idx) => (
                          <div key={idx} className="order-item-row">
                            <div className="order-item-thumb">
                              {item.productPhoto ? (
                                <img src={item.productPhoto} alt={item.productName} />
                              ) : (
                                <div className="order-item-placeholder"><FiPackage /></div>
                              )}
                            </div>
                            <div className="order-item-info">
                              <span className="order-item-name">{item.productName}</span>
                              <span className="order-item-detail">
                                {item.type === 'rent' ? `เช่า ${item.rentalDays} วัน` : 'ซื้อ'}
                                {' × '}{item.quantity}
                              </span>
                            </div>
                            <span className="order-item-price">฿{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="order-card-footer">
                      <span className="order-date">{formatDate(order.createdAt)}</span>
                      <span className="order-total">รวม ฿{orderTotal.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Toolbar: Title & Add Button */}
        <div className="content-toolbar">
          <h2 className="section-title">รายการสินค้าของฉัน ({products.length})</h2>
          <button className="btn-add-product" onClick={() => navigate('/add-product')}>
            <FiPlus className="plus-icon" /> เพิ่มสินค้าใหม่
          </button>
        </div>

        {/* Product List */}
        <div className="seller-product-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              กำลังโหลดข้อมูล...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#f44336' }}>
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-products">
              <p>ยังไม่มีสินค้าในร้าน</p>
            </div>
          ) : (
            products.map((item) => (
              <div key={item._id} className="seller-product-card">
                <div className="product-thumb">
                  {item.productphoto ? (
                    <img src={item.productphoto} alt={item.productname} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  ) : (
                    <div className="img-placeholder-art"></div>
                  )}
                </div>
                
                <div className="product-info-col">
                  <h3 className="sp-name">{item.productname}</h3>
                  <p className="sp-desc">{item.productdetail}</p>
                </div>

                <div className="product-price-col">
                  <span className="sp-price">฿{item.productPrice?.toLocaleString()}</span>
                </div>

                <div className="product-actions-col">
                  <button 
                    className="btn-icon-action edit" 
                    title="แก้ไข"
                    onClick={() => handleEdit(item._id)}
                  >
                    <FiEdit />
                  </button>
                  <button 
                    className="btn-icon-action delete" 
                    title="ลบ"
                    onClick={() => handleDelete(item._id, item.productname)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  );
}

export default SellerProductListPage;