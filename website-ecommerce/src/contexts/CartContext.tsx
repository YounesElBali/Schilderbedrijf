"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Define product type
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  articlenr:number;
  quantity?: number;
  variantId?: number;
  variantName?: string;
}

// Define cart context type
interface CartContextType {
  cart: Product[];
  getTotalPrice: () => number; 
  addToCart: (product: Product) => void;
  removeFromCart: (id: number, variantId?: number) => void;  
  updateQuantity: (id: string, quantity: number, variantId?: number) => void;
  clearCart: () => void;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to local storage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    console.log("Adding product:", product); // Debugging log

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.variantId === product.variantId
      );
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && item.variantId === product.variantId
            ? { ...item, quantity: (item.quantity || 1) + (product.quantity || 1) }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: product.quantity || 1 }];
      }
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * (item.quantity ?? 1), 0);
  };

  const removeFromCart = (id: number, variantId?: number) => {
    setCart((prevCart) => 
      prevCart.filter((item) => !(item.id === id && item.variantId === variantId))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (id: string, quantity: number, variantId?: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === parseInt(id) && item.variantId === variantId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getTotalPrice, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
