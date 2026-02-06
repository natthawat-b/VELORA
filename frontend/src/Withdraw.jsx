import React, { useState } from 'react';
import '../styles/Withdraw.css';

function Withdraw() {
  const [step, setStep] = useState(1); // 1: form, 2: confirm, 3: processing
  const [formData, setFormData] = useState({
    accountNumber: '',
    amount: '',
    availableBalance: 0
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleConfirm = () => {
    setStep(3);
    // Simulate processing
    setTimeout(() => {
      alert('การถอนเงินสำเร็จ');
      setStep(1);
    }, 2000);
  };

  return (
    <div className="withdraw-container">
      <button className="back-button">&lt;</button>

      {step === 1 && (
        <div className="withdraw-form">
          <h1>การเงิน</h1>

          <div className="balance-info">
            <p className="label">สามารถถอนได้</p>
            <p className="balance">฿{formData.availableBalance}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>บัญชีที่ใช้ถอน</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="ใส่เลขบัญชี"
                required
              />
            </div>

            <div className="form-group">
              <label>จำนวนเงิน</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="ใส่จำนวนเงิน"
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              ยืนยัน
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="withdraw-confirm">
          <h1>ยืนยันการถอนเงิน</h1>

          <div className="confirm-details">
            <div className="detail-row">
              <span className="label">โอนไปยัง</span>
              <span className="value">{formData.accountNumber}</span>
            </div>

            <div className="detail-row">
              <span className="label">จำนวนเงินที่ถอน</span>
              <span className="value">฿{formData.amount}</span>
            </div>
          </div>

          <button className="btn-primary" onClick={handleConfirm}>
            ยืนยันเพื่อถอนเงิน
          </button>

          <p className="warning-text">
            การกรอกข้อมูลที่ไม่ถูกต้องจะส่งผลให้การประมวลผลถูกปฏิเสธ 
            และผู้รับผิดชอบค่าใช้จ่ายใด ๆ ตามเงื่อนไขของการประมวลผลของธนาคาร
          </p>

          <button className="btn-secondary" onClick={() => setStep(1)}>
            กลับ
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="withdraw-processing">
          <div className="processing-animation">
            <div className="spinner"></div>
          </div>
          
          <h2>กำลังดำเนินการถอนเงิน</h2>
          <p>คุณจะได้รับเงินภายใน 2-3 วันทำการ</p>
        </div>
      )}
    </div>
  );
}

export default Withdraw;