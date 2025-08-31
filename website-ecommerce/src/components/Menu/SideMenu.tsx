import React from 'react';
import Link from 'next/link';

export function SideMenu({ isOpen, closeModal }: { isOpen: boolean; closeModal: () => void }) {
  return (
    <div className={`fixed inset-y-6 left-0 flex flex-col w-full sm:w-72 bg-[#ffffff] z-50 shadow-lg transition-all transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Header with close button and logo */}
      <div className="flex items-center p-4 border-b border-gray-100">
        <button className="p-2" onClick={closeModal}>
          x
        </button>
        <Link href="/" className="ml-4">
          <img 
            src="/logoPastoolz.png" 
            alt="Pastoolz" 
            className="h-12 w-auto object-contain"
          />
        </Link>
        <span className="text-xs align-top ml-1">®</span>
      </div>
      
      {/* Menu items */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-2">
          <li>
            <Link 
              href="/category/Tape" 
              className="block px-6 py-4 text-gray-900 hover:bg-gray-100"
            >
              Tape
            </Link>
          </li>
          <li>
            <Link 
              href="/category/Schuren" 
              className="block px-6 py-4 text-gray-900 hover:bg-gray-100"
            >
              Schuren
            </Link>
          </li>
          <li>
            <Link 
              href="/category/Folie" 
              className="block px-6 py-4 text-gray-900 hover:bg-gray-100"
            >
              Folie
            </Link>
          </li>
          <li>
            <Link 
              href="/category/Lijm" 
              className="block px-6 py-4 text-gray-900 hover:bg-gray-100"
            >
              Lijm
            </Link>
          </li>
          <li>
            <Link 
              href="/category/Polijst" 
              className="block px-6 py-4 text-gray-900 hover:bg-gray-100"
            >
              Polijst
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* Background overlay image */}
      <div 
        className="absolute right-0 top-0 h-full w-1/3 bg-cover bg-right pointer-events-none"
        style={{ 
          backgroundImage: "url('/tape-image.jpg')",
          clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)"
        }}
      />
    </div>
  );
};
