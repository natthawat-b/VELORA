import React, { useState } from 'react';
import './pages.css';
import { login } from '../function.js';

const LoginPage = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // For demo - simulate login success
    if (formData.email && formData.password) {
      // Try actual login
      const result = await login(formData.email, formData.password);
      
      // For demo purposes, allow any login
      setTimeout(() => {
        setLoading(false);
        const mockUser = {
          id: 1,
          email: formData.email,
          name: formData.email.split('@')[0]
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        onLogin && onLogin(mockUser);
      }, 500);
    } else {
      setLoading(false);
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
    }
  };

  return (
    <div className="page-container">
      <div className="register-page">
        <h1 className="register-title">เข้าสู่ระบบ</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          ยินดีต้อนรับสู่ VELORA
        </p>
        
        {error && (
          <div style={{ 
            background: '#FFEBEE', 
            color: '#C62828', 
            padding: '12px 16px', 
            borderRadius: '12px',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">อีเมล</label>
            <input 
              type="email" 
              name="email"
              className="form-input" 
              placeholder="example@email.com"
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
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-signup" disabled={loading}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #eee'
        }}>
          <p style={{ color: '#666', marginBottom: '16px' }}>ยังไม่มีบัญชี?</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => onNavigate && onNavigate('customer-register')}
              style={{
                padding: '12px 24px',
                background: '#fff',
                border: '2px solid #1A1A1A',
                borderRadius: '25px',
                fontSize: '14px',
                fontFamily: 'Prompt, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              สมัครเป็นลูกค้า
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('seller-register')}
              style={{
                padding: '12px 24px',
                background: '#fff',
                border: '2px solid #FF6B35',
                color: '#FF6B35',
                borderRadius: '25px',
                fontSize: '14px',
                fontFamily: 'Prompt, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              สมัครเป็นผู้ขาย
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
