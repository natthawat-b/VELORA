import React, { useState } from 'react';
import '../styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login:', { username, password });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="logo">VELORA</h1>
        <h2>เข้าสู่ระบบ</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ชื่อ</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="กรอกชื่อผู้ใช้"
            />
          </div>

          <div className="form-group">
            <label>รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="กรอกรหัสผ่าน"
            />
          </div>

          <button type="submit" className="btn-primary">
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="signup-options">
          <h3>สร้างบัญชี</h3>
          <div className="signup-buttons">
            <button className="btn-secondary">ลูกค้า</button>
            <button className="btn-secondary">ผู้ขาย</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;