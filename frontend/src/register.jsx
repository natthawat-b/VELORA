import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/register.css';
import API_URL from './config/api';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phone: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // จำกัดรหัสผ่านให้ใส่ได้แค่ตัวอักษรและตัวเลขเท่านั้น
    if (name === 'password') {
      const filtered = value.replace(/[^a-zA-Z0-9]/g, '');
      setFormData({ ...formData, password: filtered });
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleConfirmPasswordChange = (e) => {
    const filtered = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    setConfirmPassword(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ตรวจสอบรหัสผ่านตรงกันหรือไม่
    if (formData.password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน กรุณากรอกใหม่');
      return;
    }

    // ตรวจสอบเบอร์โทรขึ้นต้นด้วย 0
    if (formData.phone && !formData.phone.startsWith('0')) {
      setError('เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0');
      return;
    }

    // ตรวจสอบตัวเลขซ้ำเกิน 6 ตัว
    if (formData.phone) {
      const digitCounts = {};
      for (const char of formData.phone) {
        digitCounts[char] = (digitCounts[char] || 0) + 1;
        if (digitCounts[char] > 6) {
          setError('เบอร์โทรศัพท์ห้ามมีตัวเลขซ้ำกันเกิน 6 ตัว');
          return;
        }
      }
    }

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
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>ชื่อผู้ใช้</label>
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
              placeholder="อย่างน้อย 6 ตัว และมีตัวพิมพ์ใหญ่"
              required
            />
          </div>

          <div className="form-group">
            <label>ยืนยันรหัสผ่าน</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
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
              placeholder="ตัวเลขเท่านั้น ไม่ต้องใส่ - เช่น 0812345678"
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