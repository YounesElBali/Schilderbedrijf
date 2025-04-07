'use client';
import React, { useState, useEffect } from 'react';
import { getCategories } from '../../../services/product.services'; // Assuming you have a service to fetch categories
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  isNew: boolean;
}

// Assuming this file is in the path `app/category/[category]/page.tsx`
export default async function TapeMaterialenListing({ params }: { params: Promise<{ categories: string }> }) {
  const { categories: categoryParam } = await params;
  
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('name-asc');
  const [categoryList, setCategoryList] = useState<{ id: number; name: string; image: string; path: string }[]>([]);

  // Add sorting function
  const sortProducts = (products: Product[], option: string) => {
    const sortedProducts = [...products];
    switch (option) {
      case 'name-asc':
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      case 'price-asc':
        return sortedProducts.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sortedProducts.sort((a, b) => b.price - a.price);
      default:
        return sortedProducts;
    }
  };

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
      const res = await fetch(`/api/categories/${encodeURIComponent(categoryName)}/products`);
      console.log('Products response:', res);
      if (res.ok) {
        const data = await res.json();
        console.log('Products data:', data);
        setProducts(data);
      } else {
        console.error('Failed to fetch products:', res.status, res.statusText);
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error fetching products');
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
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="name-asc">Alfabetisch: A-Z</option>
                    <option value="name-desc">Alfabetisch: Z-A</option>
                    <option value="price-asc">Prijs: laag naar hoog</option>
                    <option value="price-desc">Prijs: hoog naar laag</option>
                  </select>
                </div>
              </div>
              <span>{products.length} producten</span>
            </div>

            {/* Loading state */}
            {loading && <p>Loading products...</p>}

            {/* Product grid */}
            {!loading && products.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {sortProducts(products, sortOption).map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="relative">
                      {product.isNew && (
                        <div className="absolute top-0 left-0 transform -rotate-45 translate-x-[-30%] translate-y-[40%] bg-yellow-400 text-xs font-bold px-4 py-0.5">
                          NIEUW
                        </div>
                      )}
                      <Link 
                        href={`/products/${product.id}`} 
                        className="font-bold text-sm hover:text-blue-600 transition-colors"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-32 object-contain p-2"
                        />
                      </Link>
                    </div>
                    <p className="text-sm text-center px-1">{product.name}</p>
                    <p className="text-base font-bold mb-1 px-1">€{product.price.toFixed(2)} incl. BTW</p>
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
