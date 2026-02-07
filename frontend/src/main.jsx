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
import { CartProvider } from './context/CartProvider.jsx'
import SearchPage from './SearchPage.jsx'
import ShopOwnerProfile from './ShopOwnerProfile.jsx'
import SellerProductListPage from './SellerProductListPage.jsx'
import AddProductPage from './AddProductPage.jsx'
import EditProductPage from './EditProductPage.jsx'
import UserProfilePage from './UserProfilePage.jsx'
import OrderListPage from './OrderListPage.jsx'
import AddressEditPage from './AddressEditPage.jsx'
import StylesPage from './StylesPage.jsx'
import SelectedStylePage from './SelectedStylePage.jsx'
import OrderTrackingPage from './OrderTrackingPage.jsx'

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
          <Route path="/shop-owner-profile" element={<ShopOwnerProfile />} />
          <Route path="/seller-products" element={<SellerProductListPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/edit-product/:id" element={<EditProductPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/order-list" element={<OrderListPage />} />
          <Route path="/styles" element={<StylesPage />} />
          <Route path="/style/:styleName" element={<SelectedStylePage />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
          <Route path="/address-edit" element={<AddressEditPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
)

