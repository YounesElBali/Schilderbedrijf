"use client";
import {SideMenu} from "../Menu/SideMenu";
import { useState } from "react";
import Link from "next/link";
import { EmptyCartModal } from "../Shopping/ShoppingCartHomePage";
import { useCart } from "../../contexts/CartContext";
import { usePricing } from "../../contexts/PriceContext";
import Marquee from "react-fast-marquee";

export function Banner() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartEmpty] = useState(true);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  
  const { cart } = useCart();
  const { selectedCountry, setSelectedCountry, countries } = usePricing();
  const cartCount = cart.length; 

  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName);
    setCountryDropdownOpen(false);
  };

  return (
    <div>
      {/* Top Notification Bar */}
      <div className="bg-[#d6ac0a] text-black text-sm">
        <div className="w-full px-4">
            <Marquee >
             - Voor 16:00 besteld, zelfde dag verzonden!  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  -   1000+ Klanten gingen u voor!  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  - Gratis verzending vanaf €80 - &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  
             - Voor 16:00 besteld, zelfde dag verzonden!  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  -   1000+ Klanten gingen u voor!  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  - Gratis verzending vanaf €80 - &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  
             - Voor 16:00 besteld, zelfde dag verzonden!  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  -   1000+ Klanten gingen u voor!  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  - Gratis verzending vanaf €80 - &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  
             - Voor 16:00 besteld, zelfde dag verzonden!  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  -   1000+ Klanten gingen u voor!  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  - Gratis verzending vanaf €80 - &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  
            </Marquee>
        </div>
      </div>
  
      {/* Header Section */}
      <div className="bg-[#f1efe7] py-4 shadow-sm w-full">
        <div className="mx-auto px-4 flex justify-between items-center">
          {/* Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
            {menuOpen ? "×" : "☰"}
          </button>
  
          {/* Logo */}
          <Link href="/">
          <img 
            src="/logoPastoolz.png" 
            alt="PAStoolz" 
            className="h-16"
          />
          </Link>
  
          {/* Navigation Icons */}
          <div className="flex items-center gap-4">
            {/* Country Selector */}
            <div className="flex items-center gap-1 hidden md:flex">
              <span>EUR €</span>
              <span>|</span>
              <div className="relative">
                <button
                  onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                  className="flex items-center gap-1 hover:text-blue-600 cursor-pointer"
                >
                  <span>{selectedCountry}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${countryDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {countryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[120px]">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => handleCountryChange(country.name)}
                        className={`w-full px-3 py-2 text-left hover:bg-gray-100 first:rounded-t-md last:rounded-b-md ${
                          selectedCountry === country.name ? 'bg-blue-50 text-blue-600' : ''
                        }`}
                      >
                        {country.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
      
      {/* Click outside to close country dropdown */}
      {countryDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setCountryDropdownOpen(false)}
        />
      )}
    </div>
  );
}