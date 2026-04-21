"use client";
import React from "react";
import { ArrowRight, Edit3, Image, FileText, Map, Wand2, Calculator } from "lucide-react";
import { ToolPageShell } from "@/components/ToolPageShell";

export default function ToolsPage() {
  return (
    <ToolPageShell
      titleBefore="Real Estate Listing"
      titleAccent="Tools"
      subtitle="Everything you need to create captivating property listings in a fraction of the time"
      mainVariant="stack"
      mainSectionId={null}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF385C]/30 hover:shadow-lg sm:p-7">
          <div className="mb-4 w-fit rounded-xl bg-[#FF385C]/10 p-3">
            <Edit3 className="h-6 w-6 text-[#FF385C]" aria-hidden />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Airbnb Listing Generator</h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">
            Create optimized Airbnb listings in a fraction of time and increase your bookings.
          </p>
          <div className="mt-auto">
            <a
              href="/airbnb-listing"
              className="inline-flex items-center text-sm font-semibold text-[#E31C5F] transition-colors hover:text-[#FF385C]"
            >
              Try it now{" "}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF385C]/30 hover:shadow-lg sm:p-7">
          <div className="mb-4 w-fit rounded-xl bg-[#FF385C]/10 p-3">
            <Image className="h-6 w-6 text-[#FF385C]" aria-hidden />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Property Description Generator</h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">
            Create compelling property descriptions that highlight the best features of your property.
          </p>
          <div className="mt-auto">
            <a
              href="/property-description-generator"
              className="inline-flex items-center text-sm font-semibold text-[#E31C5F] transition-colors hover:text-[#FF385C]"
            >
              Try it now{" "}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF385C]/30 hover:shadow-lg sm:p-7">
          <div className="mb-4 w-fit rounded-xl bg-[#FF385C]/10 p-3">
            <Map className="h-6 w-6 text-[#FF385C]" aria-hidden />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Driving Directions Generator</h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">
            Generate driving directions to help guests get to your property easily.
          </p>
          <div className="mt-auto">
            <a
              href="/driving-directions-generator"
              className="inline-flex items-center text-sm font-semibold text-[#E31C5F] transition-colors hover:text-[#FF385C]"
            >
              Try it now{" "}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF385C]/30 hover:shadow-lg sm:p-7">
          <div className="mb-4 w-fit rounded-xl bg-[#FF385C]/10 p-3">
            <FileText className="h-6 w-6 text-[#FF385C]" aria-hidden />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">House Rules Generator</h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">
            Generate clear and concise house rules for your property listings.
          </p>
          <div className="mt-auto">
            <a
              href="/airbnb-house-rules-generator"
              className="inline-flex items-center text-sm font-semibold text-[#E31C5F] transition-colors hover:text-[#FF385C]"
            >
              Try it now{" "}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF385C]/30 hover:shadow-lg sm:p-7">
          <div className="mb-4 w-fit rounded-xl bg-[#FF385C]/10 p-3">
            <Wand2 className="h-6 w-6 text-[#FF385C]" aria-hidden />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Social Media Post Generator</h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">
            Generate social media posts for any social media platform. Upload photos, fill in the details, pick a template, and download a polished post for any social media platform.
          </p>
          <div className="mt-auto">
            <a
              href="/social-media-post-generator"
              className="inline-flex items-center text-sm font-semibold text-[#E31C5F] transition-colors hover:text-[#FF385C]"
            >
              Try it now{" "}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF385C]/30 hover:shadow-lg sm:p-7">
          <div className="mb-4 w-fit rounded-xl bg-[#FF385C]/10 p-3">
            <Wand2 className="h-6 w-6 text-[#FF385C]" aria-hidden />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">AI Interior Design Generator</h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">
            Upload a room photo, review AI suggestions, and generate an improved interior design image in minutes.
          </p>
          <div className="mt-auto">
            <a
              href="/ai-interior-design-generator"
              className="inline-flex items-center text-sm font-semibold text-[#E31C5F] transition-colors hover:text-[#FF385C]"
            >
              Try it now{" "}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF385C]/30 hover:shadow-lg sm:p-7">
          <div className="mb-4 w-fit rounded-xl bg-[#FF385C]/10 p-3">
            <Calculator className="h-6 w-6 text-[#FF385C]" aria-hidden />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Mortgage Calculator</h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">
            Estimate monthly payment with principal, interest, PMI, taxes, insurance, HOA, and amortization schedule.
          </p>
          <div className="mt-auto">
            <a
              href="/mortgage-calculator"
              className="inline-flex items-center text-sm font-semibold text-[#E31C5F] transition-colors hover:text-[#FF385C]"
            >
              Try it now{" "}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF385C]/30 hover:shadow-lg sm:p-7">
          <div className="mb-4 w-fit rounded-xl bg-[#FF385C]/10 p-3">
            <Calculator className="h-6 w-6 text-[#FF385C]" aria-hidden />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">FHA Mortgage Loan Calculator</h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">
            Estimate FHA monthly payments with principal, interest, taxes, insurance, HOA, and FHA mortgage insurance premium.
          </p>
          <div className="mt-auto">
            <a
              href="/fha-mortgage-calculator"
              className="inline-flex items-center text-sm font-semibold text-[#E31C5F] transition-colors hover:text-[#FF385C]"
            >
              Try it now{" "}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF385C]/30 hover:shadow-lg sm:p-7">
          <div className="mb-4 w-fit rounded-xl bg-[#FF385C]/10 p-3">
            <Calculator className="h-6 w-6 text-[#FF385C]" aria-hidden />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">VA Mortgage Calculator</h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">
            Estimate VA monthly payments with taxes, insurance, HOA, and VA funding fee scenarios.
          </p>
          <div className="mt-auto">
            <a
              href="/va-mortgage-calculator"
              className="inline-flex items-center text-sm font-semibold text-[#E31C5F] transition-colors hover:text-[#FF385C]"
            >
              Try it now{" "}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
