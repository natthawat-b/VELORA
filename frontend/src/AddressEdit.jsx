import React, { useState } from 'react';
import '../styles/AddressEdit.css';

function AddressEdit() {
  const [formData, setFormData] = useState({
    phone: '(+66) 00-000-000',
    province: 'กรุงเทพมหานคร',
    district: 'สายไหม',
    subDistrict: 'คลองถนน',
    postalCode: '10220',
    addressDetail: '1888/88 ไดโนเสาร์ หมู่บ้ามีอยู่ผู้เผดีว สุขุมวิทยาวไปสุดสายตา ดงดกกา'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Address updated:', formData);
  };

  return (
    <div className="address-edit-container">
      <button className="back-button">&lt;</button>
      <h1>แก้ไขที่อยู่</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ที่อยู่</label>
          <p className="info-text">หมายเลขโทรศัพท์</p>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>จังหวัด</label>
          <select
            name="province"
            value={formData.province}
            onChange={handleChange}
            required
          >
            <option value="กรุงเทพมหานคร">จังหวัดกรุงเทพมหานคร</option>
            <option value="เชียงใหม่">จังหวัดเชียงใหม่</option>
            <option value="ภูเก็ต">จังหวัดภูเก็ต</option>
            {/* Add more provinces */}
          </select>
        </div>

        <div className="form-group">
          <label>เขต/อำเภอ</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
          >
            <option value="สายไหม">เขตสายไหม</option>
            {/* Add more districts */}
          </select>
        </div>

        <div className="form-group">
          <label>แขวง/ตำบล</label>
          <select
            name="subDistrict"
            value={formData.subDistrict}
            onChange={handleChange}
            required
          >
            <option value="คลองถนน">แขวงคลองถนน</option>
            {/* Add more sub-districts */}
          </select>
        </div>

        <div className="form-group">
          <label>รหัสไปรษณีย์</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            maxLength="5"
            required
          />
        </div>

        <div className="form-group">
          <label>บ้านเลขที่, ซอย, ถนน, แขวง/ตำบล</label>
          <textarea
            name="addressDetail"
            value={formData.addressDetail}
            onChange={handleChange}
            rows="4"
            placeholder="ที่อยู่"
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          บันทึกที่อยู่
        </button>
      </form>
    </div>
  );
}

export default AddressEdit;