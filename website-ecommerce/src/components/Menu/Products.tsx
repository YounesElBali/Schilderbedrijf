"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function ProductCategories() {
  const [categories, setCategories] = useState<{ id: number; name: string; image: string; path: string }[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  const navigateToCategory = (path: string) => {
    // Remove any potential encoding or unwanted characters
    const sanitizedPath = path.replace(/[^a-zA-Z0-9-_]/g, '');
    router.push(`/category/${sanitizedPath}`);
  };

  return (
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
          {categories.map((category) => (
            <div key={category.id} className="relative flex flex-col items-center">
              {/* Product Image */}
              <div className="w-50 h-50 flex items-center justify-center">
                <img
                  src={category.image}
                  alt={`${category.name} category`}
                  className="w-full h-full object-cover"
                />
              </div>
    
              {/* Category Button */}
              <button
                onClick={() => navigateToCategory(category.path)}
                className="mt-4 bg-[#d6ac0a] text-black py-2 px-4 min-w-32 flex items-center justify-between font-bold"
              >
                <span>{category.name}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 ml-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M14 5l7 7m0 0l-7 7m7-7H3" 
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
    
  
}
