'use client';
import React, {use, useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  isNew: boolean;
  inStock: boolean;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          setError('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error fetching product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="max-w-7xl mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="max-w-7xl mx-auto p-4">Product not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="relative">
            {product.isNew && (
              <div className="absolute top-0 left-0 transform -rotate-45 translate-x-[-30%] translate-y-[40%] bg-yellow-400 text-xs font-bold px-4 py-0.5">
                NIEUW
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-contain p-4 border border-gray-200 rounded-lg"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="mb-6">
            <p className="text-2xl font-bold text-black">€{product.price.toFixed(2)} incl. BTW</p>
          </div>


          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`px-6 py-2 rounded ${
                  product.inStock
                    ? 'bg-[#d6ac0a] text-black hover:bg-[#000000] hover:text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'In winkelwagen' : 'Niet op voorraad'}
              </button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-2">Product Details</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Artikelnummer: {product.id}</li>
              <li>Status: {product.inStock ? 'Op voorraad' : 'Niet op voorraad'}</li>
            </ul>
          </div>
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">Beschrijving</h3>
            <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 