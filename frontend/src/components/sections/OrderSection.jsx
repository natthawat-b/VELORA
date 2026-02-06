import React, { useState } from 'react';
import { getOrderStatus } from '../../function';

const OrderSection = () => {
  const [output, setOutput] = useState(null);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('buyer');

  const handleGetStatus = async () => {
    if (!userId) { setOutput('Enter User ID'); return; }
    setOutput(`Fetching orders for ${userId} as ${role}...`);
    const result = await getOrderStatus(userId, role);
    setOutput(result);
  };

  return (
    <div className="section-container">
      <div className="card">
        <h3>Track Orders</h3>
        <div className="form-group">
            <label>User ID</label>
            <input value={userId} onChange={e => setUserId(e.target.value)} />
        </div>
        <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
            </select>
        </div>
        <button className="btn-primary" onClick={handleGetStatus}>Check Status</button>
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

export default OrderSection;
