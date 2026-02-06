import React, { useState } from 'react';
import '../styles/Checkout.css';

function Checkout() {
  const [formData, setFormData] = useState({
    address: '',
    addressDetail: '',
    phone: '(+66) 00-000-000',
    shippingMethod: 'standard',
    insurance: false,
    paymentMethod: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Order submitted:', formData);
  };

  return (
    <div className="checkout-container">
      <button className="back-button">&lt;</button>
      <h1>สั่งซื้อสินค้า</h1>

      <form onSubmit={handleSubmit}>
        <section className="address-section">
          <h2>ที่อยู่</h2>
          <p className="address-display">{formData.address || 'รายละเอียดที่อยู่'}</p>
          
          <div className="form-group">
            <label>เบอร์ติดต่อ</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="shipping-section">
          <h2>ตัวเลือกการจัดส่ง</h2>
          
          <div className="shipping-options">
            <label className="shipping-option">
              <input
                type="radio"
                name="shippingMethod"
                value="standard"
                checked={formData.shippingMethod === 'standard'}
                onChange={handleChange}
              />
              <div className="option-details">
                <h3>ส่งปกติ</h3>
                <p>ระยะเวลาในการจัดส่ง 2-3 วัน</p>
                <p className="price">฿ XX</p>
              </div>
            </label>

            <label className="shipping-option">
              <input
                type="radio"
                name="shippingMethod"
                value="express"
                checked={formData.shippingMethod === 'express'}
                onChange={handleChange}
              />
              <div className="option-details">
                <h3>ส่งเร็ว</h3>
                <p>ระยะเวลาในการจัดส่ง 1-2 วัน</p>
                <p className="price">฿ XX</p>
              </div>
            </label>
          </div>
        </section>

        <section className="insurance-section">
          <h2>ประกันสินค้า</h2>
          <label className="insurance-option">
            <input
              type="checkbox"
              name="insurance"
              checked={formData.insurance}
              onChange={handleChange}
            />
            <div className="option-details">
              <p>ประกันความปลอดภัยของสินค้า หากไอเราจะไบดชอบความเยหายระหางขนง</p>
              <p className="price">฿ XX</p>
            </div>
          </label>
        </section>

        <section className="payment-section">
          <h2>เพิ่มวิธีการชำระเงิน</h2>
          
          <div className="form-group">
            <label>ชำระเงินโดย</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="">เลือกวิธีการชำระเงิน</option>
              <option value="cash">เงินสด</option>
              <option value="bank">โอนผ่านธนาคาร</option>
              <option value="card">บัตรเครดิต/เดบิต</option>
            </select>
          </div>
        </section>

        <div className="order-summary">
          <div className="summary-row">
            <span>รวมยอดสั่งซื้อ</span>
            <span className="total">฿ XXX</span>
          </div>

          <button type="submit" className="btn-primary btn-submit">
            ยืนยันการสั่งซื้อ
          </button>
        </div>
      </form>
    </div>
  );
}

export default Checkout;