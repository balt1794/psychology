// Import necessary dependencies
import { NextRequest, NextResponse } from 'next/server';
import { Stripe } from 'stripe';

// Create a new instance of the Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: '2023-10-16',
});

// Define your API route handler using the POST function
export async function POST(req: NextRequest, res: NextResponse<string>) {
 
  try {
    const { userId, email, purchaseType } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1OVcBaLxbwyf0mciZyDDfkgD', // replace with the actual price ID
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        userId: userId,
        purchaseType: purchaseType,
      },
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/`,
      cancel_url: `${req.headers.get('origin')}/`,
      client_reference_id: userId,
    });


  } catch (err) {
 
  }
}
