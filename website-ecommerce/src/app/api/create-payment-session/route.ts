// pages/api/create-payment-session.ts

import { NextApiRequest, NextApiResponse } from 'next';
import Mollie from '@mollie/api-client';
import { NextRequest } from 'next/server';

const mollieClient = Mollie({ apiKey: process.env.MOLLIE_API_KEY!  }); // Replace with your Mollie test/live API key

export async function POST(req: NextRequest) {
  try {
    const { totalPrice, email, items } = await req.json();

    const payment = await mollieClient.payments.create({
      amount: {
        value: totalPrice.toString(),
        currency: 'EUR',
      },
      description: 'Order',
      redirectUrl: 'http://localhost:3000/order-success',
      metadata: {
        email,
        items: JSON.stringify(items),
      },
    });

    if (!payment._links?.checkout?.href) {
      throw new Error('No payment checkout URL found');
    }

    return Response.json({ paymentUrl: payment._links.checkout.href });
  } catch (error) {
    console.error('Mollie payment creation error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create payment' }), { status: 500 });
  }
}