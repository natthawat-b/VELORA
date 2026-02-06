// ==========================================
// 1. Authentication & Profile System
// ==========================================

export const login = async (username, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Network error' };
  }
};

export const registerCustomer = async (data) => {
  // data: { name, email, password, phone }
  try {
    const response = await fetch('/api/auth/register/customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Register customer error:', error);
    return { success: false, message: 'Network error' };
  }
};

export const registerSeller = async (data) => {
  // data: { ...customerData, shopName, idCardNumber, bankInfo, accountNumber }
  try {
    const response = await fetch('/api/auth/register/seller', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Register seller error:', error);
    return { success: false, message: 'Network error' };
  }
};

export const updateProfile = async (userId, data, isSeller = false) => {
  // data can include image, personal info
  const endpoint = isSeller ? `/api/seller/${userId}` : `/api/user/${userId}`;
  try {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, message: 'Network error' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload();
};

// ==========================================
// 2. Product Display & Filtering
// ==========================================

export const getRecommendedProducts = async () => {
  try {
    const response = await fetch('/api/products/recommended');
    return await response.json(); // Expected: [{ id, image, name, price, rentalPrice, ... }]
  } catch (error) {
    console.error('Get recommended products error:', error);
    return [];
  }
};

export const filterProductsByStyle = (products, style) => {
  // style examples: 'Streetwear', 'Y2K', 'Old Money', 'Minimalist'
  if (!style || style === 'All') return products;
  return products.filter(product => product.style === style);
};

export const getProductDetails = async (productId) => {
  try {
    const response = await fetch(`/api/products/${productId}`);
    return await response.json(); // Expected: { ..., largeImages, description, rating, comments }
  } catch (error) {
    console.error('Get product details error:', error);
    return null;
  }
};

// ==========================================
// 3. Storefront System
// ==========================================

export const getStoreInfo = async (storeId) => {
  try {
    const response = await fetch(`/api/stores/${storeId}`);
    return await response.json(); // Expected: { name, rating, ... }
  } catch (error) {
    console.error('Get store info error:', error);
    return null;
  }
};

export const getStoreProducts = async (storeId) => {
  try {
    const response = await fetch(`/api/stores/${storeId}/products`);
    return await response.json();
  } catch (error) {
    console.error('Get store products error:', error);
    return [];
  }
};

// ==========================================
// 4. Purchase & Rental Options
// ==========================================

export const calculateRentalPrice = (dailyRate, days) => {
  // Basic calculation: rate * days + deposit (if any)
  // Assuming deposit is handled separately or included in initial logic
  return dailyRate * days;
};

export const toggleRentBuyMode = (mode) => {
  // This might be a UI state helper, returning the active mode string
  return mode === 'buy' ? 'rent' : 'buy';
};

// ==========================================
// 5. Shopping Cart System
// ==========================================

// Assuming cart is stored in localStorage or Context, here are helper functions interacting with a hypothetical local cart state

export const addToCart = (cart, product, size, type, rentalDays = 0) => {
  const newCart = [...cart];
  const existingItemIndex = newCart.findIndex(
    item => item.id === product.id && item.size === size && item.type === type
  );

  if (existingItemIndex > -1) {
    newCart[existingItemIndex].quantity += 1;
  } else {
    newCart.push({
      ...product,
      size,
      type, // 'buy' or 'rent'
      quantity: 1,
      rentalDays: type === 'rent' ? rentalDays : 0
    });
  }
  return newCart;
};

export const updateCartItemQuantity = (cart, itemId, change) => {
  return cart.map(item => {
    if (item.id === itemId) {
      const newQuantity = Math.max(0, item.quantity + change);
      return { ...item, quantity: newQuantity };
    }
    return item;
  }).filter(item => item.quantity > 0); // Remove if 0
};

export const removeFromCart = (cart, itemId) => {
  return cart.filter(item => item.id !== itemId);
};

// ==========================================
// 6. Checkout System
// ==========================================

export const calculateCartTotal = (cart) => {
  return cart.reduce((total, item) => {
    const price = item.type === 'rent' ? (item.rentalPrice * item.rentalDays) : item.price;
    return total + (price * item.quantity);
  }, 0);
};

export const calculateCheckoutTotal = (cartTotal, shippingCost, insuranceCost = 0) => {
  return cartTotal + shippingCost + insuranceCost;
};

export const updateShippingMethod = (method) => {
  // Returns cost based on method
  const rates = {
    'standard': 30, // 30 THB
    'express': 50   // 50 THB
  };
  return rates[method] || 0;
};

// ==========================================
// 7. Address Management
// ==========================================

export const getProvinces = async () => {
    // Mock or API call for Thai provinces
    return ['Bangkok', 'Chiang Mai', 'Phuket', 'Khon Kaen']; 
};

export const saveAddress = async (userId, addressData) => {
  try {
    const response = await fetch(`/api/users/${userId}/address`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(addressData),
    });
    return await response.json();
  } catch (error) {
    console.error('Save address error:', error);
    return { success: false };
  }
};

// ==========================================
// 8. Payment System
// ==========================================

export const processPayment = async (orderId, paymentMethod, bankDetails = null) => {
  const payload = {
    orderId,
    method: paymentMethod, // 'cash' or 'bank_transfer'
    bankDetails: paymentMethod === 'bank_transfer' ? bankDetails : null
  };

  try {
    const response = await fetch('/api/payment/process', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error('Payment processing error:', error);
    return { success: false };
  }
};

export const linkBankAccount = async (userId, bankInfo) => {
  try {
    const response = await fetch(`/api/users/${userId}/bank-account`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(bankInfo),
    });
    return await response.json();
  } catch (error) {
    console.error('Link bank account error:', error);
    return { success: false };
  }
};

// ==========================================
// 9. Order Tracking
// ==========================================

export const getOrderStatus = async (userId, role = 'buyer') => {
  // role: 'buyer' or 'seller'
  const endpoint = role === 'seller' ? `/api/seller/${userId}/orders` : `/api/users/${userId}/orders`;
  try {
    const response = await fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const orders = await response.json();
    
    // Categorizing orders logic would happen here or in component
    // Example: orders.filter(o => o.status === 'shipping')
    return orders; 
  } catch (error) {
    console.error('Get order status error:', error);
    return [];
  }
};

// ==========================================
// 10. Seller Operations & Finance
// ==========================================

export const addNewProduct = async (sellerId, productData) => {
  try {
    const response = await fetch(`/api/seller/${sellerId}/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(productData),
    });
    return await response.json();
  } catch (error) {
    console.error('Add product error:', error);
    return { success: false };
  }
};

export const requestWithdrawal = async (sellerId, amount) => {
  try {
    const response = await fetch(`/api/seller/${sellerId}/withdraw`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ amount }),
    });
    return await response.json();
  } catch (error) {
    console.error('Withdrawal request error:', error);
    return { success: false };
  }
};
