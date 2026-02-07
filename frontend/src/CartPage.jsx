import React from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/CartPage.css';
import { FiChevronLeft, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from './context/CartContext.jsx';

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, updateItemType, cartTotal } = useCart();

  // คำนวณราคารวม
  const subtotal = cartTotal;
  const shipping = cartItems.length > 0 ? 50 : 0; // ค่าส่งสมมติ
  const total = subtotal + shipping;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    navigate('/checkout', {
      state: {
        cartItems: cartItems,
        source: 'cart',
        totalPrice: total
      }
    });
  };

  return (
    <div className="cart-page-container">
      {/* Header */}
      <header className="cart-header">
        <div className="header-inner">
          <div className="header-left">
            <button className="btn-back" onClick={handleGoBack}><FiChevronLeft /></button>
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
                    <button className="btn-delete" onClick={() => removeFromCart(item.id)}>
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
                      {item.productPhoto ? (
                        <img src={item.productPhoto} alt={item.productName} className="cart-product-img" />
                      ) : (
                        <div className="img-placeholder-content"></div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="product-details">
                      <h3 className="product-title">{item.productName}</h3>
                      <div className="product-price-row">
                         <div className="product-price">฿ {item.productPrice?.toLocaleString()}</div>
                      </div>
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
              
              {/* Item Options Section */}
              <div className="cart-options-section">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-option-item">
                    <div className="option-item-name">{item.productName}</div>
                    <div className="option-radio-group">
                      <label className={`radio-label ${item.type === 'buy' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name={`type-${item.id}`}
                          value="buy"
                          checked={item.type === 'buy'}
                          onChange={() => updateItemType(item.id, 'buy')}
                        />
                        ซื้อ
                      </label>
                      <label className={`radio-label ${item.type === 'rent' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name={`type-${item.id}`}
                          value="rent"
                          checked={item.type === 'rent'}
                          onChange={() => updateItemType(item.id, 'rent')}
                        />
                        เช่า
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="divider"></div>

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

              <button className="btn-checkout" onClick={handleCheckout}>
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