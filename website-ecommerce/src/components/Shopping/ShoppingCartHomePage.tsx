"use client";
import { useCart } from "@/contexts/CartContext";

export function EmptyCartModal({ isOpen, closeModal }: { isOpen: boolean; closeModal: () => void }) {
  const { cart, removeFromCart } = useCart();

  return (
    <>
      {/* Overlay (Background Dim) */}
      <div onClick={closeModal}></div>

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 right-0 w-96 h-full bg-white shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Winkelwagen • {cart.length}</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* If Cart is Empty */}
        {cart.length === 0 ? (
          <div className="p-6 text-center text-2xl font-bold">Je winkelwagen is leeg</div>
        ) : (
          <div className="p-4">
            <h3 className="text-xl font-bold mb-4">Jouw Producten</h3>
            
            {/* Cart Items */}
            {cart.map((item) => (
              <div key={item.id} className="border rounded-sm p-4 mb-4 flex">
                <div className="w-24 h-24 bg-gray-100 mr-4 flex items-center justify-center">
                  <img src={item.image} alt={item.name} className="max-w-full max-h-full" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-xl font-semibold mt-2">€{item.price.toFixed(2)}</p>
                </div>
                <div className="self-end">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white px-4 py-2 w-32 font-medium"
                  >
                    Verwijderen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
