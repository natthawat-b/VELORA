import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/register.css';
import API_URL from './config/api';

const SellerSignup = () => {
  const navigate = useNavigate();
  
  // State for form fields
  const [formData, setFormData] = useState({
    shopusername: '',
    shopname: '',
    shopEmail: '',
    shopPassword: '',
    shopPhone: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.shopPassword !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน กรุณากรอกใหม่');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/shop/register`, formData);
      
      if (response.data.success) {
        alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
        navigate('/'); // Navigate to login page
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response) {
        setError(err.response.data.error?.message || err.response.data.message || 'เกิดข้อผิดพลาด');
      } else if (err.request) {
        setError('ไม่สามารถเชื่อมต่อ server ได้');
      } else {
        setError('เกิดข้อผิดพลาด: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <button className="btn-back" onClick={() => navigate('/')}>
          ←
        </button>
        <h1 className="signup-title">สมัครบัญชีผู้ขาย</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ชื่อผู้ใช้</label>
            <input 
              type="text" 
              name="shopusername"
              value={formData.shopusername}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>ชื่อร้านค้า</label>
            <input 
              type="text" 
              name="shopname"
              value={formData.shopname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>อีเมล</label>
            <input 
              type="email" 
              name="shopEmail"
              value={formData.shopEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>รหัสผ่าน</label>
            <input 
              type="password" 
              name="shopPassword"
              value={formData.shopPassword}
              onChange={handleChange}
              placeholder="อย่างน้อย 6 ตัว และมีตัวพิมพ์ใหญ่"
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label>ยืนยันรหัสผ่าน</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label>เบอร์โทรศัพท์</label>
            <input 
              type="tel" 
              name="shopPhone"
              value={formData.shopPhone}
              onChange={handleChange}
              placeholder="ตัวเลขเท่านั้น ไม่ต้องใส่ - เช่น 0812345678"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'กำลังสมัคร...' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerSignup;