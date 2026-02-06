import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';

// Pages
import Login from './pages/Login';
import CustomerSignup from './pages/CustomerSignup';
import SellerSignup from './pages/SellerSignup';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AddressEdit from './pages/AddressEdit';
import StyleBrowser from './pages/StyleBrowser';
import UserProfile from './pages/UserProfile';
import SellerDashboard from './pages/SellerDashboard';
import Withdraw from './pages/Withdraw';
import AddProduct from './pages/AddProduct';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Authentication Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup/customer" element={<CustomerSignup />} />
          <Route path="/signup/seller" element={<SellerSignup />} />

          {/* Customer Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/address/edit" element={<AddressEdit />} />
          <Route path="/styles" element={<StyleBrowser />} />
          <Route path="/profile" element={<UserProfile />} />

          {/* Seller Routes */}
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/withdraw" element={<Withdraw />} />
          <Route path="/seller/product/add" element={<AddProduct />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;