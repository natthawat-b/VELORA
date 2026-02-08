import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiSearch, FiShoppingCart } from 'react-icons/fi';
import './assets/SearchPage.css';
import { useCart } from './context/CartContext.jsx';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const performSearch = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await axios.post(`${apiUrl}/api/product/search`, {
        productname: searchTerm
      });
      if (response.data.success) {
        setSearchResults(response.data.payload);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, performSearch]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="search-page-container">
      <header className="search-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowLeft />
        </button>
        <form 
          className="search-bar-wrapper" 
          onSubmit={(e) => {
            e.preventDefault();
            performSearch();
          }}
        >
          <button type="submit" style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
            <FiSearch className="search-icon" />
          </button>
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </form>
        <div className="cart-wrapper" onClick={() => navigate('/cart')}>
            <FiShoppingCart className="icon-cart" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
      </header>

      <main className="search-results">
        {loading ? (
          <div className="loading">กำลังค้นหา...</div>
        ) : searchResults.length > 0 ? (
          <div className="search-product-grid">
            {searchResults.map((item) => (
              <div 
                key={item._id} 
                className="search-product-card"
                onClick={() => handleProductClick(item._id)}
              >
                <div className="search-product-img-holder">
                  {item.productphoto ? <img src={item.productphoto} alt={item.productname} className="search-product-img" /> : null}
                </div>
                <div className="search-product-info">
                  <p className="search-p-category">{item.productstyle || 'Category'}</p>
                  <h3 className="search-p-title">{item.productname}</h3>
                  <div className="search-p-footer">
                    <span className="search-p-price">฿ {item.productPrice?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          searchTerm && <div className="no-results">ไม่พบสินค้า "{searchTerm}"</div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
