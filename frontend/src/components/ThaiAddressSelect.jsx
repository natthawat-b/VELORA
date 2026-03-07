import React, { useState, useEffect } from 'react';

const ThaiAddressSelect = ({ 
  address, 
  onChange, 
  className = '',
  layout = 'grid' // 'grid' for CheckoutPage (2 cols), 'stacked' or single full-width wrapper can be managed by parent
}) => {
  const [data, setData] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const response = await fetch('/thai_address.json');
        const jsonData = await response.json();
        setData(jsonData);
        
        // Extract unique provinces
        const uniqueProvinces = [...new Set(jsonData.map(item => item.province))].sort();
        setProvinces(uniqueProvinces);
      } catch (error) {
        console.error('Error loading Thai address data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAddressData();
  }, []);

  // Update districts when province changes
  useEffect(() => {
    if (address.province && data.length > 0) {
      const filteredDistricts = [...new Set(
        data
          .filter(item => item.province === address.province)
          .map(item => item.amphoe)
      )].sort();
      setDistricts(filteredDistricts);
    } else {
      setDistricts([]);
    }
  }, [address.province, data]);

  // Update sub-districts when district changes
  useEffect(() => {
    if (address.district && address.province && data.length > 0) {
      const filteredSubDistricts = [...new Set(
        data
          .filter(item => item.province === address.province && item.amphoe === address.district)
          .map(item => item.district)
      )].sort();
      setSubDistricts(filteredSubDistricts);
    } else {
      setSubDistricts([]);
    }
  }, [address.district, address.province, data]);

  // Handle selection changes
  const handleProvinceChange = (e) => {
    const value = e.target.value;
    onChange({
      ...address,
      province: value,
      district: '', // Reset lower levels
      subDistrict: '',
      postalCode: ''
    });
  };

  const handleDistrictChange = (e) => {
    const value = e.target.value;
    onChange({
      ...address,
      district: value,
      subDistrict: '', // Reset lower levels
      postalCode: ''
    });
  };

  const handleSubDistrictChange = (e) => {
    const value = e.target.value;
    // Find matching zip code
    const matchingData = data.find(
      item => item.province === address.province && 
              item.amphoe === address.district && 
              item.district === value
    );
    
    onChange({
      ...address,
      subDistrict: value,
      postalCode: matchingData ? String(matchingData.zipcode) : ''
    });
  };

  const selectStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
    backgroundColor: '#fff',
    fontSize: '14px',
    outline: 'none',
    cursor: loading ? 'wait' : 'default'
  };

  if (layout === 'grid') {
    return (
      <div className={`form-grid ${className}`}>
        <div className="form-group">
          <label>จังหวัด</label>
          <select 
            value={address.province || ''} 
            onChange={handleProvinceChange}
            disabled={loading}
            style={selectStyle}
            required
          >
            <option value="">เลือกจังหวัด</option>
            {provinces.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>เขต/อำเภอ</label>
          <select 
            value={address.district || ''} 
            onChange={handleDistrictChange}
            disabled={!address.province || loading}
            style={selectStyle}
            required
          >
            <option value="">เลือกเขต/อำเภอ</option>
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>แขวง/ตำบล</label>
          <select 
            value={address.subDistrict || ''} 
            onChange={handleSubDistrictChange}
            disabled={!address.district || loading}
            style={selectStyle}
            required
          >
            <option value="">เลือกแขวง/ตำบล</option>
            {subDistricts.map(sd => (
              <option key={sd} value={sd}>{sd}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>รหัสไปรษณีย์</label>
          <input 
            type="text" 
            value={address.postalCode || ''} 
            readOnly
            style={{...selectStyle, backgroundColor: '#f5f5f5', cursor: 'not-allowed'}}
            required 
          />
        </div>
      </div>
    );
  }

  // Fallback flat layout
  return (
    <div className={className}>
      <div className="form-group">
        <label>จังหวัด</label>
        <select 
          value={address.province || ''} 
          onChange={handleProvinceChange}
          disabled={loading}
          style={selectStyle}
          required
        >
          <option value="">เลือกจังหวัด</option>
          {provinces.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>เขต/อำเภอ</label>
        <select 
          value={address.district || ''} 
          onChange={handleDistrictChange}
          disabled={!address.province || loading}
          style={selectStyle}
          required
        >
          <option value="">เลือกเขต/อำเภอ</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>แขวง/ตำบล</label>
        <select 
          value={address.subDistrict || ''} 
          onChange={handleSubDistrictChange}
          disabled={!address.district || loading}
          style={selectStyle}
          required
        >
          <option value="">เลือกแขวง/ตำบล</option>
          {subDistricts.map(sd => <option key={sd} value={sd}>{sd}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>รหัสไปรษณีย์</label>
        <input 
          type="text" 
          value={address.postalCode || ''} 
          readOnly
          style={{...selectStyle, backgroundColor: '#f5f5f5', cursor: 'not-allowed'}}
          required 
        />
      </div>
    </div>
  );
};

export default ThaiAddressSelect;
