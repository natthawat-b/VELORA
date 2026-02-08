import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/register.css';

const API_URL = 'http://localhost:3000/api';

const SellerSignup = () => {
  const navigate = useNavigate();
  
  // State for form fields
  const [formData, setFormData] = useState({
    shopusername: '',
    shopname: '',
    shopEmail: '',
    shopPassword: '',
    shopPhone: '',
    shopIDcard: '',
    shopBank: '',
    shopBankNumber: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
            <label>รหัสผ่าน (อย่างน้อย 6 ตัว, มีตัวพิมพ์ใหญ่)</label>
            <input 
              type="password" 
              name="shopPassword"
              value={formData.shopPassword}
              onChange={handleChange}
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
              required
            />
          </div>
          <div className="form-group">
            <label>เลขบัตรประชาชน</label>
            <input 
              type="text" 
              name="shopIDcard"
              value={formData.shopIDcard}
              onChange={handleChange}
              maxLength="13" 
              required
            />
          </div>
          <div className="form-group">
            <label>ธนาคาร</label>
            <input 
              type="text" 
              name="shopBank"
              value={formData.shopBank}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>เลขบัญชี</label>
            <input 
              type="text" 
              name="shopBankNumber"
              value={formData.shopBankNumber}
              onChange={handleChange}
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