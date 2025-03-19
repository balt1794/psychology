"use client"
import React, {useState}  from "react";
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Toaster, toast } from "react-hot-toast";

import { ArrowRight, Edit3, Image, FileText, MessageSquare, LayoutGrid, Home, Key, Map, Star } from "lucide-react"

export default function ToolsPage() {
  return (
    <section className="py-12 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="mx-auto max-w-screen-md text-center mb-12">
        <h2 className="mb-4 text-5xl tracking-tight font-bold text-[#FF385C]">Real Estate Listing Tools</h2>
        <p className="mb-5 font-light text-black sm:text-2xl">
          Everything you need to create captivating property listings in a fraction of the time
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Listing Generator */}
        <div className="flex flex-col p-6 rounded-lg border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="p-3 rounded-full bg-[#FF385C] w-fit mb-4">
            <Edit3 className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl text-[#FF385C] font-bold mb-2">Airbnb Listing Generator</h3>
          <p className="text-gray-600 mb-4">
            Create optimized Airbnb listings in a fraction of time and increase your bookings.
          </p>
          <div className="mt-auto">
            <a href="/airbnb-listing" className="inline-flex items-center text-[#FF385C] font-medium">
              Try it now <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Photo Enhancer */}
        <div className="flex flex-col p-6 rounded-lg border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="p-3 rounded-full bg-[#FF385C] w-fit mb-4">
            <Image className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl text-[#FF385C] font-bold mb-2">Property Description Generator</h3>
          <p className="text-gray-600 mb-4">
          Create compelling property descriptions that highlight the best features of your property.
          </p>
          <div className="mt-auto">
            <a href="/property-description-generator" className="inline-flex items-center text-[#FF385C] font-medium">
              Try it now <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>

          {/* Local Guide Creator */}
          <div className="flex flex-col p-6 rounded-lg border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="p-3 rounded-full bg-[#FF385C] w-fit mb-4">
            <Map className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl text-[#FF385C]  font-bold mb-2">Driving Directions Generator</h3>
          <p className="text-gray-600 mb-4">
            Generate driving directions to help guests get to your property easily.
          </p>
          <div className="mt-auto">
            <a href="/driving-directions-generator" className="inline-flex items-center text-[#FF385C] font-medium">
              Try it now <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Title Creator */}
        <div className="flex flex-col p-6 rounded-lg border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="p-3 rounded-full bg-[#FF385C] w-fit mb-4">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl text-[#FF385C] font-bold mb-2">House Rules Generator</h3>
          <p className="text-gray-600 mb-4">
            Generate clear and concise house rules for your property listings.
          </p>
          <div className="mt-auto">
            <a href="/airbnb-house-rules-generator" className="inline-flex items-center text-[#FF385C] font-medium">
              Try it now <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Guest Communication
        <div className="flex flex-col p-6 rounded-lg border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="p-3 rounded-full bg-[#FF385C] w-fit mb-4">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Guest Communication</h3>
          <p className="text-gray-600 mb-4">
            Create professional templates for guest communication to improve your response rate.
          </p>
          <div className="mt-auto">
            <a href="#" className="inline-flex items-center text-[#FF385C] font-medium">
              Try it now <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="flex flex-col p-6 rounded-lg border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="p-3 rounded-full bg-[#FF385C] w-fit mb-4">
            <LayoutGrid className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Amenities Optimizer</h3>
          <p className="text-gray-600 mb-4">
            Highlight the most appealing amenities of your property to attract more bookings.
          </p>
          <div className="mt-auto">
            <a href="#" className="inline-flex items-center text-[#FF385C] font-medium">
              Try it now <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="flex flex-col p-6 rounded-lg border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="p-3 rounded-full bg-[#FF385C] w-fit mb-4">
            <Home className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">House Rules Generator</h3>
          <p className="text-gray-600 mb-4">
            Create clear and friendly house rules that set expectations for your guests.
          </p>
          <div className="mt-auto">
            <a href="#" className="inline-flex items-center text-[#FF385C] font-medium">
              Try it now <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="flex flex-col p-6 rounded-lg border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="p-3 rounded-full bg-[#FF385C] w-fit mb-4">
            <Key className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Check-in Instructions</h3>
          <p className="text-gray-600 mb-4">
            Generate detailed check-in instructions to ensure a smooth arrival for your guests.
          </p>
          <div className="mt-auto">
            <a href="#" className="inline-flex items-center text-[#FF385C] font-medium">
              Try it now <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="flex flex-col p-6 rounded-lg border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="p-3 rounded-full bg-[#FF385C] w-fit mb-4">
            <Star className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Review Response</h3>
          <p className="text-gray-600 mb-4">
            Create thoughtful responses to guest reviews to maintain your excellent reputation.
          </p>
          <div className="mt-auto">
            <a href="#" className="inline-flex items-center text-[#FF385C] font-medium">
              Try it now <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
         */}
      </div>
    </section>
  )
}

