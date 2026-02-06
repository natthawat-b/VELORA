import React, { useState } from 'react';
import './assets/AddProductPage.css';
import { FiChevronLeft, FiPlus, FiImage, FiX } from 'react-icons/fi';

function AddProductPage() {
  // State สำหรับเก็บข้อมูล
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [isRentable, setIsRentable] = useState(false);
  
  // State สำหรับจัดการขนาดสินค้า (Sizes)
  const [sizes] = useState(['S', 'M', 'L', 'XL']); // ค่าเริ่มต้น
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Mock Styles
  const styles = ['Streetwear', 'Minimalist', 'Vintage', 'Formal', 'Sporty'];

  // Toggle เลือกขนาด
  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  return (
    <div className="add-product-container">
      {/* --- Header --- */}
      <header className="page-header">
        <div className="header-inner">
          <button className="btn-back">
            <FiChevronLeft /> ย้อนกลับ
          </button>
          <h1 className="header-title">เพิ่มรายการสินค้า</h1>
        </div>
      </header>

      {/* --- Main Content (Grid Layout) --- */}
      <main className="main-content">
        <div className="form-wrapper">
          
          {/* Left Column: Image Upload */}
          <div className="image-upload-section">
            <div className="image-preview-box">
              <div className="upload-placeholder">
                <FiPlus className="upload-icon-large" />
                <p>อัปโหลดรูปภาพสินค้า</p>
                <span className="upload-hint">รองรับไฟล์ .jpg, .png</span>
              </div>
            </div>
            
            {/* Gallery Thumbnails (จำลองว่ามีรูปเล็กๆ) */}
            <div className="image-thumbnails">
              <div className="thumb-box active"><FiImage /></div>
              <div className="thumb-box"><FiPlus /></div>
              <div className="thumb-box"><FiPlus /></div>
              <div className="thumb-box"><FiPlus /></div>
            </div>
          </div>

          {/* Right Column: Form Inputs */}
          <form className="product-form-section">
            
            {/* ชื่อสินค้า */}
            <div className="form-group">
              <label>ชื่อสินค้า</label>
              <input 
                type="text" 
                placeholder="ระบุชื่อสินค้า..." 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            {/* รายละเอียดสินค้า */}
            <div className="form-group">
              <label>รายละเอียดสินค้า</label>
              <textarea 
                rows="5"
                placeholder="อธิบายรายละเอียดสินค้า สภาพสินค้า..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* สไตล์ (Dropdown) */}
            <div className="form-group">
              <label>สไตล์</label>
              <div className="select-wrapper">
                <select 
                  value={selectedStyle} 
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className={selectedStyle ? 'selected' : ''}
                >
                  <option value="" disabled>เลือกสไตล์สินค้า</option>
                  {styles.map((style) => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ขนาด (Size Selection) */}
            <div className="form-group">
              <div className="label-row">
                <label>ขนาด</label>
                <button type="button" className="btn-add-size-mini"><FiPlus /></button>
              </div>
              <div className="size-selector">
                {sizes.map((size) => (
                  <div 
                    key={size} 
                    className={`size-chip ${selectedSizes.includes(size) ? 'active' : ''}`}
                    onClick={() => toggleSize(size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>

            <div className="divider"></div>

            {/* Toggle Switch: อนุญาตให้เช่า */}
            <div className="form-group-row">
              <label>อนุญาตให้เช่าได้หรือไม่</label>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={isRentable}
                  onChange={(e) => setIsRentable(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>

            {/* ปุ่ม Submit */}
            <div className="form-actions">
              <button type="button" className="btn-cancel">ยกเลิก</button>
              <button type="submit" className="btn-submit">ลงขายสินค้า</button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default AddProductPage;