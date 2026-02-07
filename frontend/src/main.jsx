import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import HomePage from './HomePage.jsx'
import Register from './register.jsx'
import RegisterShop from './registerShop.jsx'
import ProductDetailPage from './ProductDetailPage.jsx'
import ShopProfilePage from './ShopProfilePage.jsx'
import CheckoutPage from './CheckoutPage.jsx'
import CartPage from './CartPage.jsx'
import { CartProvider } from './context/CartContext.jsx'

import SearchPage from './SearchPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerShop" element={<RegisterShop />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/shop/:id" element={<ShopProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
)

