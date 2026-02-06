import React from 'react';
import '../styles/ProductCard.css';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image || '/images/placeholder.jpg'} alt={product.name} />
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-footer">
          <div className="price-info">
            <p className="price">฿ {product.price}</p>
            {product.rentalPrice && product.rentalPerDay && (
              <p className="rental-price">เช่า: {product.rentalPrice}/วัน</p>
            )}
          </div>
          
          {product.rating && (
            <div className="rating">
              <span className="star">⭐</span>
              <span>{product.rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;