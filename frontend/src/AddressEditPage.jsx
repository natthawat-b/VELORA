import React, { useState } from 'react';
import './AddressEditPage.css';
import { FiChevronLeft, FiSave, FiMapPin } from 'react-icons/fi';
import ThaiAddressSelect from './components/ThaiAddressSelect';
function AddressEditPage() {
  // State สำหรับเก็บข้อมูลในฟอร์ม
  const [formData, setFormData] = useState({
    phone: '(+66) 00-000-000',
    province: 'กรุงเทพมหานคร',
    district: 'เขตสายไหม',
    subDistrict: 'แขวงคลองถนน',
    postalCode: '10220',
    addressDetail: 'ที่อยู่ 1888/88 ไดโนเสาร์ หมู่บมิอยู่ผู้เดียว สุขุมวิทยาวไปสุดสายตา ดงดกกา'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="address-page-container">
      {/* --- Header --- */}
      <header className="address-navbar">
        <div className="nav-inner">
          <button className="btn-back">
            <FiChevronLeft /> ย้อนกลับ
          </button>
          <h1 className="page-title">แก้ไขที่อยู่</h1>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="address-content">
        <div className="address-card">
          <div className="card-header">
            <div className="icon-wrapper">
              <FiMapPin />
            </div>
            <h2>รายละเอียดที่อยู่</h2>
            <p>กรุณาระบุข้อมูลให้ครบถ้วนสำหรับการจัดส่ง</p>
          </div>

          <form className="address-form">
            
            {/* เบอร์โทรศัพท์ (เต็มความกว้าง) */}
            <div className="form-group full-width">
              <label>หมายเลขโทรศัพท์</label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="กรอกเบอร์โทรศัพท์"
              />
            </div>

            <div className="form-group full-width">
              <label>บ้านเลขที่, ซอย, หมู่, ถนน, แขวง/ตำบล</label>
              <textarea 
                name="addressDetail"
                rows="4"
                value={formData.addressDetail}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Thai Address Select Component (Province, District, SubDistrict, PostalCode) */}
            <div className="form-group full-width" style={{ marginTop: '15px' }}>
               <ThaiAddressSelect 
                 address={formData} 
                 onChange={setFormData}
               />
            </div>

            {/* รายละเอียดที่อยู่อยู่ด้านบนแล้ว */}

            {/* ปุ่มบันทึก */}
            <div className="form-actions">
              <button type="button" className="btn-cancel">ยกเลิก</button>
              <button type="submit" className="btn-save">
                <FiSave /> บันทึกข้อมูล
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default AddressEditPage;