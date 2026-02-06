import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/StyleBrowser.css';

function StyleBrowser() {
  const [selectedStyle, setSelectedStyle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const styles = [
    'Minimalist',
    'Y2K',
    'Hip-hop',
    'Gothic',
    'Bohemian',
    'Coquette',
    'Streetwear',
    'Old Money'
  ];

  const products = [
    {
      id: 1,
      name: 'ชื่อสินค้า',
      description: 'รายละเอียดสินค้า',
      price: 'XXXX',
      rentalPrice: 'xxx',
      rating: 4.9
    },
    // Add more products
  ];

  return (
    <div className="style-browser-container">
      <button className="back-button">&lt;</button>
      
      <div className="search-section">
        <input
          type="text"
          placeholder="ค้นหาสไตล์..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <section className="trending-styles">
        <h2>Trending Styles</h2>
        <div className="styles-grid">
          {styles.map((style, index) => (
            <button
              key={index}
              className={`style-button ${selectedStyle === style ? 'active' : ''}`}
              onClick={() => setSelectedStyle(style)}
            >
              <div className="style-icon">
                {/* Add style icon/image */}
              </div>
              <span>{style}</span>
            </button>
          ))}
        </div>
      </section>

      {selectedStyle && (
        <section className="selected-style-section">
          <button className="back-button">&lt;</button>
          <h2>สไตล์ที่เลือก: {selectedStyle}</h2>
          
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default StyleBrowser;