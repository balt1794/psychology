"use client"
import React, {useState}  from "react";
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Toaster, toast } from "react-hot-toast";
import { Check } from "lucide-react"

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
    <section className="bg-gradient-to-b from-white to-gray-50 ">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-12">
         
          <h2 className="mb-4 text-4xl md:text-5xl tracking-tight font-bold text-gray-900">Pricing</h2>
          <p className="mb-8 text-gray-600 sm:text-xl max-w-xl mx-auto">
            Generate captivating Airbnb listings in a fraction of time with PropertyListingsAI 🚀
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center">
          {/* Professional Plan */}
          <div className="relative flex flex-col p-8 mx-auto mb-6 max-w-lg w-full text-center bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 lg:min-w-[450px]">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#FF385C] text-white text-sm font-bold py-1 px-4 rounded-full">
              Most Popular
            </div>

            <h3 className="mb-2 text-2xl font-bold text-gray-900">One-time Purchase</h3>
            <p className="text-gray-500">Perfect for occasional hosts</p>

            <div className="flex justify-center items-baseline my-8">
              <span className="mr-2 text-5xl font-extrabold text-gray-900">$9.99</span>
              <span className="text-xl text-gray-500">/15 Credits</span>
            </div>

            <ul role="list" className="mb-8 space-y-4 text-left">
              <li className="flex items-start">
                <Check className="flex-shrink-0 w-5 h-5 text-[#FF385C] mt-0.5" />
                <span className="ml-3 text-gray-700">1 Listing = 1 Credit</span>
              </li>
              <li className="flex items-start">
                <Check className="flex-shrink-0 w-5 h-5 text-[#FF385C] mt-0.5" />
                <span className="ml-3 text-gray-700">Ideal for Airbnb Listings</span>
              </li>
              <li className="flex items-start">
                <Check className="flex-shrink-0 w-5 h-5 text-[#FF385C] mt-0.5" />
                <span className="ml-3 text-gray-700">Credits never expire</span>
              </li>
              <li className="flex items-start">
                <Check className="flex-shrink-0 w-5 h-5 text-[#FF385C] mt-0.5" />
                <span className="ml-3 text-gray-700">Save tons of time</span>
              </li>
              <li className="flex items-start">
                <Check className="flex-shrink-0 w-5 h-5 text-[#FF385C] mt-0.5" />
                <span className="ml-3 text-gray-700">Instant results</span>
              </li>
            </ul>

            <button
              onClick={handleCheckout}
              className="py-3 px-6 text-white bg-[#FF385C] hover:bg-[#E31C5F] rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF385C]"
            >
              Get Started Now
            </button>

            <p className="mt-4 text-xs text-gray-500">No subscription, pay only when you need it</p>
          </div>
        </div>

        {/* Additional benefits section */}
        <div className="mt-6 max-w-3xl mx-auto">
          <h3 className="text-xl text-black font-semibold mb-6 text-center">Every Purchase Includes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#FF385C]/10 flex items-center justify-center mb-3">
                <svg
                  className="w-5 h-5 text-[#FF385C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <h4 className="font-medium mb-1">Fast Generation</h4>
              <p className="text-sm text-gray-600">Get your listing in seconds, not hours</p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#FF385C]/10 flex items-center justify-center mb-3">
                <svg
                  className="w-5 h-5 text-[#FF385C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h4 className="font-medium mb-1">SEO Optimized</h4>
              <p className="text-sm text-gray-600">Rank higher in Airbnb search results</p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#FF385C]/10 flex items-center justify-center mb-3">
                <svg
                  className="w-5 h-5 text-[#FF385C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <h4 className="font-medium mb-1">Secure Checkout</h4>
              <p className="text-sm text-gray-600">Safe payment processing via Stripe</p>
            </div>
          </div>
        </div>

        {/* Testimonial or guarantee */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 italic max-w-2xl mx-auto">
            "I saved hours of writing time and my bookings increased by 30% after using PropertyListingsAI for my Airbnb
            listings."
          </p>
          <p className="mt-2 font-medium">— Sarah T., Superhost</p>
        </div>
      </div>
    </section>
    </>
  );
};

export default Pricing;
