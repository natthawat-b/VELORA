import React, { useState } from 'react';
import './CartPage.css';
import { FiChevronLeft, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

function CartPage() {
  // ข้อมูลจำลองสินค้าในตะกร้า
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      shopName: 'ชื่อร้าน A',
      productName: 'รายละเอียดสินค้า A',
      img: '', // URL รูปภาพ
      options: 'M, 1 DAY',
      price: 150,
      quantity: 1,
    },
    {
      id: 2,
      shopName: 'ชื่อร้าน B',
      productName: 'รายละเอียดสินค้า B',
      img: '', // URL รูปภาพ
      options: 'L',
      price: 1200,
      quantity: 1,
    },
    {
      id: 3,
      shopName: 'ชื่อร้าน A',
      productName: 'รายละเอียดสินค้า C',
      img: '', // URL รูปภาพ
      options: 'S, 3 DAYS',
      price: 450,
      quantity: 2,
    },
  ]);

  // คำนวณราคารวม
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 50; // ค่าส่งสมมติ
  const total = subtotal + shipping;

  // ฟังก์ชันลบสินค้า (จำลอง)
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // ฟังก์ชันเพิ่ม/ลดจำนวน
  const updateQuantity = (id, change) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  return (
    <div className="cart-page-container">
      {/* Header */}
      <header className="cart-header">
        <div className="header-inner">
          <div className="header-left">
            <button className="btn-back"><FiChevronLeft /></button>
            <h1 className="page-title">รถเข็น ({cartItems.length})</h1>
          </div>
          <div className="brand-logo">VELORA</div>
        </div>
      </header>

      <main className="cart-content">
        <div className="cart-layout">
          
          {/* Left Column: Cart Items */}
          <section className="cart-items-section">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <FiShoppingBag className="empty-icon" />
                <p>ไม่มีสินค้าในตะกร้า</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="cart-card">
                  
                  {/* Shop Header inside card */}
                  <div className="card-shop-header">
                    <span className="shop-name">{item.shopName} &gt;</span>
                    <button className="btn-delete" onClick={() => removeItem(item.id)}>
                      ลบ <FiTrash2 />
                    </button>
                  </div>

                  <div className="card-body">
                    {/* Checkbox (Optional) */}
                    <div className="checkbox-wrapper">
                      <input type="checkbox" defaultChecked />
                    </div>

                    {/* Product Image */}
                    <div className="product-img-box">
                      {/* CSS Art Background */}
                      <div className="img-placeholder-content"></div>
                    </div>

                    {/* Product Details */}
                    <div className="product-details">
                      <h3 className="product-title">{item.productName}</h3>
                      <div className="product-options">
                        <span className="option-pill">{item.options}</span>
                      </div>
                      <div className="product-price">฿ {item.price.toLocaleString()}</div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="quantity-controls">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}><FiMinus /></button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}><FiPlus /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Right Column: Order Summary */}
          <aside className="order-summary-section">
            <div className="summary-card">
              <h2 className="summary-title">สรุปคำสั่งซื้อ</h2>
              
              <div className="summary-row">
                <span>ยอดรวมสินค้า</span>
                <span>฿ {subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>ค่าจัดส่ง</span>
                <span>฿ {shipping.toLocaleString()}</span>
              </div>
              
              <div className="divider"></div>
              
              <div className="summary-row total">
                <span>ยอดรวมสุทธิ</span>
                <span className="total-price">฿ {total.toLocaleString()}</span>
              </div>

              <button className="btn-checkout">
                ชำระเงิน ({cartItems.length})
              </button>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}

export default CartPage;