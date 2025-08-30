"use client";
import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { usePricing } from '@/contexts/PriceContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  phone: string;
  country: string;
  company?: string;
  vatNumber?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotalPrice, clearCart } = useCart();
  const { selectedCountry, calculatePrice, getCountryData, vatRate, isVATExempt, validateBelgianVAT } = usePricing();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGuestCheckout, setIsGuestCheckout] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [vatNumber, setVatNumber] = useState('');
  const [vatValidationError, setVatValidationError] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  // Validate VAT number when it changes (for Belgium)
  useEffect(() => {
    const countryData = getCountryData();
    if (countryData?.code === 'BE' && vatNumber) {
      if (!validateBelgianVAT(vatNumber)) {
        setVatValidationError('Ongeldig Belgisch BTW-nummer. Formaat: BE0123456789');
      } else {
        setVatValidationError('');
      }
    } else {
      setVatValidationError('');
    }
  }, [vatNumber, selectedCountry]);

  // Get total price with current country pricing and VAT number
  const getTotalPriceWithCountry = () => {
    return cart.reduce((total, item) => {
      const itemPrice = calculatePrice(item.price, vatNumber);
      return total + (itemPrice * (item.quantity || 1));
    }, 0);
  };

  // Calculate delivery cost based on total with country pricing
  const calculateDeliveryCost = () => {
    const currentTotal = getTotalPriceWithCountry();
    if (currentTotal >= 80) return 0;
    return 6.95;
  };

  // Calculate VAT amount for display
  const getVATAmount = () => {
    const countryData = getCountryData();
    const exempt = isVATExempt(vatNumber);
    
    // No VAT if exempt
    if (exempt) return 0;
    
    // Calculate base total (without VAT)
    const baseTotal = cart.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
    
    return baseTotal * vatRate;
  };

  // Get subtotal (base prices without VAT)
  const getSubtotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  };

  // Update delivery cost whenever cart, country, or VAT number changes
  useEffect(() => {
    setDeliveryCost(calculateDeliveryCost());
  }, [cart, selectedCountry, vatNumber]);

  // Handle hydration and get user data from localStorage
  useEffect(() => {
    setIsHydrated(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleVatNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setVatNumber(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    // Validate Belgian VAT number if provided
    const countryData = getCountryData();
    if (countryData?.code === 'BE' && vatNumber && !validateBelgianVAT(vatNumber)) {
      setError('Voor België is een geldig BTW-nummer vereist voor BTW-vrijstelling.');
      setIsProcessing(false);
      return;
    }
  
    try {
      const formData = new FormData(document.querySelector('form') as HTMLFormElement);
      const email = formData.get('email') as string;
      
      const totalPriceWithCountry = getTotalPriceWithCountry();
      const vatAmount = getVATAmount();
      const subtotal = getSubtotal();
      const exempt = isVATExempt(vatNumber);
      
      // Store form data in localStorage for later use after payment
      const orderData = {
        email,
        country: selectedCountry,
        vatAmount,
        subtotal,
        vatNumber: vatNumber || null,
        vatExempt: exempt,
        shippingAddress: {
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          company: formData.get('company'),
          street: formData.get('street'),
          vatNumber: vatNumber || null,
          postalCode: formData.get('postalCode'),
          city: formData.get('city'),
          phone: formData.get('phone'),
          country: selectedCountry,
        },
        billingAddress: formData.get('sameBilling') === 'on'
          ? {
              firstName: formData.get('firstName'),
              lastName: formData.get('lastName'),
              company: formData.get('company'),
              street: formData.get('street'),
              vatNumber: vatNumber || null,
              postalCode: formData.get('postalCode'),
              city: formData.get('city'),
              phone: formData.get('phone'),
              country: selectedCountry,
            }
          : {
              firstName: formData.get('billingFirstName'),
              lastName: formData.get('billingLastName'),
              company: formData.get('billingCompany'),
              street: formData.get('billingStreet'),
              vatNumber: vatNumber || null,
              postalCode: formData.get('billingPostalCode'),
              city: formData.get('billingCity'),
              phone: formData.get('billingPhone'),
              country: selectedCountry,
            },
        userId: isGuestCheckout ? null : user?.id,
        items: cart.map(item => ({
          ...item,
          price: calculatePrice(item.price, vatNumber), // Store the actual price paid
          basePrice: item.price, // Store the base price
          country: selectedCountry
        })),
        totalPrice: totalPriceWithCountry + deliveryCost,
        deliveryCost: deliveryCost,
        paymentMethod: 'ideal',
        withVAT: !exempt
      };
      
      // Store order data in localStorage for later use (only after hydration)
      if (isHydrated) {
        localStorage.setItem('pendingOrderData', JSON.stringify(orderData));
      }
  
      // Create Mollie payment session
      const paymentResponse = await fetch('/api/create-payment-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalPrice: (totalPriceWithCountry + deliveryCost).toFixed(2),
          email,
          items: orderData.items,
          orderData: orderData,
        }),
      });
  
      if (!paymentResponse.ok) throw new Error('Payment creation failed');
  
      const { paymentUrl, error, redirectToCheckout } = await paymentResponse.json();
     
      if (error) {
        if (redirectToCheckout) {
          router.push('/checkout');
        } else {
          setError('Er is een fout opgetreden tijdens het starten van de betaling.');
        }
        return;
      }
      
      // Redirect to Mollie payment page
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Payment error:', error);
      setError('Er is een fout opgetreden tijdens het starten van de betaling.');
      setIsProcessing(false);
    }
  };
  
  const countryData = getCountryData();
  const totalPriceWithCountry = getTotalPriceWithCountry();
  const vatAmount = getVATAmount();
  const subtotal = getSubtotal();
  const finalTotal = totalPriceWithCountry + deliveryCost;
  const exempt = isVATExempt(vatNumber);
  
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
          </div>

          {/* Shipping section */}
          <div className="mb-8">
            <h2 className="font-medium mb-4">Bezorgadres</h2>
            <div className="mb-3">
              <div className="border border-gray-300 rounded p-3 flex justify-between">
                <span>{selectedCountry}</span>
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

            {/* BTW-nummer veld - aangepast voor België */}
            <div className="mb-3">
              <input
                type="text"
                name="vatNumber"
                value={vatNumber}
                onChange={handleVatNumberChange}
                placeholder={
                  countryData?.code === 'BE' 
                    ? "BTW-nummer (bijv. BE0123456789) - vereist voor BTW-vrijstelling"
                    : "BTW-nummer (optioneel)"
                }
                className={`w-full border rounded p-3 ${
                  vatValidationError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {vatValidationError && (
                <p className="text-red-500 text-sm mt-1">{vatValidationError}</p>
              )}
              {countryData?.code === 'BE' && !vatNumber && (
                <p className="text-blue-600 text-sm mt-1">
                  ℹ️ Zonder geldig Belgisch BTW-nummer worden prijzen inclusief BTW berekend
                </p>
              )}
              {countryData?.code === 'BE' && exempt && (
                <p className="text-green-600 text-sm mt-1">
                  ✓ Geldig BTW-nummer - prijzen exclusief BTW
                </p>
              )}
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
            <Link href="/terms" className="text-gray-600">
            <span className="text-blue-600">
               voorwaarden&nbsp;
            </span>
            </Link>
            <span className="text-blue-600">
               en
            </span>
            <Link href="/privacy" className="text-gray-600">
            <span className="text-blue-600">
               privacybeleid
            </span>
            </Link>
          </div>
        
          {/* Submit button */}
          <button
            type="submit"
            disabled={isProcessing || (countryData?.code === 'BE' && vatNumber && !validateBelgianVAT(vatNumber))}
            className={`w-full bg-[#d6ac0a] text-black py-4 rounded mb-8 ${
              isProcessing || (countryData?.code === 'BE' && vatNumber && !validateBelgianVAT(vatNumber))
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-black hover:text-white'
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
            {cart.map((item) => {
              const itemPriceWithCountry = calculatePrice(item.price, vatNumber);
              const itemTotal = itemPriceWithCountry * (item.quantity || 1);
              
              return (
                <div key={item.id} className="flex justify-between border-b pb-3 mb-3">
                  <div>
                    <p>{item.name}</p>
                    {item.variantName && <p className="text-sm text-gray-600">Variant: {item.variantName}</p>}
                    <p className="text-sm text-gray-600">Aantal: {item.quantity}</p>
                    <p className="text-sm text-gray-600">
                      €{item.price.toFixed(2)} excl. BTW × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€{itemTotal.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      {exempt ? 'excl.' : 'incl.'} BTW
                    </p>
                  </div>
                </div>
              );
            })}
            
            {/* Price breakdown */}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between mb-2">
                <span>Subtotaal (excl. BTW)</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              
              {!exempt && vatAmount > 0 && (
                <div className="flex justify-between mb-2">
                  <span>BTW (21%)</span>
                  <span>€{vatAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between mb-2">
                <span>Verzendkosten</span>
                <span>
                  {deliveryCost === 0 ? (
                    <span className="text-green-600">Gratis</span>
                  ) : (
                    `€${deliveryCost.toFixed(2)}`
                  )}
                </span>
              </div>
              
              {totalPriceWithCountry < 80 && (
                <p className="text-sm text-green-600 mb-2">
                  Bestel voor €{(80 - totalPriceWithCountry).toFixed(2)} meer om gratis verzending te krijgen
                </p>
              )}
              
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Totaal ({exempt ? 'excl.' : 'incl.'} BTW)</span>
                <span>€{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}