import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/SellerProductListPage.css';
import { FiChevronLeft, FiPlus, FiGrid, FiList, FiEdit, FiTrash2, FiDollarSign } from 'react-icons/fi';

function SellerProductListPage() {
  const navigate = useNavigate();
  const API_URL = 'https://velora-x8m0.onrender.com/api';
  
  const [balance] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
              <span className="amount">{balance.toLocaleString()}</span>
            </div>
          </div>
          <button className="btn-withdraw">
            ถอนเงิน
          </button>
        </div>
      </header>

      {/* --- Main Content (White/Grey Area) --- */}
      <main className="seller-content">
        
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