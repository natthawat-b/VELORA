import React, { useState } from 'react';
import '../styles/Signup.css';

function SellerSignup() {
  const [formData, setFormData] = useState({
    shopName: '',
    email: '',
    password: '',
    phone: '',
    idCard: '',
    bank: '',
    accountNumber: '',
    accountName: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Seller Signup:', formData);
  };

  return (
    <div className="signup-container">
      <div className="signup-box seller">
        <h1 className="logo">VELORA</h1>
        <h2>สมัครบัญชีผู้ขาย</h2>
        <p className="subtitle">Sign up</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ชื่อร้านค้า</label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              placeholder="กรอกชื่อร้านค้า"
              required
            />
          </div>

          <div className="form-group">
            <label>อีเมล</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="กรอกอีเมล"
              required
            />
          </div>

          <div className="form-group">
            <label>รหัสผ่าน</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="กรอกรหัสผ่าน"
              required
            />
          </div>

          <div className="form-group">
            <label>เบอร์โทรศัพท์</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="กรอกเบอร์โทรศัพท์"
              required
            />
          </div>

          <div className="form-group">
            <label>เลขบัตรประชาชน</label>
            <input
              type="text"
              name="idCard"
              value={formData.idCard}
              onChange={handleChange}
              placeholder="กรอกเลขบัตรประชาชน"
              maxLength="13"
              required
            />
          </div>

          <div className="form-group">
            <label>ธนาคาร</label>
            <select
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              required
            >
              <option value="">เลือกธนาคาร</option>
              <option value="scb">ไทยพาณิชย์</option>
              <option value="kbank">กสิกรไทย</option>
              <option value="bbl">กรุงเทพ</option>
              <option value="ktb">กรุงไทย</option>
              <option value="tmb">ทหารไทย</option>
            </select>
          </div>

          <div className="form-group">
            <label>เลขบัญชี</label>
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="กรอกเลขบัญชี"
              required
            />
          </div>

          <div className="form-group">
            <label>ชื่อบัญชี</label>
            <input
              type="text"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              placeholder="กรอกชื่อบัญชี"
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            สมัครสมาชิก
          </button>
        </form>
      </div>
    </div>
  );
}

export default SellerSignup;