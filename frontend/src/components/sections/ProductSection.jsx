import React, { useState } from 'react';
import { getRecommendedProducts, filterProductsByStyle, getProductDetails } from '../../function';

const ProductSection = () => {
  const [output, setOutput] = useState(null);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [filterStyle, setFilterStyle] = useState('All');

  const handleGetRecommended = async () => {
    setOutput('Fetching recommended products...');
    const result = await getRecommendedProducts();
    setProducts(Array.isArray(result) ? result : []);
    setOutput(result);
  };

  const handleFilter = () => {
    // Note: In a real app this would filter the *current* list or fetch filtered.
    // The function signature implies client-side filter of a list.
    const result = filterProductsByStyle(products, filterStyle);
    setOutput(result);
  };

  const handleGetDetails = async () => {
    if (!productId) {
        setOutput('Please enter a Product ID');
        return;
    }
    setOutput(`Fetching details for ${productId}...`);
    const result = await getProductDetails(productId);
    setOutput(result);
  };

  return (
    <div className="section-container">
      <div className="card">
        <h3>Recommended Products</h3>
        <button className="btn-primary" onClick={handleGetRecommended}>Get Recommended</button>
      </div>

      <div className="card">
        <h3>Filter Products</h3>
        <p style={{fontSize: '0.8rem', color: '#aaa', marginBottom: '10px'}}>
             Filters the list fetched from "Get Recommended"
        </p>
        <div className="form-group">
            <label>Style</label>
            <select value={filterStyle} onChange={(e) => setFilterStyle(e.target.value)}>
                <option value="All">All</option>
                <option value="Streetwear">Streetwear</option>
                <option value="Y2K">Y2K</option>
                <option value="Old Money">Old Money</option>
                <option value="Minimalist">Minimalist</option>
            </select>
        </div>
        <button className="btn-primary" onClick={handleFilter}>Apply Filter</button>
      </div>

      <div className="card">
        <h3>Product Details</h3>
        <div className="form-group">
            <label>Product ID</label>
            <input 
                value={productId} 
                onChange={(e) => setProductId(e.target.value)} 
                placeholder="Product ID"
            />
        </div>
        <button className="btn-primary" onClick={handleGetDetails}>Get Details</button>
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

export default ProductSection;
