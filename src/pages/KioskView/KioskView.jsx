import React, { useState } from 'react';
import menuData from '../../data/data.json'
import styles from './KioskView.module.css'

function KioskView({ socket }) {
  const [cart, setCart] = useState([]);
  
  const addToCart = (item) => {
    const uniqueItem = {
        ...item,
        cartId: crypto.randomUUID()
    };

    setCart(prevCart => [...prevCart, uniqueItem]);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const orderData = { id: Date.now(), items: cart };
    socket.emit('new_order', orderData);
    setCart([]);
    alert("Thanks! Order was sent to /kitchen");
  };

  return (
<div className={styles.container}>
    <div>
        {menuData.map(item => (
            <button key={item.id} onClick={() => addToCart(item)}>
                <strong>{item.name}</strong><br/>{item.price} kr
            </button>
        ))}
    </div>

    <div>
        {cart.map(item => <div key={item.cartId}>{item.name}</div>)}
    </div>

    {/* TOTAL AND PAYMENT */}
    <div>
        <h3>Total: {cart.reduce((sum, i) => sum + i.price, 0)} kr</h3>
        <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
        >
            Send to /Kitchen
        </button>
    </div>
</div>
  )
}

export default KioskView;