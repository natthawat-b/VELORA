import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './assets/CheckoutPage.css';
import { FiChevronLeft, FiMapPin, FiPhone, FiTruck, FiShield, FiChevronRight, FiCreditCard, FiBox, FiSmartphone, FiDollarSign } from 'react-icons/fi';

const PAYMENT_METHODS = [
  { id: 'promptpay', name: 'PromptPay (QR Code)', icon: <FiSmartphone />, description: 'สแกน QR Code เพื่อชำระเงิน' },
  { id: 'credit_cart', name: 'บัตรเครดิต / บัตรเดบิต', icon: <FiCreditCard />, description: 'รองรับ Visa, Mastercard, JCB' },
  { id: 'cod', name: 'เก็บเงินปลายทาง (COD)', icon: <FiDollarSign />, description: 'ชำระเงินเมื่อได้รับสินค้า' }
];

function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // รับข้อมูลจาก location.state (รองรับทั้งจาก Cart และ Buy Now)
  const { product, type, price, cartItems } = location.state || {}; // ... rest of the file


  // แปลงข้อมูลให้อยู่ในรูปแบบ Array เสมอ เพื่อให้ Render ได้เหมือนกัน
  const checkoutItems = cartItems || (product ? [{
    id: product._id,
    productId: product._id,
    productName: product.productname || product.productName, // รองรับทั้ง 2 key
    productPhoto: product.productphoto || product.productPhoto,
    productPrice: price,
    type: type,
    shopName: product.shop?.name || product.shopName || 'ร้านค้า',
    quantity: 1
  }] : []);

  // State สำหรับตัวเลือกต่างๆ
  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' or 'fast'
  const [hasInsurance, setHasInsurance] = useState(false);

  // --- Address Management State ---
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  
  // --- Payment State ---
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]); // Default to PromptPay
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Form State
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    details: '',
    province: '',
    district: '',
    subDistrict: '',
    postalCode: ''
  });

  // Load addresses from local storage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('velora_addresses');
    if (saved) {
      const addresses = JSON.parse(saved);
      setSavedAddresses(addresses);
      // Auto-select first address if available
      if (addresses.length > 0) {
        setSelectedAddress(addresses[0]);
      }
    }
  }, []);

  const handleSaveAddress = () => {
    // Validate simple
    if (!newAddress.name || !newAddress.phone || !newAddress.details) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    let updatedAddresses;
    let savedAddressObj;

    if (newAddress.id) {
        // Edit existing
        updatedAddresses = savedAddresses.map(addr => 
            addr.id === newAddress.id ? newAddress : addr
        );
        savedAddressObj = newAddress;
    } else {
        // Add new
        savedAddressObj = { ...newAddress, id: Date.now() };
        updatedAddresses = [...savedAddresses, savedAddressObj];
    }
    
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('velora_addresses', JSON.stringify(updatedAddresses));
    
    setSelectedAddress(savedAddressObj); // Select the saved address
    setShowAddEditModal(false);
    setShowAddressModal(true); // Re-open list modal to see changes
    
    // Reset form
    setNewAddress({
      name: '',
      phone: '',
      details: '',
      province: '',
      district: '',
      subDistrict: '',
      postalCode: ''
    });
  };

  const handleAddNewAddress = () => {
    // Reset form for new add
    setNewAddress({
      name: '',
      phone: '',
      details: '',
      province: '',
      district: '',
      subDistrict: '',
      postalCode: ''
    });
    setShowAddressModal(false); 
    setShowAddEditModal(true);
  };

  const handleEditAddress = (addr) => {
    setNewAddress(addr);
    setShowAddressModal(false);
    setShowAddEditModal(true);
  };

  const handleDeleteAddress = (id, e) => {
    e.stopPropagation(); // Prevent selecting the address
    if (window.confirm('คุณต้องการลบที่อยู่นี้ใช่หรือไม่?')) {
        const updatedAddresses = savedAddresses.filter(addr => addr.id !== id);
        setSavedAddresses(updatedAddresses);
        localStorage.setItem('velora_addresses', JSON.stringify(updatedAddresses));
        
        // If selected address was deleted, deselect it
        if (selectedAddress?.id === id) {
            setSelectedAddress(null);
        }
    }
  };

  // คำนวณยอดรวมสินค้า
  const productTotal = checkoutItems.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0);
  
  // ค่าจัดส่งและประกัน
  const standardShippingCost = 50;
  const fastShippingCost = 100;
  const insuranceCost = 200;

  // คำนวณยอดรวมสุทธิ
  const currentShippingCost = shippingMethod === 'standard' ? standardShippingCost : fastShippingCost;
  const currentInsuranceCost = hasInsurance ? insuranceCost : 0;
  const total = productTotal + currentShippingCost + currentInsuranceCost;

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="checkout-container">
      {/* --- Header --- */}
      <header className="checkout-navbar">
        <div className="nav-inner">
          <button className="btn-back" onClick={handleGoBack}>
            <FiChevronLeft />
          </button>
          <h1 className="page-title">ทำการสั่งซื้อ</h1>
          <div className="nav-spacer"></div>
        </div>
      </header>

      <main className="checkout-content">
        <div className="checkout-grid">
          
          {/* --- Left Column: Details --- */}
          <div className="checkout-details">
            
            {/* 1. Address Section */}
            <section className="info-card" onClick={() => setShowAddressModal(true)} style={{ cursor: 'pointer' }}>
              <h3 className="card-title">ที่อยู่จัดส่ง</h3>
              <div className="info-row">
                <div className="info-icon"><FiMapPin /></div>
                <div className="info-text">
                  {selectedAddress ? (
                    <>
                      <p className="main-text font-bold">{selectedAddress.name} ({selectedAddress.phone})</p>
                      <p className="sub-text text-sm text-gray-500">
                        {selectedAddress.details} {selectedAddress.subDistrict} {selectedAddress.district} {selectedAddress.province} {selectedAddress.postalCode}
                      </p>
                    </>
                  ) : (
                    <p className="main-text text-gray-400">คลิกเพื่อเลือกหรือเพิ่มที่อยู่จัดส่ง</p>
                  )}
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
              <h3 className="card-title">รายการสินค้า ({checkoutItems.length})</h3>
              
              {checkoutItems.map((item, index) => (
                <div key={index} className="checkout-item-wrapper">
                  <div className="checkout-shop-header">{item.shopName} &gt;</div>
                  <div className="checkout-product-item">
                    <div className="checkout-img-box">
                      {item.productPhoto ? (
                        <img src={item.productPhoto} alt={item.productName} className="checkout-product-img" />
                      ) : (
                        <div className="art-sky"></div>
                      )}
                    </div>
                    <div className="checkout-item-details">
                      <h4 className="item-name">{item.productName}</h4>
                      <div className="item-variant">{item.type === 'rent' ? 'เช่า' : 'ซื้อ'}</div>
                      <div className="item-price-qty">
                        <span className="price">฿ {item.productPrice?.toLocaleString()}{item.type === 'rent' ? '/วัน' : ''}</span>
                        <span className="qty">x {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                  {index < checkoutItems.length - 1 && <div className="divider-sm"></div>}
                </div>
              ))}
            </section>

            {/* 5. Payment Method */}
            <section className="info-card" onClick={() => setShowPaymentModal(true)} style={{ cursor: 'pointer' }}>
              <h3 className="card-title">ชำระเงินโดย</h3>
              <div className="info-row">
                <div className="info-icon">{paymentMethod?.icon || <FiCreditCard />}</div>
                <div className="info-text">
                  <p className="main-text font-bold">{paymentMethod?.name || 'เลือกวิธีการชำระเงิน'}</p>
                  {paymentMethod?.description && <p className="sub-text text-sm text-gray-500">{paymentMethod.description}</p>}
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
                <span>฿ {productTotal.toLocaleString()}</span>
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

      {/* --- Address List Modal --- */}
      {showAddressModal && (
        <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>เลือกที่อยู่จัดส่ง</h3>
              <button className="close-btn" onClick={() => setShowAddressModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              {savedAddresses.length === 0 ? (
                <p className="text-center text-gray-500 py-4">ยังไม่มีที่อยู่จัดส่ง</p>
              ) : (
                <div className="address-list">
                  {savedAddresses.map(addr => (
                    <div 
                      key={addr.id} 
                      className={`address-item ${selectedAddress?.id === addr.id ? 'selected' : ''}`}
                    >
                      <div className="address-item-content" 
                        onClick={() => {
                          setSelectedAddress(addr);
                          setShowAddressModal(false);
                        }}
                      >
                        <div className="address-info">
                          <div className="font-bold">{addr.name} | {addr.phone}</div>
                          <div className="text-sm text-gray-600">
                            {addr.details} {addr.subDistrict} {addr.district} {addr.province} {addr.postalCode}
                          </div>
                        </div>
                        {selectedAddress?.id === addr.id && <div className="check-icon">✓</div>}
                      </div>
                      <div className="address-actions">
                        <button className="btn-action edit" onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }}>
                           แก้ไข
                        </button>
                        <button className="btn-action delete" onClick={(e) => handleDeleteAddress(addr.id, e)}>
                           ลบ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button className="btn-add-new" onClick={handleAddNewAddress}>
                + เพิ่มที่อยู่ใหม่
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Add/Edit Address Modal --- */}
      {showAddEditModal && (
        <div className="modal-overlay" onClick={() => setShowAddEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>เพิ่มที่อยู่ใหม่</h3>
              <button className="close-btn" onClick={() => setShowAddEditModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <form className="address-form" onSubmit={(e) => { e.preventDefault(); handleSaveAddress(); }}>
                <div className="form-group">
                  <label>ชื่อ-นามสกุล</label>
                  <input 
                    type="text" 
                    value={newAddress.name} 
                    onChange={e => setNewAddress({...newAddress, name: e.target.value})}
                    placeholder="ชื่อผู้รับ"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>เบอร์โทรศัพท์</label>
                  <input 
                    type="tel" 
                    value={newAddress.phone} 
                    onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                    placeholder="08x-xxx-xxxx"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>จังหวัด</label>
                  <input 
                    type="text" 
                    value={newAddress.province} 
                    onChange={e => setNewAddress({...newAddress, province: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>เขต/อำเภอ</label>
                  <input 
                    type="text" 
                    value={newAddress.district} 
                    onChange={e => setNewAddress({...newAddress, district: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>แขวง/ตำบล</label>
                  <input 
                    type="text" 
                    value={newAddress.subDistrict} 
                    onChange={e => setNewAddress({...newAddress, subDistrict: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>รหัสไปรษณีย์</label>
                  <input 
                    type="text" 
                    value={newAddress.postalCode} 
                    onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group full">
                  <label>รายละเอียดที่อยู่ (บ้านเลขที่, ซอย, ถนน)</label>
                  <textarea 
                    value={newAddress.details} 
                    onChange={e => setNewAddress({...newAddress, details: e.target.value})}
                    rows="3"
                    required 
                  ></textarea>
                </div>
                
                <button type="submit" className="btn-save-address">บันทึกที่อยู่</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- Payment Method Modal --- */}
      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>เลือกวิธีการชำระเงิน</h3>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="payment-list">
                {PAYMENT_METHODS.map(method => (
                  <div 
                    key={method.id} 
                    className={`address-item ${paymentMethod?.id === method.id ? 'selected' : ''}`}
                    onClick={() => {
                        setPaymentMethod(method);
                        setShowPaymentModal(false);
                    }}
                  >
                    <div className="address-item-content">
                        <div className="info-row" style={{ padding: 0, border: 'none' }}>
                            <div className="info-icon">{method.icon}</div>
                            <div className="info-text">
                                <p className="main-text font-bold">{method.name}</p>
                                <p className="sub-text text-sm text-gray-500">{method.description}</p>
                            </div>
                        </div>
                        {paymentMethod?.id === method.id && <div className="check-icon">✓</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;