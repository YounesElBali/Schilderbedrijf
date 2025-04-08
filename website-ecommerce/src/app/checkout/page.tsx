"use client";
import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGuestCheckout, setIsGuestCheckout] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Get user data from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const handleOrderCompletion = async (paymentId?: string) => {
    try {
      const formData = new FormData(document.querySelector('form') as HTMLFormElement);
      const email = formData.get('email') as string;

      const shippingAddress = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        company: formData.get('company'),
        street: formData.get('street'),
        vatNumber: formData.get('vatNumber'),
        postalCode: formData.get('postalCode'),
        city: formData.get('city'),
        phone: formData.get('phone'),
        country: 'Nederland',
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
            country: 'Nederland',
          };

      // For guest users, user.id will be null
      const userId = isGuestCheckout ? null : user?.id;

      // Create order request
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, // Guest or logged-in user
          items: cart,
          totalPrice: getTotalPrice(),
          shippingAddress: JSON.stringify(shippingAddress), // ✅ convert to string
          billingAddress: JSON.stringify(billingAddress), 
          paymentMethod: 'ideal',
          paymentId,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await response.json();

      // Store the order ID for later (success page)
      localStorage.setItem('lastOrderId', orderData.id.toString());

      // Clear the cart
      clearCart();

      // Redirect to the success page
      router.push('/order-success');
    } catch (error) {
      console.error('Error processing order:', error);
      setError('Er is een fout opgetreden bij het verwerken van je bestelling. Probeer het opnieuw.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    handleOrderCompletion();
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

          {/* Contact section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-medium">Contact</h2>
              {false && (
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="checkoutType"
                      checked={isGuestCheckout}
                      onChange={() => setIsGuestCheckout(true)}
                      className="mr-2"
                    />
                    <span className="text-sm">Als gast</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="checkoutType"
                      checked={!isGuestCheckout}
                      onChange={() => setIsGuestCheckout(false)}
                      className="mr-2"
                    />
                    <span className="text-sm">Inloggen</span>
                  </label>
                </div>
              )}
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
            {!isGuestCheckout && !user?.id && (
              <div className="mb-3">
                <input
                  type="password"
                  name="password"
                  placeholder="Wachtwoord"
                  required
                  className="w-full border border-gray-300 rounded p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Shipping section */}
          <div className="mb-8">
            <h2 className="font-medium mb-4">Bezorgadres</h2>
            <div className="mb-3">
              <div className="border border-gray-300 rounded p-3 flex justify-between cursor-pointer">
                <span>Nederland</span>
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

            <div className="mb-3 relative">
              <input
                type="text"
                name="street"
                placeholder="Straatnaam + huisnummer"
                required
                className="w-full border border-gray-300 rounded p-3 pr-10"
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

            <div className="mb-3">
              <input
                type="text"
                name="vatNumber"
                placeholder="BTW-nummer (optioneel)"
                className="w-full border border-gray-300 rounded p-3"
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

            <div className="rounded p-3 border border-gray-300 flex items-center">
              <input
                type="radio"
                id="ideal"
                name="payment"
                value="ideal"
                checked={true}
                onChange={() => {}}
                className="mr-2"
                required
              />
              <label htmlFor="ideal" className="flex items-center">
                <img src="/tp_web_ideal.webp" alt="iDEAL" className="h-[50px] mr-2" /> iDEAL
              </label>
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
              Ik ga akkoord met de&nbsp;
            </span>
            <Link href="/voorwaarden" className="text-gray-600">
            <span className="text-blue-600">
               voorwaarden
            </span>
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full bg-[#d6ac0a] text-black py-4 rounded mb-8 ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:text-white'
            }`}
          >
            {isProcessing ? 'Verwerken...' : 'Ga naar betalen'}
          </button>
        </form>
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
                <div>
                  <p>{item.name}</p>
                  <p className="text-sm text-gray-600">Aantal: {item.quantity}</p>
                </div>
                <p>€{(item.price * (item.quantity || 1)).toFixed(2)}</p>
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
