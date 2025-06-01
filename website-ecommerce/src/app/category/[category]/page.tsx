'use client';
import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductImage {
  id: number;
  url: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  images: ProductImage[]; // array of images
  isNew: boolean;
}

// Assuming this file is in the path `app/category/[category]/page.tsx`
export default function TapeMaterialenListing({ params }: { params: Promise<{ category: string }> }) {
  const categoryParam = use(params);
  console.log("testing what is in the params: " + categoryParam.category);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('name-asc');

  // Sorting function
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

  // Fetch products by category
  const fetchProductsByCategory = async (categorySlug: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(categorySlug)}/products`);
      console.log('Products response:', res);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryParam) {
      console.log('Category param changed, fetching products for:', categoryParam);
      fetchProductsByCategory(categoryParam.category);
    }
  }, [categoryParam]);

  return (
    <div>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-5xl font-bold mb-8">{categoryParam.category}</h1>

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

            {loading && <p>Loading products...</p>}

            {!loading && products.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {sortProducts(products, sortOption).map((product) => {
                  // Determine the first image URL or use placeholder
                  const firstImage =
                    product.images && product.images.length > 0
                      ? product.images[0].url
                      : '/placeholder.png';

                  return (
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
                          <Image
                            src={firstImage}
                            alt={product.name}
                            width={200}
                            height={128}
                            className="w-full h-32 object-contain p-2"
                          />
                        </Link>
                      </div>
                      <p className="text-sm text-center px-1">{product.name}</p>
                      <p className="text-base font-bold mb-1 px-1">
                        €{product.price.toFixed(2)} incl. BTW
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && products.length === 0 && <p>No products found in this category.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
