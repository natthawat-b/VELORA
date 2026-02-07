import React, { useState } from 'react';
import './WithdrawalPage.css';
import { FiChevronLeft, FiCheck } from 'react-icons/fi';

function WithdrawalPage() {
  // State สำหรับควบคุมขั้นตอน (1=กรอก, 2=ยืนยัน, 3=สำเร็จ)
  const [step, setStep] = useState(1);
  
  // State ข้อมูล
  const [balance] = useState(5000); // จำลองเงินในกระเป๋า
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');

  // ฟังก์ชันเปลี่ยนขั้นตอน
  const handleNext = () => {
    if (!accountNumber || !amount) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    if (parseFloat(amount) > balance) {
      alert('ยอดเงินคงเหลือไม่เพียงพอ');
      return;
    }
    setStep(2);
  };

  const handleConfirm = () => {
    // จำลองการส่งข้อมูล API
    setTimeout(() => {
      setStep(3);
    }, 500);
  };

  const handleBack = () => {
    if (step === 1) {
      // Logic กลับหน้า Home หรืออื่นๆ
      console.log('Back to Home');
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="withdraw-container">
      {/* --- Header --- */}
      <header className="withdraw-header">
        <div className="header-inner">
          <button className="btn-back" onClick={handleBack} style={{ visibility: step === 3 ? 'hidden' : 'visible' }}>
            <FiChevronLeft /> {step === 1 ? 'การเงิน' : 'ย้อนกลับ'}
          </button>
          <h1 className="header-title">
            {step === 1 && 'การเงิน'}
            {step === 2 && 'ยืนยันการถอนเงิน'}
            {step === 3 && 'ทำรายการสำเร็จ'}
          </h1>
          <div style={{ width: 24 }}></div> {/* Spacer */}
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="withdraw-content">
        <div className="withdraw-card">
          
          {/* STEP 1: กรอกข้อมูล (รูปที่ 23) */}
          {step === 1 && (
            <div className="step-content">
              <div className="balance-display">
                <span className="balance-label">สามารถถอนได้ (฿)</span>
                <h1 className="balance-amount">{balance.toLocaleString()}</h1>
              </div>

              <div className="form-group">
                <label>บัญชีที่ใช้ถอน</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="ใส่เลขบัญชี"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>จำนวนเงิน</label>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="ใส่จำนวนเงิน"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <button className="btn-submit" onClick={handleNext}>
                ยืนยัน
              </button>
            </div>
          )}

          {/* STEP 2: ตรวจสอบข้อมูล (รูปที่ 24, 25) */}
          {step === 2 && (
            <div className="step-content">
              <div className="review-group">
                <label>โอนไปยัง</label>
                <div className="read-only-field">{accountNumber}</div>
              </div>

              <div className="review-group">
                <label>จำนวนเงินที่ถอน</label>
                <div className="read-only-field">฿ {parseFloat(amount).toLocaleString()}</div>
              </div>

              <div className="disclaimer-box">
                <p>
                  การกรอกข้อมูลที่ไม่ถูกต้องจะส่งผลให้ธุรกรรมถูกปฏิเสธ 
                  และคุณจะต้องเป็นผู้รับผิดชอบค่าใช้จ่ายใดๆ ที่ตามมาที่เกี่ยวข้องกับการประมวลผลคำขอของคุณ
                </p>
              </div>

              <button className="btn-submit" onClick={handleConfirm}>
                ยืนยันเพื่อถอนเงิน
              </button>
            </div>
          )}

          {/* STEP 3: สำเร็จ (รูปที่ 26) */}
          {step === 3 && (
            <div className="step-content text-center">
              <div className="success-icon-wrapper">
                <div className="success-circle">
                  <FiCheck />
                </div>
              </div>
              
              <h2 className="success-title">กำลังดำเนินการถอนเงิน</h2>
              <p className="success-desc">คุณจะได้รับเงินภายใน 2-3 วันทำการ</p>

              <div className="review-group text-left">
                <label>จำนวนเงินที่ถอน</label>
                <div className="read-only-field">฿ {parseFloat(amount).toLocaleString()}</div>
              </div>

              <div className="review-group text-left">
                <label>โอนไปยัง</label>
                <div className="read-only-field">{accountNumber}</div>
              </div>

              <button className="btn-submit" onClick={() => setStep(1)}>
                กลับ
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default WithdrawalPage;