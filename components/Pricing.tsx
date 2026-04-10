"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Toaster, toast } from "react-hot-toast";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

type PurchaseType = "onetime" | "monthly" | "yearly";

const CHECKOUT_ENDPOINTS: Record<PurchaseType, string> = {
  onetime: "/api/pay",
  monthly: "/api/hellomonthly",
  yearly: "/api/helloyearly",
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const FEATURES = [
  "1 Listing = 1 Credit",
  "Ideal for real estate listings including Airbnb, Zillow, RE/MAX, Booking.com, and Vrbo",
  "Credits never expire",
  "Save time on descriptions & social posts",
  "Drive more bookings & sales",
  "No subscription — pay only when you need it",
] as const;

const PRICING_AUDIENCE =
  "Ideal for real estate agents, property managers, and people creating real estate listings, social content, and an online presence to grow their business and close more deals.";

const Pricing = () => {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const startCheckout = useCallback(
    async (purchaseType: PurchaseType) => {
      if (!auth.user) {
        toast.error("Please log in to proceed with the purchase.");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(CHECKOUT_ENDPOINTS[purchaseType], {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: auth.user.uid,
            email: auth.user.email,
            purchaseType,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const message =
            typeof data?.error === "string"
              ? data.error
              : "Could not start checkout. Please try again.";
          toast.error(message);
          return;
        }

        const sessionId = data?.sessionId as string | undefined;
        if (!sessionId) {
          toast.error("Invalid checkout session. Please try again.");
          return;
        }

        const stripe = await stripePromise;
        if (!stripe) {
          toast.error("Payment system failed to load. Refresh and try again.");
          return;
        }

        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          toast.error(error.message ?? "Checkout could not continue.");
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [auth.user]
  );

  return (
    <>
      <Toaster position="top-center" />
      <section
        id="pricing"
        className="relative overflow-x-hidden bg-gradient-to-b from-slate-50/80 via-white to-rose-50/40"
        aria-labelledby="pricing-heading"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF385C]/25 to-transparent"
          aria-hidden
        />
        <div className="mx-auto max-w-screen-xl px-4 pb-12 pt-6 sm:pb-16 sm:pt-8 lg:px-6 lg:pb-20 lg:pt-10">
          <div className="mb-10 w-full text-center sm:mb-12">
            <h2
              id="pricing-heading"
              className="mb-3 text-4xl font-bold tracking-tight text-gray-900 text-balance md:mb-4 md:text-5xl"
            >
              Pricing
            </h2>
            <p className="w-full text-lg leading-relaxed text-gray-800 text-pretty sm:text-xl">
              Generate captivating real estate listings in a fraction of the time with{" "}
              <Link
                href="/"
                className="font-semibold text-[#FF385C] underline decoration-[#FF385C]/35 underline-offset-2 transition-colors hover:text-[#E31C5F] hover:decoration-[#E31C5F]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF385C] focus-visible:ring-offset-2"
              >
                PropertyListingsAI
              </Link>
              .
            </p>
            <p className="mt-4 w-full text-lg leading-relaxed text-gray-800 text-pretty sm:mt-5 sm:text-xl">
              {PRICING_AUDIENCE}
            </p>
          </div>

          <div className="flex flex-col items-stretch justify-center pt-6 md:flex-row md:items-start md:pt-5">
            <div className="relative mx-auto w-full max-w-lg lg:min-w-[460px]">
              <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
                <span className="inline-flex rounded-full bg-[#FF385C] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-[#FF385C]/35">
                  Most popular
                </span>
              </div>
              <div className="relative flex flex-col overflow-hidden rounded-md border border-gray-200/80 bg-white/90 px-8 pb-8 pt-12 text-center shadow-[0_24px_60px_-12px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.04] backdrop-blur-sm transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-12px_rgba(15,23,42,0.14)] sm:px-10 sm:pb-10 sm:pt-14">
              <div className="pt-0">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-[1.65rem]">
                  One-time purchase
                </h3>
              </div>

              <div className="my-8 rounded-2xl bg-gradient-to-br from-gray-50 to-slate-50/80 px-6 py-6 ring-1 ring-gray-100">
                <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1">
                  <span className="text-5xl font-extrabold tabular-nums tracking-tight text-gray-900 sm:text-6xl">
                    $9.99
                  </span>
                  <span className="text-lg font-medium text-gray-500 sm:text-xl">/ 15 credits</span>
                </div>
                <p className="mt-2 text-center text-sm text-gray-500">Pay once, use credits whenever you need them.</p>
              </div>

              <ul role="list" className="mb-8 space-y-3.5 text-left">
                {FEATURES.map((text) => (
                  <li
                    key={text}
                    className="flex items-start gap-3 rounded-xl px-1 py-0.5 transition-colors hover:bg-gray-50/80"
                  >
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FF385C]/10">
                      <Check className="h-3.5 w-3.5 text-[#FF385C]" strokeWidth={3} aria-hidden />
                    </span>
                    <span className="text-[0.95rem] leading-snug text-gray-700 sm:text-base">{text}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => startCheckout("onetime")}
                disabled={loading}
                aria-busy={loading}
                className="inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-xl bg-[#FF385C] px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-[#FF385C]/25 transition-colors hover:bg-[#E31C5F] hover:shadow-lg hover:shadow-[#FF385C]/30 focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden />
                    Redirecting…
                  </>
                ) : (
                  "Get started now"
                )}
              </button>

              <p className="mt-5 text-xs leading-relaxed text-gray-500">
                No subscription — pay only when you need it.
              </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
