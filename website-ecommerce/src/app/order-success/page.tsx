"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface OrderDetails {
  id: number;
  totalPrice: number;
  createdAt: string;
}

export default function OrderSuccessPage() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the order ID from the URL or localStorage
    const orderId = localStorage.getItem('lastOrderId');
    if (!orderId) {
      router.push('/');
      return;
    }

    // Fetch order details
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrderDetails(data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Bestelnummer: #{orderDetails.id}
              </h2>
              <div className="flex justify-between text-gray-600">
                <span>Datum:</span>
                <span>{new Date(orderDetails.createdAt).toLocaleDateString('nl-NL')}</span>
              </div>
              <div className="flex justify-between text-gray-600 mt-2">
                <span>Totaalbedrag:</span>
                <span className="font-semibold">€{orderDetails.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Je ontvangt binnen enkele minuten een bevestigingsmail met de details van je bestelling.
            </p>

            <div className="mt-8">
              <Link 
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
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