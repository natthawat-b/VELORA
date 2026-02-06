import React, { useState } from 'react';
import './ProductOptionModal.css';
import { FiX, FiCheck } from 'react-icons/fi';

const ProductOptionModal = ({ isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedDays, setSelectedDays] = useState(null);

  // จำลองข้อมูลตัวเลือก
  const sizes = ['S', 'M', 'L', 'XL'];
  const rentalDays = ['3 วัน', '5 วัน', '7 วัน', '15 วัน'];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* ปุ่มปิด (Close Button) */}
        <button className="btn-close" onClick={onClose}>
          <FiX />
        </button>

        <div className="modal-body">
          {/* ฝั่งซ้าย: รูปสินค้า */}
          <div className="modal-image-section">
            <div className="modal-img-placeholder">
              {/* CSS Art: Cloud & Mountain (ย่อส่วน) */}
              <div className="art-cloud-mini"></div>
              <div className="art-mountain-mini"></div>
            </div>
          </div>

          {/* ฝั่งขวา: ตัวเลือกต่างๆ */}
          <div className="modal-options-section">
            <h2 className="modal-product-title">produce name</h2>
            
            {/* ตัวเลือกขนาด */}
            <div className="option-group">
              <label>ขนาดสินค้า</label>
              <div className="option-grid">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`option-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ตัวเลือกจำนวนวัน */}
            <div className="option-group">
              <label>จำนวนวันที่เช่า</label>
              <div className="option-grid">
                {rentalDays.map((days) => (
                  <button
                    key={days}
                    className={`option-btn ${selectedDays === days ? 'active' : ''}`}
                    onClick={() => setSelectedDays(days)}
                  >
                    {days}
                  </button>
                ))}
              </div>
            </div>

            {/* ส่วนสรุปราคาและปุ่มยืนยัน */}
            <div className="modal-actions">
              
              {/* ปุ่มเช่า (Rent) */}
              <div className="action-row rent-row">
                <span className="action-label">เช่า</span>
                <span className="action-price">฿ 500</span>
                <button className="btn-select-action outline">เลือกเช่า</button>
              </div>

              {/* ปุ่มซื้อ (Buy) */}
              <div className="action-row buy-row">
                <span className="action-label gold-text">Buy</span>
                <span className="action-price gold-text">฿ 2,000</span>
                <button className="btn-select-action solid">เลือกซื้อ</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOptionModal;