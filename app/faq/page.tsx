import type { Metadata } from "next";
import Script from "next/script";
import { FaqSection } from "@/components/FaqSection";
import { faqJsonLd } from "@/lib/faq";

const SITE_URL = "https://propertylistingsai.com";

export const metadata: Metadata = {
  title: "FAQ | PropertyListingsAI",
  description:
    "Answers about PropertyListingsAI: how it works, credits and pricing, Airbnb limits, who it’s for, listing length, and supported real estate platforms.",
  openGraph: {
    title: "FAQ | PropertyListingsAI",
    description:
      "Answers about PropertyListingsAI: how it works, credits, Airbnb limits, and supported platforms.",
    url: `${SITE_URL}/faq`,
    siteName: "PropertyListingsAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | PropertyListingsAI",
    description:
      "Answers about PropertyListingsAI: how it works, credits, Airbnb limits, and supported platforms.",
  },
  alternates: {
    canonical: "/faq",
  },
};

export default function FaqPage() {
  return (
    <>
      <main className="min-h-[50vh] px-4 py-10 sm:px-6 lg:py-14">
        <FaqSection className="mx-auto max-w-5xl" />
      </main>
      <Script
        id="faq-page-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
