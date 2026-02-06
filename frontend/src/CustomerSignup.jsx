import React, { useState } from 'react';
import '../styles/Signup.css';

function CustomerSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Customer Signup:', formData);
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="logo">VELORA</h1>
        <h2>สมัครบัญชีลูกค้า</h2>
        <p className="subtitle">Sign up</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ชื่อ</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="กรอกชื่อ"
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

          <button type="submit" className="btn-primary">
            สมัครสมาชิก
          </button>
        </form>
      </div>
    </div>
  );
}

export default CustomerSignup;