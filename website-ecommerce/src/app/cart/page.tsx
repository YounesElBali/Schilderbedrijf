"use client";

import { useCart } from "../../contexts/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between border-b py-2">
              <span>{item.name} (x{item.quantity}) - ${item.price * (item.quantity || 1)}</span>
              <button
                className="text-red-500"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>
      )}
      <Link href="/">
        <span className="mt-4 block text-blue-500 cursor-pointer">Back to shopping</span>
      </Link>
    </div>
  );
}
