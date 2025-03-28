'use client';
import React, { useState, useEffect } from 'react';
import { getCategories } from '../../../services/product.services'; // Assuming you have a service to fetch categories
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  isNew: boolean;
}

// Assuming this file is in the path `app/category/[category]/page.tsx`
export default function TapeMaterialenListing({ params }: { params: { categories: string } }) {
  const { categories: categoryParam } = params;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryList, setCategoryList] = useState<{ id: number; name: string; image: string; path: string }[]>([]);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      console.log('Fetching categories...');
      try {
        const res = await fetch("/api/categories");
        console.log('Categories response:', res);
        const data = await res.json();
        console.log('Categories data:', data);
        setCategoryList(data);
        
        // If we have the category param, fetch products immediately
        if (categoryParam) {
          console.log('Found category param, fetching products for:', categoryParam);
          fetchProductsByCategory(categoryParam);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  // Fetch products based on the category
  const fetchProductsByCategory = async (categoryName: string) => {
    console.log('Fetching products for category:', categoryName);
    setLoading(true);
    try {
      // Find the matching category from our list
      const matchingCategory = categoryList.find(cat => 
        cat.name.toLowerCase() === categoryName.toLowerCase() ||
        cat.path.toLowerCase() === `/${categoryName.toLowerCase()}`
      );
      
      if (!matchingCategory) {
        console.error('No matching category found for:', categoryName);
        setProducts([]);
        return;
      }

      console.log('Found matching category:', matchingCategory);
      const res = await fetch(`/api/products/${matchingCategory.name}`);
      console.log('Products response:', res);
      if (res.ok) {
        const data = await res.json();
        console.log('Products data:', data);
        setProducts(data);
      } else {
        console.error('Failed to fetch products:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when the category changes
  useEffect(() => {
    if (categoryParam && categoryList.length > 0) {
      console.log('Category param changed, fetching products for:', categoryParam);
      fetchProductsByCategory(categoryParam);
    }
  }, [categoryParam, categoryList]);

  return (
    <div>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-5xl font-bold mb-8">{categoryParam}</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            {/* Add your filters here */}
          </div>

          {/* Product listing */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <span className="mr-2">Sorteer op:</span>
                <div className="relative">
                  <select
                    className="border border-gray-300 rounded p-2 pr-8 appearance-none"
                    // Handle sorting logic here
                  >
                    <option>Alfabetisch: A-Z</option>
                    <option>Alfabetisch: Z-A</option>
                    <option>Prijs: laag naar hoog</option>
                    <option>Prijs: hoog naar laag</option>
                  </select>
                </div>
              </div>
              <span>{products.length} producten</span>
            </div>

            {/* Loading state */}
            {loading && <p>Loading products...</p>}

            {/* Product grid */}
            {!loading && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="relative">
                      {product.isNew && (
                        <div className="absolute top-0 left-0 transform -rotate-45 translate-x-[-30%] translate-y-[40%] bg-yellow-400 text-xs font-bold px-6 py-1">
                          NIEUW
                        </div>
                      )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-contain p-4"
                    />
                    </div>
                    <div className="p-3 text-center">
                      <Link 
                        href={`/products/${product.id}`} 
                        className="font-bold text-sm mb-2 hover:text-blue-600 transition-colors"
                      >
                        {product.name}
                      </Link>
                      <p className="text-lg font-bold mb-1">€{product.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500 mb-4">Incl. BTW</p>
                      <button
                        className="w-full bg-white border-2 border-black py-2 px-4 rounded font-medium hover:bg-gray-100 transition"
                        onClick={() => console.log(`Added product ${product.id} to cart`)}
                      >
                        Aan winkelwagen toevoegen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No products available */}
            {!loading && products.length === 0 && (
              <p>No products found in this category.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
