import React, { useState, useEffect, useCallback } from 'react';
import { CartContext } from './CartContext';

export function CartProvider({ children }) {
  // โหลดข้อมูลจาก localStorage เมื่อเริ่มต้น
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('velora_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // บันทึกลง localStorage ทุกครั้งที่ cartItems เปลี่ยน
  useEffect(() => {
    localStorage.setItem('velora_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Helper function to calculate days between dates
  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 0 ? daysDiff : 1;
  };

  // ฟังก์ชันสำหรับดึงข้อมูลสินค้าล่าสุดจาก Database เพื่ออัพเดทราคา/ข้อมูล
  const refreshCartData = useCallback(async () => {
    try {
      const currentItems = JSON.parse(localStorage.getItem('velora_cart') || '[]');
      if (currentItems.length === 0) return;

      // สร้าง Array ของ Promise เพื่อดึงข้อมูลสินค้าแต่ละตัว
      const updatedItemsPromises = currentItems.map(async (item) => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'https://velora-1.onrender.com';
          const response = await fetch(`${apiUrl}/api/product/${item.productId}`);
          const data = await response.json();
          
          if (data.success && data.payload) {
            const product = data.payload;
            // Normalize price (handle case sensitivity)
            const price = product.productPrice || product.productprice || 0;

            // คำนวณราคาใหม่ (เผื่อมีการเปลี่ยนแปลง)
            const newPrice = item.type === 'rent' 
              ? Math.round(price * 0.1) 
              : price;

            return {
              ...item,
              productName: product.productname,
              productPhoto: product.productphoto,
              productPrice: newPrice,
              fullPrice: price, // เก็บราคาเต็มไว้คำนวณกรณีเปลี่ยน type
              shopName: product.shop?.name || 'ร้านค้า',
              rentalDays: item.rentalDays || calculateDays(item.rentalStartDate, item.rentalEndDate),
              rentalStartDate: item.rentalStartDate,
              rentalEndDate: item.rentalEndDate,
              isDateSpecific: item.isDateSpecific !== undefined ? item.isDateSpecific : true,
              isSelected: item.isSelected !== undefined ? item.isSelected : true,
            };
          }
          return item; // ถ้าดึงไม่สำเร็จ ให้ใช้ข้อมูลเดิม
        } catch (err) {
          console.error(`Error refreshing item ${item.productId}:`, err);
          return item;
        }
      });

      const updatedItems = await Promise.all(updatedItemsPromises);
      
      // อัพเดท state ถ้าข้อมูลมีการเปลี่ยนแปลง (เช็คแบบคร่าวๆ หรือ set เลยก็ได้)
      setCartItems(updatedItems);
    } catch (error) {
      console.error('Error refreshing cart data:', error);
    }
  }, []);

  // เรียกใช้ refreshCartData เมื่อโหลดหน้าเว็บครั้งแรก
  useEffect(() => {
    // Async function ภายใน useEffect เพื่อหลีกเลี่ยง warning
    const loadInitialData = async () => {
      await refreshCartData();
    };
    loadInitialData();
  }, [refreshCartData]);

  // เพิ่มสินค้าลงตะกร้า
  const addToCart = (product, type = 'buy') => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const price = product.productPrice || product.productprice || 0;
    
    const cartItem = {
      id: `${product._id}-${Date.now()}`,
      productId: product._id,
      productName: product.productname,
      productPhoto: product.productphoto,
      productPrice: type === 'rent' 
        ? Math.round(price * 0.1) 
        : price,
      fullPrice: price,
      type: type,
      shopName: product.shop?.name || 'ร้านค้า',
      quantity: 1,
      rentalDays: 1, 
      rentalStartDate: type === 'rent' ? today.toISOString().split('T')[0] : null,
      rentalEndDate: type === 'rent' ? tomorrow.toISOString().split('T')[0] : null,
      isDateSpecific: true,
      isSelected: true, // Default selected
    };

    setCartItems(prev => [...prev, cartItem]);
    return true;
  };



  // เปลี่ยนประเภทสินค้า (เช่า <-> ซื้อ)
  const updateItemType = (id, newType) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        // คำนวณราคาใหม่จาก fullPrice
        const newPrice = newType === 'rent'
          ? Math.round(item.fullPrice * 0.1)
          : item.fullPrice;
          
        return { 
          ...item, 
          type: newType,
          productPrice: newPrice
        };
      }
      return item;
    }));
  };

  // อัพเดทช่วงวันเช่า
  const updateRentalDates = (id, startDate, endDate) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.type === 'rent') {
         const days = calculateDays(startDate, endDate);
         return { 
           ...item, 
           rentalStartDate: startDate,
           rentalEndDate: endDate,
           rentalDays: days 
          };
      }
      return item;
    }));
  }

  // สลับโหมดระบุวัน / ระบุจำนวนวัน
  const toggleDateMode = (id) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.type === 'rent') {
        const newIsDateSpecific = !item.isDateSpecific;
        
        // ถ้าเปลี่ยนมาเป็นระบุวัน ให้ตั้งค่าเริ่มต้นเป็นวันนี้-พรุ่งนี้
        let newStartDate = item.rentalStartDate;
        let newEndDate = item.rentalEndDate;
        
        if (newIsDateSpecific && !newStartDate) {
           const today = new Date();
           const endDate = new Date(today);
           endDate.setDate(today.getDate() + (item.rentalDays || 1));
           
           newStartDate = today.toISOString().split('T')[0];
           newEndDate = endDate.toISOString().split('T')[0];
        }

        return {
          ...item,
          isDateSpecific: newIsDateSpecific,
          rentalStartDate: newIsDateSpecific ? newStartDate : null,
          rentalEndDate: newIsDateSpecific ? newEndDate : null
        };
      }
      return item;
    }));
  };

  // อัพเดทจำนวนวันเช่า (กรณีไม่ระบุวันที่)
  const updateRentalDuration = (id, days) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.type === 'rent') {
        return {
          ...item,
          rentalDays: days > 0 ? days : 1
        };
      }
      return item;
    }));
  };

  // ลบสินค้าออกจากตะกร้า
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // อัพเดทจำนวนสินค้า
  const updateQuantity = (id, change) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  // ลบหลายสินค้าออกจากตะกร้า (สำหรับ Checkout)
  const removeItems = (ids) => {
    setCartItems(prev => prev.filter(item => !ids.includes(item.id)));
  };

  // ล้างตะกร้า
  const clearCart = () => {
    setCartItems([]);
  };

  // Toggle Item Selection
  const toggleSelection = (id) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isSelected: !item.isSelected };
      }
      return item;
    }));
  };

  // จำนวนสินค้าในตะกร้า
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // ยอดรวม (เฉพาะที่เลือก)
  const cartTotal = cartItems.reduce((acc, item) => {
    if (!item.isSelected) return acc; // Skip unselected items

    const price = item.type === 'rent' 
      ? item.productPrice * item.rentalDays // For rent: Price * Days
      : item.productPrice; // For buy: Price only
    return acc + (price * item.quantity);
  }, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateItemType,
    updateRentalDates,
    toggleDateMode,
    updateRentalDuration,
    toggleSelection,
    clearCart,
    removeItems,
    cartCount,
    cartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
