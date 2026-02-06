import React, { useState } from 'react';
import './pages.css';
import { registerSeller } from '../function.js';

const SellerRegister = ({ onNavigate, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
    email: '',
    password: '',
    phone: '',
    idCardNumber: '',
    bankInfo: '',
    accountNumber: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await registerSeller(formData);
    setLoading(false);
    // For demo, always succeed
    alert('สมัครบัญชีผู้ขายสำเร็จ! กรุณาเข้าสู่ระบบ');
    onSuccess ? onSuccess() : onNavigate && onNavigate('login');
  };

  return (
    <div className="page-container">
      <div className="register-page">
        <h1 className="register-title">สมัครบัญชีผู้ขาย</h1>
        
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
            <label className="form-label">ชื่อร้านค้า</label>
            <input 
              type="text" 
              name="shopName"
              className="form-input" 
              value={formData.shopName}
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

          <div className="form-group">
            <label className="form-label">เลขบัตรประชาชน</label>
            <input 
              type="text" 
              name="idCardNumber"
              className="form-input" 
              value={formData.idCardNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">ธนาคาร</label>
            <input 
              type="text" 
              name="bankInfo"
              className="form-input" 
              value={formData.bankInfo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">เลขบัญชี</label>
            <input 
              type="text" 
              name="accountNumber"
              className="form-input" 
              value={formData.accountNumber}
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

export default SellerRegister;
