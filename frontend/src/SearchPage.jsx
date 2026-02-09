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
  const [selectedStyle, setSelectedStyle] = useState('ทั้งหมด');
  const navigate = useNavigate();
  const { cartCount } = useCart();

  // Available styles
  const styles = ['ทั้งหมด', 'Streetwear', 'Minimalist', 'Vintage', 'Formal', 'Sporty'];

  const performSearch = useCallback(async () => {
    setLoading(true);
    try {
      // If "ทั้งหมด" is selected and no search term, fetch all products
      if (selectedStyle === 'ทั้งหมด' && !searchTerm) {
        const response = await axios.get('https://velora-x8m0.onrender.com/api/product');
        if (response.data.success) {
          setSearchResults(response.data.payload);
        } else {
          setSearchResults([]);
        }
      } else {
        // Build search query
        let searchQuery = searchTerm;
        
        // If a specific style is selected, add it to search query
        if (selectedStyle !== 'ทั้งหมด') {
          searchQuery = searchTerm || selectedStyle;
        }

        const response = await axios.post('https://velora-x8m0.onrender.com/api/product/search', {
          productname: searchQuery
        });
        
        if (response.data.success) {
          let results = response.data.payload;
          
          // If specific style selected, filter results by style
          if (selectedStyle !== 'ทั้งหมด') {
            results = results.filter(product => 
              product.productstyle === selectedStyle
            );
          }
          
          setSearchResults(results);
        } else {
          setSearchResults([]);
        }
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedStyle]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedStyle, performSearch]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleStyleClick = (style) => {
    setSelectedStyle(style);
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
            placeholder="ค้นหาสไตล์สินค้า..."
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

      {/* Style Filter Chips */}
      <div className="filter-section">
        <div className="filter-chips">
          {styles.map((style) => (
            <button
              key={style}
              className={`filter-chip ${selectedStyle === style ? 'active' : ''}`}
              onClick={() => handleStyleClick(style)}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

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
                    <span className="search-p-rating">★ 4.9</span>
                  </div>
                  <p className="search-p-rent">เช่า: {Math.round(item.productPrice * 0.1)}/วัน</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            {searchTerm || selectedStyle !== 'ทั้งหมด' 
              ? `ไม่พบสินค้า ${searchTerm ? `"${searchTerm}"` : ''} ${selectedStyle !== 'ทั้งหมด' ? `ในหมวด ${selectedStyle}` : ''}`
              : 'ไม่มีสินค้า'
            }
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
