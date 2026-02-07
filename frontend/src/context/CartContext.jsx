import React, { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

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

  // ฟังก์ชันสำหรับดึงข้อมูลสินค้าล่าสุดจาก Database เพื่ออัพเดทราคา/ข้อมูล
  const refreshCartData = async () => {
    try {
      if (cartItems.length === 0) return;

      // สร้าง Array ของ Promise เพื่อดึงข้อมูลสินค้าแต่ละตัว
      const updatedItemsPromises = cartItems.map(async (item) => {
        try {
          const response = await fetch(`http://localhost:3000/api/product/${item.productId}`);
          const data = await response.json();
          
          if (data.success && data.payload) {
            const product = data.payload;
            // คำนวณราคาใหม่ (เผื่อมีการเปลี่ยนแปลง)
            const newPrice = item.type === 'rent' 
              ? Math.round(product.productPrice * 0.1) 
              : product.productPrice;

            return {
              ...item,
              productName: product.productname,
              productPhoto: product.productphoto,
              productPrice: newPrice,
              fullPrice: product.productPrice, // เก็บราคาเต็มไว้คำนวณกรณีเปลี่ยน type
              shopName: product.shop?.name || 'ร้านค้า',
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
  };

  // เรียกใช้ refreshCartData เมื่อโหลดหน้าเว็บครั้งแรก (หรือจะเรียกตอนเปิดหน้า Cart ก็ได้)
  useEffect(() => {
    refreshCartData();
  }, []);

  // เพิ่มสินค้าลงตะกร้า
  const addToCart = (product, type = 'buy') => {
    const cartItem = {
      id: `${product._id}-${Date.now()}`, // ตัด type ออกจาก id เพื่อให้จัดการง่ายขึ้น หรือถ้าอยากแยกรายการก็คงไว้ได้ แต่ในที่นี้จะรวม
      productId: product._id,
      productName: product.productname,
      productPhoto: product.productphoto,
      productPrice: type === 'rent' 
        ? Math.round(product.productPrice * 0.1) 
        : product.productPrice,
      fullPrice: product.productPrice, // เก็บราคาเต็ม
      type: type,
      shopName: product.shop?.name || 'ร้านค้า',
      quantity: 1,
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

  // ล้างตะกร้า
  const clearCart = () => {
    setCartItems([]);
  };

  // จำนวนสินค้าในตะกร้า
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // ยอดรวม
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.productPrice * item.quantity), 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateItemType,
    clearCart,
    cartCount,
    cartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
