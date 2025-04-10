"use client";
import { Suspense,useEffect, useState} from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

interface OrderDetails {
  id: number;
  totalPrice: number;
  deliveryCost: number;
  createdAt: string;
}

 function OrderSuccessPageContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);// Prevent duplicate order creation
  //const [paymentId, setPaymentId] = useState<string | null>(null);
  
  const [orderProcessed, setOrderProcessed] = useState<boolean>(false);

   
    const paymentId = searchParams.get('paymentId');
  


  useEffect(() => {
    if (!paymentId) {
      setError('Geen betalings-ID gevonden. Neem contact op met de klantenservice.');
      setIsLoading(false);
      return;
    }

    // Check if the order for this paymentId has already been created
    const orderCreated = localStorage.getItem(`orderCreated_${paymentId}`);
    if (orderCreated) {
      setIsLoading(false); // Skip order creation if already done
      return;
    }

    setIsLoading(false); // Payment ID exists, ready for order creation
  }, [paymentId]);

    const createOrder = async () => {
      try {
        
        const pendingOrderData = localStorage.getItem('pendingOrderData');
        
        if (!pendingOrderData) {
          setError('Geen bestelgegevens gevonden. Neem contact op met de klantenservice.');
          setIsLoading(false);
          return;
        }

        const orderData = JSON.parse(pendingOrderData);
        
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...orderData,
            paymentId,
            shippingAddress: JSON.stringify(orderData.shippingAddress),
            billingAddress: JSON.stringify(orderData.billingAddress),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create order');
        }

        const createdOrder = await response.json();
        setOrderDetails(createdOrder);
        
        localStorage.setItem('lastOrderId', createdOrder.id.toString());
        localStorage.setItem(`orderCreated_${paymentId}`, 'true');
        
        await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderData, createdOrder }),
        });

        clearCart();
        localStorage.removeItem('pendingOrderData');
        setOrderProcessed(true); 
      } catch (error) {
        console.error('Error creating order:', error);
        setError('Er is een fout opgetreden bij het verwerken van je bestelling. Neem contact op met de klantenservice.');
      } finally {
        setIsLoading(false);
      }
    };
    useEffect(() => {
      if (!isLoading && !error && paymentId) {
        createOrder(); 
        
      }
    }, [isLoading, error, paymentId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Er is een fout opgetreden
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              {error}
            </p>

            <div className="mt-8">
              <Link 
                href="/"
                className="inline-block bg-[#d6ac0a] text-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition-colors"
              >
                Terug naar home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Bedankt voor je bestelling!
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            We hebben je bestelling ontvangen en verwerken deze zo snel mogelijk.
          </p>

          {orderDetails && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Bestelnummer: #{orderDetails.id}</p>
              <p className="text-sm">Totaalbedrag: €{orderDetails.totalPrice.toFixed(2)}</p>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Je ontvangt binnen enkele minuten een bevestigingsmail met de details van je bestelling. Check ook je spam folder.
            </p>

            <div className="mt-8">
              <Link 
                href="/"
                className="inline-block bg-[#d6ac0a] text-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition-colors"
              >
                Terug naar home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessPageContent />
    </Suspense>
  );
}