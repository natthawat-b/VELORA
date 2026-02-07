import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './assets/Checkout.css';

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState(location.state?.selectedItems || []);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [insurance, setInsurance] = useState(false);
  
  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // New Address Form State
  const [newAddress, setNewAddress] = useState({
    phone: '',
    province: '',
    district: '',
    subDistrict: '',
    postalCode: '',
    addressDetail: ''
  });

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedBank, setSelectedBank] = useState('');
  const [bankAccountNumber, _setBankAccountNumber] = useState('');

  // Available banks
  const banks = [
    { id: 'kbank', name: 'ธนาคารกสิกรไทย', color: '#138f2d' },
    { id: 'scb', name: 'ธนาคารไทยพาณิชย์', color: '#4e2a82' },
    { id: 'bbl', name: 'ธนาคารกรุงเทพ', color: '#1e4598' },
    { id: 'ktb', name: 'ธนาคารกรุงไทย', color: '#1ba5e0' },
    { id: 'bay', name: 'ธนาคารกรุงศรีอยุธยา', color: '#fec43b' },
    { id: 'tmb', name: 'ธนาคารทหารไทยธนชาต', color: '#1279be' }
  ];

  // Load saved addresses from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const addresses = JSON.parse(localStorage.getItem(`addresses_${userData._id}`)) || [];
      setSavedAddresses(addresses);
      if (addresses.length > 0) {
        setSelectedAddress(addresses[0]);
      }
    }
  }, []);

  // Handle Buy Now from Product Detail
  useEffect(() => {
    if (location.state?.buyNow && location.state?.product) {
      const { product, size, mode, rentalDays, totalPrice } = location.state;
      setItems([{
        productId: product,
        quantity: 1,
        size: size || 'M',
        rentalDays: mode === 'rent' ? rentalDays : null
      }]);
    }
  }, [location.state]);

  // Save new address
  const handleSaveAddress = () => {
    if (!newAddress.phone || !newAddress.province || !newAddress.district || 
        !newAddress.subDistrict || !newAddress.postalCode || !newAddress.addressDetail) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const newAddressWithId = { ...newAddress, id: Date.now() };
      const updatedAddresses = [...savedAddresses, newAddressWithId];
      localStorage.setItem(`addresses_${userData._id}`, JSON.stringify(updatedAddresses));
      setSavedAddresses(updatedAddresses);
      setSelectedAddress(newAddressWithId);
      setIsAddingNew(false);
      setNewAddress({
        phone: '',
        province: '',
        district: '',
        subDistrict: '',
        postalCode: '',
        addressDetail: ''
      });
    }
  };

  // Delete address
  const handleDeleteAddress = (addressId) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const updatedAddresses = savedAddresses.filter(a => a.id !== addressId);
      localStorage.setItem(`addresses_${userData._id}`, JSON.stringify(updatedAddresses));
      setSavedAddresses(updatedAddresses);
      if (selectedAddress?.id === addressId) {
        setSelectedAddress(updatedAddresses[0] || null);
      }
    }
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => {
    const price = item.rentalDays 
        ? (item.productId.productrentprice || 0) * item.rentalDays
        : (item.productId.productprice || 0);
    return sum + (price * item.quantity);
  }, 0);

  const shippingCost = shippingMethod === 'standard' ? 45 : 80;
  const insuranceCost = insurance ? Math.ceil(subtotal * 0.05) : 0;
  const total = subtotal + shippingCost + insuranceCost;

  return (
    <div className="checkout-container">
      {/* Header */}
      <header className="checkout-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="checkout-title">สั่งซื้อสินค้า</h1>
      </header>

      {/* Address Section */}
      <section className="checkout-section" onClick={() => setShowAddressModal(true)} style={{cursor: 'pointer'}}>
        <div className="section-header">
          <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span className="section-title">ที่อยู่</span>
          <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
        <div className="section-content">
          {selectedAddress ? (
            <div className="address-preview">
              <div>{selectedAddress.phone}</div>
              <div>{selectedAddress.addressDetail}, {selectedAddress.subDistrict}, {selectedAddress.district}, {selectedAddress.province} {selectedAddress.postalCode}</div>
            </div>
          ) : (
            <span style={{color: '#999'}}>คลิกเพื่อเพิ่มที่อยู่</span>
          )}
        </div>
      </section>

      {/* Phone Section */}
      <section className="checkout-section">
        <div className="section-header">
          <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <span className="section-title">เบอร์ติดต่อ</span>
          <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
        <div className="section-content">
          {selectedAddress?.phone || '(+66) 00-000-000'}
        </div>
      </section>

      {/* Shipping Section */}
      <section className="checkout-section">
        <div className="section-header" style={{ marginBottom: '15px' }}>
             <span className="section-title">ตัวเลือกการจัดส่ง</span>
        </div>
        
        <div 
             className={`shipping-option ${shippingMethod === 'standard' ? 'selected' : ''}`}
             onClick={() => setShippingMethod('standard')}
        >
            <div className="shipping-info">
                <div className="shipping-icon">🚚</div>
                <div className="shipping-text">
                    <h4>ส่งปกติ</h4>
                    <p>ระยะเวลาในการจัดส่ง 2-3 วัน</p>
                </div>
            </div>
            <div className="shipping-price">฿ 45</div>
        </div>

        <div 
             className={`shipping-option ${shippingMethod === 'express' ? 'selected' : ''}`}
             onClick={() => setShippingMethod('express')}
        >
            <div className="shipping-info">
                <div className="shipping-icon">🚀</div>
                <div className="shipping-text">
                    <h4>ส่งเร็ว</h4>
                    <p>ระยะเวลาในการจัดส่ง 1-2 วัน</p>
                </div>
            </div>
            <div className="shipping-price">฿ 80</div>
        </div>
      </section>

      {/* Insurance Section */}
      <section className="checkout-section">
         <div className="section-header" style={{ marginBottom: '15px' }}>
             <span className="section-title">ประกันสินค้า</span>
        </div>
        <div className={`insurance-option`} onClick={() => setInsurance(!insurance)} style={{cursor: 'pointer', borderColor: insurance ? '#d4a574' : '#eee'}}>
            <div className="insurance-info">
                <div className="shipping-icon" style={{color: insurance ? '#d4a574' : '#ccc'}}>🛡️</div>
                <div className="insurance-text">
                    <h4>ประกันสินค้า</h4>
                    <p>ประกันความปลอดภัยของสินค้า หากไม่ซื้อเราจะไม่รับผิดชอบความเสียหายระหว่างขนส่ง</p>
                </div>
            </div>
             <div className="shipping-price" style={{color: insurance ? '#d4a574' : '#ccc'}}>฿ {insuranceCost}</div>
        </div>
      </section>

      {/* Order List Section */}
      <section className="checkout-section">
        <div className="section-header" style={{marginBottom: '10px'}}>
            <span className="section-title">รายการจัดส่งสินค้า</span>
        </div>
        <div className="shop-name">ชื่อร้านค้า &gt;</div>
        
        {items.map((item, index) => (
            <div key={index} className="order-item">
                <img 
                    src={item.productId.productphoto || 'https://via.placeholder.com/60'} 
                    alt={item.productId.productname} 
                    className="item-image" 
                />
                <div className="item-details">
                    <div className="item-name">{item.productId.productname}</div>
                    <div className="item-variant">
                         {item.size}
                    </div>
                    {item.rentalDays && <div style={{fontSize: '12px', color: '#888'}}>เช่า {item.rentalDays} วัน</div>}

                    <div className="item-price-qty">
                        <span className="item-price">
                             ฿ {item.rentalDays 
                                    ? (item.productId.productrentprice || 0) * item.rentalDays
                                    : (item.productId.productprice || 0)
                                }
                        </span>
                        <span className="item-qty">x {item.quantity}</span>
                    </div>
                </div>
            </div>
        ))}

        {/* Totals */}
        <div className="cost-summary">
            <div className="cost-row">
                <span>ค่าสินค้า</span>
                <span>฿ {subtotal.toLocaleString()}</span>
            </div>
            <div className="cost-row">
                <span>ค่าจัดส่ง</span>
                <span>฿ {shippingCost.toLocaleString()}</span>
            </div>
             <div className="cost-row">
                <span>ค่าประกัน</span>
                <span>฿ {insuranceCost.toLocaleString()}</span>
            </div>
            <div className="cost-row total">
                <span>ทั้งหมด</span>
                <span>฿ {total.toLocaleString()}</span>
            </div>
        </div>
      </section>

      {/* Payment Method */}
      <section className="checkout-section" onClick={() => setShowPaymentModal(true)} style={{cursor: 'pointer'}}>
         <div className="section-header">
             <span className="section-title">ชำระเงินโดย</span>
             <svg className="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
             </svg>
         </div>
         <div className="section-content">
             {selectedPaymentMethod === 'cash' ? (
               <div className="payment-preview">
                 <span>💵</span>
                 <span>เงินสด (ชำระปลายทาง)</span>
               </div>
             ) : selectedPaymentMethod === 'bank' ? (
               <div className="payment-preview">
                 <span>🏦</span>
                 <span>{banks.find(b => b.id === selectedBank)?.name || 'โอนผ่านธนาคาร'}</span>
               </div>
             ) : (
               <span style={{color: '#999'}}>คลิกเพื่อเลือกวิธีชำระเงิน</span>
             )}
         </div>
      </section>

      {/* Bottom Bar */}
      <div className="checkout-footer">
          <div className="total-label">
              <span className="item-count-badge">{items.length}</span>
              <span>รวมยอดสั่งซื้อ</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
               <span className="total-amount">฿ {total.toLocaleString()}</span>
               <button className="place-order-btn" onClick={() => {
                 if (!selectedAddress) {
                   alert('กรุณาเพิ่มที่อยู่จัดส่ง');
                   setShowAddressModal(true);
                   return;
                 }
                 alert(`Confirm order: ฿${total}`)
               }}>
                   สั่งสินค้า &gt;
               </button>
          </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="address-modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="address-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="address-modal-header">
              <button className="modal-back-btn" onClick={() => {
                if (isAddingNew) {
                  setIsAddingNew(false);
                } else {
                  setShowAddressModal(false);
                }
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
              <h2 className="address-modal-title">
                {isAddingNew ? 'เพิ่มที่อยู่ใหม่' : 'แก้ไขที่อยู่'}
              </h2>
            </div>

            {isAddingNew ? (
              /* New Address Form */
              <div className="address-form">
                <h3 className="form-section-title">ที่อยู่</h3>
                
                <div className="form-group">
                  <label className="form-label">หมายเลขโทรศัพท์</label>
                  <input 
                    type="tel" 
                    className="form-input"
                    placeholder="(+66) 00-000-000"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">จังหวัด</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="จังหวัดกรุงเทพมหานคร"
                    value={newAddress.province}
                    onChange={(e) => setNewAddress({...newAddress, province: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">เขต/อำเภอ</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="เขตสายใหม"
                    value={newAddress.district}
                    onChange={(e) => setNewAddress({...newAddress, district: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">แขวง/ตำบล</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="แขวงคลองถนน"
                    value={newAddress.subDistrict}
                    onChange={(e) => setNewAddress({...newAddress, subDistrict: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">รหัสไปรษณีย์</label>
                  <input 
                    type="text" 
                    className="form-input"
                    placeholder="10220"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">บ้านเลขที่, ซอย, หมู่, ถนน, แขวง/ตำบล</label>
                  <textarea 
                    className="form-textarea"
                    placeholder="ที่อยู่ 1888/88 ไดโนเสาร์ หมู่บ้านอยู่ผู้เดียว สุขนวิทยาวไปสุดสายตา ตงตกกา"
                    value={newAddress.addressDetail}
                    onChange={(e) => setNewAddress({...newAddress, addressDetail: e.target.value})}
                  />
                </div>

                <button className="save-address-btn" onClick={handleSaveAddress}>
                  บันทึกที่อยู่
                </button>
              </div>
            ) : (
              /* Saved Addresses List */
              <div className="address-list">
                <h3 className="form-section-title">ที่อยู่ที่บันทึกไว้</h3>
                
                {savedAddresses.length === 0 ? (
                  <div className="no-address">
                    <p>ยังไม่มีที่อยู่ที่บันทึกไว้</p>
                  </div>
                ) : (
                  savedAddresses.map((address) => (
                    <div 
                      key={address.id} 
                      className={`saved-address-card ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedAddress(address);
                        setShowAddressModal(false);
                      }}
                    >
                      <div className="address-card-content">
                        <div className="address-phone">{address.phone}</div>
                        <div className="address-detail">
                          {address.addressDetail}, {address.subDistrict}, {address.district}, {address.province} {address.postalCode}
                        </div>
                      </div>
                      <button 
                        className="delete-address-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address.id);
                        }}
                      >
                        ลบ
                      </button>
                    </div>
                  ))
                )}

                <button className="add-new-address-btn" onClick={() => setIsAddingNew(true)}>
                  + เพิ่มที่อยู่ใหม่
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="address-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="address-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="address-modal-header">
              <button className="modal-back-btn" onClick={() => setShowPaymentModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
              <h2 className="address-modal-title">เลือกวิธีชำระเงิน</h2>
            </div>

            <div className="payment-options">
              {/* Cash Option */}
              <div 
                className={`payment-option ${selectedPaymentMethod === 'cash' ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedPaymentMethod('cash');
                  setSelectedBank('');
                  setShowPaymentModal(false);
                }}
              >
                <div className="payment-option-icon">💵</div>
                <div className="payment-option-info">
                  <h4>เงินสด (ชำระปลายทาง)</h4>
                  <p>ชำระเงินเมื่อได้รับสินค้า</p>
                </div>
                {selectedPaymentMethod === 'cash' && (
                  <div className="payment-check">✓</div>
                )}
              </div>

              {/* Bank Transfer Option */}
              <div 
                className={`payment-option ${selectedPaymentMethod === 'bank' ? 'selected' : ''}`}
                onClick={() => setSelectedPaymentMethod('bank')}
              >
                <div className="payment-option-icon">🏦</div>
                <div className="payment-option-info">
                  <h4>โอนผ่านธนาคาร</h4>
                  <p>เลือกธนาคารที่ต้องการ</p>
                </div>
                {selectedPaymentMethod === 'bank' && (
                  <div className="payment-check">✓</div>
                )}
              </div>

              {/* Bank Selection (shown when bank transfer is selected) */}
              {selectedPaymentMethod === 'bank' && (
                <div className="bank-selection">
                  <h4 className="bank-selection-title">เลือกธนาคาร</h4>
                  <div className="bank-list">
                    {banks.map((bank) => (
                      <div 
                        key={bank.id}
                        className={`bank-option ${selectedBank === bank.id ? 'selected' : ''}`}
                        onClick={() => setSelectedBank(bank.id)}
                        style={{borderColor: selectedBank === bank.id ? bank.color : '#eee'}}
                      >
                        <div 
                          className="bank-icon" 
                          style={{backgroundColor: bank.color}}
                        >
                          🏦
                        </div>
                        <span className="bank-name">{bank.name}</span>
                        {selectedBank === bank.id && (
                          <div className="payment-check" style={{color: bank.color}}>✓</div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {selectedBank && (
                    <button 
                      className="confirm-payment-btn"
                      onClick={() => setShowPaymentModal(false)}
                    >
                      ยืนยันวิธีชำระเงิน
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
