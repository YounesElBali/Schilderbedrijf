import { NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderData, createdOrder } = body;

    if (!orderData || !createdOrder) {
      return NextResponse.json({ error: 'Missing order data' }, { status: 400 });
    }

    const result = await sendOrderConfirmationEmail(orderData, createdOrder);

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to send email', details: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error('API error sending email:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
