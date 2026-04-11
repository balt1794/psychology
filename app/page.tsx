import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Clock, CheckCircle } from "lucide-react"
import { Metadata } from "next";
import { ArrowRight, Camera, Sparkles } from "lucide-react";
import { FaqSection } from "@/components/FaqSection";
import { faqJsonLd } from "@/lib/faq";

export const metadata: Metadata = {
  title: 'PropertyListingsAI - Real Estate Listing Description Generator',
  description:'Generate captivating real estate descriptions for your property listings instantly with AI to boost visibility, bookings and sales.'
};


export default function Home() {
  return (
    <>
<section className="relative z-10 mx-auto max-w-9xl px-4 py-10 sm:px-6 sm:py-12 lg:px-16 lg:py-20">
  <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
    <div>
      <h1 className="mb-5 inline-flex max-w-full flex-wrap items-center gap-2 rounded-md bg-[#FF385C] px-3 py-1.5 text-xs font-semibold text-white sm:mb-6 sm:px-4 sm:py-1.5 sm:text-sm">
        <span className="leading-snug">Real Estate Listing Description Generator</span>
        <Sparkles className="h-4 w-4 shrink-0" />
      </h1>
      <h2 className="mb-4 text-3xl font-bold leading-[1.12] tracking-tight text-black sm:text-4xl sm:leading-[1.15] lg:mb-6 lg:text-6xl lg:leading-tight">
        <span className="sm:hidden">
          <span className="block">Better Property Listings</span>
          <span className="mt-1 block">
            in Minutes <span className="text-[#FF385C]">with AI</span>
          </span>
        </span>
        <span className="hidden sm:block">
          <span className="inline">Better Property</span> <span className="inline">Listings</span>
          <span className="mt-2 block sm:mt-3">
            <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="whitespace-nowrap">in Minutes</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap sm:gap-2">
                <span className="text-[#FF385C]">with AI</span>
                <span
                  className="text-[1.85rem] leading-none sm:text-5xl lg:text-6xl"
                  aria-hidden="true"
                >
                  🏠
                </span>
              </span>
            </span>
          </span>
        </span>
      </h2>
      <p className="mb-6 max-w-xl text-base font-medium leading-relaxed text-[#5f5f5f] sm:text-lg lg:text-2xl">
        Powerful real estate tools to manage property listings, create high-converting images and descriptions, and
        maximize your sales and bookings.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
        <Link
          href="/tools"
          className="inline-flex w-full items-center justify-center rounded-md bg-[#FF385C] px-6 py-3 font-bold text-white transition-colors hover:bg-[#E31C5F] sm:w-auto"
        >
          Real Estate Tools
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        <Link
          href="/airbnb-listing"
          className="inline-flex w-full items-center justify-center rounded-md border border-[#FF385C] px-6 py-3 font-bold text-[#E31C5F] transition-colors hover:bg-[#FFECEF] sm:w-auto"
        >
          Airbnb Listing Generator
        </Link>
      </div>
    </div>

    <div className="relative">
      <div className="rounded-[28px] p-0">
        <div className="relative rounded-xl overflow-hidden border border-[#ececec] bg-white shadow-xl h-[360px] md:h-[560px]">
          <Image
            src="/hero1.jpg"
            alt="Luxury property exterior"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

  <div className="hidden md:block absolute -top-8 right-6 w-72 rounded-2xl bg-white/95 backdrop-blur border border-[#ececec] p-1 shadow-xl">
       
        <div className="relative rounded-xl overflow-hidden mb-2 h-36">
          <Image
            src="/hero2.jpg"
            alt="Featured listing preview"
            fill
            loading="lazy"
            className="object-cover"
          />
        </div>
        <div className="mb-2 rounded-lg border border-[#e7e7e7] bg-white">
          <div className="grid grid-cols-4 divide-x divide-[#e5e5e5]">
            <div className="px-2 py-2 text-center">
              <span className="block text-xs font-extrabold text-[#111] leading-none">4</span>
              <span className="block mt-1 text-[9px] font-medium text-[#666]">Beds</span>
            </div>
            <div className="px-2 py-2 text-center">
              <span className="block text-xs font-extrabold text-[#111] leading-none">4</span>
              <span className="block mt-1 text-[9px] font-medium text-[#666]">Baths</span>
            </div>
            <div className="px-2 py-2 text-center">
              <span className="block text-xs font-extrabold text-[#111] leading-none">2,284</span>
              <span className="block mt-1 text-[9px] font-medium text-[#666]">Sq Ft</span>
            </div>
            <div className="px-2 py-2 text-center">
              <span className="block text-xs font-extrabold text-[#111] leading-none">$171</span>
              <span className="block mt-1 text-[9px] font-medium text-[#666]">/Sq Ft</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-[#ececec] bg-[#fafafa] p-2 ">
          <p className="text-[9px] text-[#444] leading-relaxed font-medium">
          Just listed in Edwardsville, IL: Beautifully maintained 4-bedroom, 4-bath home in a desirable neighborhood.</p>
        </div>
      </div>

      <div className="absolute -bottom-8 left-2 right-2 md:left-0 md:right-12 rounded-xl border border-[#ececec] bg-[#fafafa] px-4 py-2 shadow-lg">
        <p className="text-xs md:text-sm text-[#2d2d2d] leading-relaxed">
          A modern, light-filled residence with open living spaces, premium finishes, and strong curb appeal.
          Perfect as the hero listing preview area for your generated long-form property description.
        </p>
      </div>
    </div>
  </div>
</section>

<section className="brand-section">
  <div className="container mx-auto max-w-5xl px-6 py-10 lg:px-12 lg:py-6">
    <h2 className="mb-8 text-center text-xl font-bold text-gray-900 md:mb-10 md:text-2xl">
      Trusted by the best real estate agents and property managers in the market
    </h2>
    <div className="brand-logos flex flex-wrap items-center justify-center gap-x-10 gap-y-8 md:gap-x-14">
      {[
        { alt: "Airbnb", src: "/airbnb.png", className: "h-8 w-auto max-h-8 md:h-9" },
        { alt: "RE/MAX", src: "/remax.png", className: "h-7 w-auto max-h-7 md:h-6" },
        { alt: "Booking.com", src: "/booking.svg", className: "h-8 w-auto max-h-8 md:h-9" },
        { alt: "Vrbo", src: "/Vrbo.svg.png", className: "h-7 w-auto max-h-[30px] md:h-8 md:max-h-9" },
        { alt: "Zillow", src: "/zillow.png", className: "h-8 w-auto max-h-7 md:h-10" },
      ].map((item, i) => (
        <div key={item.alt} className="brand-logo-item flex shrink-0 items-center justify-center">
          <img
            alt={item.alt}
            width={120}
            height={40}
            decoding="async"
            src={item.src}
            loading={i < 2 ? "eager" : "lazy"}
            fetchPriority={i < 2 ? "high" : undefined}
            className={`object-contain ${item.className}`}
          />
        </div>
      ))}
    </div>
  </div>
</section>



{/* 
<section className="max-w-8xl mx-auto mt-16 mb-16 p-6 lg:p-16">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
        <div className="relative w-full lg:w-1/2 rounded-xl overflow-hidden">
          <img
            src="/slider3.png"
            alt="Property Listings AI"
            className="w-full h-auto rounded-xl"
          />
          <div className="absolute inset-0 bg-black bg-opacity-70 rounded-xl flex items-center justify-center">
            <div className="p-2 text-white max-w-lg">
              <h2 className="text-3xl font-bold mb-4 text-white">
                Transform Your <span className="text-[#FF385C]">Airbnb Listing</span>
              </h2>
              <p className="mb-6 text-gray-100">
                Our AI-powered tools analyze your property photos and details to create compelling, SEO-optimized Airbnb
                listings that attract more guests and increase bookings. Save hours of writing time while creating
                professional descriptions that highlight your property&apos;s best features.
              </p>
              <Link
                href="/tools"
                className="inline-flex items-center bg-[#FF385C] hover:bg-[#E31C5F] text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Explore Our Tools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-xl border-r-8 border-gray-200 p-6">
          <h2 className="text-4xl text-black font-bold mb-6">Real Estate Listing Tools</h2>

          <div className="space-y-2">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-[#FF385C] transition-colors">
              <Link href="/airbnb-listing">
                <h3 className="font-bold text-lg text-[#FF385C] mb-1">Airbnb Listing Generator</h3>
                <p className="text-gray-700">
                  Turn your property photos into compelling Airbnb listings that attract more bookings.
                </p>
              </Link>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-[#FF385C] transition-colors">
              <Link href="/property-description-generator">
                <h3 className="font-bold text-lg text-[#FF385C] mb-1">Property Description Generator</h3>
                <p className="text-gray-700">
                  Generate eye-catching descriptions that attract more guests.
                </p>
              </Link>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-[#FF385C] transition-colors">
              <Link href="/airbnb-house-rules-generator">
                <h3 className="font-bold text-lg text-[#FF385C] mb-1">Airbnb House Rules Generator</h3>
                <p className="text-gray-700">Create clear, professional house rules based on your property photos.</p>
              </Link>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-[#FF385C] transition-colors">
              <Link href="/driving-directions-generator">
                <h3 className="font-bold text-lg text-[#FF385C] mb-1">Airbnb Driving Directions Generator</h3>
                <p className="text-gray-700">
                  Generate detailed driving directions to help guests find your property easily.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>


*/}


    <section className="w-full max-w-screen-3xl mx-auto px-5 py-10 sm:px-8 md:px-10 lg:px-14 xl:px-20 2xl:px-24 lg:py-14 mt-10 mb-14 lg:mt-12 lg:mb-8">
      <h2 className="text-center text-3xl font-bold text-gray-900 lg:text-4xl mb-8 lg:mb-10">
        Explore the Best{" "}
        <Link
          href="/tools"
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold text-[#FF385C] transition-colors hover:bg-rose-50 hover:text-[#E31C5F] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF385C] focus-visible:ring-offset-2"
        >
          Real Estate Tools
        </Link>
      </h2>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-8 lg:grid-cols-4 lg:gap-x-7 xl:gap-x-9">
        {[
          {
            imageAlt: "Airbnb listing tool preview",
            imageSrc: "/tool1.png",
            title: "Airbnb Listing Generator",
            description:
              "Turn your property photos into compelling Airbnb listings that attract more bookings.",
            href: "/airbnb-listing",
            primaryLabel: "Generate listing",
          },
          {
            imageAlt: "Property description tool preview",
            imageSrc: "/tool2.png",
            title: "Property Description Generator",
            description:
              "Generate eye-catching descriptions that attract more guests and highlight your property's best features.",
            href: "/property-description-generator",
            primaryLabel: "Write with AI",
          },
          {
            imageAlt: "House rules tool preview",
            imageSrc: "/tool3.png",
            title: "Airbnb House Rules Generator",
            description:
              "Create clear, professional house rules based on your property photos and details.",
            href: "/airbnb-house-rules-generator",
            primaryLabel: "Generate rules",
          },
          {
            imageAlt: "Driving directions tool preview",
            imageSrc: "/tool4.webp",
            title: "Airbnb Driving Directions Generator",
            description:
              "Generate detailed driving directions so guests can find your property easily.",
            href: "/driving-directions-generator",
            primaryLabel: "Get directions",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="relative h-56 w-full shrink-0 bg-gray-100 md:h-60">
              <Image
                src={card.imageSrc}
                alt={card.imageAlt}
                fill
                className={
                  card.imageSrc === "/tool2.png"
                    ? "object-cover blur-xs scale-105 brightness-[0.92]"
                    : "object-cover"
                }
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
              />
              {card.title === "Airbnb Listing Generator" ? (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Image
                    src="/airbnb.png"
                    alt="Airbnb logo"
                    width={96}
                    height={30}
                    className="h-auto w-auto object-contain"
                  />
                </div>
              ) : null}
              {card.imageSrc === "/tool2.png" ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="mx-3 w-full max-w-[92%] rounded-lg bg-black/30 px-4 py-2 backdrop-blur-[1px]">
                  <p className="mx-auto mt-2 max-w-[92%] text-left line-clamp-5 text-[11px] leading-relaxed text-white/90 sm:text-sm font-black">
                  Modern Hillside Retreat with Scenic Views
                    </p>
                    <p className="mx-auto mt-2 max-w-[92%] text-left line-clamp-5 text-[11px] leading-relaxed text-white/90 sm:text-xs">
                      Nestled amidst a lush, tranquil landscape, this contemporary home offers stunning views of the
                      surrounding hills and sunsets over the horizon. Its sleek, black exterior is tastefully offset by
                      warm, glowing lights that enhance its inviting charm. Inside, large windows draw in ample natural
                      light, creating a bright and airy atmosphere perfect for relaxation or entertaining.
                    </p>
                  </div>
                </div>
              ) : null}
              {card.imageSrc === "/tool3.png" ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="mx-3 w-full max-w-[92%] rounded-lg bg-black/30 px-4 py-4 text-center backdrop-blur-[1px]">
                    <p className="mx-auto max-w-[92%] text-center text-[11px] font-black leading-relaxed text-white/95 sm:text-sm">
                      House Rules for a Smooth Stay
                    </p>
                    <ul className="mx-auto mt-2 max-w-[92%] space-y-1 text-center text-[10px] leading-relaxed text-white/90 sm:text-xs">
                      <li>🚭 No smoking indoors</li>
                      <li>🎉 No parties or events</li>
                      <li>🏊 No pool use after 10 PM</li>
                    </ul>
                  </div>
                </div>
              ) : null}
              {card.imageSrc === "/tool4.webp" ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="mx-3 w-full max-w-[92%] rounded-lg bg-black/30 px-4 py-4 text-center backdrop-blur-[1px]">
                    <p className="mx-auto max-w-[92%] text-center text-[11px] font-black leading-relaxed text-white/95 sm:text-sm">
                      Easy Arrival Directions 🚗
                    </p>
                    <p className="mx-auto mt-1 max-w-[92%] text-center text-[10px] leading-relaxed text-white/90 sm:text-xs">
                      From downtown, take I-95 North to Exit 24, continue 2 miles, then turn right on Palm Avenue. The
                      property is on your left with a blue gate.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="flex flex-col items-center px-6 pb-7 pt-6 text-center">
              <h3 className="text-lg font-bold text-gray-900 lg:text-xl">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black lg:text-[0.9375rem]">{card.description}</p>
              <Link
                href={card.href}
                className="mt-5 inline-flex w-full max-w-[min(100%,20rem)] items-center justify-center rounded-lg border-2 border-[#FF385C] px-4 py-2.5 text-sm font-semibold text-[#E31C5F] transition-colors hover:bg-[#FFECEF]"
              >
                {card.primaryLabel}
              </Link>

            </div>
          </div>
        ))}
      </div>
    </section>

<section className="mx-auto mt-12 max-w-8xl px-6 lg:px-16">
  <h2 className="text-center text-3xl font-bold text-gray-900 lg:text-4xl">
    Focus on Closing Deals, Ditch Time-Consuming Tasks
  </h2>
  <p className="mx-auto mt-2 max-w-5xl text-center text-black lg:text-lg">
    From listing copy to property details, get everything done faster so you can spend more time selling.
  </p>
</section>

<section className="max-w-8xl mx-auto mt-2 mb-8 p-6 lg:p-16">
  <div className="flex flex-col lg:flex-row justify-center items-center gap-10">
    {/* Left Side: Card with Time Savings & Included Items */}
    <div className="w-full lg:w-5/12 flex justify-center">
      <div className="w-full rounded-lg border-2 border-gray-200 bg-white p-6 sm:p-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-black lg:text-4xl mb-3">
          Save <span className="text-[#FF385C]">2+ Hours</span> Per Listing
        </h2>

        <p className="text-lg leading-relaxed text-black mb-6">
          Our real estate tools automate the most time-consuming parts of creating property listings, giving you back hours of
          your valuable time for each property, so you can focus on what really matters.
        </p>

        <div className="mb-5 flex items-center">
         
          <h3 className="text-xl font-bold text-black">Everything You Need, Automatically Generated</h3>
        </div>

        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            "Compelling Titles",
            "Detailed Descriptions",
            "Property Highlights",
            "Amenities List",
            "House Rules",
            "Contact Information",
            "SEO Optimized Content",
            "How to Get There",
          ].map((item, index) => (
            <li key={index} className="flex items-center rounded-xl border border-gray-200 bg-[#fcfcfd] px-3 py-2">
              <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-[#008489]" />
              <span className="text-[1.05rem] text-black">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl ">
          <p className="font-medium text-black">
            <span className="font-bold text-black">Make it easy to list your properties on all major platforms: Airbnb, Zillow, Remax, Booking.com, Vrbo, and more.</span> 
          </p>
        </div>
        <Link
          href="/airbnb-listing"
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[#FF385C] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#E31C5F]"
        >
          Generate listing
        </Link>
      </div>
    </div>

    {/* Right Side: Image with styling */}
    <div className="w-full lg:w-7/12 flex justify-center">
      <div className="relative w-full overflow-hidden rounded-lg border-2 border-white-400 shadow-lg">
        <div className="relative h-[460px] w-full md:h-[620px]">
          <Image
            src="/showcase.webp"
            alt="Property showcase"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent p-4 text-white sm:p-5">
          <div className="h-full w-full overflow-y-auto pr-1 md:w-1/2 ml-2">
            <h3 className="text-lg font-extrabold leading-tight text-white sm:text-2xl">Bel Air Poolside Retreat</h3>

            <p className="mt-2 text-xs leading-relaxed text-white/90 sm:text-sm">
              Experience luxury in the heart of Bel Air. This exquisite 3-bedroom home offers a serene escape with
              modern amenities, a crystal-clear pool, elegant loungers, and alfresco dining on a spacious patio.
            </p>

            <p className="mt-2 text-xs leading-relaxed text-white/90 sm:text-sm">
              Located in one of Bel Air&apos;s best spots, this home blends classic elegance with modern comfort. It
              features sophisticated interiors, two pristine bathrooms, and easy access to LA attractions for both
              relaxation and exploration.
            </p>

            <div className="mt-3 text-[11px] leading-relaxed text-white/90 sm:text-xs">
              <p className="font-bold text-white">House rules:</p>
              <ul className="mt-1 space-y-0.5">
                <li>- No smoking</li>
                <li>- No pets allowed</li>
                <li>- No parties or events</li>
                <li>- Quiet hours: 10 PM - 8 AM</li>
                <li>- Check-in after 3 PM</li>
                <li>- Check-out by 11 AM</li>
              </ul>
            </div>

            <div className="mt-3 text-[11px] leading-relaxed text-white/90 sm:text-xs">
              <p className="font-bold text-white">Property details:</p>
              <p>Guests: 3 | Bedrooms: 3 | Beds: 3 | Bathrooms: 2</p>
              <p className="mt-1">
                Amenities: Wifi, Pool, Kitchen, Washer, Air conditioning, Heating, TV
              </p>
            </div>

            <div className="mt-3 text-[11px] leading-relaxed text-white/90 sm:text-xs">
              <p className="font-bold text-white">How to get there:</p>
              <p>- From LAX: I-405 N to Sunset Blvd, then 57 Harrison St (approx. 25 min).</p>
              <p>- From Downtown LA: US-101 N and I-405 S (approx. 35 min).</p>
            </div>

            <div className="mt-3 text-[11px] leading-relaxed text-white/90 sm:text-xs">
              <p className="font-bold text-white">Nearby:</p>
              <p>Getty Center (15 min), Rodeo Drive (20 min), Santa Monica Pier (25 min), Hollywood Walk of Fame (30 min)</p>
            </div>

            <p className="mt-3 text-[11px] leading-relaxed text-white/90 sm:text-xs">
              Contact: thebestrealestateguide@gmail.com or 9737577833
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Features section temporarily hidden
<section id="features">...</section>
*/}

<section className="mx-4 mt-8 lg:mx-10">
  <div className="w-full rounded-md border border-[#ffd8e2] bg-[#fff5f8] p-6 shadow-sm lg:p-8">
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">Simple Pricing. No Subscription.</h2>
        <p className="mt-2 max-w-2xl text-base text-black">
          Pay for what you need. Our one-time payment plan gives you 15 credits for just $9.99.
        </p>
        <Link
          href="/pricing"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#FF385C] px-5 py-2.5 text-md font-semibold text-white transition-colors hover:bg-[#E31C5F]"
        >
          Get Started
        </Link>
      </div>

      <div className="rounded-2xl border border-[#FFB8C7] bg-white p-4 lg:p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Most Popular Plan</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#ffd8e2] bg-[#fff8fa] p-3 text-center">
            <p className="text-md font-medium text-gray-500">Price</p>
            <p className="mt-1 text-2xl font-extrabold text-[#FF385C] lg:text-3xl">$9.99</p>
          </div>
          <div className="rounded-xl border border-[#ffd8e2] bg-[#fff8fa] p-3 text-center">
            <p className="text-md font-medium text-gray-500">Credits</p>
            <p className="mt-1 text-2xl font-extrabold text-gray-900 lg:text-3xl">15</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<FaqSection />

<Script
  id="faq-schema"
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
/>


      <Toaster />

    </>
  );
}