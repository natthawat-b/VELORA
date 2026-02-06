import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/App.css';

// กำหนด URL ของ Backend API
const API_URL = 'http://localhost:3000/api';

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
      const response = await axios.post(`${API_URL}/user/login`, {
        username,
        password
      });

      // ถ้าล็อกอินสำเร็จ
      if (response.data.success) {
        alert('เข้าสู่ระบบสำเร็จ!');
        // TODO: เก็บข้อมูล user ไว้ใน localStorage หรือ context
        // localStorage.setItem('user', JSON.stringify(response.data.data));
        // navigate('/home'); // นำทางไปหน้าหลัก
      }
    } catch (err) {
      // จัดการ error
      console.error('Login error:', err);
      if (err.response) {
        setError(err.response.data.message || 'เกิดข้อผิดพลาด');
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
    <div className="container">
      <div className="login-card">
        <h1 className="brand-logo">VELORA</h1>

        {/* ส่วนเข้าสู่ระบบ (Login Section) */}
        <div className="section">
          <h2 className="section-title">เข้าสู่ระบบ</h2>
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
        <div className="section">
          <h2 className="section-title">สร้างบัญชี</h2>
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