"use client";
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

export default function CheckoutPage() {
  const { cart, getTotalPrice } = useCart();
  const [saveInfo, setSaveInfo] = useState(false);
  const [emailSubscribe, setEmailSubscribe] = useState(false);

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto font-sans">
      {/* Left side - checkout form */}
      <div className="md:w-2/3 p-6">
        {/* Payment options */}
        <div className="mb-8">
          <div className="flex justify-center space-x-2 mb-4">
            <button className="bg-purple-600 text-white py-3 px-4 rounded flex-1 flex items-center justify-center">
              <img src="/shop-pay-logo.svg" alt="Shop Pay" className="h-5" />
            </button>
            <button className="bg-black text-white py-3 px-4 rounded flex-1 flex items-center justify-center">
              <img src="/g-pay-logo.svg" alt="Google Pay" className="h-5" />
            </button>
          </div>
          <div className="text-center text-gray-500 text-sm mb-4">of</div>
        </div>

        {/* Contact section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-medium">Contact</h2>
            <a href="#" className="text-blue-600 text-sm">Inloggen</a>
          </div>
          <div className="mb-3">
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full border border-gray-300 rounded p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="emailSubscribe" 
              checked={emailSubscribe}
              onChange={() => setEmailSubscribe(!emailSubscribe)}
              className="mr-2"
            />
            <label htmlFor="emailSubscribe" className="text-sm text-gray-700">
              Stuur mij een e-mail met nieuws en aanbiedingen
            </label>
          </div>
        </div>

        {/* Shipping section */}
        <div className="mb-8">
          <h2 className="font-medium mb-4">Bezorging</h2>
          <div className="mb-3">
            <div className="border border-gray-300 rounded p-3 flex justify-between cursor-pointer">
              <span>Nederland</span>
              <span>▼</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input 
              type="text"
              placeholder="Voornaam (optioneel)"
              className="border border-gray-300 rounded p-3" 
            />
            <input 
              type="text"
              placeholder="Achternaam"
              className="border border-gray-300 rounded p-3" 
            />
          </div>
          
          <div className="mb-3">
            <input 
              type="text"
              placeholder="Bedrijf (optioneel)"
              className="w-full border border-gray-300 rounded p-3" 
            />
          </div>
          
          <div className="mb-3 relative">
            <input 
              type="text"
              placeholder="Straatnaam"
              className="w-full border border-gray-300 rounded p-3 pr-10" 
            />
          </div>
          
          <div className="mb-3">
            <input 
              type="text"
              placeholder="BTW-nummer"
              className="w-full border border-gray-300 rounded p-3" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input 
              type="text"
              placeholder="Postcode"
              className="border border-gray-300 rounded p-3" 
            />
            <input 
              type="text"
              placeholder="Stad"
              className="border border-gray-300 rounded p-3" 
            />
          </div>
          
          <div className="mb-3 relative">
            <input 
              type="tel"
              placeholder="Telefoon (optioneel)"
              className="w-full border border-gray-300 rounded p-3 pr-10" 
            />
          </div>
        </div>

        {/* Shipping method section */}
        <div className="mb-8">
          <h2 className="font-medium mb-4">Verzendwijze</h2>
          <div className="bg-gray-100 p-3 rounded text-sm text-gray-600">
            Vul je bezorgadres in om de beschikbare verzendmethoden te zien.
          </div>
        </div>

        {/* Payment section */}
        <div className="mb-8">
          <h2 className="font-medium mb-2">Betaling</h2>
          <p className="text-xs text-gray-500 mb-4">Alle transacties zijn beveiligd en versleuteld.</p>
          
          <div className="border border-blue-500 rounded p-3 mb-3 flex items-center">
            <input 
              type="radio" 
              id="ideal" 
              name="payment" 
              className="mr-2" 
              defaultChecked
            />
            <label htmlFor="ideal" className="flex items-center">
              <img src="/ideal-logo.png" alt="iDEAL" className="h-4 mr-2" />
            </label>
          </div>
          
          <div className="mb-3">
            <div className="border border-gray-300 rounded p-3 flex justify-between cursor-pointer">
              <span>ABN AMRO</span>
              <span>▼</span>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="border border-gray-300 rounded p-3 flex items-center">
              <span className="mr-2">Creditcard</span>
              <div className="flex space-x-2 ml-auto">
                <img src="/visa-logo.png" alt="Visa" className="h-5" />
                <img src="/mastercard-logo.png" alt="Mastercard" className="h-5" />
                <img src="/amex-logo.png" alt="American Express" className="h-5" />
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="border border-gray-300 rounded p-3 flex items-center">
              <span className="mr-2">Klarna</span>
              <img src="/klarna-logo.png" alt="Klarna" className="h-5 ml-auto" />
            </div>
          </div>
        </div>

        {/* Billing address section */}
        <div className="mb-8">
          <h2 className="font-medium mb-4">Factuuradres</h2>
          <div className="border border-blue-500 rounded p-3 mb-3 flex items-center">
            <input 
              type="radio" 
              id="sameBilling" 
              name="billing" 
              className="mr-2" 
              defaultChecked
            />
            <label htmlFor="sameBilling">Zelfde als bezorgadres</label>
          </div>
          
          <div className="border border-gray-300 rounded p-3 mb-3 flex items-center">
            <input 
              type="radio" 
              id="differentBilling" 
              name="billing" 
              className="mr-2"
            />
            <label htmlFor="differentBilling">Een ander factuuradres gebruiken</label>
          </div>
        </div>

        {/* Save info section */}
        <div className="mb-8">
          <h2 className="font-medium mb-4">Mij onthouden</h2>
          <div className="border border-gray-300 rounded p-3 mb-3 flex items-center">
            <input 
              type="checkbox" 
              id="saveInfo"
              checked={saveInfo}
              onChange={() => setSaveInfo(!saveInfo)}
              className="mr-2"
            />
            <label htmlFor="saveInfo" className="text-blue-600">
              Mijn gegevens opslaan voor een snellere checkout
            </label>
          </div>
        </div>

        {/* Terms section */}
        <div className="mb-4 text-sm flex items-start">
          <input type="checkbox" className="mt-1 mr-2" />
          <span className="text-gray-600">
            Ik ga akkoord met de voorwaarden
          </span>
        </div>

        {/* Submit button */}
        <button className="w-full bg-gray-200 text-gray-800 py-4 rounded mb-8">
          Ga naar betalen
        </button>

        {/* Footer links */}
        <div className="text-center text-xs text-blue-600 space-x-2 mb-4">
          <a href="#">Terugstuurvoorbeleid</a>
          <span>|</span>
          <a href="#">Privacybeleid</a>
          <span>|</span>
          <a href="#">Algemene voorwaarden</a>
          <span>|</span>
          <a href="#">Wettelijke kennisgeving</a>
        </div>
        <div className="text-center text-xs text-blue-600 space-x-2">
          <a href="#">Annuleringsbeleid</a>
          <span>|</span>
          <a href="#">Contactgegevens</a>
          <span>|</span>
          <a href="#">Cookie-optelichten</a>
        </div>
      </div>

      {/* Right side - order summary */}
      <div className="bg-gray-100 md:w-1/3 p-6">
        {/* Product summary */}
        <div className="flex items-start mb-6 pb-6 border-b border-gray-300">
          <div className="relative mr-4">
            <div className="bg-gray-200 rounded w-16 h-16 flex items-center justify-center">
              <img src="/product-thumbnail.jpg" alt="Product" className="w-12 h-12" />
            </div>
            <div className="absolute -top-1 -right-1 bg-gray-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              1
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm mb-1">MOOZERS | Wash | Schuimzeep Geel | 55mm x 50m | Afplaktape | Maskingtape</p>
            <p className="text-gray-500 text-xs">1 stuk</p>
          </div>
          <div className="text-right">
            <p className="font-medium">€ 196,65</p>
          </div>
        </div>

        {/* Discount code */}
        <div className="mb-6 pb-6 border-b border-gray-300">
          <div className="flex mb-2">
            <input 
              type="text" 
              placeholder="Kortingscode" 
              className="flex-1 border border-gray-300 rounded-l p-2" 
            />
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-r">
              Toepassen
            </button>
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-gray-100 md:w-1/3 p-6">
          {cart.length === 0 ? (
            <p className="text-center text-lg">Je winkelwagen is leeg</p>
          ) : (
            <>
              <h3 className="text-xl font-bold mb-4">Jouw Producten</h3>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between border-b pb-3 mb-3">
                  <p>{item.name} x {item.quantity}</p>
                  <p>€{(item.price * (item.quantity ?? 1)).toFixed(2)}</p>
                </div>
              ))}
              <div className="flex justify-between font-bold">
                <span>Totaal</span>
                <span>€{getTotalPrice().toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>

        {/* Total */}
        {/* <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="font-medium">Totaal</span>
            <div className="text-right">
              <span className="text-xs text-gray-500">EUR</span>
              <span className="font-medium text-lg ml-1">€ 196,65</span>
            </div>
          </div>
          <div className="text-right text-xs text-gray-500 mb-3">
            inclusief € 34,13 btw
          </div>
          <div className="flex items-center text-blue-600 text-sm">
         
            <span>TOTALE BESPARING: € 10,35</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};
