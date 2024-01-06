//import { IncomingMessage, ServerResponse } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
//import { doc, getDoc, updateDoc } from 'firebase/firestore';

import Cors from 'micro-cors';
import { Stripe } from 'stripe';
//import { buffer } from 'micro';
//import { db } from "../../config/firebase"
import http from 'http';



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: '2023-10-16',
});



const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

const handler = async (req: NextApiRequest, res: NextApiResponse)   => {
  //console.log('Request received');
  const { method } = req;
  const { userId, email, purchaseType } = JSON.parse(req.body);

  //console.log('Headers:', headers)
  //console.log('Authorization header:', headers.authorization);

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  //const sig = headers['stripe-signature'];

  try {
    // Retrieve the authenticated user's ID from the request headers
    //const userId = headers.authorization?.replace('Bearer ', '');
   // console.log('userId', userId, email);
    // Create a new Stripe checkout session
    //return;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          //price: 'price_1LQLYKLxbwyf0mciMbNjfLyD',
          price: 'price_1OVcBaLxbwyf0mciZyDDfkgD',
           // replace with the actual price ID
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
    // Send the session ID back to the client
    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      res.status(500).json({ statusCode: 500, message: err.message });
    } else {
      res.status(500).json({ statusCode: 500, message: 'Unknown error occurred.' });
    }
  }
};




  


  // export const config = {
  //   api: {
  //     bodyParser: false,
  //   },
  // };

  export default cors((req: NextApiRequest | http.IncomingMessage, res: NextApiResponse | http.ServerResponse) => {
  
    return handler(req as NextApiRequest, res as NextApiResponse);
  });