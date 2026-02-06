import React, { useState } from 'react';
import { getStoreInfo, getStoreProducts } from '../../function';

const StoreSection = () => {
  const [output, setOutput] = useState(null);
  const [storeId, setStoreId] = useState('');

  const handleGetInfo = async () => {
     if (!storeId) { setOutput('Enter Store ID'); return; }
     setOutput(`Fetching info for store ${storeId}...`);
     const result = await getStoreInfo(storeId);
     setOutput(result);
  };

  const handleGetProducts = async () => {
    if (!storeId) { setOutput('Enter Store ID'); return; }
    setOutput(`Fetching products for store ${storeId}...`);
    const result = await getStoreProducts(storeId);
    setOutput(result);
 };

  return (
    <div className="section-container">
      <div className="card">
        <h3>Store Operations</h3>
        <div className="form-group">
            <label>Store ID</label>
            <input 
                value={storeId} 
                onChange={(e) => setStoreId(e.target.value)} 
                placeholder="Store ID"
            />
        </div>
        <button className="btn-secondary" onClick={handleGetInfo}>Get Info</button>
        <button className="btn-secondary" onClick={handleGetProducts}>Get Products</button>
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

export default StoreSection;
