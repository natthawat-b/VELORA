import React, { useState } from 'react';
import { 
    addToCart, removeFromCart, 
    calculateCartTotal, calculateCheckoutTotal, updateShippingMethod
} from '../../function';

const CartSection = () => {
  const [cart, setCart] = useState([]);
  const [output, setOutput] = useState(null);
  
  // Mock inputs
  const [newItem, setNewItem] = useState({ id: 1, name: 'Sample Item', price: 100, rentalPrice: 50 });
  const [size, setSize] = useState('M');
  const [type, setType] = useState('buy');
  const [rentalDays, setRentalDays] = useState(3);
  const [shippingMethod, setShippingMethod] = useState('standard');

  const handleAddToCart = () => {
      const updatedCart = addToCart(cart, newItem, size, type, rentalDays);
      setCart(updatedCart);
      setOutput({ message: 'Added to cart', cart: updatedCart });
  };

  const handleCalculateTotal = () => {
      const total = calculateCartTotal(cart);
      const outputMsg = { cartTotal: total };
      setOutput(outputMsg);
  };

  const handleCheckoutCalc = () => {
      const cartTotal = calculateCartTotal(cart);
      const shipping = updateShippingMethod(shippingMethod);
      const finalTotal = calculateCheckoutTotal(cartTotal, shipping);
      setOutput({ 
          cartTotal, 
          shippingCost: shipping, 
          finalTotal 
      });
  };

  return (
    <div className="section-container">
      <div className="card">
        <h3>Add Mock Item</h3>
        <div className="form-group">
            <label>Item Name</label>
            <input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
        </div>
        <div className="form-group">
            <label>Price (Buy)</label>
            <input type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} />
        </div>
        <div className="form-group">
            <label>Price (Rent/Day)</label>
            <input type="number" value={newItem.rentalPrice} onChange={e => setNewItem({...newItem, rentalPrice: Number(e.target.value)})} />
        </div>
        <div className="form-group" style={{display:'flex', gap:'10px'}}>
             <div style={{flex:1}}>
                 <label>Type</label>
                 <select value={type} onChange={e => setType(e.target.value)}>
                     <option value="buy">Buy</option>
                     <option value="rent">Rent</option>
                 </select>
             </div>
             <div style={{flex:1}}>
                 <label>Size</label>
                 <select value={size} onChange={e => setSize(e.target.value)}>
                     <option value="S">S</option>
                     <option value="M">M</option>
                     <option value="L">L</option>
                 </select>
             </div>
        </div>
        {type === 'rent' && (
            <div className="form-group">
                <label>Rental Days</label>
                <input type="number" value={rentalDays} onChange={e => setRentalDays(Number(e.target.value))} />
            </div>
        )}
        <button className="btn-primary" onClick={handleAddToCart}>Add to Cart</button>
      </div>

      <div className="card">
        <h3>Cart Actions</h3>
        <div className="cart-preview" style={{maxHeight:'150px', overflowY:'auto', background:'rgba(0,0,0,0.2)', padding:'10px', borderRadius:'8px', marginBottom:'10px'}}>
            {cart.length === 0 ? 'Cart Empty' : cart.map((item, idx) => (
                <div key={idx} style={{borderBottom:'1px solid #444', paddingBottom:'5px', marginBottom:'5px', display:'flex', justifyContent:'space-between', fontSize:'0.85rem'}}>
                    <span>{item.name} ({item.type} x{item.quantity})</span>
                    <button style={{padding:'2px 5px', fontSize:'0.7rem', background:'#e74c3c'}} onClick={() => {
                        const newCart = removeFromCart(cart, item.id);
                        setCart(newCart);
                    }}>X</button>
                </div>
            ))}
        </div>
        <button className="btn-secondary" onClick={handleCalculateTotal}>Calc Subtotal</button>
        
        <h4 style={{marginTop:'20px', marginBottom:'10px', fontSize:'1rem'}}>Checkout</h4>
        <div className="form-group">
            <label>Shipping</label>
            <select value={shippingMethod} onChange={e => setShippingMethod(e.target.value)}>
                <option value="standard">Standard (30)</option>
                <option value="express">Express (50)</option>
            </select>
        </div>
        <button className="btn-primary" onClick={handleCheckoutCalc}>Calc Final Total</button>
      </div>

       {/* Output Console */}
       <div className="card" style={{gridColumn: '1 / -1'}}>
        <h3>Result Console</h3>
        <div className="output-area">
          {output ? JSON.stringify(output, null, 2) : '// Waiting for action...'}
        </div>
      </div>
    </div>
  );
};

export default CartSection;
