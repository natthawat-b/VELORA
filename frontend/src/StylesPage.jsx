import React from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/StylesPage.css';
import { FiChevronLeft, FiSearch } from 'react-icons/fi';

function StylesPage() {
  const navigate = useNavigate();
  const styles = [
    { name: 'Streetwear', img: '🧥' },
    { name: 'Minimalist', img: '🌿' },
    { name: 'y2k', img: '🦋' },
    { name: 'Coquette', img: '🎀' },
    { name: 'Old Money', img: '🏛️' },
    { name: 'Hip-hop', img: '🎤' },
    { name: 'gothic', img: '🖤' },
    { name: 'BoHemaian', img: '🏕️' },
    // เพิ่มข้อมูลจำลองเพื่อให้เห็นผลลัพธ์ตอนเต็มจอชัดขึ้น
    { name: 'Vintage', img: '📻' },
    { name: 'Casual', img: '👕' },
    { name: 'Formal', img: '👔' },
    { name: 'Sporty', img: '👟' },
  ];

  return (
    <div className="styles-container">
      {/* Header เต็มความกว้าง */}
      <header className="styles-header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FiChevronLeft />
          </button>
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="ค้นหาสไตล์..." 
              className="search-input" 
            />
          </div>
        </div>
      </header>

      {/* Main Content เต็มความกว้าง */}
      <main className="styles-main">
        <h2 className="trending-title">Trending Styles</h2>
        
        <div className="styles-grid">
          {styles.map((style, index) => (
            <div key={index} className="style-card" onClick={() => navigate(`/style/${style.name}`)} style={{ cursor: 'pointer' }}>
              <div className="style-image-box">
                {/* ใช้ Emoji แทนรูปภาพชั่วคราว ใส่ <img> จริงได้ที่นี่ */}
                <span className="placeholder-icon">{style.img}</span>
              </div>
              <p className="style-name">{style.name}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default StylesPage;