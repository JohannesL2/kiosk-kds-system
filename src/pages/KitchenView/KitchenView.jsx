import React, { useState, useEffect} from 'react'

export default function KitchenView({ socket }) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        socket.on('display_order', (newOrder) => {
            console.log("New order received in kitchen", newOrder);
            setOrders((prevOrders) => [...prevOrders, newOrder]);
        });

        return () => socket.off('display_order');
    }, [socket]);

    const completeOrder = (orderId) => {
        setOrders(orders.filter(order => order.id !== orderId));
    };

  return (
    <div>
        <h1>KitchenView</h1>

        <div>
            {orders.length === 0 && <p>No orders currently...</p>}

            {orders.map((order) => (
                <div key={order.id}>
                    <h2>Order #{order.id.toString().slice(-4)}</h2>
                    <ul>
                        {order.items.map((item, index) => (
                            <li key={index}>
                                {item.name}
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => completeOrder(order.id)}
                    >
                        Done
                    </button>
                </div>
            ))}
        </div>
    </div>
  )
}
