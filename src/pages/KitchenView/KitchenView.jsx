import React, { useState, useEffect} from 'react'

export default function KitchenView({ socket }) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
  const handleNewOrder = (newOrder) => {
    setOrders((current) => [
      ...current.filter((order) => String(order.id) !== String(newOrder.id)),
      newOrder,
    ]);
  };

  const handleCompletedOrder = (orderId) => {
    setOrders((current) =>
      current.filter((order) => String(order.id) !== String(orderId))
    );
  };

  socket.on('display_order', handleNewOrder);
  socket.on('order_completed', handleCompletedOrder);

  fetch('http://localhost:4000/orders')
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((savedOrders) => {
      setOrders((current) => {
        const byId = new Map(
          current.map((order) => [String(order.id), order])
        );

        savedOrders.forEach((order) => byId.set(String(order.id), order));
        return Array.from(byId.values());
      });
    })
    .catch((error) => {
      console.error('Could not get saved order:', error);
    });

  return () => {
    socket.off('display_order', handleNewOrder);
    socket.off('order_completed', handleCompletedOrder);
  };
}, [socket]);

const completeOrder = (orderId) => {
  socket.timeout(5000).emit('complete_order', orderId, (timeoutError, response) => {
    if (timeoutError || !response?.ok) {
      console.error(
        'Could not mark order as done:',
        response?.error || 'Server not answering'
      );
    }
  });
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
