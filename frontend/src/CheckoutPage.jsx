import React, { useState } from 'react';
import './CheckoutPage.css';
import { FiChevronLeft, FiMapPin, FiPhone, FiTruck, FiShield, FiChevronRight, FiCreditCard, FiBox } from 'react-icons/fi';

function CheckoutPage() {
  // State สำหรับตัวเลือกต่างๆ
  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' or 'fast'
  const [hasInsurance, setHasInsurance] = useState(false);

  // ข้อมูลจำลอง (Mock Data)
  const productPrice = 8150;
  const standardShippingCost = 50;
  const fastShippingCost = 100;
  const insuranceCost = 200;

  // คำนวณยอดรวม
  const currentShippingCost = shippingMethod === 'standard' ? standardShippingCost : fastShippingCost;
  const currentInsuranceCost = hasInsurance ? insuranceCost : 0;
  const total = productPrice + currentShippingCost + currentInsuranceCost;

  return (
    <div className="checkout-container">
      {/* --- Header --- */}
      <header className="checkout-navbar">
        <div className="nav-inner">
          <button className="btn-back">
            <FiChevronLeft /> ย้อนกลับ
          </button>
          <h1 className="page-title">สั่งซื้อสินค้า</h1>
        </div>
      </header>

      <main className="checkout-content">
        <div className="checkout-grid">
          
          {/* --- Left Column: Details --- */}
          <div className="checkout-details">
            
            {/* 1. Address Section */}
            <section className="info-card">
              <h3 className="card-title">ที่อยู่จัดส่ง</h3>
              <div className="info-row">
                <div className="info-icon"><FiMapPin /></div>
                <div className="info-text">
                  <p className="main-text">รายละเอียดที่อยู่ (บ้านเลขที่, ถนน, แขวง/เขต, จังหวัด...)</p>
                </div>
                <FiChevronRight className="arrow-icon" />
              </div>
              <div className="divider"></div>
              <div className="info-row">
                <div className="info-icon"><FiPhone /></div>
                <div className="info-text">
                  <p className="main-text">(+66) 081-234-5678</p>
                </div>
                <FiChevronRight className="arrow-icon" />
              </div>
            </section>

            {/* 2. Shipping Options */}
            <section className="info-card">
              <h3 className="card-title">ตัวเลือกการจัดส่ง</h3>
              
              <div 
                className={`option-box ${shippingMethod === 'standard' ? 'selected' : ''}`}
                onClick={() => setShippingMethod('standard')}
              >
                <div className="option-icon"><FiTruck /></div>
                <div className="option-details">
                  <span className="option-name">ส่งปกติ</span>
                  <span className="option-desc">ระยะเวลา 2-3 วัน</span>
                </div>
                <span className="option-price">฿ {standardShippingCost}</span>
              </div>

              <div 
                className={`option-box ${shippingMethod === 'fast' ? 'selected' : ''}`}
                onClick={() => setShippingMethod('fast')}
              >
                <div className="option-icon fast"><FiTruck /></div>
                <div className="option-details">
                  <span className="option-name">ส่งเร็ว</span>
                  <span className="option-desc">ระยะเวลา 1-2 วัน</span>
                </div>
                <span className="option-price">฿ {fastShippingCost}</span>
              </div>
            </section>

            {/* 3. Insurance */}
            <section className="info-card">
              <h3 className="card-title">ประกันสินค้า</h3>
              <div 
                className={`option-box ${hasInsurance ? 'selected-gold' : ''}`}
                onClick={() => setHasInsurance(!hasInsurance)}
              >
                <div className="option-icon"><FiShield /></div>
                <div className="option-details">
                  <span className="option-name">ประกันสินค้า</span>
                  <span className="option-desc">คุ้มครองความเสียหายระหว่างขนส่ง</span>
                </div>
                <span className="option-price">฿ {insuranceCost}</span>
              </div>
            </section>

            {/* 4. Product List */}
            <section className="info-card product-section">
              <h3 className="card-title">รายการจัดส่งสินค้า</h3>
              <div className="checkout-shop-header">ชื่อร้านค้า &gt;</div>
              
              <div className="checkout-product-item">
                <div className="checkout-img-box">
                  <div className="art-sky"></div>
                </div>
                <div className="checkout-item-details">
                  <h4 className="item-name">รายละเอียดสินค้า</h4>
                  <div className="item-variant">Size: M</div>
                  <div className="item-price-qty">
                    <span className="price">฿ {productPrice.toLocaleString()}</span>
                    <span className="qty">x 1</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Payment Method */}
            <section className="info-card">
              <h3 className="card-title">ชำระเงินโดย</h3>
              <div className="info-row">
                <div className="info-icon"><FiCreditCard /></div>
                <div className="info-text">
                  <p className="main-text">เพิ่มวิธีการชำระเงิน</p>
                </div>
                <FiChevronRight className="arrow-icon" />
              </div>
            </section>
          </div>

          {/* --- Right Column: Order Summary (Sticky) --- */}
          <aside className="checkout-summary">
            <div className="summary-box">
              <h2 className="summary-header">สรุปยอดสั่งซื้อ</h2>
              
              <div className="summary-line">
                <span>ค่าสินค้า</span>
                <span>฿ {productPrice.toLocaleString()}</span>
              </div>
              <div className="summary-line">
                <span>ค่าจัดส่ง ({shippingMethod === 'standard' ? 'ปกติ' : 'เร็ว'})</span>
                <span>฿ {currentShippingCost}</span>
              </div>
              <div className="summary-line">
                <span>ค่าประกัน</span>
                <span>฿ {currentInsuranceCost}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>ยอดรวมสุทธิ</span>
                <span className="gold-text">฿ {total.toLocaleString()}</span>
              </div>

              <button className="btn-place-order">
                ยืนยันการสั่งซื้อ
              </button>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}

export default CheckoutPage;