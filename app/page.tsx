import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Clock, CheckCircle } from "lucide-react"
import { Metadata } from "next";
import { ArrowRight, Camera, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: 'PropertyListingsAI - Real Estate Listing Description Generator',
  description:'Generate captivating real estate descriptions for your property listings instantly with AI to boost visibility, bookings and sales.'
};


export default function Home() {

  return (
    <>
<section className="relative z-10 max-w-9xl mx-auto px-6 py-12 lg:px-16 lg:py-20">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
    <div>
      <h1 className="inline-flex items-center rounded-md bg-[#FF385C] px-4 py-1 text-sm font-semibold text-white mb-6">
      Real Estate Listing Description Generator
      <Sparkles className="ml-2 h-4 w-4" />
      </h1>
      <h2 className="text-4xl lg:text-6xl text-black font-bold leading-tight mb-4">
        Better Property Listings 
      
        
      </h2>
    <h2 className="text-4xl lg:text-6xl text-black font-bold leading-tight mb-4">
      in Minutes <span className="text-[#FF385C]">with AI</span>
      <span className="inline-block ml-3  mb-3 text-5xl align-middle">🏠</span>
      </h2>
      <p className="text-lg lg:text-2xl text-[#5f5f5f] font-medium mb-6">
  Powerful real estate tools to manage property listings,
  <br />
  create high-converting images and descriptions,
  <br />
  and maximize your sales and bookings.
</p>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/tools"
          className="inline-flex items-center bg-[#FF385C] hover:bg-[#E31C5F] text-white font-bold py-3 px-6 rounded-md transition-colors"
        >
          Real Estate Tools
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        <Link
          href="/airbnb-listing"
          className="inline-flex items-center border border-[#FF385C] text-[#E31C5F] hover:bg-[#FFECEF] font-bold py-3 px-6 rounded-md transition-colors"
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

<section>
<div className="relative z-10 flex flex-col items-center justify-center max-w-4xl gap-8 mx-auto mt-8">
<span className="text-xl text-black font-black hidden md:flex mb-2">Trusted by the best in the market</span>
  </div>
<div className="flex items-center justify-center gap-3">
    <div className="flex items-center space-x-6">
        <img src="/airbnb.png" width="60" height="30" className="w-10 md:w-12   v-lazy-image v-lazy-image-loaded" ></img>
        <img src="/remax.png" width="60" height="30" className="w-10 md:w-20  v-lazy-image v-lazy-image-loaded" ></img>
        <img src="/booking.svg" width="60" height="30" className="w-10 md:w-12 v-lazy-image v-lazy-image-loaded" ></img>
        <img src="/Vrbo.svg.png" width="60" height="30" className="w-14 md:w-24  v-lazy-image v-lazy-image-loaded" ></img>
        <img src="/zillow.png" width="60" height="30" className="w-14 md:w-28  v-lazy-image v-lazy-image-loaded" ></img>
    </div>
</div>
</section>

{/* New Section for Included Items and Image */}
{/* New Section for Included Items and Image */}
<section className="max-w-8xl mx-auto mt-16 mb-16 p-6 lg:p-16">
  <div className="flex flex-col lg:flex-row justify-center items-center gap-10">
    {/* Left Side: Card with Time Savings & Included Items */}
    <div className="w-full lg:w-1/2 flex justify-center">
      <div className="bg-white rounded-xl shadow-xl p-8 border-l-8 border-white-400 w-full">
        <h2 className="text-3xl lg:text-4xl text-black font-bold mb-3">
          Save <span className="text-[#FF385C]">2+ Hours</span> Per Listing
        </h2>

        <p className="text-lg text-[#00000078] mb-6">
          Our AI tools automate the most time-consuming parts of creating property listings, giving you back hours of
          your valuable time for each property.
        </p>

        <div className="flex items-center mb-5">
          <Clock className="h-6 w-6 text-[#FF385C] mr-2" />
          <h3 className="text-xl font-bold text-black">Everything You Need, Automatically Generated</h3>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <li key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-[#008489] mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-[#484848]">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 p-4 bg-[#F7F7F7] rounded-lg border-2 border-white-400">
          <p className="text-[#484848] font-medium">
            <span className="text-[#FF385C] font-bold">Average time saved:</span> 2 hours per property listing
          </p>
        </div>
      </div>
    </div>

    {/* Right Side: Image with styling */}
    <div className="w-full lg:w-1/2 flex justify-center ">
      <img src="/preview-plai.png" alt="Slider Image" className="w-full h-auto rounded-lg border-2 border-white-400" />
    </div>
  </div>
</section>

<section className="max-w-8xl mx-auto mt-16 mb-16 p-6 lg:p-16">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
        {/* Left Side: Property Image with Description Overlay */}
        <div className="relative w-full lg:w-1/2 rounded-xl overflow-hidden">
          <img
            src="/slider3.png" // Replace with your image URL
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
                professional descriptions that highlight your property's best features.
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

        {/* Right Side: Tools */}
        <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-xl border-r-8 border-white-400 p-6">
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
              </p> </Link>
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

<section id="features" className="md:pb-20 mt-12  md:pt-10 pb-6 sm:pb-6 sm:pt-6 rounded-xl border-2 border-white-400 mr-4 ml-4 lg:mr-10 lg:ml-10" style={{backgroundColor: "#fafafa"}}>
    <div className="section_wrapper max-w-295.2 pl-4 pr-4 lg:pl-12 lg:pr-12 mx-auto">
        <div className="text-center ">
        <h2 className=" text-2xl lg:text-4xl font-bold mb-0 lg:mb-6 text-center text-black p-6 lg:p-0">Features ⚡</h2>
    <p className=" text-sm lg:text-lg mb-8 text-center text-black">
    AI-powered features that can help you list your properties in no time. We offer support for all popular platforms such as Airbnb, Zillow, Remax, and more.
      </p>
        </div>
        <div className="module3 grid grid-cols-2 md:grid-cols-3 gap-6">
      
            <div className="feature mb-10">
            <div className="emoji text-xl lg:text-4xl">🚘</div>
                <h3 className="font-bold mb-4 text-sm text-black lg:text-xl">AI Directions Generator</h3>
                <p className="text-sm text-black">Enter the address of your property, and our AI will generate clear, step-by-step directions for your potential guests, making it easy for them to find their way.</p> 
            </div>
            <div className="feature mb-10">
                <div className="emoji text-xl text-4xl">🏡</div>
                <h3 className="font-bold mb-4 text-sm text-black  lg:text-xl ">AI House Rules Generator</h3>
                <p className="text-sm text-black">Upload images or provide details about your property, and our AI will automatically generate comprehensive house rules, including check-in/check-out times and other essential guidelines.</p>
            </div>
            <div className="feature mb-10">
                <div className="emoji text-xl text-4xl">📝</div>
                <h3 className="font-bold mb-4 text-sm text-black  lg:text-xl ">AI Property Descriptions Generator</h3>
                <p className="text-sm text-black">Generate complete, ready-to-post property descriptions for platforms like Airbnb, Booking.com, Zillow, etc. Highlight your property's best features, making it easy to attract potential guests.</p>
            </div>
            <div className="feature">
                <div className="emoji text-xl text-4xl">📷</div>
                <h3 className="font-bold mb-4 text-sm text-black  lg:text-xl">AI Image to Description</h3>
                <p className="text-sm text-black">Using the latest AI vision models, upload your property images and our AI will convert them into detailed, engaging descriptions, making your listings more appealing and informative.</p>
            </div>
            <div className="feature">
                <div className="emoji text-xl text-4xl">📱</div>
                <h3 className="font-bold mb-4 text-sm  text-black lg:text-xl">AI Social Media Real State Posts</h3>
                <p className="text-sm text-black">Create optimized social media posts for your property listings with ease. Our AI ensures your posts are on point to boost visibility and engagement.</p>
            </div>
            <div className="feature">
                <div className="emoji text-xl text-4xl">🖼️</div>
                <h3 className="font-bold mb-4 text-sm text-black  lg:text-xl">AI Property Images Descriptions</h3>
                <p className="text-sm text-black">Create compelling and accurate descriptions for your individual property images, making your listings more attractive to potential buyers.</p>
                <a className="text-white" href="https://alteropen.com/" title="Alternative Open Directory">AlterOpen</a>
                <a className="text-white" href="https://freeaitool.ai/" title="Alternative Open Directory">FreeAITool</a>
            </div>
           
        </div>	
    </div>
</section>


      <Toaster />
<Footer/>

    </>
  );
}