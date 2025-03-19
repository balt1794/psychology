import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Clock, CheckCircle } from "lucide-react"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'PropertyListingsAI - AI Real Estate Listing Generator',
  description:'Generate perfect, optimized AI real estate listings instantly to boost visibility and bookings.'
};


export default function Home() {


  return (
    <>
<div className="relative z-10 max-w-10xl mx-auto flex p-10 lg:p-24">
  <div className="max-w-5xl ">
    <h1 className="text-5xl lg:text-6xl text-black font-bold  mb-6 mt-1 lg:mt-6" >AI Real Estate Listings</h1>
    <h2 className="text-xl lg:text-4xl text-black font-bold  mb-6 mt-1 lg:-mt-2" >Property Descriptions using AI 🏠</h2>

    <div className="text-md lg:text-2xl text-gray-500 mb-2 lg:mb-6 " style={{ color: "#00000078" }}>
    List properties on Airbnb, Booking, Vrbo in minutes ⚡</div>
    <div className="text-md lg:text-2xl text-gray-500 mb-6 " style={{ color: "#00000078" }}>Say goodbye to manual time-consuming listings and automate it with our AI real estate listing generator </div>
    <Link href="/airbnb-listing">
    <button
        type="button"
        
        className="w-full lg:w-1/2 sm:inline-block bg-[#FF385C] text-black border-4 border-white-400 px-3 text-lg font-medium rounded-lg  p-1 text-white hover:bg-[#E04E5A] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate"
      >
        Create Listings Now!
      </button>
      </Link>
  </div>

  
 
  <div className="hidden lg:flex items-center">
    <div>
      <div className="-rotate-8 ml-12 p-4 mb-4">
      
        <div className="text-xs mb-1 ml-4 font-medium" style={{ color: "#00000078" }}>Exquisite villa located in a serene, palm-fringed setting, property features a spacious two-story main house and an outdoor pool...🌴</div>
        <div className="flex items-center justify-center mt-4 rounded-md ">
          
          <div className="text-6xl font-semibold border-4 border-white-400 rounded-xl">
            <Image
              src="/slider1.png"
              alt="viking in white backgrounsd logo"
              width={450}
              height={550}
              loading="lazy"
              className="rounded-md"
            />
          </div>
        </div>
      </div>

 {/*
      <div className="rotate-8 ">
        <div className="text-xs  mb-3 " style={{ color: "#00000078" }}>Luxury yacht deck setup with a wooden table and chairs featuring a sumptuous cheese platter and a bottle of champagne, against a backdrop of serene sailboats anchored at sea.</div>
        
        <div className="w-64 h-64 mx-auto rounded-md ">
          <Image
            src="/hero2.jpg"
            alt="fox in dark blue logo"
            width={500}
            height={500}
            loading="lazy"
            className="rounded-md"
          />
        </div>
      </div>
      */}
    </div>
    

    <div>
      <div className="-rotate-8 ">
        <div className="text-xs mb-4 font-medium" style={{ color: "#00000078" }}>Nestled in the hills, this modern retreat offers breathtaking views and a peaceful sanctuary for a relaxing getaway...🚪</div>
 
        <div className="flex items-center justify-center w-128 h-128 rounded-md">
          <div className="text-6xl font-semibold border-4 border-white-400 rounded-xl">
            <Image
              src="/slider2.png"
              alt="dog in gray background logo"
              width={400}
              height={300}
              loading="lazy"
              className="rounded-md"
            />
          </div>
        </div>
      </div>
    </div>

  </div>
</div>

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
      <div className="bg-white rounded-xl shadow-lg p-8 border-l-8 border-white-400 w-full">
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