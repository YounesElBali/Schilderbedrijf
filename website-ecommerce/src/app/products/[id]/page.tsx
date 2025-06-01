'use client';
import React, {use, useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DeliveryTimeline from '@/components/Menu/DeliveryTimeLine';

interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  price?: number;
  inStock: boolean;
}

interface Icons {
  id: number;
  name: string;
  url: string;
  productImages: ProductProductImage[]; // renamed from "products"
}

interface ProductProductImage {
  productId: number;
  productImageId: number;
  product: Product;
  productImage: Icons;
}
interface Images {
  id: number;
  productId: number;
  url: string;
}
interface Product {
  id: number;
  name: string;
  price: number;
  images: Images[]; // fallback main image if needed
  description: string;
  isNew: boolean;
  inStock: boolean;
  deliveryCost: number;
  articlenr: string;
  productImages: ProductProductImage[];
  variants?: ProductVariant[];
  traits: string;
  categoryId: number;
}


export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [categories, setCategories] = useState<{ id: number; name: string; image: string; path: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProductAndVariants = async () => {
      try {
        // Fetch product details
        const productResponse = await fetch(`/api/products/${id}`);
        if (!productResponse.ok) {
          setError('Product not found');
          return;
        }
        const productData = await productResponse.json();
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error fetching product');
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndVariants();
  }, [id, router]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    }
  
    fetchCategories();
  }, []);
  

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: selectedVariant?.price || product.price,
        image: product.images && product.images.length > 0 
        ? [{ id: product.images[0].id, url: product.images[0].url }] 
        : [],
        quantity: quantity,
        articlenr: product.articlenr,
        variantId: selectedVariant?.id,
        variantName: selectedVariant?.name
      });
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="max-w-7xl mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="max-w-7xl mx-auto p-4">Product not found</div>;
  }

const allImages = (product.images || []);

  const category = categories.find((cat) => cat.id === (product as any)?.categoryId);


  return (
    <div className="min-h-screen bg-[#ffffff]	 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="flex items-center gap-x-4 flex-wrap mb-4">
      <button
          onClick={() => router.back()}
          className="flex items-center border border-gray-300 text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-md text-sm"
        >
        <p>{'< Terug'}</p> 
        </button>

  {/* Breadcrumb */}
        <nav className="text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="list-reset flex items-center space-x-1">
            <li>
              <Link href="/" className="hover:underline text-gray-600">
                Home
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link
                href={`/category/${category?.name || ''}`}
                className="hover:underline text-gray-600"
              >
                {category?.name || 'Category'}
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-black font-medium truncate max-w-[150px]">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Back Button */}
        
      </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
       <div className="space-y-4">
        <div className="relative aspect-square rounded-lg overflow-hidden bg-white">
          <Image
             src={allImages[selectedImageIndex].url}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        {allImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {allImages.map((image, index) => (
              <button
                key={image.id}
                 onClick={() => setSelectedImageIndex(index)}
                 className={`relative aspect-square rounded-md overflow-hidden ${
                      selectedImageIndex === index
                        ? 'ring-2 ring-blue-500'
                        : 'ring-1 ring-gray-200'
                    }`}
              >
                <Image
                  src={image.url}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 12.5vw"
                />
              </button>
            ))}
          </div>
        )}
      </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="mt-2 flex items-center space-x-2">
                {product.isNew && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Nieuw
                  </span>
                )}
                {!product.inStock && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Uitverkocht
                  </span>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-2xl font-bold text-black">
                €{selectedVariant?.price ? selectedVariant.price.toFixed(2) : product.price.toFixed(2)} incl. BTW
              </p>
            </div>

            {/* Variant Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Selecteer variant</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 border rounded-md ${
                        selectedVariant?.id === variant.id
                          ? 'bg-[#d6ac0a] text-black border-[#d6ac0a]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      } ${!variant.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!variant.inStock}
                    >
                      {variant.name}
                      {!variant.inStock && <span className="ml-1 text-xs">(Niet op voorraad)</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                  disabled={!product.inStock || (selectedVariant ? !selectedVariant.inStock : false)}
                  className={`px-6 py-2 rounded ${
                    product.inStock && (!selectedVariant || selectedVariant.inStock)
                      ? 'bg-[#d6ac0a] text-black hover:bg-[#000000] hover:text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.inStock && (!selectedVariant || selectedVariant.inStock) 
                    ? 'In winkelwagen' 
                    : 'Niet op voorraad'}
                </button>
              </div>
            </div>
            <DeliveryTimeline />

             {product.productImages && product.productImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {product.productImages.map((imgUsage) => (
                    <div key={imgUsage.productId} className="relative aspect-square rounded-md overflow-hidden ring-1 ring-gray-200 hover:ring-blue-500 cursor-pointer">
                      <Image
                        src={imgUsage.productImage.url}
                        alt={`${product.name} - Additional Image`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 12.5vw"
                      />
                    </div>
                  ))}
                </div>
              )}



            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-2">Product Details</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Artikelnummer: {product.articlenr}</li>
                <li>Status: {product.inStock ? 'Op voorraad' : 'Niet op voorraad'}</li>
              </ul>
            </div>
          {product.traits && product.traits.trim() !== "" && (
            <div className="border-t pt-6">
              <ul className="flex flex-wrap justify-start">
                {product.traits.split(',').map((trait, index) => (
                  <li className="flex gap-x-3 w-1/2 mb-4" key={index}>
                    <svg className="shrink-0 size-6 mt-0.5 text-yellow-500 stroke-[3.5]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span className="text-black-600 dark:text-black text-lg">
                      {trait.trim()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}


            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-2">Beschrijving</h3>
              <p className=" whitespace-pre-line">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 