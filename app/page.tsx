"use client"
import Navbar from "@/components/Navbar";
import { ChangeEvent, useState, useEffect, FormEvent } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { loadStripe } from '@stripe/stripe-js';
import FreeRewritesLeft from "../components/FreeRewritesLeft";
import { updateDoc, getDoc, doc } from "firebase/firestore"; 
import { db } from "../config/firebase";
import axios from "axios"
import Image from "next/image";
import { Carousel, Typography, Button } from "@material-tailwind/react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function Home() {

  //const [activeGenerator, setActiveGenerator] = useState<"location" | "houseRules" | "textNarrator">("houseRules");
  const [activeGenerator, setActiveGenerator] = useState<string | null>('location'); // Added state for active button

  const [showGenerator2, setShowGenerator2] = useState(false);
  // State to manage the uploaded images and OpenAI API response
  const [images, setImages] = useState<string[]>([]);
  const [openAIResponse, setOpenAIResponse] = useState<string>("");
  const [error, setError] = useState<string | null>(null);


  const [submitting, setSubmitting] = useState(false);

  const auth = useAuth();

  const [fact, setFact] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [factType, setFactType] = useState("");

  const fetchRandomFact = async () => {
    setLoading(true);
    setFact(null);
    try {
      const response = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ factType })
      });
      const data = await response.json();
      if (response.ok) {
        setFact(data.fact);
      } else {
        console.error("Error fetching random fact:", data.error);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
    setLoading(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFactType(event.target.value);
  };

  const [inputText, setInputText] = useState('');
  const [openAIResponseAddress, setOpenAIResponseAddress] = useState('');

   //const { user } = useAuth();
   const [freeRewritesLeft, setFreeRewritesLeft] = useState<number | null>(null);

   useEffect(() => {
     const fetchFreeRewritesLeft = async () => {
       if (auth.user) {
         const userId = auth.user.uid;
         const userDocRef = doc(db, "users", userId);
   
         try {
           const userDoc = await getDoc(userDocRef);
   
           if (userDoc.exists()) {
             const data = userDoc.data();
             setFreeRewritesLeft(data?.freeRewritesLeft ?? null);
           } else {
             
           }
         } catch (e) {
           //console.error("Error fetching freeRewritesLeft: ", e);
         }
       }
     };
   
     fetchFreeRewritesLeft();
   }, [auth.user]);

   const updateFreeRewritesLeft = async () => {
    if (auth.user) {
      const userId = auth.user.uid;
      const userDocRef = doc(db, "users", userId);
  
      try {
        // Use getDoc() instead of doc() to check if the document exists
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          const newFreeRewritesLeft = userDoc.data().freeRewritesLeft - 1;
  
          // Use updateDoc() to update the document with the new value
          await updateDoc(userDocRef, {
            freeRewritesLeft: newFreeRewritesLeft,
          });
  
          //console.log("freeRewritesLeft updated", newFreeRewritesLeft);
          // Update state
          setFreeRewritesLeft(newFreeRewritesLeft);
        } else {
          //console.log("userDoc does not exist");
        }
      } catch (e) {
        //console.error("Error updating freeRewritesLeft: ", e);
      }
    }
  };

  // Handle changes when files are selected
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      window.alert("No images selected. Choose images.");
      return;
    }

    // Get the selected files
    const files = Array.from(event.target.files);

    // Convert the files to base64 strings
    const readers = files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise<string>((resolve) => {
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result.split(',')[1]); // Extract the base64 part
          }
        };
      });
    });

    Promise.all(readers)
      .then((base64Images) => {
        setImages(base64Images);
      })
      .catch((error) => {
        console.error("Error reading files:", error);
        setError("Error reading files. Please try again.");
      });
  }

  // Handle form submission
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Check if any images are uploaded
    if (images.length === 0) {
      alert("Upload one or more images.");
      return;
    }
    setSubmitting(true);

    try {
      // Make a POST request to the image analysis API
      const response = await fetch("api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          images: images,
        }),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      // Handle streaming text response from OpenAI API
      const reader = response.body?.getReader();
      let chunks: string[] = [];

      while (true) {
        const { done, value } = await reader?.read() || {};

        // Check if the response is done
        if (done) {
          break;
        }

        // Update the OpenAI response
        if (value) {
          const currentChunk = new TextDecoder().decode(value);
          chunks.push(currentChunk);
        }
      }

      // Combine and format chunks into a clean response
      const formattedResponse = chunks.join("").replace(/(?:\r\n|\r|\n)/g, "\n");

      // Update the OpenAI response
      setOpenAIResponse(formattedResponse);
    } catch (error) {
      console.error("Error during API request:", error);

      // Handle errors
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        alert("Failed to connect to the server. Please try again later.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
    setSubmitting(false);
    await updateFreeRewritesLeft();
  }




  async function handleSubmitDescription(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Check if any images are uploaded
    if (images.length === 0) {
      alert("Upload one or more images.");
      return;
    }
    setSubmitting(true);

    try {
      // Make a POST request to the image analysis API
      const response = await fetch("api/analyze-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          images: images,
        }),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      // Handle streaming text response from OpenAI API
      const reader = response.body?.getReader();
      let chunks: string[] = [];

      while (true) {
        const { done, value } = await reader?.read() || {};

        // Check if the response is done
        if (done) {
          break;
        }

        // Update the OpenAI response
        if (value) {
          const currentChunk = new TextDecoder().decode(value);
          chunks.push(currentChunk);
        }
      }

      // Combine and format chunks into a clean response
      const formattedResponse = chunks.join("").replace(/(?:\r\n|\r|\n)/g, "\n");

      // Update the OpenAI response
      setOpenAIResponse(formattedResponse);
    } catch (error) {
      console.error("Error during API request:", error);

      // Handle errors
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        alert("Failed to connect to the server. Please try again later.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
    setSubmitting(false);
    await updateFreeRewritesLeft();
  }






  async function handleSubmitAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!inputText) {
      alert("Please enter some text.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/analyze-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      const generatedResponse = data.response;

      setOpenAIResponseAddress(generatedResponse);
    } catch (error) {
      console.error("Error during API request:", error);
      alert("An unexpected error occurred. Please try again.");
    }

    setSubmitting(false);
  };









  const copyFactToClipboard = () => {
    if (fact) {
      navigator.clipboard.writeText(fact);
      toast.success("Fact copied to clipboard", {
        icon: "✂️",
      });
    }
  };


  // Render the component
  function copyAIResponseToClipboard() {
    navigator.clipboard.writeText(openAIResponse);
    toast.success("AI response copied to clipboard", {
      icon: "✂️",
    });
  }

  const handleCheckout = async () => {
    console.log("handleCheckout called");
    setLoading(true);


    try {
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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

  const handleGenerateListingClick = () => {
    if (!auth.user) {
      // User is not logged in
      toast.error("Please sign up to generate a listing.", {
        icon: "🔐",
      });
    } 
  };


  return (
    <>
    {/*
    <div className="relative h-screen w-screen">

<Image className="absolute inset-0 w-full h-full object-cover" width="500" height="200" src="/hero.png" alt="Background Image" loading="lazy" />
<div className="absolute inset-0 bg-black opacity-90"></div>
  */}
<div className="relative z-10 max-w-10xl mx-auto flex p-10 lg:p-20">
  <div className="max-w-5xl ">
    <h1 className="text-5xl lg:text-6xl text-black font-bold  mb-6 mt-1 lg:mt-6" >Real Estate Listings 🏠</h1>
    <h2 className="text-xl lg:text-5xl text-black font-bold  mb-6 mt-1 lg:-mt-2" >Fast and Efficient using AI</h2>

    <div className="text-md lg:text-2xl text-gray-500 mb-2 lg:mb-6 " style={{ color: "#00000078" }}>
    List your properties in minutes using AI ⚡</div>
    <div className="text-md lg:text-2xl text-gray-500 mb-6 " style={{ color: "#00000078" }}>Say goodbye to the manual time-consuming listings and automate it with our suite of real estate listing tools</div>
    <button
        type="button"
        onClick={() => {
          const generatorSection = document.getElementById("generator");
          if (generatorSection) {
            generatorSection.scrollIntoView({ behavior: "smooth" });
          }
        }}
        className="w-full lg:w-1/2 sm:inline-block text-black px-3 text-lg font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate"
      >
        Create Listings Now!
      </button>
  </div>

  
 
  <div className="hidden lg:flex items-center">
    <div>
      <div className="-rotate-8 ml-12 p-4 mb-4">
      
        <div className="text-xs mb-1 ml-4 " style={{ color: "#00000078" }}>Exquisite villa located in a serene, palm-fringed setting, property features a spacious two-story main house and an outdoor pool area... </div>
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
        <div className="text-xs mb-4 " style={{ color: "#00000078" }}>Nestled in the hills, this modern retreat offers breathtaking views and a peaceful sanctuary for a relaxing getaway...</div>
 
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
<span className="text-lg text-black font-black hidden md:flex mb-2">Trusted by the best in the market</span>
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

<section id="features" className="md:pb-20 mt-12  md:pt-10 pb-6 sm:pb-6 sm:pt-6 rounded-xl border-2 border-white-400 mr-4 ml-4" style={{backgroundColor: "#fafafa"}}>
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


 {/*
<div className="my-6">
  <div className="flex items-center justify-center gap-3">
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 hidden md:flex">As seen on: </span> 
      <Link href="/https://hackernoon.com/my-ai-resume-maker-website-passes-$1k-in-mrr">
      <img src="/hn-logo.png" width="100" height="32" className="w-1/5 md:w-[150px] grayscale v-lazy-image v-lazy-image-loaded">
      </img>
      </Link>
       </div>
       </div>
       </div>




<div classNameName="w-full lg:w-3/4 mx-auto mt-12 border-4 border-red-400">
    <Carousel autoplay={true} className="">
    <div className="relative h-full w-full mx-auto ">
    <Image
        src="/hero3.png"
        alt="image 3"
        className="md:hidden h-full w-full object-cover"
        width={500}
        height={500}
    />

    <Image
        src="/hero2.png"
        alt="image 2"
        className="hidden md:block h-full w-full object-cover"
        width={500}
        height={500}
    />
       <div className="absolute inset-0 grid h-full w-full items-center bg-black/75 ">
  <div className="w-3/4  p-4 md:w-full  ">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
      <div className=" p-1 lg:p-4">
        <Typography
          variant="h1"
          color="white"
          className="mb-4 text-xl lg:text-3xl md:text-4xl lg:text-5xl"
        >
          Tropical Luxury Villa Oasis
        </Typography>
        <Typography
          variant="lead"
          color="white"
          className=" text-md lg:text-2xl mb-1 lg:mb-12 opacity-80"
        >
          This exquisite villa captures the essence of tropical luxury living. Located in a serene, palm-fringed setting, the property features a spacious two-story main house and an inviting outdoor pool area, blending modern amenities with natural beauty. Experience tranquility and elegance with ample space for relaxation and entertainment.
        </Typography>
        <div className="flex gap-2 ">
          <Button     onClick={() => {
          const generatorSection = document.getElementById("generator");
          if (generatorSection) {
            generatorSection.scrollIntoView({ behavior: "smooth" });
          }
        }} size="lg" color="white"  className="w-full hidden sm:inline-block text-white px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate">
            Generate
          </Button>
       
        </div>
      </div>
      <div className="bg-white p-4 hidden lg:block ">
      <Image
          src="/slider1.png"
          alt="image 2"
          className="h-full w-full object-cover"
          width={500}
          height={500}
        />
      </div>
    </div>
  </div>
</div>
      </div>



      <div className="relative h-full w-full mx-auto ">
      <Image
        src="/hero3.png"
        alt="image 3"
        className="md:hidden h-full w-full object-cover"
        width={500}
        height={500}
    />
  
    <Image
        src="/hero2.png"
        alt="image 2"
        className="hidden md:block h-full w-full object-cover"
        width={500}
        height={500}
    />
       <div className="absolute inset-0 grid h-full w-full items-center bg-black/75 ">
  <div className="w-3/4  p-4 md:w-full ">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className=" p-4">
        <Typography
          variant="h1"
          color="white"
          className="mb-4 text-xl lg:text-3xl md:text-4xl lg:text-5xl"
        >
          Serene Mountain View Retreat
        </Typography>
        <Typography
          variant="lead"
          color="white"
          className="mb-12  text-md lg:text-2xl opacity-80"
        >
Nestled in the hills, this modern retreat offers breathtaking views and a peaceful sanctuary for a relaxing getaway. With its contemporary design and expansive outdoor spaces, the home is perfect for those looking to connect with nature.        </Typography>
        <div className="flex gap-2 ">
          <Button     onClick={() => {
          const generatorSection = document.getElementById("generator");
          if (generatorSection) {
            generatorSection.scrollIntoView({ behavior: "smooth" });
          }
        }} size="lg" color="white"  className="w-full hidden sm:inline-block text-white px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate">
            Generate
          </Button>
       
        </div>
      </div>
      <div className="bg-white p-4 hidden lg:block  ">
      <Image
          src="/slider2.png"
          alt="image 2"
          className="h-full w-full object-cover "
          width={500}
          height={500}
        />
      </div>
    </div>
  </div>
</div>
      </div>

      <div className="relative h-full w-full mx-auto ">
      <Image
        src="/hero3.png"
        alt="image 3"
        className="md:hidden h-full w-full object-cover"
        width={500}
        height={500}
    />
   
    <Image
        src="/hero2.png"
        alt="image 2"
        className="hidden md:block h-full w-full object-cover"
        width={500}
        height={500}
    />
       <div className="absolute inset-0 grid h-full w-full items-center bg-black/75 ">
  <div className="w-3/4  p-4 md:w-full ">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className=" p-4">
        <Typography
          variant="h1"
          color="white"
          className="mb-4 text-xl lg:text-3xl md:text-4xl lg:text-5xl"
        >
          Serene Hilltop Villa with Jungle Scenery
        </Typography>
        <Typography
          variant="lead"
          color="white"
          className="mb-12 text-md lg:text-2xl opacity-80"
        >
Indulge in a lavish getaway at this exquisite multi-level villa nestled in the heart of a lush tropical landscape with breathtaking views of the ocean. The serene setting and luxurious amenities promise an unforgettable stay filled with relaxation, privacy, and comfort.     </Typography>
        <div className="flex gap-2 ">
          <Button     onClick={() => {
          const generatorSection = document.getElementById("generator");
          if (generatorSection) {
            generatorSection.scrollIntoView({ behavior: "smooth" });
          }
        }} size="lg" color="white"  className="w-full hidden sm:inline-block text-white px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate">
            Generate
          </Button>
       
        </div>
      </div>
      <div className="bg-white p-4 hidden lg:block">
      <Image
          src="/slider3.png"
          alt="image 2"
          className="h-full w-full object-cover"
          width={500}
          height={500}
        />
      </div>
    </div>
  </div>
</div>
      </div>
    </Carousel>
    </div>

  */}

      <Toaster />



      <>
      {/* Your existing code */}
      
      <div className="flex justify-center mt-12 space-x-4">
        {/* Button for Location Generator */}
        <button
  className={`text-black px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full  p-1  focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate ${activeGenerator === 'location' ? 'bg-gray-200 text-black' : ''}`}
  onClick={() => setActiveGenerator('location')}
        >
          Directions Generator
        </button>
        {/* Button for House Rules Generator */}
        <button
  className={`text-black px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full  p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate ${activeGenerator === 'houseRules' ? 'bg-gray-200 text-black'  : ''}`}
  onClick={() => setActiveGenerator('houseRules')}
        >
          House Rules Generator
        </button>
        {/* Button for Text Narrator */}
        <button
              className={`text-black px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full  p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate ${activeGenerator === 'textNarrator' ? 'bg-gray-200 text-black'  : ''}`}
              onClick={() => setActiveGenerator('textNarrator')}
          
        >
         Property Description Generator
        </button>
      </div>
      







<div className="h-screen">



      {/* Render the active generator based on the state */}
      {activeGenerator === 'location' && (
        
        <>
          {/* Content for Location Generator */}

          <div className="flex items-center justify-center text-md  " id="generator">
  <div className="flex flex-wrap justify-between w-full max-w-8xl p-4 lg:p-10">
    {/* Left Side: Uploaded Images and Form */}
    <div className="w-full md:w-1/2  shadow-lg p-8 text-black mb-8 rounded-lg md:mb-0 border-solid border-4 border-white-400">
      <h2 className="text-xl font-bold mb-4">Enter property address:</h2>
      <FreeRewritesLeft freeRewritesLeft={freeRewritesLeft} />
        <div className="flex flex-col mb-6 mt-3 ">
        <input
        type="text"
        placeholder="35 Adams St, Newark, NJ"
        value={factType}
        onChange={handleInputChange}
        style={{ marginBottom: '10px' }}
        className="text-black border-4 border-white-400 rounded-xl p-2"
      />
        </div>
        <div className="flex justify-center">
          {auth.user ? (
            // User is logged in
            freeRewritesLeft && freeRewritesLeft > 0 ? (
              // User has free rewrites left
              <>
               <style jsx>{`
               .loader {
                border: 16px solid #f3f3f3; /* Light grey */
                border-top: 16px solid black; /* Blue */
                border-radius: 50%;
                width: 45px;
                height: 45px;
                animation: spin 2s linear infinite;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
                 `}</style>
           
           {submitting ? (
        <div className="loader"></div>
      ) : (
      
        <button
        className="sm:inline-block text-black px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate"
        onClick={fetchRandomFact}
        disabled={loading || submitting}
      >
        {loading ? 'Loading...' : 'Get Directions'}
      </button>
      )}
              </>
            ) : (
              // User doesn't have free rewrites left
              <button
                type="button"
                onClick={handleCheckout}
                className="sm:inline-block text-black px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate"
              >
                Buy Credits
              </button>
            )
          ) : (
            // User is not logged in
            <button type="button" onClick={handleGenerateListingClick} className="sm:inline-block text-black px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate">
              Generate Listing</button>
          )}
        </div>
             
            
          </div>
         

          
          {openAIResponse === "" && (
  <div className="w-full md:w-1/2 border-solid border-t-4 border-r-4 border-b-4 border-white-400 rounded-lg shadow-md p-8 text-black">
    <h2 className="text-xl font-bold mb-2">Directions Instructions:</h2>
    {submitting ? "Generating..." : ""}
    <div>
      {fact && (
        <div className="border-t border-gray-300 pt-4">
          <div>
            {/* Split the fact into multiple instructions and display each */}
            {fact.split('\n').map((instruction, index) => (
              <div key={index} className="mt-4">
                <p className="text-black">{instruction}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    <div className="flex justify-center mt-4">
      <button
        className="sm:inline-block text-black px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate"
        onClick={copyFactToClipboard}
      >
        Copy Directions
      </button>
    </div>
  </div>
)}
        </div>
      </div>
        </>
      )}





















      {activeGenerator === 'houseRules' && (
        <>
          <div className="flex items-center justify-center text-md  " id="generator">
        
        <div className="flex flex-wrap justify-between w-full max-w-8xl p-4 lg:p-10  ">
          {/* Left Side: Uploaded Images and Form */}
          <div className="w-full md:w-1/2  shadow-lg p-8 text-black mb-8 rounded-lg md:mb-0 border-solid border-4 border-white-400 ">
            <h2 className="text-xl font-bold mb-4">House Rules - Upload Images</h2>
          
            <FreeRewritesLeft freeRewritesLeft={freeRewritesLeft} />
            {images.length > 0 ? (
               <div className="flex flex-wrap mb-4">
               {images.map((image, index) => (
                 <div key={index} className="w-1/4 p-2">
                   <img
                     src={`data:image/jpeg;base64,${image}`}
                     className="w-full object-contain max-h-32 mb-2"
                     alt={`Uploaded Image ${index}`}
                   />
                 </div>
               ))}
             </div>
            ) : (
              <div className="mb-4 p-8 text-center">
                <p>Once you upload images, you will see them here.</p>
                <p>You need to upload at least 2 images.</p>
              </div>
            )}

            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="flex flex-col mb-6">
                <input
                  type="file"
                  className="text-sm border rounded-lg cursor-pointer"
                  onChange={(e) => handleFileChange(e)}
                  multiple
                />
              </div>

              <div className="flex justify-center">
          {auth.user ? (
            // User is logged in
            freeRewritesLeft && freeRewritesLeft > 0 ? (
              // User has free rewrites left
              <>
               <style jsx>{`
               .loader {
                border: 16px solid #f3f3f3; /* Light grey */
                border-top: 16px solid black; /* Blue */
                border-radius: 50%;
                width: 45px;
                height: 45px;
                animation: spin 2s linear infinite;
              }
              
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
                 `}</style>
           
           {submitting ? (
        <div className="loader"></div>
      ) : (
        <button
          type="submit"
          className="sm:inline-block text-black px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate"
          disabled={submitting} // Disable the button when submitting
        >
          Generate Listing
        </button>
      )}
              </>
            ) : (
              // User doesn't have free rewrites left
              <button
                type="button"
                onClick={handleCheckout}
                className="sm:inline-block text-black px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate"
              >
                Buy Credits
              </button>
            )
          ) : (
            // User is not logged in
            <button type="button" onClick={handleGenerateListingClick} className="sm:inline-block text-black px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate">
              Generate Listing</button>
          )}
        </div>
             
            </form>
            
          </div>
         

          {/* Right Side: AI Response */}
          {openAIResponse !== "" && (
  <div className="w-full md:w-1/2 border-solid border-t-4 border-r-4 border-b-4 border-white-400 rounded-lg shadow-md p-8 text-black">
    <div className="border-t border-gray-300 pt-4">
      <h2 className="text-xl font-bold mb-2">House Rules:</h2>
      {submitting ? "Generating..." : ""}
      <div>
        {openAIResponse.split('\n').map((line, index) => {
          if (line.startsWith("###")) {
            return (
              <div key={index} className="mb-4">
                <strong>{line.replace(/#/g, "").trim()}</strong>
              </div>
            );
          } else if (line.startsWith("**")) {
            return (
              <div key={index} className="mb-4">
                <strong>{line.replace(/\*/g, "").trim()}</strong>
              </div>
            );
          } else {
            return (
              <div key={index} className="mb-4">
                {line}
              </div>
            );
          }
        })}
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="sm:inline-block text-black px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate"
          onClick={copyAIResponseToClipboard}
        >
          Copy Listing
        </button>
      </div>
    </div>
  </div>
)}
        </div>
      </div>
        </>
      )}













{activeGenerator === 'textNarrator' && (
        <>
          {/* Content for House Rules Generator */}
          <div className="flex items-center justify-center text-md " id="generator">
        
        <div className="flex flex-wrap justify-between w-full max-w-8xl p-4 lg:p-10  ">
          {/* Left Side: Uploaded Images and Form */}
          <div className="w-full md:w-1/2  shadow-lg p-8 text-black mb-8 rounded-lg md:mb-0 border-solid border-4 border-white-400 ">
            <h2 className="text-xl font-bold mb-4">Property Descriptions - Upload Images</h2>
          
            <FreeRewritesLeft freeRewritesLeft={freeRewritesLeft} />

            {images.length > 0 ? (
                 <div className="flex flex-wrap mb-4">
               {images.map((image, index) => (
                 <div key={index} className="w-1/4 p-2">
                   <img
                     src={`data:image/jpeg;base64,${image}`}
                     className="w-full object-contain max-h-32 mb-2"
                     alt={`Uploaded Image ${index}`}
                   />
                 </div>
               ))}
             </div>
            ) : (
              <div className="mb-4 p-8 text-center">
                <p>Once you upload images, you will see them here.</p>
                <p>You need to upload at least 2 images.</p>
              </div>
            )}

            <form onSubmit={(e) => handleSubmitDescription(e)}>
              <div className="flex flex-col mb-6">
                <input
                  type="file"
                  className="text-sm border rounded-lg cursor-pointer"
                  onChange={(e) => handleFileChange(e)}
                  multiple
                />
              </div>

              <div className="flex justify-center">
          {auth.user ? (
            // User is logged in
            freeRewritesLeft && freeRewritesLeft > 0 ? (
              // User has free rewrites left
              <>
               <style jsx>{`
               .loader {
                border: 16px solid #f3f3f3; /* Light grey */
                border-top: 16px solid black; /* Blue */
                border-radius: 50%;
                width: 45px;
                height: 45px;
                animation: spin 2s linear infinite;
              }
              
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
                 `}</style>
           
           {submitting ? (
        <div className="loader"></div>
      ) : (
        <button
          type="submit"
          className="sm:inline-block text-black px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate"
          disabled={submitting} // Disable the button when submitting
        >
          Generate Listing
        </button>
      )}
              </>
            ) : (
              // User doesn't have free rewrites left
              <button
                type="button"
                onClick={handleCheckout}
                className="sm:inline-block text-black px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate"
              >
                Buy Credits
              </button>
            )
          ) : (
            // User is not logged in
            <button type="button" onClick={handleGenerateListingClick} className="sm:inline-block text-black px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate">
              Generate Listing</button>
          )}
        </div>
             
            </form>
            
          </div>
         

          {/* Right Side: AI Response */}
          {openAIResponse !== "" && (
  <div className="w-full md:w-1/2 border-solid border-t-4 border-r-4 border-b-4 border-white-400 rounded-lg shadow-md p-8 text-black">
    <div className="border-t border-gray-300 pt-4">
      <h2 className="text-xl font-bold mb-2">Property Description:</h2>
      {submitting ? "Generating..." : ""}
      <div>
        {openAIResponse.split('\n').map((line, index) => {
          if (line.startsWith("###")) {
            return (
              <div key={index} className="mb-4">
                <strong>{line.replace(/#/g, "").trim()}</strong>
              </div>
            );
          } else if (line.startsWith("**")) {
            return (
              <div key={index} className="mb-4">
                <strong>{line.replace(/\*/g, "").trim()}</strong>
              </div>
            );
          } else {
            return (
              <div key={index} className="mb-4">
                {line}
              </div>
            );
          }
        })}
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="sm:inline-block text-black px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate"
          onClick={copyAIResponseToClipboard}
        >
          Copy Listing
        </button>
      </div>
    </div>
  </div>
)}
        </div>
      </div>
        </>
      )}

      {/* Your existing code <Footer/> */}</div>
      
    </>
    </>
  );
}