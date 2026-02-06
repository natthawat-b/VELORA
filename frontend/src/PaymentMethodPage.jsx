import React, { useState } from 'react';
import './PaymentMethodPage.css';
import { FiChevronLeft, FiChevronDown, FiCreditCard } from 'react-icons/fi';
import { FaMoneyBillWave, FaUniversity } from 'react-icons/fa';

function PaymentMethodPage() {
  const [selectedMethod, setSelectedMethod] = useState('bank'); // 'cash' or 'bank'
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // รายชื่อธนาคารจำลอง
  const banks = [
    { id: 'kbank', name: 'ธนาคารกสิกรไทย' },
    { id: 'scb', name: 'ธนาคารไทยพาณิชย์' },
    { id: 'bbl', name: 'ธนาคารกรุงเทพ' },
    { id: 'ktb', name: 'ธนาคารกรุงไทย' },
    { id: 'ttb', name: 'ธนาคารทีทีบี' },
  ];

  return (
    <div className="payment-page-container">
      {/* --- Header --- */}
      <header className="payment-navbar">
        <div className="nav-inner">
          <button className="btn-back">
            <FiChevronLeft /> ย้อนกลับ
          </button>
          <h1 className="page-title">เลือกวิธีการชำระเงิน</h1>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="payment-content">
        <div className="payment-card">
          
          <h2 className="card-heading">ช่องทางการชำระเงิน</h2>
          <p className="card-subheading">กรุณาเลือกวิธีการชำระเงินที่คุณสะดวก</p>

          {/* ตัวเลือกที่ 1: เงินสด */}
          <div 
            className={`payment-option ${selectedMethod === 'cash' ? 'selected' : ''}`}
            onClick={() => setSelectedMethod('cash')}
          >
            <div className="option-icon cash">
              <FaMoneyBillWave />
            </div>
            <div className="option-info">
              <span className="option-title">เงินสด</span>
              <span className="option-desc">ชำระเงินปลายทาง (Cash on Delivery)</span>
            </div>
            <div className="radio-circle"></div>
          </div>

          <div className="divider"></div>

          {/* ตัวเลือกที่ 2: ธนาคาร (พร้อมฟอร์ม) */}
          <div 
            className={`payment-option bank-option ${selectedMethod === 'bank' ? 'selected' : ''}`}
            onClick={() => setSelectedMethod('bank')}
          >
            <div className="bank-header">
              <div className="option-icon bank">
                <FaUniversity />
              </div>
              <div className="option-info">
                <span className="option-title">โอนผ่านธนาคาร</span>
                <span className="option-desc">ชำระผ่านแอปธนาคารหรือเคาน์เตอร์</span>
              </div>
              <div className="radio-circle"></div>
            </div>

            {/* ส่วนฟอร์มธนาคาร (แสดงเมื่อเลือก) */}
            {selectedMethod === 'bank' && (
              <div className="bank-form" onClick={(e) => e.stopPropagation()}>
                <div className="form-group">
                  <label>ธนาคาร</label>
                  <div className="select-wrapper">
                    <select 
                      value={bank} 
                      onChange={(e) => setBank(e.target.value)}
                      className={bank ? 'filled' : ''}
                    >
                      <option value="" disabled>เลือกธนาคาร</option>
                      {banks.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                    <FiChevronDown className="select-arrow" />
                  </div>
                </div>

                <div className="form-group">
                  <label>เลขบัญชี</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      placeholder="กรอกเลขบัญชี" 
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                    <FiCreditCard className="input-icon" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ปุ่มยืนยัน */}
          <button className="btn-confirm-payment">
            ยืนยันการชำระเงิน
          </button>

        </div>
      </main>
    </div>
  );
}

export default PaymentMethodPage;