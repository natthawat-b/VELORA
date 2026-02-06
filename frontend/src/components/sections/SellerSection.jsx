import React, { useState } from 'react';
import { addNewProduct, requestWithdrawal } from '../../function';

const SellerSection = () => {
  const [output, setOutput] = useState(null);
  const [sellerId, setSellerId] = useState('');
  const [productData, setProductData] = useState({ name: '', price: '', stock: '' });
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const handleAddProduct = async () => {
    if (!sellerId) { setOutput('Enter Seller ID'); return; }
    setOutput('Adding product...');
    const result = await addNewProduct(sellerId, productData);
    setOutput(result);
  };

  const handleWithdraw = async () => {
    if (!sellerId) { setOutput('Enter Seller ID'); return; }
    setOutput('Requesting withdrawal...');
    const result = await requestWithdrawal(sellerId, withdrawAmount);
    setOutput(result);
  };

  return (
    <div className="section-container">
      <div className="card">
        <h3>Add New Product</h3>
        <div className="form-group">
            <label>Seller ID</label>
            <input value={sellerId} onChange={e => setSellerId(e.target.value)} />
        </div>
        <div className="form-group">
            <label>Product Name</label>
            <input value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} />
        </div>
        <div className="form-group">
            <label>Price</label>
            <input value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} />
        </div>
        <button className="btn-primary" onClick={handleAddProduct}>Add Product</button>
      </div>

      <div className="card">
        <h3>Finance</h3>
        <div className="form-group">
            <label>Withdraw Amount</label>
            <input value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} type="number" />
        </div>
        <button className="btn-secondary" onClick={handleWithdraw}>Request Withdraw</button>
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

export default SellerSection;
