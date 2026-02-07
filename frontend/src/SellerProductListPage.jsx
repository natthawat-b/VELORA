import React, { useState } from 'react';
import './assets/SellerProductListPage.css';
import { FiChevronLeft, FiPlus, FiGrid, FiList, FiEdit, FiTrash2, FiDollarSign } from 'react-icons/fi';

function SellerProductListPage() {
  // ข้อมูลจำลอง (Mock Data)
  const [balance] = useState(0);
  const [products] = useState([
    {
      id: 1,
      name: 'ชื่อสินค้า A',
      desc: 'รายละเอียดสินค้า A แบบย่อ...',
      price: 5000,
      image: '' 
    },
    {
      id: 2,
      name: 'ชื่อสินค้า B',
      desc: 'รายละเอียดสินค้า B แบบย่อ...',
      price: 5000,
      image: '' 
    },
    {
      id: 3,
      name: 'ชื่อสินค้า C',
      desc: 'รายละเอียดสินค้า C แบบย่อ...',
      price: 2500,
      image: '' 
    }
  ]);

  return (
    <div className="seller-page-container">
      
      {/* --- Top Section (Black Background) --- */}
      <header className="seller-header-section">
        {/* Navbar inside header */}
        <div className="seller-navbar">
          <button className="btn-back-dark">
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
          <button className="btn-add-product">
            <FiPlus className="plus-icon" /> เพิ่มสินค้าใหม่
          </button>
        </div>

        {/* Product List */}
        <div className="seller-product-list">
          {products.map((item) => (
            <div key={item.id} className="seller-product-card">
              <div className="product-thumb">
                <div className="img-placeholder-art"></div>
              </div>
              
              <div className="product-info-col">
                <h3 className="sp-name">{item.name}</h3>
                <p className="sp-desc">{item.desc}</p>
              </div>

              <div className="product-price-col">
                <span className="sp-price">฿{item.price.toLocaleString()}</span>
              </div>

              <div className="product-actions-col">
                <button className="btn-icon-action edit" title="แก้ไข">
                  <FiEdit />
                </button>
                <button className="btn-icon-action delete" title="ลบ">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}

          {/* ถ้าไม่มีสินค้า */}
          {products.length === 0 && (
            <div className="empty-products">
              <p>ยังไม่มีสินค้าในร้าน</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default SellerProductListPage;