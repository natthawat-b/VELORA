import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/register.css';

const API_URL = 'https://velora-x8m0.onrender.com/api';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/user/register`, formData);
      
      if (response.data.success || response.data.payload?.success) {
        // Store userId in localStorage
        const userId = response.data.payload?._id || response.data._id;
        if (userId) {
          localStorage.setItem('userId', userId);
          console.log('✅ User registered and logged in:', userId);
        }
        
        alert('สมัครสมาชิกสำเร็จ!');
        navigate('/');
      }
    } catch (err) {
      console.error('Register error:', err);
      if (err.response) {
        setError(err.response.data.error?.message || 'เกิดข้อผิดพลาด');
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
        <h1 className="signup-title">สมัครบัญชีลูกค้า</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ชื่อ</label>
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
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
            />
          </div>

          {error && <p className="error-message" style={{color: 'red', textAlign: 'center'}}>{error}</p>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'กำลังสมัคร...' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;