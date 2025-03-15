"use client"
import React, {useState}  from "react";
import { useAuth } from '../../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Toaster, toast } from "react-hot-toast";

const Pricing = () => {
  const [loading, setLoading] = useState(false);

  const auth = useAuth();

  const handleCheckout = async () => {
    console.log("handleCheckout called");
    
console.log(loading)
if (!auth.user) {
  toast.error("Please log in to proceed with the purchase.");
  setLoading(false);
  return;
}

    try {
      const response = await fetch('/api/pay', {
        method: 'POST',
        //headers: {
        //  'Content-Type': 'application/json'
       // }
       body:
          JSON.stringify({
            //userId : auth.user.uid
            userId: auth.user.uid,
          email: auth.user.email,
          purchaseType: 'onetime',
          })
        
      });

      const { sessionId } = await response.json();

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
      if (!stripe) {
        console.error("Stripe failed to load.");
        return;
      }
      
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleCheckoutMonthly = async () => {
    console.log("handleCheckout called");
    
console.log(loading)
if (!auth.user) {
  toast.error("Please log in to proceed with the purchase.");
  setLoading(false);
  return;
}

    try {
      const response = await fetch('/api/hellomonthly', {
        method: 'POST',
        //headers: {
        //  'Content-Type': 'application/json'
       // },
       body:
          JSON.stringify({
            //userId : auth.user.uid
            userId: auth.user.uid,
          email: auth.user.email,
          purchaseType: 'monthly',
          })
        
      });

      const { sessionId } = await response.json();

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
      if (!stripe) {
        console.error("Stripe failed to load.");
        return;
      }
      
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleCheckoutYearly = async () => {
    
    console.log("handleCheckout called");
    
console.log(loading)
if (!auth.user) {
  toast.error("Please log in to proceed with the purchase.");
  setLoading(false);
  return;
}

    try {
      const response = await fetch('/api/helloyearly', {
        method: 'POST',
        //headers: {
        //  'Content-Type': 'application/json'
       // },
       body:
          JSON.stringify({
            //userId : auth.user.uid
            userId: auth.user.uid,
          email: auth.user.email,
          purchaseType: 'yearly',
          })
        
      });

      const { sessionId } = await response.json();

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
      if (!stripe) {
        console.error("Stripe failed to load.");
        return;
      }
      
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <>
    <Toaster />
    <section className="">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-bold text-black">
            Pricing
          </h2>
          <p className="mb-5 font-light text-black sm:text-2xl">
          Start create captivating listings in a fraction of time with PropertyListingsAI 🚀
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center"> {/* Use flex-col for mobile and flex-row for larger screens */}
          {/* Professional Plan */}
          <div className="flex flex-col p-6 mx-2 mb-3 max-w-lg text-center text-black rounded-lg border border-4 border-white-400  xl:p-8 lg:min-w-[400px]">
            <h3 className="mb-4 text-3xl font-semibold">One-time</h3>
            <div className="rounded-full border px-2.5 py-0.5 text-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border border-4 border-white-400  bg-white text-black  text-center">
              Most Popular
            </div>
            <div className="flex justify-center items-baseline my-8">
              <span className="mr-2 text-5xl font-bold">$9.99</span>
              <span className="text-gray-400">/15 Credits</span>
            </div>
            <ul role="list" className="mb-8 space-y-4 text-left">
              <li className="flex items-center space-x-3 text-lg">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>1 Listing = 1 Credit</span>
              </li>
              <li className="flex items-center space-x-3 text-lg">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>Ideal for Airbnb Listings</span>
              </li>
              <li className="flex items-center space-x-3 text-lg">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>Credits never expire</span>
              </li>
              <li className="flex items-center space-x-3 text-lg">
              <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>Save tons of time</span>
              </li>
              <li className="flex items-center space-x-3 text-lg">
              <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>Instant results</span>
              </li>
              {/* Add more features specific to this plan */}
            </ul>
            <button onClick={handleCheckout} className="text-black  bg-white hover:bg-gray-200 border border-4 border-white-400 focus:ring-4 focus:ring-primary-200 font-medium rounded-xl text-md px-5 py-2.5 text-center">
              Buy
            </button>
          </div>

          {/* Another Plan (e.g., Basic Plan) 
          <div className="flex flex-col p-6 mx-2 mb-3 max-w-lg text-center text-black rounded-lg border border-2 border-white shadow-lg shadow-orange-500/50 xl:p-8 lg:min-w-[400px]">
            <h3 className="mb-4 text-3xl font-semibold">Monthly</h3>
            <div className="rounded-full border px-2.5 py-0.5 text-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-white bg-white text-black  text-center">
              Save 90%
            </div>
            <div className="flex justify-center items-baseline my-8">
              <span className="mr-2 text-5xl font-extrabold">$6.99</span>
              <span className="text-gray-400">/month</span>
            </div>
            <ul role="list" className="mb-8 space-y-4 text-left">
            <li className="flex items-center space-x-3 text-lg">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>Infinite Credits</span>
              </li>
              <li className="flex items-center space-x-3 text-lg">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>Full access to all templates and features</span>
              </li>
              <li className="flex items-center space-x-3 text-lg">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>More engagement, followers, impressions and interactions</span>
              </li>
              <li className="flex items-center space-x-3 text-lg">
              <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>Custom templates (Upon request)</span>
              </li>
              <li className="flex items-center space-x-3 text-lg">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>Unlimited Video Creation</span>
              </li>
 
            </ul>
            <button onClick={handleCheckoutMonthly}  className="text-black bg-white hover:bg-gray-400 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-md px-5 py-2.5 text-center">
              Buy
            </button>
          </div>

          <div className="flex flex-col p-6 mx-2 mb-3 max-w-lg text-center text-white rounded-lg border border-2 border-white shadow-lg shadow-orange-500/50 xl:p-8 lg:min-w-[400px]">
            <h3 className="mb-4 text-3xl font-semibold">Yearly</h3>
            <div className="rounded-full border px-2.5 py-0.5 text-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-white bg-white text-black  text-center">
              Save 90%
            </div>
            <div className="flex justify-center items-baseline my-8">
              <span className="mr-2 text-5xl font-extrabold">$49.99</span>
              <span className="text-gray-400">/year</span>
            </div>
            <ul role="list" className="mb-8 space-y-4 text-left">
              <li className="flex items-center space-x-3 text-lg">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>Infinite Credits</span>
              </li>
              <li className="flex items-center space-x-3 text-lg">
              <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>Full access to all templates and features</span>
              </li>
              <li className="flex items-center space-x-3 text-lg">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>More engagement, followers, impressions and interactions</span>
              </li>
              <li className="flex items-center space-x-3 text-lg">
              <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>Custom templates (Upon request)</span>
              </li>
              <li className="flex items-center space-x-3 text-lg">
                <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span>Unlimited Video Creation</span>
              </li>
            
            </ul>
            <button onClick={handleCheckoutYearly}  className="text-black bg-white hover:bg-gray-400 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-md px-5 py-2.5 text-center">
              Buy
            </button>
          </div>
          */}
        </div>
      </div>
      {/*<div className="mx-auto max-w-screen-md text-center mt-8 lg:mt-12">
        <p className="mb-5 font-light text-gray-500 sm:text-lg">Use CODE - GIF30 to get 30% Off</p>
  </div>*/}
    </section>
    </>
  );
};

export default Pricing;
