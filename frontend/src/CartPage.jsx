import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assets/Cart.css';

const API_URL = 'http://localhost:3001/api';

function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]); // Array of productIds
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems, selectedItems]);

  const fetchCart = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      // ถ้าไม่มี session ให้หยุด loading แล้วปล่อยให้ UI แสดงผลว่าต้อง Login
      if (!userData || !userData._id) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/cart/${userData._id}`);
      if (response.data.success) {
        setCartItems(response.data.payload?.items || []);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach(item => {
      // Check if item is selected
      // Note: item structure is { productId: {...}, quantity, ... }
      // We use item._id (unique cart item id) or productId._id to track selection
      // Better use item._id if available, but cart items in mongoose subdoc has _id usually.
      
      if (selectedItems.includes(item._id)) {
        const price = item.rentalDays 
            ? (item.productId.productrentprice || 0) * item.rentalDays
            : (item.productId.productprice || 0);
        total += price * item.quantity;
      }
    });
    setTotalPrice(total);
  };

  const toggleSelection = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const updateQuantity = async (item, newQty) => {
    if (newQty < 1) return;
    
    // Optimistic update
    const oldItems = [...cartItems];
    const updatedItems = cartItems.map(i => 
        i._id === item._id ? { ...i, quantity: newQty } : i
    );
    setCartItems(updatedItems);

    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      await axios.put(`${API_URL}/cart/update`, {
        userId: userData._id,
        productId: item.productId._id,
        size: item.size,
        rentalDays: item.rentalDays,
        quantity: newQty
      });
    } catch (err) {
      console.error('Error updating quantity:', err);
      setCartItems(oldItems); // Revert on error
    }
  };

  const removeItem = async (item) => {
    if (!window.confirm('ต้องการลบสินค้านี้ออกจากตะกร้า?')) return;

    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      await axios.delete(`${API_URL}/cart/remove`, {
        data: {
          userId: userData._id,
          productId: item.productId._id,
          size: item.size,
          rentalDays: item.rentalDays
        }
      });
      // Update UI
      setCartItems(cartItems.filter(i => i._id !== item._id));
      setSelectedItems(selectedItems.filter(id => id !== item._id));
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  if (loading) {
    return <div className="cart-container loading-cart">กำลังโหลดตะกร้า...</div>;
  }

  return (
    <div className="cart-container">
      {/* Header */}
      <header className="cart-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="cart-title">รถเข็น ({cartItems.length})</h1>
      </header>

      {/* Cart Items */}
      <div className="cart-list">
        {!JSON.parse(localStorage.getItem('userData'))?.username ? (
           <div className="empty-cart">
             <p>กรุณาเข้าสู่ระบบเพื่อดูตะกร้าสินค้า</p>
             <button className="checkout-btn" onClick={() => navigate('/home')} style={{marginTop: '10px', width: 'auto', padding: '10px 20px'}}>
               กลับไปหน้าหลัก
             </button>
           </div>
        ) : cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item._id} className="cart-item-card">
              <div className="cart-shop-header">
                <span className="cart-shop-name">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  ชื่อร้านค้า
                </span>
                <button className="remove-btn-text" onClick={() => removeItem(item)}>ลบ</button>
              </div>

              <div className="cart-item-body">
                 {/* Checkbox */}
                <div className="cart-item-select">
                  <div 
                    className={`cart-checkbox ${selectedItems.includes(item._id) ? 'checked' : ''}`}
                    onClick={() => toggleSelection(item._id)}
                  ></div>
                </div>

                {/* Image */}
                <div className="cart-item-image">
                   {item.productId.productphoto ? (
                      <img src={item.productId.productphoto} alt={item.productId.productname} />
                   ) : (
                      <div style={{width: '100%', height: '100%', backgroundColor: '#eee'}}></div>
                   )}
                </div>

                {/* Details */}
                <div className="cart-item-details">
                   <div className="cart-item-name">{item.productId.productname}</div>
                   
                   {/* Specs Tag */}
                   <div className="cart-item-specs">
                      {item.size && <span>{item.size}</span>}
                      {item.size && item.rentalDays && <span>, </span>}
                      {item.rentalDays && <span>{item.rentalDays} วัน</span>}
                   </div>

                   <div className="cart-item-footer">
                      <div className="cart-item-price">
                        ฿ {
                            (item.rentalDays 
                                ? (item.productId.productrentprice || 0) * item.rentalDays  
                                : (item.productId.productprice || 0)
                            ).toLocaleString()
                        }
                      </div>
                      
                      <div className="quantity-controls">
                        <button className="qty-btn" onClick={() => updateQuantity(item, item.quantity - 1)}>-</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item, item.quantity + 1)}>+</button>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-cart">
             <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
             </svg>
             <p>ไม่มีสินค้าในตะกร้า</p>
          </div>
        )}
      </div>

      {/* Checkout Bar */}
      <div className="cart-bottom-bar">
        <button 
            className="checkout-btn" 
            disabled={selectedItems.length === 0}
            onClick={() => {
                // Filter selected items from cartItems
                const itemsToCheckout = cartItems.filter(item => selectedItems.includes(item._id));
                navigate('/checkout', { state: { selectedItems: itemsToCheckout } });
            }}
        >
          ชำระเงิน ({totalPrice.toLocaleString()})
        </button>
      </div>
    </div>
  );
}

export default CartPage;
