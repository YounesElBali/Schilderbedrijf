"use client";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export function EmptyCartModal({ isOpen, closeModal }: { isOpen: boolean; closeModal: () => void }) {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      if (cart.length === 0) {
        setIsLoading(false);
        return;
      }
  
      try {
        // Fetch 3 random products
        const response = await fetch('/api/products/recommended', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch random products');
        }
  
        const data = await response.json();
        setRecommendedProducts(data);
      } catch (error) {
        console.error('Error fetching random products:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchRecommendedProducts();
  }, [cart]);
  

  const totalPrice = cart.reduce((total, item) => total + item.price * (item.quantity ?? 1), 0);

  return (
    <>
      {/* Overlay (Background Dim) */}
      <div onClick={closeModal}></div>

      {/* Sliding Panel */}
      <div
        className={`fixed top-6 right-0 w-96 h-full bg-[#ffffff] z-50 shadow-lg transition-all transform  ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <br/>
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
              <div key={`${item.id}-${item.variantId || 'base'}`} className="border rounded-sm p-4 mb-4 flex">
                <div className="w-24 h-24 bg-gray-100 mr-4 flex items-center justify-center">
                  <img src={item.image} alt={item.name} className="max-w-full max-h-full" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold">{item.name}</h4>
                  {item.variantName && <p className="text-sm text-gray-600">Variant: {item.variantName}</p>}
                  <p className="text-xl font-semibold mt-2">€{item.price.toFixed(2)}</p>
                  <div className="mt-2">
                    <label htmlFor={`quantity-${item.id}-${item.variantId || 'base'}`} className="mr-2 text-sm">
                      Hoeveelheid:
                    </label>
                    <input
                      type="number"
                      id={`quantity-${item.id}-${item.variantId || 'base'}`}
                      value={item.quantity}
                      min={1}
                      onChange={(e) => updateQuantity(item.id.toString(), parseInt(e.target.value), item.variantId)}
                      className="w-16 px-2 py-1 border rounded-md"
                    />
                  </div>
                </div>
                <div className="self-end">
                  <button
                    onClick={() => removeFromCart(item.id, item.variantId)}
                    className="bg-red-500 text-white px-4 py-2 w-32 font-medium"
                  >
                    Verwijderen
                  </button>
                </div>
              </div>
            ))}

             {/* Total Price */}
             <div className="mt-6 flex justify-between items-center font-semibold">
              <span className="text-lg">Totaal:</span>
              <span className="text-2xl">€{totalPrice.toFixed(2)}</span>
            </div>

            {/* Recommended Products */}
            {!isLoading && recommendedProducts.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Aanbevolen voor jou</h3>
                <div className="space-y-4">
                  {recommendedProducts.map((product) => (
                    <div key={product.id} className="border rounded-sm p-4 flex items-center">
                      <div className="w-16 h-16 bg-gray-100 mr-4 flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="max-w-full max-h-full" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-lg font-semibold mt-1">€{product.price.toFixed(2)}</p>
                      </div>
                      <Link href={`/product/${product.id}`}>
                        <button 
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                          onClick={closeModal}
                        >
                          Bekijken
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Checkout Button */}
            <div className="mt-6">
              <Link href="/checkout">
                <button 
                  className="w-full bg-[#d6ac0a] text-black py-3 rounded-lg font-medium hover:bg-[#000000] hover:text-white transition-colors"
                  onClick={closeModal}
                >
                  Ga naar kassa
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
