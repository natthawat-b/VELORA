import React from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/CartPage.css';
import './assets/SharedNavbar.css';
import { FiChevronLeft, FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiShoppingCart } from 'react-icons/fi';
import { useCart } from './context/CartContext.jsx';

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, setQuantity, updateItemType, updateRentalDates, toggleDateMode, updateRentalDuration, toggleSelection, cartTotal } = useCart();

  // คำนวณราคารวม
  const subtotal = cartTotal;
  // คำนวณค่าจัดส่งตามจำนวนชิ้น (เฉพาะที่เลือก)
  const selectedItems = cartItems.filter(i => i.isSelected !== false);
  const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = selectedItems.length === 0 ? 0 
    : subtotal >= 5000 ? 0  // ฟรีค่าส่งเมื่อซื้อครบ 5,000 บาท
    : 30 + (totalQuantity * 20); // ฐาน 30 + 20 บาท/ชิ้น
  const total = subtotal + shipping;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleCheckout = () => {
    const selectedItems = cartItems.filter(item => item.isSelected !== false);
    if (selectedItems.length === 0) return;
    
    navigate('/checkout', {
      state: {
        cartItems: selectedItems,
        source: 'cart',
        totalPrice: total
      }
    });
  };

  return (
    <div className="cart-page-container">
      {/* Header */}
      <header className="velora-navbar">
        <div className="nav-content">
          <button className="nav-back-btn" onClick={handleGoBack}><FiChevronLeft /></button>
          <h1 className="nav-title">รถเข็น ({cartItems.length})</h1>
          <div className="nav-icons">
            <div className="cart-icon-wrapper" onClick={() => navigate('/cart')}>
              <FiShoppingCart className="nav-icon" />
            </div>
          </div>
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
                    {/* Checkbox (Select Item) */}
                    <div className="checkbox-wrapper">
                      <input 
                        type="checkbox" 
                        checked={item.isSelected !== false}
                        onChange={() => toggleSelection && toggleSelection(item.id)}
                        title="Select item for checkout"
                      />
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

                    {/* Quantity & Rental Days Controls */}
                    <div className="quantity-controls-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div className="quantity-controls">
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}><FiMinus /></button>
                        <input 
                          type="number" 
                          className="qty-value qty-input"
                          value={item.quantity}
                          min={1}
                          max={item.maxStock || 99}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) setQuantity(item.id, val);
                          }}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value);
                            if (isNaN(val) || val < 1) setQuantity(item.id, 1);
                          }}
                          style={{ width: '45px', textAlign: 'center', border: '1px solid #eee', borderRadius: '6px', padding: '4px 2px', fontSize: '14px', fontWeight: '600' }}
                        />
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)} disabled={item.quantity >= (item.maxStock || 99)}><FiPlus /></button>
                      </div>
                      <span style={{ fontSize: '12px', color: '#999' }}>คงเหลือ {item.maxStock || 99} ชิ้น</span>

                      {/* Rental Date Range Selector */}
                      {item.type === 'rent' && (
                        <div className="rental-dates-control">
                          
                          {item.isDateSpecific !== false ? (
                            // Date Specific Mode
                            <>
                              <div className="rental-date-row">
                                <div className="rental-input-group">
                                  <label className="rental-label">วันที่เริ่มเช่า:</label>
                                  <input 
                                    type="date"
                                    className="rental-date-input"
                                    value={item.rentalStartDate || ''}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => updateRentalDates(item.id, e.target.value, item.rentalEndDate)}
                                  />
                                </div>
                                <div className="rental-input-group">
                                  <label className="rental-label">ถึงวันที่:</label>
                                  <input 
                                    type="date"
                                    className="rental-date-input"
                                    value={item.rentalEndDate || ''}
                                    min={item.rentalStartDate ? new Date(new Date(item.rentalStartDate).getTime() + 86400000).toISOString().split('T')[0] : ''}
                                    onChange={(e) => updateRentalDates(item.id, item.rentalStartDate, e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="rental-summary-box">
                                <span>จำนวนวัน:</span>
                                <span className="rental-days-highlight">{item.rentalDays || 1}</span>
                                <span>วัน</span>
                              </div>
                            </>
                          ) : (
                            // Duration Only Mode
                            <div className="rental-duration-row">
                                <span style={{ fontSize: '0.9rem', color: '#333' }}>จำนวนวันที่เช่า:</span>
                                <div className="quantity-controls" style={{ transform: 'scale(0.9)' }}>
                                  <button className="qty-btn" onClick={() => updateRentalDuration(item.id, (item.rentalDays || 1) - 1)}><FiMinus /></button>
                                  <span className="qty-value">{item.rentalDays || 1}</span>
                                  <button className="qty-btn" onClick={() => updateRentalDuration(item.id, (item.rentalDays || 1) + 1)}><FiPlus /></button>
                                </div>
                                <span style={{ fontSize: '0.9rem', color: '#333' }}>วัน</span>
                            </div>
                          )}
                        </div>
                      )}
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
                {cartItems.filter(item => item.isSelected !== false).map((item) => (
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
                <span>ค่าจัดส่ง ({totalQuantity} ชิ้น)</span>
                <span>{shipping === 0 && subtotal >= 5000 ? <span style={{color: '#4CAF50', fontWeight: 600}}>ฟรี!</span> : `฿ ${shipping.toLocaleString()}`}</span>
              </div>
              {subtotal > 0 && subtotal < 5000 && (
                <div style={{ fontSize: '12px', color: '#d4af37', textAlign: 'right', marginTop: '-5px' }}>
                  ซื้อเพิ่มอีก ฿{(5000 - subtotal).toLocaleString()} ฟรีค่าส่ง!
                </div>
              )}
              
              <div className="divider"></div>
              
              <div className="summary-row total">
                <span>ยอดรวมสุทธิ</span>
                <span className="total-price">฿ {total.toLocaleString()}</span>
              </div>

              <button className="btn-checkout" onClick={handleCheckout} disabled={cartItems.filter(i => i.isSelected !== false).length === 0}>
                ชำระเงิน ({cartItems.filter(i => i.isSelected !== false).length})
              </button>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}

export default CartPage;