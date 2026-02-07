import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import HomePage from './HomePage.jsx'
import Register from './register.jsx'
import RegisterShop from './registerShop.jsx'
import ShopOwnerProfile from './ShopOwnerProfile.jsx'
import ProductDetailPage from './ProductDetailPage.jsx'
import SellerProductListPage from './SellerProductListPage.jsx'
import AddProductPage from './AddProductPage.jsx'
import EditProductPage from './EditProductPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/shop-profile" element={<ShopOwnerProfile />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/seller-products" element={<SellerProductListPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/edit-product/:id" element={<EditProductPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registerShop" element={<RegisterShop />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

