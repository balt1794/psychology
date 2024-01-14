import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';



const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ message: 'Webhook Error: Signature missing.' });
    }

    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const userId = event.data.object.metadata?.userId;

      if (userId) {
        await updateFreeRewritesLeft(userId);
      }
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (err) {
    return NextResponse.json(
      {
        message: "something went wrong",
        ok: false,
      },
      { status: 500 }
    );
    
  }
}

async function updateFreeRewritesLeft(userId: string) {
  const userDocRef = doc(db, 'users', userId);

  try {
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const currentFreeRewritesLeft = userDoc.data()?.freeRewritesLeft || 0;

      await updateDoc(userDocRef, {
        freeRewritesLeft: currentFreeRewritesLeft + 15,
      });
    }
  } catch (e) {
    console.error('Error updating freeRewritesLeft: ', e);
  }
}
  

