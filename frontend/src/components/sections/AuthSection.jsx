import React, { useState } from 'react';
import { login, registerCustomer, registerSeller, updateProfile, logout } from '../../function';

const AuthSection = () => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [regData, setRegData] = useState({ name: '', email: '', password: '', phone: '' });
  const [sellerRegData, setSellerRegData] = useState({ shopName: '', idCardNumber: '', bankInfo: '', accountNumber: '' });
  const [output, setOutput] = useState(null);

  const handleLogin = async () => {
    setOutput('Logging in...');
    const result = await login(loginData.username, loginData.password);
    setOutput(result);
  };

  const handleRegister = async () => {
    setOutput('Registering Customer...');
    const result = await registerCustomer(regData);
    setOutput(result);
  };
  
  const handleSellerRegister = async () => {
      setOutput('Registering Seller...');
      // Merge basic reg data for simplicity in this demo, or add separate fields
      const result = await registerSeller({ ...regData, ...sellerRegData });
      setOutput(result);
  };

  const handleLogout = () => {
    logout();
    setOutput('Logged out (page reloading...)');
  };

  return (
    <div className="section-container">
      {/* Login Card */}
      <div className="card">
        <h3>Login</h3>
        <div className="form-group">
          <label>Username</label>
          <input 
            value={loginData.username} 
            onChange={(e) => setLoginData({...loginData, username: e.target.value})} 
            placeholder="Username" 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={loginData.password} 
            onChange={(e) => setLoginData({...loginData, password: e.target.value})} 
            placeholder="Password" 
          />
        </div>
        <button className="btn-primary" onClick={handleLogin}>Login</button>
        <button className="btn-secondary" style={{marginTop: '10px', width: '100%'}} onClick={handleLogout}>Logout</button>
      </div>

      {/* Register Customer Card */}
      <div className="card">
        <h3>Register Customer</h3>
        <div className="form-group">
          <label>Name</label>
          <input 
            value={regData.name} 
            onChange={(e) => setRegData({...regData, name: e.target.value})} 
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            value={regData.email} 
            onChange={(e) => setRegData({...regData, email: e.target.value})} 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password"
            value={regData.password} 
            onChange={(e) => setRegData({...regData, password: e.target.value})} 
          />
        </div>
         <div className="form-group">
          <label>Phone</label>
          <input 
            value={regData.phone} 
            onChange={(e) => setRegData({...regData, phone: e.target.value})} 
          />
        </div>
        <button className="btn-primary" onClick={handleRegister}>Register</button>
      </div>

      {/* Register Seller Card - extending customer fields */}
      <div className="card">
        <h3>Register Seller (Extra Fields)</h3>
        <p style={{fontSize: '0.8rem', color: '#aaa', marginBottom: '10px'}}>
            Uses Name/Email/Pass from Customer form + these fields:
        </p>
        <div className="form-group">
          <label>Shop Name</label>
          <input 
            value={sellerRegData.shopName} 
            onChange={(e) => setSellerRegData({...sellerRegData, shopName: e.target.value})} 
          />
        </div>
        <div className="form-group">
            <label>ID Card Number</label>
            <input 
                value={sellerRegData.idCardNumber} 
                onChange={(e) => setSellerRegData({...sellerRegData, idCardNumber: e.target.value})} 
            />
        </div>
        <button className="btn-primary" onClick={handleSellerRegister}>Register Seller</button>
      </div>

      {/* Update Profile Card */}
      <div className="card">
        <h3>Update Profile</h3>
        <p style={{fontSize: '0.8rem', color: '#aaa', marginBottom: '10px'}}>
             Requires valid token (login first)
        </p>
        <div className="form-group">
            <label>User ID</label>
            <input placeholder="User ID" id="update-profile-id" />
        </div>
        <div className="form-group">
            <label>New Name</label>
            <input placeholder="New Name" id="update-profile-name" />
        </div>
        <button className="btn-primary" onClick={async () => {
             const userId = document.getElementById('update-profile-id').value;
             const name = document.getElementById('update-profile-name').value;
             setOutput('Updating profile...');
             const result = await updateProfile(userId, { name });
             setOutput(result);
        }}>Update Profile</button>
      </div>

      {/* Output Console */}
      <div className="card" style={{gridColumn: '1 / -1'}}>
        <h3>Result Console</h3>
        <div className="output-area">
          {output ? JSON.stringify(output, null, 2) : '// Waiting for action...'}
        </div>
      </div>
    </div>
  );
};

export default AuthSection;
