import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './assets/AddProductPage.css'; // Reuse same CSS
import './assets/SharedNavbar.css';
import { FiChevronLeft, FiPlus, FiImage, FiX } from 'react-icons/fi';
import API_URL from './config/api';

function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL
  
  // State สำหรับเก็บข้อมูล
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [price, setPrice] = useState('');
  const [productPhoto, setProductPhoto] = useState(''); // Base64 string
  const [photoPreview, setPhotoPreview] = useState(''); // For preview
  const [isRentable, setIsRentable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingProduct, setFetchingProduct] = useState(true);
  
  // State สำหรับจัดการขนาดสินค้า (Sizes)
  const [sizes] = useState(['S', 'M', 'L', 'XL']); // ค่าเริ่มต้น
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Mock Styles
  const styles = ['Streetwear', 'Minimalist', 'Vintage', 'Formal', 'Sporty'];

  // Fetch product data on mount
  useEffect(() => {
    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProductData = async () => {
    try {
      setFetchingProduct(true);
      const response = await axios.get(`${API_URL}/product/${id}`);
      
      if (response.data.success) {
        const product = response.data.payload;
        
        // Populate form with existing data
        setProductName(product.productname || '');
        setDescription(product.productdetail || '');
        setSelectedStyle(product.productstyle || '');
        setPrice(product.productPrice?.toString() || '');
        setProductPhoto(product.productphoto || '');
        setPhotoPreview(product.productphoto || '');
        setIsRentable(product.productAllowedToRent || false);
        
        // Parse sizes from string to array
        if (product.productsize) {
          const sizesArray = product.productsize.split(', ');
          setSelectedSizes(sizesArray);
        }
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('ไม่สามารถโหลดข้อมูลสินค้าได้');
    } finally {
      setFetchingProduct(false);
    }
  };

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
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const handleRemoveImage = () => {
    setProductPhoto('');
    setPhotoPreview('');
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!productName.trim()) {
      setError('กรุณากรอกชื่อสินค้า');
      return;
    }
    if (!description.trim()) {
      setError('กรุณากรอกรายละเอียดสินค้า');
      return;
    }
    if (!selectedStyle) {
      setError('กรุณาเลือก Style สินค้า');
      return;
    }
    if (selectedSizes.length === 0) {
      setError('กรุณาเลือกขนาดสินค้าอย่างน้อย 1 ขนาด');
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setError('กรุณากรอกราคาสินค้าที่ถูกต้อง');
      return;
    }
    if (!productPhoto) {
      setError('กรุณาอัพโหลดรูปภาพสินค้า');
      return;
    }

    setLoading(true);
    
    try {
      const productData = {
        productname: productName,
        productdetail: description,
        productphoto: productPhoto, // Base64 string
        productstyle: selectedStyle,
        productsize: selectedSizes.join(', '), // Convert array to string
        productAllowedToRent: isRentable,
        productPrice: parseFloat(price)
      };

      const response = await axios.put(`${API_URL}/product/${id}`, productData);
      
      if (response.data.success) {
        alert('อัพเดทสินค้าสำเร็จ!');
        navigate('/seller-products');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.response?.data?.error?.message || 'เกิดข้อผิดพลาดในการอัพเดทสินค้า');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProduct) {
    return (
      <div className="add-product-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          กำลังโหลดข้อมูลสินค้า...
        </div>
      </div>
    );
  }

  return (
    <div className="add-product-container">
      {/* --- Header --- */}
      <header className="velora-navbar">
        <div className="nav-content">
          <button className="nav-back-btn" onClick={() => navigate('/seller-products')}>
            <FiChevronLeft />
          </button>
          <h1 className="nav-title">แก้ไขรายการสินค้า</h1>
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
                    onClick={handleRemoveImage}
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
                  <FiImage className="upload-icon-large" />
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
            <div className="image-thumbnails">
              <div className={`thumb-box ${photoPreview ? 'active' : ''}`}>
                {photoPreview ? <FiImage /> : <FiImage />}
              </div>
              <div className="thumb-box"><FiImage /></div>
              <div className="thumb-box"><FiImage /></div>
              <div className="thumb-box"><FiImage /></div>
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
                {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default EditProductPage;
