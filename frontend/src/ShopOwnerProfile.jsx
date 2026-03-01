import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/ShopOwnerProfile.css';
import './assets/ChatListPage.css';
import { FiShoppingCart, FiMessageSquare, FiBox, FiTruck, FiCheckCircle, FiHome, FiSearch, FiUser, FiEdit2, FiCamera, FiShoppingBag, FiLogOut, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import API_URL from './config/api';

function ShopOwnerProfile() {
  const navigate = useNavigate();
  const [shopData, setShopData] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [loading, setLoading] = useState(true);
  const [shopPhoto, setShopPhoto] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [editInfo, setEditInfo] = useState({ shopBank: '', shopBankNumber: '', shopIDcard: '' });
  const [savingInfo, setSavingInfo] = useState(false);
  const [chatCount, setChatCount] = useState(0);

  useEffect(() => {
    fetchShopData();
    fetchChatCount();
  }, []);

  const fetchChatCount = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const shopId = userData._id;
      if (!shopId) return;

      const response = await axios.get(`${API_URL}/chat/list/${shopId}`);
      if (response.data.success) {
        const chats = response.data.payload;
        // Count total messages across all chats
        const totalMessages = chats.reduce((sum, chat) => sum + (chat.messages?.length || 0), 0);
        setChatCount(totalMessages);
      }
    } catch {
      // silently fail
    }
  };

  const fetchShopData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const shopId = userData._id;

      if (!shopId) {
        console.error('No shop ID found');
        alert('ไม่พบข้อมูลร้านค้า กรุณา login ใหม่');
        setLoading(false);
        navigate('/shop-login');
        return;
      }

      console.log('Fetching shop data for ID:', shopId);
      const response = await axios.get(`${API_URL}/shop/${shopId}`);
      
      console.log('Shop data response:', response.data);
      
      if (response.data.success) {
        setShopData(response.data.payload);
        setEditedName(response.data.payload.shopname);
        setShopPhoto(response.data.payload.shopPhoto || '');
        setPhotoPreview(response.data.payload.shopPhoto || '');
      } else {
        console.error('Failed to fetch shop data');
        alert('ไม่สามารถดึงข้อมูลร้านค้าได้');
      }
    } catch (error) {
      console.error('Error fetching shop data:', error);
      alert('เกิดข้อผิดพลาดในการดึงข้อมูลร้านค้า');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = () => {
    setIsEditingName(true);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditedName(shopData?.shopname || '');
  };

  const handleSaveEdit = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const shopId = userData._id;

      const response = await axios.put(`${API_URL}/shop/${shopId}`, {
        shopname: editedName
      });

      if (response.data.success) {
        setShopData(response.data.payload);
        setIsEditingName(false);
        alert('แก้ไขชื่อร้านสำเร็จ!');
      }
    } catch (error) {
      console.error('Error updating shop name:', error);
      alert('เกิดข้อผิดพลาดในการแก้ไขชื่อร้าน');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setShopPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const shopId = userData._id;

      console.log('Saving photo, shopId:', shopId);
      console.log('Photo data length:', shopPhoto?.length);

      const response = await axios.put(`${API_URL}/shop/${shopId}`, {
        shopPhoto: shopPhoto
      });

      console.log('Save response:', response.data);

      if (response.data.success) {
        const updatedShop = response.data.payload;
        console.log('Updated shop data:', updatedShop);
        console.log('shopPhoto from response:', updatedShop.shopPhoto ? 'exists' : 'missing');
        
        // Update all state with response data
        setShopData(updatedShop);
        
        // Keep the photo in preview - use saved photo from response
        if (updatedShop.shopPhoto) {
          setPhotoPreview(updatedShop.shopPhoto);
          setShopPhoto(updatedShop.shopPhoto);
        }
        
        alert('แก้ไขรูปโปรไฟล์สำเร็จ!');
      } else {
        console.error('Response not successful:', response.data);
        alert('ไม่สามารถบันทึกรูปได้');
      }
    } catch (error) {
      console.error('Error updating shop photo:', error);
      alert('เกิดข้อผิดพลาดในการแก้ไขรูปโปรไฟล์');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    navigate('/');
  };

  if (loading) {
    return <div className="loading">กำลังโหลด...</div>;
  }

  return (
    <div className="shop-owner-container">
      {/* --- Navbar --- */}
      <header className="navbar">
        <div className="nav-content">
          <h1 className="brand-logo">VELORA</h1>
          <div className="nav-icons">
            <div className="nav-icon-wrapper" onClick={() => navigate('/chat-list')} title="แชท">
              <FiMessageSquare className="nav-icon" />
              {chatCount > 0 && <span className="nav-chat-badge">{chatCount > 99 ? '99+' : chatCount}</span>}
            </div>
            <FiLogOut className="nav-icon" onClick={handleLogout} style={{ color: '#d32f2f', cursor: 'pointer' }} title="ออกจากระบบ" />
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="main-content">
        <div className="content-wrapper">
          
          {/* ส่วนที่ 1: การ์ดข้อมูลร้านค้า */}
          <section className="profile-card">
            <div className="profile-image-section">
              <div className="profile-img-placeholder">
                {photoPreview ? (
                  <img src={photoPreview} alt="Shop Profile" className="profile-photo" />
                ) : (
                  <>
                    {/* CSS Art: ภูเขาและเมฆ */}
                    <div className="art-cloud"></div>
                    <div className="art-mountain"></div>
                  </>
                )}
              </div>
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="photo-upload" className="btn-edit-img">
                <span className="edit-text"><FiCamera /> แก้ไข</span>
              </label>
              {photoPreview && photoPreview !== shopData?.shopPhoto && (
                <button className="btn-save-photo" onClick={handleSavePhoto}>
                  <FiCheck /> บันทึกรูป
                </button>
              )}
            </div>
            
            <div className="profile-info-section">
              <div className="name-row">
                {isEditingName ? (
                  <>
                    <input
                      type="text"
                      className="edit-name-input"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button className="btn-save" onClick={handleSaveEdit}>
                        <FiCheck /> บันทึก
                      </button>
                      <button className="btn-cancel" onClick={handleCancelEdit}>
                        <FiX /> ยกเลิก
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="shop-account-name">{shopData?.shopname || 'ชื่อแอคเค้าท์ร้าน'}</h2>
                    <button className="btn-edit-text" onClick={handleStartEdit}>
                      <FiEdit2 /> แก้ไข
                    </button>
                  </>
                )}
              </div>
              
              <button className="btn-my-products" onClick={() => navigate('/seller-products')}>
                <FiShoppingBag className="btn-icon" /> สินค้าของฉัน
              </button>
              <button className="btn-my-products" onClick={() => {
                setEditInfo({
                  shopBank: shopData?.shopBank || '',
                  shopBankNumber: shopData?.shopBankNumber || '',
                  shopIDcard: shopData?.shopIDcard || ''
                });
                setShowInfoModal(true);
              }}>
                <FiInfo className="btn-icon" /> ข้อมูลเพิ่มเติม
              </button>
            </div>
          </section>

          {/* ส่วนที่ 2: สถานะการจัดส่ง (Dashboard) */}
          <section className="status-dashboard">
            <h3 className="section-title">รายการจัดส่ง</h3>
            <div className="status-grid">
              <div className="status-item">
                <div className="status-icon-box">
                  <FiBox />
                </div>
                <p>เข้ารับพัสดุแล้ว</p>
              </div>
              
              <div className="status-item">
                <div className="status-icon-box">
                  <FiTruck />
                </div>
                <p>กำลังจัดส่ง</p>
              </div>
              
              <div className="status-item">
                <div className="status-icon-box completed">
                  <FiCheckCircle />
                </div>
                <p>จัดส่งสำเร็จ</p>
              </div>
            </div>
          </section>

          {/* ส่วนที่ 3: ปุ่ม Logout */}
          <div className="logout-section">
            <button className="btn-logout" onClick={handleLogout}>LOG OUT</button>
          </div>
          
        </div>
      </main>

      {/* Bottom Nav - Only Profile Button */}
      <footer className="bottom-nav">
        <div className="nav-item active"><FiUser /></div>
      </footer>

      {/* Modal ข้อมูลเพิ่มเติม */}
      {showInfoModal && (
        <div className="info-modal-overlay" onClick={() => setShowInfoModal(false)}>
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            <div className="info-modal-header">
              <h3>ข้อมูลเพิ่มเติม</h3>
              <button className="btn-close-modal" onClick={() => setShowInfoModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="info-modal-body">
              <div className="info-item-edit">
                <label className="info-label">ธนาคาร</label>
                <select
                  className="info-select"
                  value={editInfo.shopBank}
                  onChange={(e) => setEditInfo({...editInfo, shopBank: e.target.value})}
                >
                  <option value="">เลือกธนาคาร</option>
                  <option value="ธนาคารกรุงเทพ">ธนาคารกรุงเทพ (BBL)</option>
                  <option value="ธนาคารกสิกรไทย">ธนาคารกสิกรไทย (KBANK)</option>
                  <option value="ธนาคารกรุงไทย">ธนาคารกรุงไทย (KTB)</option>
                  <option value="ธนาคารไทยพาณิชย์">ธนาคารไทยพาณิชย์ (SCB)</option>
                  <option value="ธนาคารกรุงศรีอยุธยา">ธนาคารกรุงศรีอยุธยา (BAY)</option>
                  <option value="ธนาคารทหารไทยธนชาต">ธนาคารทหารไทยธนชาต (TTB)</option>
                  <option value="ธนาคารออมสิน">ธนาคารออมสิน (GSB)</option>
                  <option value="ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร">ธ.ก.ส. (BAAC)</option>
                  <option value="ธนาคารอาคารสงเคราะห์">ธนาคารอาคารสงเคราะห์ (GHB)</option>
                  <option value="ธนาคารซีไอเอ็มบีไทย">ธนาคารซีไอเอ็มบีไทย (CIMBT)</option>
                  <option value="ธนาคารยูโอบี">ธนาคารยูโอบี (UOB)</option>
                  <option value="ธนาคารแลนด์แอนด์เฮ้าส์">ธนาคารแลนด์ แอนด์ เฮ้าส์ (LHBANK)</option>
                  <option value="ธนาคารเกียรตินาคินภัทร">ธนาคารเกียรตินาคินภัทร (KKP)</option>
                  <option value="ธนาคารทิสโก้">ธนาคารทิสโก้ (TISCO)</option>
                  <option value="ธนาคารไทยเครดิต">ธนาคารไทยเครดิต (TCR)</option>
                  <option value="ธนาคารอิสลามแห่งประเทศไทย">ธนาคารอิสลามแห่งประเทศไทย (ISBT)</option>
                  <option value="ธนาคารไอซีบีซี">ธนาคารไอซีบีซี (ICBC)</option>
                  <option value="ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อม">ธนาคาร SME (SME BANK)</option>
                  <option value="ธนาคารเอ็กซิมแบงค์">ธนาคารเอ็กซิมแบงค์ (EXIM)</option>
                </select>
              </div>
              <div className="info-item-edit">
                <label className="info-label">เลขบัญชี</label>
                <input
                  className="info-input"
                  type="text"
                  value={editInfo.shopBankNumber}
                  onChange={(e) => setEditInfo({...editInfo, shopBankNumber: e.target.value})}
                  placeholder="กรอกเลขบัญชีธนาคาร"
                />
              </div>
              <div className="info-item-edit">
                <label className="info-label">เลขบัตรประชาชน</label>
                <input
                  className="info-input"
                  type="text"
                  value={editInfo.shopIDcard}
                  onChange={(e) => setEditInfo({...editInfo, shopIDcard: e.target.value})}
                  maxLength="13"
                  placeholder="ตัวเลข 13 หลัก ไม่ต้องใส่ -"
                />
              </div>
            </div>
            <button
              className="btn-save-info"
              onClick={async () => {
                setSavingInfo(true);
                try {
                  await axios.put(`${API_URL}/shop/${shopData._id}`, editInfo);
                  setShopData({...shopData, ...editInfo});
                  alert('บันทึกข้อมูลสำเร็จ!');
                  setShowInfoModal(false);
                } catch (err) {
                  alert('เกิดข้อผิดพลาด: ' + (err.response?.data?.error?.message || err.message));
                } finally {
                  setSavingInfo(false);
                }
              }}
              disabled={savingInfo}
            >
              {savingInfo ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopOwnerProfile;