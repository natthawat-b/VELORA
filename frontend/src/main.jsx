import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Register from './register.jsx'
import RegisterShop from './registerShop.jsx'
import Home from './Home.jsx'
import ProductDetail from './ProductDetail.jsx'
import ShopPage from './ShopPage.jsx'
import CartPage from './CartPage.jsx'
import CheckoutPage from './CheckoutPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registerShop" element={<RegisterShop />} />
        <Route path="/home" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/shop/:shopId" element={<ShopPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

