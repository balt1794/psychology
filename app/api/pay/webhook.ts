import { IncomingMessage, ServerResponse } from 'http';
import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import Cors from 'micro-cors';
import { Stripe } from 'stripe';
import { buffer } from 'micro';
import { db } from "../../../config/firebase"
import http from 'http';

interface MyCheckoutSession extends Stripe.Checkout.Session {
  customer_email: string;
  metadata: {
    customer_email: string;
    userId: string;
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: '2023-10-16',
});

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

export const webhookHandler = async (req: NextRequest, res: NextResponse) => {
  const sig = req.headers.get('stripe-signature');


  try {
    const { 
      type, 
      data: {
        object: { 
          ...webhookData 
        }
      } 
    } = await req.json();

    if (type === 'checkout.session.completed') {
      const session = webhookData as MyCheckoutSession;

      const userId = session.metadata.userId;
      await updateFreeRewritesLeft(userId);
    }

  } catch (err) {

  }
};

async function updateFreeRewritesLeft(userId: string) {
  const userDocRef = doc(db, 'users', userId);

  try {
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      await updateDoc(userDocRef, {
        freeRewritesLeft: 20,
      });
    }
  } catch (e) {
    console.error('Error updating freeRewritesLeft: ', e);
  }
}