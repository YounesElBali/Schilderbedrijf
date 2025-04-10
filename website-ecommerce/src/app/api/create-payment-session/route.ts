// pages/api/create-payment-session.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Mollie from '@mollie/api-client';
import { NextRequest } from 'next/server';

const mollieClient = Mollie({ apiKey: process.env.MOLLIE_API_KEY!  }); // Replace with your Mollie test/live API key

export async function POST(req: NextRequest) {
  try {
    const { totalPrice, email } = await req.json();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Create initial payment without the payment ID in the redirect URL
    const payment = await mollieClient.payments.create({
      amount: {
        value: totalPrice.toString(),
        currency: 'EUR',
      },
      description: 'Order',
      redirectUrl: `${baseUrl}/order-success`,
      cancelUrl:`${baseUrl}/order-failed`,
      metadata: {
        email
      },
    });

    if (!payment._links?.checkout?.href) {
      throw new Error('No payment checkout URL found');
    }

    // Add payment ID to the redirect URL
    const redirectUrl = `${baseUrl}/order-success?paymentId=${payment.id}`;
    
    // Update the payment with the correct redirect URL
    await mollieClient.payments.update(payment.id, {
      redirectUrl,
    });

    return Response.json({ paymentUrl: payment._links.checkout.href });
  } catch (error) {
    console.error('Mollie payment creation error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create payment', redirectToCheckout: true }), { status: 500 });
  }
}