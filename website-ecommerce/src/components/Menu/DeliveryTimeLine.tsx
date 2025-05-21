// components/DeliveryTimeline.tsx
'use client';
import React from 'react';

function formatDate(date: Date): string {
  return date.toLocaleDateString('nl', {
    day: '2-digit',
    month: 'short',
  });
}

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let addedDays = 0;

  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      addedDays++;
    }
  }

  return result;
}

export default function DeliveryTimeline() {
  const today = new Date();
  const orderTime = formatDate(today);
  const shippedTime = formatDate(today);
  const deliveryStart = addBusinessDays(today, 1);
  const deliveryEnd = addBusinessDays(today, 2);
  const estimatedDeliveryRange = `${formatDate(deliveryStart)} - ${formatDate(deliveryEnd)}`;

  const steps = [
    {
      icon: (
        <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      ),
      title: 'Besteld vóór 16:00',
      date: orderTime,
    },
    {
      icon: (
        <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
            <polyline points="16 8 20 8 23 11 23 16 20 16 20 18 9 18" />
            <circle cx="5" cy="18" r="2" />
            <circle cx="18" cy="18" r="2" />
          </svg>
        </div>
      ),
      title: 'Bestelling verzonden',
      date: shippedTime,
    },
    {
      icon: (
        <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
      ),
      title: 'Bestelling geleverd',
      date: estimatedDeliveryRange,
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <h2 className="text-xl font-bold text-center mb-8">Verwachte levertijd</h2>
      <div className="flex justify-center">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center mx-2">
            <div className="p-4 flex flex-col items-center">
              {step.icon}
              <p className="mt-2 font-medium text-sm text-center">{step.title}</p>
              <p className="text-black text-sm text-center">{step.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
