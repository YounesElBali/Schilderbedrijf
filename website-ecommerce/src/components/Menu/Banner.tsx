"use client";
import {SideMenu} from "../Menu/SideMenu";
import { useState } from "react";
import Link from "next/link";
import { EmptyCartModal } from "../Shopping/ShoppingCartHomePage";
import { useCart } from "../../contexts/CartContext"; // Zorg dat dit pad klopt

export function Banner() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartEmpty, setCartEmpty] = useState(true);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const { cart } = useCart(); // Haal de winkelwagen op uit de context
  const cartCount = cart.length; 
  return (
    <div>
      {/* Top Notification Bar */}
      <div className="bg-blue-900 text-white text-sm">
        <div className="w-full px-4">
          <div className="flex flex-wrap justify-between items-center py-2">
            <p>Voor 16:00 besteld, zelfde dag verzonden!</p>
          </div>
        </div>
      </div>
  
      {/* Header Section */}
      <div className="bg-white py-4 shadow-sm w-full">
        <div className="mx-auto px-4 flex justify-between items-center">
          {/* Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
            {menuOpen ? "×" : "☰"}
          </button>
  
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-black font-bold text-2xl">PAS</span>
            <span className="text-blue-600 font-bold text-2xl">t</span>
            <span className="text-black font-bold text-2xl">oolz</span>
            <span className="text-sm align-top">®</span>
          </div>
  
          {/* Navigation Icons */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 hidden md:flex">
              <span>EUR €</span>
              <span>|</span>
              <span>Nederland</span>
            </div>
  
            <Link href="/search">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
  
            <Link href="/account">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
  
            {/* Cart Button */}
            <button
              className="relative p-2"
              onClick={() => {
                if (cartEmpty) {
                  setCartModalOpen(true);
                } else {
                  window.location.href = "/cart";
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute top-0 right-0 bg-blue-900 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
  
        {/* Dropdown Menu */}
        {menuOpen && <SideMenu isOpen={menuOpen} closeModal={() => setMenuOpen(false)} />}
      </div>
  
      <EmptyCartModal isOpen={cartModalOpen} closeModal={() => setCartModalOpen(false)} />
    </div>
  );}  