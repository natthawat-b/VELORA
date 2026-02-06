import React, { useState } from 'react';
import '../styles/Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      shopName: 'ชื่อร้าน',
      productName: 'รายละเอียดสินค้า',
      size: 'M',
      duration: '1 DAY',
      price: 150,
      quantity: 1
    },
    {
      id: 2,
      shopName: 'ชื่อร้าน',
      productName: 'รายละเอียดสินค้า',
      size: 'L',
      duration: '',
      price: 1200,
      quantity: 1
    }
  ]);

  const [selectedItems, setSelectedItems] = useState([]);

  const updateQuantity = (id, delta) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <button className="back-button">&lt;</button>
        <h1>รถเข็ญ ({cartItems.length})</h1>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItems([...selectedItems, item.id]);
                  } else {
                    setSelectedItems(selectedItems.filter(id => id !== item.id));
                  }
                }}
              />
              
              <div className="item-image">
                <img src={`/images/cart-item${item.id}.jpg`} alt={item.productName} />
              </div>

              <div className="item-details">
                <div className="item-header">
                  <h3>{item.shopName}</h3>
                  <button 
                    className="btn-remove"
                    onClick={() => removeItem(item.id)}
                  >
                    ลบ
                  </button>
                </div>
                
                <p className="item-name">{item.productName}</p>
                <p className="item-variant">{item.size}{item.duration && `, ${item.duration}`}</p>
                
                <div className="item-footer">
                  <p className="item-price">฿{item.price}</p>
                  
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>ชำระเงิน ({selectedItems.length})</h2>
          
          <div className="shipping-option">
            <h3>ส่งปกติ</h3>
            <p>ระยะเวลาในการจัดส่ง 2-3 วัน</p>
            <p className="shipping-price">฿ XX</p>
          </div>

          <div className="summary-details">
            <div className="summary-row">
              <span>ค่าสินค้า</span>
              <span>฿ {calculateTotal()}</span>
            </div>
            <div className="summary-row">
              <span>ค่าจัดส่ง</span>
              <span>฿ XXX</span>
            </div>
            <div className="summary-row">
              <span>ค่าประกัน</span>
              <span>฿ XXX</span>
            </div>
            <div className="summary-row total">
              <span>ทั้งหมด</span>
              <span>฿ XXX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;