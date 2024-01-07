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
          price: 'price_1OVcBaLxbwyf0mciZyDDfkgD',
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        userId: userId,
        purchaseType: purchaseType,
      },
      mode: 'payment',
      success_url: 'http://localhost:3000',
      cancel_url: 'http://localhost:3000',
      client_reference_id: userId,
    });

    return NextResponse.json({ sessionId: session.id }); // Return sessionId instead of URL
  } catch (err) {
    console.error(err);
    // Handle error and return an appropriate response
    return NextResponse.json({ error: 'Failed to create checkout session' });
  }
}
