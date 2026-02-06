import React from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/register.css';

function Register() {
  const navigate = useNavigate();

  return (
    <div className="signup-page">
      <div className="signup-card">
        <button className="btn-back" onClick={() => navigate('/')}>
          ←
        </button>
        <h1 className="signup-title">สมัครบัญชีลูกค้า</h1>
        
        <form>
          <div className="form-group">
            <label>ชื่อ</label>
            <input type="text" />
          </div>

          <div className="form-group">
            <label>อีเมล</label>
            <input type="email" />
          </div>

          <div className="form-group">
            <label>รหัสผ่าน</label>
            <input type="password" />
          </div>

          <div className="form-group">
            <label>เบอร์โทรศัพท์</label>
            <input type="tel" />
          </div>

          <button type="submit" className="btn-submit">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;