// Import necessary dependencies
import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'micro-cors';
import { Stripe } from 'stripe';

// Create a new instance of the Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: '2023-10-16',
});

// Create a Cors middleware
const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

// Define your API route handler using the POST function
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const { userId, email, purchaseType } = JSON.parse(req.body);

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
        purchaseType: purchaseType
      },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
      client_reference_id: userId,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      res.status(500).json({ statusCode: 500, message: err.message });
    } else {
      res.status(500).json({ statusCode: 500, message: 'Unknown error occurred.' });
    }
  }
}

// Export the Cors-wrapped handler
export default cors(POST as any);
