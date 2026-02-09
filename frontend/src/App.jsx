import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/App.css';



// กำหนด URL ของ Backend API
const API_URL = 'https://velora-x8m0.onrender.com/api';

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Try user login first
      let response;
      let loginType = 'user';
      
      try {
        response = await axios.post(`${API_URL}/user/login`, {
          username,
          password
        });
      } catch (userErr) {
        // If user login fails, try shop login with same credentials
        try {
          response = await axios.post(`${API_URL}/shop/login`, {
            shopname: username, // Use same input for shopname
            shopPassword: password
          });
          loginType = 'shop';
        } catch {
          // Both logins failed
          throw userErr; // Throw the original error
        }
      }

      // If login successful, check userType and redirect
      if (response.data.success) {
        const userData = response.data.payload;
        const userType = userData.userType || loginType;
        
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userType', userType);
        
        // Store userId for follow functionality
        const userId = userData._id || userData.id;
        if (userId) {
          localStorage.setItem('userId', userId);
          console.log('✅ User logged in with ID:', userId);
        }
        
        // Navigate based on user type
        // Navigate based on user type
        if (userType === 'shop') {
          navigate('/shop-owner-profile');
        } else {
          navigate('/home');
        }
      }
    } catch (err) {
      // Handle error
      console.error('Login error:', err);
      if (err.response) {
        setError(err.response.data.error?.message || err.response.data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      } else if (err.request) {
        setError('ไม่สามารถเชื่อมต่อ server ได้ - กรุณาตรวจสอบว่า backend รันอยู่');
      } else {
        setError('เกิดข้อผิดพลาด: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-brand-logo">VELORA</h1>

        {/* ส่วนเข้าสู่ระบบ (Login Section) */}
        <div className="login-section">
          <h2 className="login-section-title">เข้าสู่ระบบ</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label>ชื่อ</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>รหัสผ่าน</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>

        {/* ส่วนสร้างบัญชี (Create Account Section) */}
        <div className="login-section">
          <h2 className="login-section-title">สร้างบัญชี</h2>
          <div className="button-group">
            <button className="btn-outline" onClick={() => navigate('/register')}>ลูกค้า</button>
            <button className="btn-outline" onClick={() => navigate('/registerShop')}>ผู้ขาย</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;