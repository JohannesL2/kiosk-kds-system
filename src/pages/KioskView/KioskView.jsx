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

  const removeFromCart = (cartId) => {
  setCart((currentCart) =>
    currentCart.filter((item) => item.cartId !== cartId)
  );
};

  return (
<main className="min-h-screen bg-[#f7f5ef] text-[#20251f]">
    <header className="bg-[#183d32] px-6 py-5 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div>
          <p className="text-sm font-medium tracking-widest text-[#c8d9c9]">
            KIOSK & KDS
          </p>
          <h1 className="mt-1 text-2xl font-bold">Good food, made easy.</h1>
        </div>

        <a
          href="/kitchen"
          className="rounded-full border border-white/30 px-4 py-2 text-sm transition hover:bg-white/10"
        >
          Kitchen display
        </a>
      </div>
    </header>

    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[1fr_360px]">
      <section>
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#66806d]">
            Fresh from the kitchen
          </p>
          <h2 className="mt-1 text-3xl font-bold">Our menu</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {menuData.map((item) => (
            <article
              key={item.id}
              className="flex min-h-52 flex-col justify-between rounded-2xl border border-[#e8e5dc] bg-white p-5 shadow-sm hover:shadow-md"
            >
              <div>
                <span className="rounded-full bg-[#edf3ec] px-3 py-1 text-xs font-semibold text-[#45634c]">
                  {item.category}
                </span>
                <h3 className="mt-4 text-xl font-bold">{item.name}</h3>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="font-semibold">{item.price} kr</span>
                <button
                  type="button"
                  onClick={() => addToCart(item)}
                  className="rounded-full bg-[#e87942] cursor-pointer px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#cf6330] focus:outline-none focus:ring-2 focus:ring-[#e87942] focus:ring-offset-2"
                >
                  Add to order
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="h-fit rounded-2xl border border-[#e8e5dc] bg-white p-6 shadow-sm lg:sticky lg:top-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Your order</h2>
          <span className="rounded-full bg-[#edf3ec] px-3 py-1 text-sm font-semibold text-[#45634c]">
            {cart.length} {cart.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {cart.length === 0 ? (
          <p className="mt-6 rounded-xl bg-[#f7f5ef] p-4 text-sm text-[#6d746c]">
            The order is empty. Add something from the menu.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-[#eeeae1]">
            {cart.map((item) => (
              <li
                key={item.cartId}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="mt-1 text-sm text-[#6d746c]">{item.price} kr</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.cartId)}
                  aria-label={`Remove ${item.name}`}
                  className="rounded-full px-3 py-1 text-sm font-medium text-[#9b4a35] transition hover:bg-[#fbefeb]"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-[#eeeae1] pt-5">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold">
            {cart.reduce((sum, item) => sum + item.price, 0)} kr
          </span>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={cart.length === 0}
          className="mt-5 w-full rounded-xl bg-[#183d32] cursor-pointer px-4 py-3 font-semibold text-white transition hover:bg-[#245342] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Send order to kitchen
        </button>
      </aside>
    </div>
  </main>
  )
}

export default KioskView;