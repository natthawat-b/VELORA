import React from 'react';
import './SelectedStylePage.css';
import { FiChevronLeft, FiSearch, FiHome, FiUser } from 'react-icons/fi';

function SelectedStylePage() {
  // จำลองข้อมูลสินค้า
  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: 'ชื่อสินค้า',
    desc: 'รายละเอียดสินค้า',
    price: 'XXXX',
    rent: 'xxx',
    rating: '4.9'
  }));

  return (
    <div className="page-container">
      {/* Header: ปุ่มย้อนกลับ + Search Bar */}
      <header className="top-header">
        <div className="header-inner">
          <button className="btn-back">
            <FiChevronLeft />
          </button>
          <div className="search-box-wrapper">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="สไตล์ที่เลือก..." 
              className="search-input" 
              defaultValue="สไตล์ที่เลือก..." // จำลองว่ามีการเลือกค่ามาแล้ว
            />
          </div>
        </div>
      </header>

      {/* Main Content: Product Grid */}
      <main className="main-content">
        <div className="product-grid">
          {products.map((item) => (
            <div key={item.id} className="product-card">
              <div className="card-image">
                {/* พื้นที่สำหรับใส่รูปภาพ (Image Placeholder) */}
                <div className="img-placeholder-content"></div>
              </div>
              
              <div className="card-details">
                <h3 className="product-name">{item.name}</h3>
                <p className="product-desc">{item.desc}</p>
                
                <div className="price-row">
                  <span className="price-text">฿ {item.price}</span>
                  <div className="rating-badge">
                    <span>★ {item.rating}</span>
                  </div>
                </div>
                
                <p className="rent-text">เช่า: {item.rent}/วัน</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="bottom-nav">
        <div className="nav-item"><FiHome /></div>
        <div className="nav-item active"><FiSearch /></div>
        <div className="nav-item"><FiUser /></div>
      </footer>
    </div>
  );
}

export default SelectedStylePage;