import React, { useState } from 'react';
import menuData from '../../data/data.json'


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
<div className='min-h-screen bg-gray-100 p-8'>
    <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-12'>
        {menuData.map(item => (
            <button key={item.id} onClick={() => addToCart(item)} className='bg-white p-4 rounded-xl shadow-sm border border-gray-200 w-52 h-12'>
                <strong className='text-lg font-semibold'>{item.name}</strong><br/>{item.price} kr
            </button>
        ))}
        </div>
    </div>

    <div className='bg-white p-6 rounded-xl shadow-lg h-fit border border-gray-200 mt-12'>
        {cart.map(item => <div key={item.cartId}>{item.name}</div>)}
    </div>

    {/* TOTAL AND PAYMENT */}
    <div>
        <h3>Total: {cart.reduce((sum, i) => sum + i.price, 0)} kr</h3>
        <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className='w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition'
        >
            Send to /Kitchen
        </button>
    </div>
</div>
  )
}

export default KioskView;