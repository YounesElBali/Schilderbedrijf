'use client';
import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  isNew: boolean;
}

export function SchuurMaterialenListing() {
  // State management
  const [sortOption, setSortOption] = useState('Alfabetisch: A-Z');
  const [availabilityExpanded, setAvailabilityExpanded] = useState(true);
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [inStockChecked, setInStockChecked] = useState(true);
  const [notInStockChecked, setNotInStockChecked] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Sample product data
  const products: Product[] = [
    { id: 1, name: 'MOOZERS Apex Abrasives - P100 - 100x150MM - Schuurpapier - 50 stuks', price: 13.99, image: '//150/150', isNew: true },
    { id: 2, name: 'MOOZERS Apex Abrasives - P120 - 100x150MM - Schuurpapier - 50 stuks', price: 13.99, image: '/api/placeholder/150/150', isNew: true },
    { id: 3, name: 'MOOZERS Apex Abrasives - P150 - 100x150MM - Schuurpapier - 50 stuks', price: 13.99, image: '/api/placeholder/150/150', isNew: true },
    { id: 4, name: 'MOOZERS Apex Abrasives - P180 - 100x150MM - Schuurpapier - 50 stuks', price: 13.99, image: '/api/placeholder/150/150', isNew: true },
    { id: 5, name: 'MOOZERS Apex Abrasives - P220 - 100x150MM - Schuurpapier - 50 stuks', price: 13.99, image: '/api/placeholder/150/150', isNew: true },
  ];

  // Add to cart function
  const addToCart = (productId: number) => {
    console.log(`Added product ${productId} to cart`);
    // Here you would normally update your cart state or send a request to your backend
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-5xl font-bold mb-8">Schuur materialen</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">Filter:</h2>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2" onClick={() => setAvailabilityExpanded(!availabilityExpanded)}>
                <h3 className="font-medium">Beschikbaarheid</h3>
              </div>
              
              {availabilityExpanded && (
                <div className="ml-2 mt-2">
                  <div className="flex items-center mb-2">
                    <input 
                      type="checkbox" 
                      id="inStock" 
                      className="mr-2 h-4 w-4"
                      checked={inStockChecked}
                      onChange={() => setInStockChecked(!inStockChecked)}
                    />
                    <label htmlFor="inStock">Op voorraad (24)</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="notInStock" 
                      className="mr-2 h-4 w-4"
                      checked={notInStockChecked}
                      onChange={() => setNotInStockChecked(!notInStockChecked)}
                    />
                    <label htmlFor="notInStock">Niet op voorraad (0)</label>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2" onClick={() => setPriceExpanded(!priceExpanded)}>
                <h3 className="font-medium">Prijs</h3>
              </div>
              
              {priceExpanded && (
                <div className="mt-2">
                  <p className="mb-2">De hoogste prijs is €28,99</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">€</span>
                    <input 
                      type="text" 
                      placeholder="Van" 
                      className="border border-gray-300 rounded p-2 w-32"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="Aan" 
                      className="border border-gray-300 rounded p-2 w-32"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
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
                  <option>Alfabetisch: A-Z</option>
                  <option>Alfabetisch: Z-A</option>
                  <option>Prijs: laag naar hoog</option>
                  <option>Prijs: hoog naar laag</option>
                </select>
              </div>
            </div>
            <span>24 producten</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-md overflow-hidden">
                <div className="relative">
                  {product.isNew && (
                    <div className="absolute top-0 left-0 transform -rotate-45 translate-x-[-30%] translate-y-[40%] bg-yellow-400 text-xs font-bold px-6 py-1">
                      NIEUW
                    </div>
                  )}
                  {/* <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-contain p-4"
                  /> */}
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-bold text-sm mb-2">{product.name}</h3>
                  <p className="text-lg font-bold mb-1">€{product.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 mb-4">Incl. BTW</p>
                  <button 
                    className="w-full bg-white border-2 border-black py-2 px-4 rounded font-medium hover:bg-gray-100 transition"
                    onClick={() => addToCart(product.id)}
                  >
                    Aan winkelwagen toevoegen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

