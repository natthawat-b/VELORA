import React from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/Home.css';

function Home() {
  // Sample product data
  const trendingProducts = [
    {
      id: 1,
      name: 'ชื่อสินค้า',
      description: 'รายละเอียดสินค้า',
      price: 2000,
      rentalPrice: 800,
      rentalPerDay: true,
      rating: 4.9,
      image: '/images/product1.jpg'
    },
    {
      id: 2,
      name: 'ชื่อสินค้า',
      description: 'รายละเอียดสินค้า',
      price: 'XXXX',
      rentalPrice: 'xxx',
      rentalPerDay: true,
      rating: 4.9,
      image: '/images/product2.jpg'
    },
    // Add more products as needed
  ];

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="logo">VELORA</h1>
        <nav className="nav-menu">
          <input type="text" placeholder="ค้นหา..." className="search-bar" />
          <div className="nav-icons">
            <span>🛒</span>
            <span>👤</span>
          </div>
        </nav>
      </header>

      <section className="trending-section">
        <h2>มาแรง</h2>
        <div className="featured-product">
          <div className="featured-image">
            <img src="/images/featured.jpg" alt="Featured Product" />
          </div>
          <div className="featured-details">
            <h3>ชื่อสินค้า</h3>
            <p className="price">฿ 2,000</p>
            <p className="price-label">ราคาขาย</p>
            <p className="rental-price">฿ 800</p>
            <p className="rental-label">ราคาเช่าต่อวัน</p>
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="products-grid">
          {trendingProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;