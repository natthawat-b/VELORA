import React, { useState } from 'react';
import './pages.css';
import { registerCustomer } from '../function.js';

const CustomerRegister = ({ onNavigate, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await registerCustomer(formData);
    setLoading(false);
    // For demo, always succeed
    alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
    onSuccess ? onSuccess() : onNavigate && onNavigate('login');
  };

  return (
    <div className="page-container">
      <div className="register-page">
        <h1 className="register-title">สมัครบัญชีลูกค้า</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">ชื่อ</label>
            <input 
              type="text" 
              name="name"
              className="form-input" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">อีเมล</label>
            <input 
              type="email" 
              name="email"
              className="form-input" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">รหัสผ่าน</label>
            <input 
              type="password" 
              name="password"
              className="form-input" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">เบอร์โทรศัพท์</label>
            <input 
              type="tel" 
              name="phone"
              className="form-input" 
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-signup" disabled={loading}>
            {loading ? 'กำลังสมัคร...' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerRegister;
