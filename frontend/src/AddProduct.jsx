import React, { useState } from 'react';
import '../styles/AddProduct.css';

function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    style: '',
    sizes: [],
    allowRental: false,
    images: []
  });

  const [selectedSizes, setSelectedSizes] = useState([]);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      images: [...formData.images, ...files]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      sizes: selectedSizes
    };
    console.log('Product added:', data);
  };

  return (
    <div className="add-product-container">
      <button className="back-button">&lt;</button>
      <h1>เพิ่มรายการสินค้า</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ชื่อสินค้า</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="กรอกชื่อสินค้า"
            required
          />
        </div>

        <div className="form-group">
          <label>รายละเอียดสินค้า</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="กรอกรายละเอียดสินค้า"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>สไตล์</label>
          <select
            name="style"
            value={formData.style}
            onChange={handleChange}
            required
          >
            <option value="">เลือกสไตล์</option>
            <option value="minimalist">Minimalist</option>
            <option value="y2k">Y2K</option>
            <option value="hiphop">Hip-hop</option>
            <option value="gothic">Gothic</option>
            <option value="bohemian">Bohemian</option>
            <option value="coquette">Coquette</option>
            <option value="streetwear">Streetwear</option>
            <option value="oldmoney">Old Money</option>
          </select>
        </div>

        <div className="form-group">
          <label>ขนาด</label>
          <div className="size-selector">
            {sizes.map(size => (
              <button
                key={size}
                type="button"
                className={`size-button ${selectedSizes.includes(size) ? 'active' : ''}`}
                onClick={() => toggleSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="allowRental"
              checked={formData.allowRental}
              onChange={handleChange}
            />
            <span>อนุญาติให้เช่า</span>
          </label>
        </div>

        <div className="form-group">
          <label>รูปภาพสินค้า</label>
          <div className="image-upload">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              id="image-upload"
            />
            <label htmlFor="image-upload" className="upload-button">
              + เพิ่มรูปภาพ
            </label>
          </div>

          {formData.images.length > 0 && (
            <div className="image-preview">
              {formData.images.map((image, index) => (
                <div key={index} className="preview-item">
                  <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        images: formData.images.filter((_, i) => i !== index)
                      });
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn-primary">
          เพิ่มสินค้า
        </button>
      </form>
    </div>
  );
}

export default AddProduct;