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
    <main className="min-h-screen bg-[#f4f5f1] text-[#20251f]">
    <header className="bg-[#183d32] px-6 py-6 text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c8d9c9]">
            Kiosk & KDS
          </p>
          <h1 className="mt-1 text-3xl font-bold">Kitchen display</h1>
          <p className="mt-1 text-sm text-[#d9e4da]">
            Incoming orders, ready to prepare
          </p>
        </div>

        <div className="rounded-xl bg-white/10 px-4 py-3 text-center">
          <p className="text-2xl font-bold">{orders.length}</p>
          <p className="text-xs text-[#d9e4da]">active orders</p>
        </div>
      </div>
    </header>

    <section className="mx-auto max-w-7xl px-6 py-8">
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#cbd2c8] bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf3ec] text-2xl">
            ✓
          </div>
          <h2 className="mt-4 text-xl font-bold">All caught up</h2>
          <p className="mt-2 text-[#6d746c]">
            New orders will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <article
              key={order.id}
              className="overflow-hidden rounded-2xl border border-[#e3e7df] bg-white shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-[#edf0eb] px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#788278]">
                    Order
                  </p>
                  <h2 className="text-2xl font-bold">
                    #{String(order.id).slice(-4)}
                  </h2>
                </div>

                <span className="rounded-full bg-[#fff1dc] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#9a5b13]">
                  {order.status || 'new'}
                </span>
              </div>

              <div className="px-5 py-4">
                <p className="mb-3 text-sm font-semibold text-[#6d746c]">
                  {order.items.length}{' '}
                  {order.items.length === 1 ? 'item' : 'items'}
                </p>

                <ul className="space-y-3">
                  {order.items.map((item, index) => (
                    <li
                      key={item.cartId || `${item.id}-${index}`}
                      className="flex items-center gap-3"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#edf3ec] text-sm font-bold text-[#45634c]">
                        {index + 1}
                      </span>
                      <span className="font-medium">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-5 pb-5">
                <button
                  type="button"
                  onClick={() => completeOrder(order.id)}
                  className="w-full rounded-xl bg-[#183d32] px-4 py-3 font-semibold text-white transition hover:bg-[#245342] focus:outline-none focus:ring-2 focus:ring-[#183d32] focus:ring-offset-2"
                >
                  Mark as done
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  </main>
  )
}
