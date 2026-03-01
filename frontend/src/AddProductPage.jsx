import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/AddProductPage.css';
import './assets/SharedNavbar.css';
import { FiChevronLeft, FiPlus, FiImage, FiX } from 'react-icons/fi';
import API_URL from './config/api';

function AddProductPage() {
  const navigate = useNavigate();

  
  // State สำหรับเก็บข้อมูล
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [price, setPrice] = useState('');
  const [productPhoto, setProductPhoto] = useState(''); // Base64 string
  const [photoPreview, setPhotoPreview] = useState(''); // For preview
  const [isRentable, setIsRentable] = useState(false);
  const [rentPrice, setRentPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('ขนาดไฟล์รูปภาพต้องไม่เกิน 10MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      return;
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setProductPhoto(base64String);
      setPhotoPreview(base64String);
      setError(''); // Clear any previous errors
    };
    reader.onerror = () => {
      setError('เกิดข้อผิดพลาดในการอ่านไฟล์');
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!productName || !description || !selectedStyle || !price || selectedSizes.length === 0 || !productPhoto) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง และเลือกรูปภาพสินค้า');
      return;
    }

    if (parseFloat(price) < 1) {
      setError('ราคาขายต้องมีค่าอย่างน้อย 1 บาท');
      return;
    }

    if (isRentable && (!rentPrice || parseFloat(rentPrice) < 1)) {
      setError('ราคาเช่าต้องมีค่าอย่างน้อย 1 บาท/วัน');
      return;
    }

    setLoading(true);
    
    try {
      // Get shop ID from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const shopId = userData._id;
      
      if (!shopId) {
        setError('ไม่พบข้อมูลร้านค้า กรุณา login ใหม่');
        setLoading(false);
        return;
      }

      const productData = {
        shopId: shopId, // ID ของร้านค้า
        productname: productName,
        productdetail: description,
        productphoto: productPhoto, // Base64 string
        productstyle: selectedStyle,
        productsize: selectedSizes.join(', '), // Convert array to string
        productAllowedToRent: isRentable,
        productPrice: parseFloat(price),
        productRentPrice: isRentable ? parseFloat(rentPrice) || 0 : 0
      };

      const response = await axios.post(`${API_URL}/product/add`, productData);
      
      if (response.data.success) {
        // Success - redirect to seller products page
        alert('เพิ่มสินค้าสำเร็จ!');
        navigate('/seller-products');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.response?.data?.error?.message || 'เกิดข้อผิดพลาดในการเพิ่มสินค้า');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      {/* --- Header --- */}
      <header className="velora-navbar">
        <div className="nav-content">
          <button className="nav-back-btn" onClick={() => navigate('/seller-products')}>
            <FiChevronLeft />
          </button>
          <h1 className="nav-title">เพิ่มรายการสินค้า</h1>
          <div className="nav-spacer"></div>
        </div>
      </header>

      {/* --- Main Content (Grid Layout) --- */}
      <main className="main-content">
        <div className="form-wrapper">
          
          {/* Left Column: Image Upload */}
          <div className="image-upload-section">
            <div className="image-preview-box">
              {photoPreview ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      borderRadius: '10px'
                    }} 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setProductPhoto('');
                      setPhotoPreview('');
                    }}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <label htmlFor="file-upload" className="upload-placeholder" style={{ cursor: 'pointer' }}>
                  <FiPlus className="upload-icon-large" />
                  <p>อัปโหลดรูปภาพสินค้า</p>
                  <span className="upload-hint">รองรับไฟล์ .jpg, .png (สูงสุด 10MB)</span>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
            
            {/* Gallery Thumbnails (จำลองว่ามีรูปเล็กๆ) */}
            <div className="image-thumbnails">
              <div className={`thumb-box ${photoPreview ? 'active' : ''}`}>
                {photoPreview ? <FiImage /> : <FiPlus />}
              </div>
              <div className="thumb-box"><FiPlus /></div>
              <div className="thumb-box"><FiPlus /></div>
              <div className="thumb-box"><FiPlus /></div>
            </div>
          </div>

          {/* Right Column: Form Inputs */}
          <form className="product-form-section" onSubmit={handleSubmit}>
            
            {/* Error Message */}
            {error && (
              <div style={{
                backgroundColor: '#fee',
                color: '#c33',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '15px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
            
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

            {/* ราคา (Price) */}
            <div className="form-group">
              <label>ราคา (บาท)</label>
              <input 
                type="number" 
                placeholder="ระบุราคาสินค้า..." 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="1"
              />
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

            {/* ราคาเช่า (แสดงเมื่อเปิดอนุญาตเช่า) */}
            {isRentable && (
              <div className="form-group">
                <label>ราคาเช่า (บาท/วัน)</label>
                <input 
                  type="number" 
                  placeholder="ระบุราคาเช่าต่อวัน..." 
                  value={rentPrice}
                  onChange={(e) => setRentPrice(e.target.value)}
                  min="1"
                  required
                />
              </div>
            )}

            {/* ปุ่ม Submit */}
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate('/seller-products')}>ยกเลิก</button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'กำลังเพิ่มสินค้า...' : 'ลงขายสินค้า'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default AddProductPage;