'use client';
import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePricing } from '@/contexts/PriceContext';

interface ProductImage {
  id: number;
  url: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  images: ProductImage[];
  isNew: boolean;
}

interface Category {
  id: number;
  name: string;
  path: string;
  image: string;
}

interface ApiResponse {
  success: boolean;
  category?: Category;
  products?: Product[];
  total?: number;
  error?: string;
  searchedFor?: string;
}

export default function TapeMaterialenListing({ params }: { params: Promise<{ category: string }> }) {
  const categoryParam = use(params);
  const { formatPrice, calculatePrice, selectedCountry } = usePricing();
  
  console.log("Category param:", categoryParam.category);

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('name-asc');

  // Sorting function - now uses calculated prices for price sorting
  const sortProducts = (products: Product[], option: string) => {
    const sortedProducts = [...products];
    switch (option) {
      case 'name-asc':
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      case 'price-asc':
        return sortedProducts.sort((a, b) => calculatePrice(a.price) - calculatePrice(b.price));
      case 'price-desc':
        return sortedProducts.sort((a, b) => calculatePrice(b.price) - calculatePrice(a.price));
      default:
        return sortedProducts;
    }
  };

  // Fetch products by category
  const fetchProductsByCategory = async (categorySlug: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(categorySlug)}/products`);
      const data: ApiResponse = await res.json();
      
      console.log('API Response:', data);
      
      if (res.ok && data.success) {
        setProducts(data.products || []);
        setCategory(data.category || null);
      } else {
        setError(data.error || 'Failed to fetch products');
        setProducts([]);
        setCategory(null);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Network error while fetching products');
      setProducts([]);
      setCategory(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryParam?.category) {
      console.log('Fetching products for category:', categoryParam.category);
      fetchProductsByCategory(categoryParam.category);
    }
  }, [categoryParam]);

  // Refetch products when country changes to ensure proper sorting
  useEffect(() => {
    if (products.length > 0 && (sortOption === 'price-asc' || sortOption === 'price-desc')) {
      // Re-sort products when country changes and we're sorting by price
      setProducts(prevProducts => [...prevProducts]);
    }
  }, [selectedCountry]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-md p-4">
                <div className="w-full h-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-2">Searched for: {categoryParam.category}</p>
          <button 
            onClick={() => fetchProductsByCategory(categoryParam.category)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-5xl font-bold mb-8">
        {category ? category.name : categoryParam.category}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          {/* Add your filters here */}
        </div>

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

          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {sortProducts(products, sortOption).map((product) => {
                const firstImage =
                  product.images && product.images.length > 0
                    ? product.images[0].url
                    : '/placeholder.png';

                return (
                  <div key={product.id} className="border border-gray-50 rounded-md overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      {product.isNew && (
                        <div className="absolute top-0 left-0 transform -rotate-45 translate-x-[-30%] translate-y-[40%] bg-yellow-400 text-xs font-bold px-4 py-0.5 z-10">
                          NIEUW
                        </div>
                      )}
                      <Link href={`/products/${product.id}`}>
                        <Image
                          src={firstImage}
                          alt={product.name}
                          width={200}
                          height={128}
                          className="w-full h-32 object-contain p-2 hover:scale-105 transition-transform"
                        />
                      </Link>
                    </div>
                    <div className="p-2">
                      <Link 
                        href={`/products/${product.id}`}
                        className="block"
                      >
                        <p className="text-sm text-center hover:text-blue-600 transition-colors line-clamp-2">
                          {product.name}
                        </p>
                      </Link>
                      <p className="text-base font-bold mb-1 text-center">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Geen producten gevonden in deze categorie.</p>
              {category && (
                <p className="text-sm text-gray-400 mt-2">Categorie: {category.name}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}