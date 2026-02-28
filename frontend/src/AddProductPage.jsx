import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/AddProductPage.css';
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
  const [additionalPhotos, setAdditionalPhotos] = useState([]); // Array of base64 strings
  const [isRentable, setIsRentable] = useState(false);
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
      setError('');
      e.target.value = ''; // Reset input so same file can be selected again
    };
    reader.onerror = () => {
      setError('เกิดข้อผิดพลาดในการอ่านไฟล์');
    };
    reader.readAsDataURL(file);
  };

  // Handle additional image upload
  const handleAdditionalImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (additionalPhotos.length >= 4) {
      setError('สามารถอัปโหลดรูปภาพเพิ่มเติมได้สูงสุด 4 รูป');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('ขนาดไฟล์รูปภาพต้องไม่เกิน 10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAdditionalPhotos((prev) => [...prev, reader.result]);
      setError('');
      e.target.value = ''; // Reset input
    };
    reader.onerror = () => {
      setError('เกิดข้อผิดพลาดในการอ่านไฟล์');
    };
    reader.readAsDataURL(file);
  };

  // Remove additional image
  const removeAdditionalImage = (index) => {
    const newPhotos = [...additionalPhotos];
    newPhotos.splice(index, 1);
    setAdditionalPhotos(newPhotos);
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
        productAdditionalImages: additionalPhotos, // Array of Base64 strings
        productstyle: selectedStyle,
        productsize: selectedSizes.join(', '), // Convert array to string
        productAllowedToRent: isRentable,
        productPrice: parseFloat(price)
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
      <header className="page-header">
        <div className="header-inner">
          <button className="btn-back" onClick={() => navigate('/seller-products')}>
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
            
            {/* Gallery Thumbnails */}
            <div className="image-thumbnails" style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              {additionalPhotos.map((photo, index) => (
                <div key={index} className="thumb-box active" style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={photo} alt={`Additional ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      fontSize: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FiX />
                  </button>
                </div>
              ))}
              
              {/* Add More Button (shows if less than 4 photos) */}
              {additionalPhotos.length < 4 && (
                <label htmlFor="additional-upload" className="thumb-box" style={{ width: '60px', height: '60px', borderRadius: '8px', border: '2px dashed #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', color: '#999' }}>
                  <FiPlus />
                  <input
                    id="additional-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAdditionalImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
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
                min="0"
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