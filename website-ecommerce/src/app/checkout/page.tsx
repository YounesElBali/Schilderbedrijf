"use client";
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [saveInfo, setSaveInfo] = useState(false);
  const [emailSubscribe, setEmailSubscribe] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Get form data
      const formData = new FormData(e.target as HTMLFormElement);
      const shippingAddress = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        company: formData.get('company'),
        street: formData.get('street'),
        vatNumber: formData.get('vatNumber'),
        postalCode: formData.get('postalCode'),
        city: formData.get('city'),
        phone: formData.get('phone'),
        country: 'Nederland'
      };

      const billingAddress = formData.get('sameBilling') === 'on' 
        ? shippingAddress 
        : {
            firstName: formData.get('billingFirstName'),
            lastName: formData.get('billingLastName'),
            company: formData.get('billingCompany'),
            street: formData.get('billingStreet'),
            vatNumber: formData.get('billingVatNumber'),
            postalCode: formData.get('billingPostalCode'),
            city: formData.get('billingCity'),
            phone: formData.get('billingPhone'),
            country: 'Nederland'
          };

      const paymentMethod = formData.get('payment') as string;

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          items: cart,
          totalPrice: getTotalPrice(),
          shippingAddress,
          billingAddress,
          paymentMethod
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      // Clear cart
      clearCart();

      // Redirect to success page
      router.push('/order-success');
    } catch (error) {
      console.error('Error processing order:', error);
      setError('Er is een fout opgetreden bij het verwerken van je bestelling. Probeer het opnieuw.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto font-sans">
      {/* Left side - checkout form */}
      <div className="md:w-2/3 p-6">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Payment options */}
          <div className="mb-8">
            <div className="flex justify-center space-x-2 mb-4">
              <button type="button" className="bg-purple-600 text-white py-3 px-4 rounded flex-1 flex items-center justify-center">
                <img src="/shop-pay-logo.svg" alt="Shop Pay" className="h-5" />
              </button>
              <button type="button" className="bg-black text-white py-3 px-4 rounded flex-1 flex items-center justify-center">
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
                name="email"
                placeholder="Email" 
                required
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
                name="firstName"
                placeholder="Voornaam"
                required
                className="border border-gray-300 rounded p-3" 
              />
              <input 
                type="text"
                name="lastName"
                placeholder="Achternaam"
                required
                className="border border-gray-300 rounded p-3" 
              />
            </div>
            
            <div className="mb-3">
              <input 
                type="text"
                name="company"
                placeholder="Bedrijf (optioneel)"
                className="w-full border border-gray-300 rounded p-3" 
              />
            </div>
            
            <div className="mb-3 relative">
              <input 
                type="text"
                name="street"
                placeholder="Straatnaam"
                required
                className="w-full border border-gray-300 rounded p-3 pr-10" 
              />
            </div>
            
            <div className="mb-3">
              <input 
                type="text"
                name="vatNumber"
                placeholder="BTW-nummer"
                className="w-full border border-gray-300 rounded p-3" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input 
                type="text"
                name="postalCode"
                placeholder="Postcode"
                required
                className="border border-gray-300 rounded p-3" 
              />
              <input 
                type="text"
                name="city"
                placeholder="Stad"
                required
                className="border border-gray-300 rounded p-3" 
              />
            </div>
            
            <div className="mb-3 relative">
              <input 
                type="tel"
                name="phone"
                placeholder="Telefoon (optioneel)"
                className="w-full border border-gray-300 rounded p-3 pr-10" 
              />
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
                value="ideal"
                className="mr-2" 
                defaultChecked
                required
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
                <input 
                  type="radio" 
                  id="creditcard" 
                  name="payment" 
                  value="creditcard"
                  className="mr-2"
                />
                <span className="mr-2">Creditcard</span>
                <div className="flex space-x-2 ml-auto">
                  <img src="/visa-logo.png" alt="Visa" className="h-5" />
                  <img src="/mastercard-logo.png" alt="Mastercard" className="h-5" />
                  <img src="/amex-logo.png" alt="American Express" className="h-5" />
                </div>
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
                name="sameBilling" 
                value="on"
                className="mr-2" 
                defaultChecked
              />
              <label htmlFor="sameBilling">Zelfde als bezorgadres</label>
            </div>
            
            <div className="border border-gray-300 rounded p-3 mb-3 flex items-center">
              <input 
                type="radio" 
                id="differentBilling" 
                name="sameBilling" 
                value="off"
                className="mr-2"
              />
              <label htmlFor="differentBilling">Een ander factuuradres gebruiken</label>
            </div>
          </div>

          {/* Terms section */}
          <div className="mb-4 text-sm flex items-start">
            <input 
              type="checkbox" 
              name="terms"
              required
              className="mt-1 mr-2" 
            />
            <span className="text-gray-600">
              Ik ga akkoord met de voorwaarden
            </span>
          </div>

          {/* Submit button */}
          <button 
            type="submit"
            disabled={isProcessing}
            className={`w-full bg-blue-600 text-white py-4 rounded mb-8 ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isProcessing ? 'Verwerken...' : 'Ga naar betalen'}
          </button>
        </form>

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
  );
}
