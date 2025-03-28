"use client";

import { useCart } from "../../contexts/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
}

export function BestsellersSection() {
  const { addToCart } = useCart();

  const products: Product[] = [
    {
      id: 1,
      name: "MOOZERS Washi Tape Paars 24MM",
      price: 2.57,
      image: "/api/placeholder/200/200"
    },
    {
      id: 2,
      name: "MOOZERS Washi Tape Geel 24MM",
      price: 2.35,
      image: "/api/placeholder/200/200"
    },
    {
      id: 3,
      name: "MOOZERS Apex Abrasives - P120 - 100x150MM - Schuurpapier - 50 stuks",
      price: 13.99,
      image: "/api/placeholder/200/200",
      isNew: true
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
    <h2 className="text-2xl font-bold mb-4">Bestsellers</h2>

    {/* Mobile View - 2 columns */}
    <div className="grid grid-cols-2 sm:hidden gap-2">
      {products.slice(0, 2).map((product) => (
        <div key={product.id} className="border rounded-lg overflow-hidden">
          <div className="relative">
            <div className="aspect-square flex items-center justify-center p-2">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            {product.isNew && (
              <div className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded">
                NIEUW
              </div>
            )}
          </div>
          <div className="p-2">
            <h3 className="text-xs font-bold mb-1 line-clamp-2">{product.name}</h3>
            <p className="text-sm font-semibold">€{product.price.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Incl. BTW</p>
            <button
              onClick={() => addToCart(product)}
              className="w-full mt-2 text-xs py-1 border rounded hover:bg-gray-50"
            >
              In winkelwagen
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Desktop View - 5 columns */}
    <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg overflow-hidden">
          <div className="relative">
            <div className="aspect-square flex items-center justify-center p-4">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            {product.isNew && (
              <div className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded">
                NIEUW
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="text-sm font-bold mb-2 line-clamp-2">{product.name}</h3>
            <p className="text-base font-semibold">€{product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Incl. BTW</p>
            <button
              onClick={() => addToCart(product)}
              className="w-full mt-2 py-2 border rounded hover:bg-gray-50"
            >
              In winkelwagen toevoegen
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}
