// Import necessary dependencies
import { NextRequest, NextResponse } from 'next/server';
import { Stripe } from 'stripe';
import {headers} from "next/headers";

// Create a new instance of the Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: '2023-10-16',
});

// Define your API route handler using the POST function
export async function POST(req: NextRequest, res: NextResponse<string>) {
  const headersList = headers();
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
      success_url: `${headersList.get("origin")}/thank-you`,
      cancel_url: `${headersList.get("origin")}/`,
      client_reference_id: userId,
    });


  } catch (err) {
 
  }
}
