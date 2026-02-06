import React from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/register.css';

const SellerSignup = () => {
  const navigate = useNavigate();

  return (
    <div className="signup-page">
      <div className="signup-card">
        <button className="btn-back" onClick={() => navigate('/')}>
          ←
        </button>
        <h1 className="signup-title">สมัครบัญชีผู้ขาย</h1>
        <form>
          <div className="form-group">
            <label>ชื่อ</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>ชื่อร้านค้า</label>
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
          <div className="form-group">
            <label>เลขบัตรประชาชน</label>
            <input type="text" maxLength="13" />
          </div>
          <div className="form-group">
            <label>ธนาคาร</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>เลขบัญชี</label>
            <input type="text" />
          </div>
          <button type="submit" className="btn-submit">Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default SellerSignup;