import { IncomingMessage, ServerResponse } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

import Cors from 'micro-cors';
import { Stripe } from 'stripe';
import { buffer } from 'micro';
import { db } from "../../config/firebase"
import http from 'http';

interface MyCheckoutSession extends Stripe.Checkout.Session {
customer_email: string;
  metadata: {
    customer_email: string;
    userId: string
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: '2023-10-16',
});

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

const webhookHandler = async (req: NextApiRequest,  res: NextApiResponse) => {
  //console.log("Webjhook bitsh");
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Webhook Error: Signature missing.' }));
    return;
  }


  try {
    const { 
        type, 
        data: {
            object: { 
                ...webhookData 
            }
        } 
    } = req.body;
   
    if (type === 'checkout.session.completed') {
    //console.log("Debugger", webhookData)
      const session = webhookData as MyCheckoutSession;

      // Extract customer email from session and pass it to updateFreeRewritesLeft function
      //const customerEmail = session.customer_email;
      const userId = session.metadata.userId;
      //await updateFreeRewritesLeft(customerEmail);
      await updateFreeRewritesLeft(userId);
      //console.log(`Customer email "${userId}" extracted and passed to updateFreeRewritesLeft function.`);
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ received: true }));
  } catch (err) {
    console.error(err);
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Webhook Error' }));
  }
};

async function updateFreeRewritesLeft(userId: string){

  //console.log('updateFreeRewritesLeft called with userid:', userId);

  // Check if the customer email matches the logged in user's email
  
    const userDocRef = doc(db, "users", userId);
  
    try {
      // Use getDoc() instead of doc() to check if the document exists
      const userDoc = await getDoc(userDocRef);
      //console.log('userDoc.exists():', userDoc.exists());
  
      if (userDoc.exists()) {
        // Use updateDoc() to update the document with the new value
        await updateDoc(userDocRef, {
          freeRewritesLeft: 20,
        });
        //console.log('freeRewritesLeft updated');
      } else {
        //console.log("userDoc does not exist");
      }
    } catch (e) {
      //console.error("Error updating freeRewritesLeft: ", e);
    }


  
}
  


  // export const config = {
  //   api: {
  //     bodyParser: false,
  //   },
  // };

  export default cors((req: NextApiRequest | http.IncomingMessage, res: NextApiResponse | http.ServerResponse) => {
    return webhookHandler(req as NextApiRequest, res as NextApiResponse);
  });