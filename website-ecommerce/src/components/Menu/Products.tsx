'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: number; name: string; image: string; path: string };

export function ProductCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list: unknown =
          Array.isArray(data) ? data :
          Array.isArray(data?.data) ? data.data :
          Array.isArray(data?.categories) ? data.categories : [];
        if (Array.isArray(list)) setCategories(list as Category[]);
        else {
          console.error("Received non-array response:", data);
          setError("Kon categorieën niet laden");
        }
      } catch (e) {
        console.error("Error fetching categories:", e);
        setError("Kon categorieën niet laden");
      }
    })();
  }, []);

  const navigateToCategory = (path: string) => {
    const sanitizedPath = path.replace(/[^a-zA-Z0-9-_]/g, "");
    router.push(`/category/${sanitizedPath}`);
  };

  if (error) {
    return <div className="container mx-auto py-12 px-4 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {categories.map((category) => (
          <div key={category.id} className="relative flex flex-col items-center">
            <div className="w-50 h-50 flex items-center justify-center">
              <img
                src={category.image}
                alt={`${category.name} category`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => navigateToCategory(category.path)}
              className="mt-4 bg-[#d6ac0a] text-black py-2 px-4 min-w-32 flex items-center justify-between font-bold"
            >
              <span>{category.name}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
