import React from 'react';
import Link from 'next/link';

export function SideMenu({ isOpen, closeModal }: { isOpen: boolean; closeModal: () => void }) {
  return (
    <div className={`fixed inset-y-0 left-0 flex flex-col w-full sm:w-72 bg-white z-50 shadow-lg transition-all transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Header with close button and logo */}
      <div className="flex items-center p-4 border-b border-gray-100">
        <button className="p-2" onClick={closeModal}>
          x
        </button>
        <Link href="/" className="ml-4">
          <img 
            src="/Logo Pastoolz.JPG" 
            alt="Pastoolz" 
            className="h-8 w-auto object-contain"
          />
        </Link>
        <span className="text-xs align-top ml-1">®</span>
      </div>
      
      {/* Menu items */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-2">
          <li>
            <a 
              href="/category/tape" 
              className="block px-6 py-4 text-gray-900 hover:bg-gray-100"
            >
              Tape
            </a>
          </li>
          <li>
            <a 
              href="/category/schuren" 
              className="block px-6 py-4 text-gray-900 hover:bg-gray-100"
            >
              Schuren
            </a>
          </li>
          <li>
            <a 
              href="/category/folie" 
              className="block px-6 py-4 text-gray-900 hover:bg-gray-100"
            >
              Folie
            </a>
          </li>
          <li>
            <a 
              href="/category/lijm" 
              className="block px-6 py-4 text-gray-900 hover:bg-gray-100"
            >
              Lijm
            </a>
          </li>
          <li>
            <a 
              href="/category/polijst" 
              className="block px-6 py-4 text-gray-900 hover:bg-gray-100"
            >
              Polijst
            </a>
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
