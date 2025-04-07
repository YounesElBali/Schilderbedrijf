// import { NextApiRequest, NextApiResponse } from 'next';
// import { Client, CheckoutAPI } from '@adyen/api-library';

// const client = new Client({ apiKey: process.env.ADYEN_API_KEY!, environment: 'TEST' });
// const checkout = new CheckoutAPI(client);

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') return res.status(405).end();

//   const { amount, email } = req.body;

// //   try {
// //     const response = await checkout.payments({
// //       amount: { currency: 'EUR', value: amount }, // amount in cents
// //       reference: `order-${Date.now()}`,
// //       returnUrl: 'http://localhost:3000/order-success', // or your domain
// //       merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT!,
// //       shopperEmail: email,
// //       paymentMethod: req.body.paymentMethod, // dynamic later
// //       channel: 'Web',
// //       additionalData: {
// //         allow3DS2: true,
// //       },
// //     });

//     return res.status(200).json('oke');
// //   } catch (err) {
// //     console.error(err);
// //     return res.status(500).json({ error: 'Failed to initiate payment' });
// //   }
// }
import { NextRequest, NextResponse } from 'next/server';
import { Client, CheckoutAPI } from '@adyen/api-library';

const client = new Client({ apiKey: process.env.ADYEN_API_KEY!, environment: 'TEST' });
const checkout = new CheckoutAPI(client);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { amount, email } = body;

  // const response = await checkout.payments({...}) // your Adyen logic

  return NextResponse.json({ message: 'oke' });
}
