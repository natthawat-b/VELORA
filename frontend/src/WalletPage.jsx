import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/WalletPage.css';
import { FiChevronLeft, FiArrowDownCircle, FiArrowUpCircle, FiCreditCard } from 'react-icons/fi';
import API_URL from './config/api';

function WalletPage() {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState(null);

  // Withdraw modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const shopId = userData._id;

  useEffect(() => {
    fetchWallet();
    fetchShopData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await axios.get(`${API_URL}/wallet/${shopId}`);
      if (response.data.success) {
        setWallet(response.data.payload);
      }
    } catch (err) {
      console.error('Error fetching wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchShopData = async () => {
    try {
      const response = await axios.get(`${API_URL}/shop/${shopId}`);
      if (response.data.success) {
        setShopData(response.data.payload);
      }
    } catch (err) {
      console.error('Error fetching shop:', err);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      alert('กรุณากรอกจำนวนเงินที่ถูกต้อง');
      return;
    }
    if (amount > (wallet?.balance || 0)) {
      alert('ยอดเงินไม่เพียงพอ');
      return;
    }

    setWithdrawing(true);
    try {
      const response = await axios.post(`${API_URL}/wallet/withdraw`, {
        shopId,
        amount
      });
      if (response.data.success) {
        setWallet(response.data.payload);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        alert('ถอนเงินสำเร็จ!');
      }
    } catch (err) {
      console.error('Withdraw error:', err);
      alert(err.response?.data?.error?.message || 'เกิดข้อผิดพลาดในการถอนเงิน');
    } finally {
      setWithdrawing(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) 
      + ' ' + d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  const transactions = wallet?.transactions 
    ? [...wallet.transactions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  if (loading) {
    return (
      <div className="wallet-container">
        <header className="wallet-header">
          <button className="btn-back" onClick={() => navigate(-1)}><FiChevronLeft /></button>
          <h1>กระเป๋าเงิน</h1>
        </header>
        <div className="transactions-empty">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <header className="wallet-header">
        <button className="btn-back" onClick={() => navigate(-1)}><FiChevronLeft /></button>
        <h1>กระเป๋าเงิน</h1>
      </header>

      {/* Balance Card */}
      <div className="balance-card">
        <p className="balance-label">ยอดเงินคงเหลือ</p>
        <h2 className="balance-amount">
          ฿ {(wallet?.balance || 0).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          <span className="balance-currency">บาท</span>
        </h2>
        <div className="balance-actions">
          <button 
            className="btn-withdraw" 
            onClick={() => setShowWithdrawModal(true)}
            disabled={!wallet?.balance || wallet.balance <= 0}
          >
            <FiArrowUpCircle style={{ marginRight: 6, verticalAlign: 'middle' }} />
            ถอนเงิน
          </button>
        </div>
      </div>

      {/* Bank Info */}
      {shopData && (shopData.shopBank || shopData.shopBankNumber) && (
        <div className="bank-info-card">
          <div className="bank-icon"><FiCreditCard /></div>
          <div className="bank-details">
            <h4>{shopData.shopBank || 'ยังไม่ระบุธนาคาร'}</h4>
            <p>{shopData.shopBankNumber || 'ยังไม่ระบุเลขบัญชี'}</p>
          </div>
        </div>
      )}

      {/* Transactions */}
      <div className="transactions-section">
        <h3 className="transactions-title">ประวัติธุรกรรม</h3>
        {transactions.length === 0 ? (
          <div className="transactions-empty">ยังไม่มีธุรกรรม</div>
        ) : (
          <div className="transaction-list">
            {transactions.map((tx, i) => (
              <div key={i} className="transaction-item">
                <div className={`transaction-icon ${tx.type}`}>
                  {tx.type === 'income' ? <FiArrowDownCircle /> : <FiArrowUpCircle />}
                </div>
                <div className="transaction-info">
                  <p className="transaction-desc">{tx.description}</p>
                  <p className="transaction-date">{formatDate(tx.createdAt)}</p>
                </div>
                <span className={`transaction-amount ${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}฿{tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="withdraw-modal-overlay" onClick={() => setShowWithdrawModal(false)}>
          <div className="withdraw-modal" onClick={e => e.stopPropagation()}>
            <h3>ถอนเงิน</h3>
            <div className="withdraw-input-group">
              <label>จำนวนเงินที่ต้องการถอน (บาท)</label>
              <input
                type="number"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(e.target.value)}
                max={wallet?.balance || 0}
                min="1"
              />
            </div>
            <div className="withdraw-bank-info">
              <strong>โอนเข้าบัญชี:</strong><br />
              {shopData?.shopBank || 'ไม่ระบุ'} — {shopData?.shopBankNumber || 'ไม่ระบุ'}
            </div>
            <div className="withdraw-actions">
              <button className="btn-withdraw-cancel" onClick={() => setShowWithdrawModal(false)}>ยกเลิก</button>
              <button 
                className="btn-withdraw-confirm" 
                onClick={handleWithdraw}
                disabled={withdrawing || !withdrawAmount}
              >
                {withdrawing ? 'กำลังดำเนินการ...' : 'ยืนยันถอนเงิน'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletPage;
