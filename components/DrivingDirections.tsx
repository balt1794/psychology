
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
import { Clock, CheckCircle } from "lucide-react"
import { ArrowRight, Map } from "lucide-react"

export default function DrivingDirections() {

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
    
          {/* Content for Location Generator */}
          <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#FF385C]">Driving Directions Generator</h1>

        <p className="text-xl md:text-2xl text-gray-700 mb-8">
          Create clear, detailed driving directions for your guests
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-left">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Help Guests Find Your Property with Perfect Directions
          </h2>

          <p className="text-gray-700 mb-4">
            Our Driving Directions Generator creates detailed, easy-to-follow instructions that guide your guests
            directly to your property. Simply enter your address, and our AI will generate comprehensive directions that
            you can add to your Airbnb listing.
          </p>

          <p className="text-gray-700 mb-4">
            Reduce check-in frustrations and late arrivals by providing guests with clear navigation instructions,
            landmark references, and helpful tips for finding your property easily.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-[#FF385C]">
                <Map className="h-5 w-5" />
              </div>
              <p className="ml-2 text-gray-700">
                <strong>Step-by-step directions</strong> from major highways and nearby landmarks
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-[#FF385C]">
                <Map className="h-5 w-5" />
              </div>
              <p className="ml-2 text-gray-700">
                <strong>Parking instructions</strong> with clear guidance on where and how to park
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-[#FF385C]">
                <Map className="h-5 w-5" />
              </div>
              <p className="ml-2 text-gray-700">
                <strong>Local navigation tips</strong> including potential GPS issues and shortcuts
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-[#FF385C]">
                <Map className="h-5 w-5" />
              </div>
              <p className="ml-2 text-gray-700">
                <strong>Multiple transportation options</strong> including driving, public transit, and rideshare
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
          <div className="flex items-center justify-center text-md  " id="generator">
  <div className="flex flex-wrap justify-between w-full max-w-8xl p-4 lg:p-10">
    {/* Left Side: Uploaded Images and Form */}
    <div className="w-full md:w-1/2  shadow-lg p-8 text-black mb-8 rounded-lg md:mb-0 border-solid border-4 border-white-400">
      <h2 className="text-xl text-[#FF385C] font-bold mb-4">Enter property address:</h2>
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
        className="sm:inline-block text-white px-3 text-md font-medium border-solid border-4 border-white-400 rounded-lg bg-[#FF385C] p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate"
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
                className="sm:inline-block text-white px-3 text-md font-medium border-solid border-4 border-white-400 rounded-lg bg-[#FF385C] p-1 text-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate"
              >
                Buy Credits
              </button>
            )
          ) : (
            // User is not logged in
            <button type="button" onClick={handleGenerateListingClick} className="sm:inline-block text-white px-3 text-md font-medium border-solid border-4 border-white-400 rounded-lg bg-[#FF385C] p-1 text-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate">
              Generate Listing</button>
          )}
        </div>
             
            
          </div>
         

          
          {openAIResponse === "" && (
  <div className="w-full md:w-1/2 border-solid border-t-4 border-r-4 border-b-4 border-white-400 rounded-lg shadow-md p-8 text-black">
    <h2 className="text-xl text-[#FF385C] font-bold mb-2">Directions Instructions:</h2>
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
        className="sm:inline-block text-white px-3 text-md font-medium border-solid border-4 border-white-400 rounded-lg bg-[#FF385C] p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate"
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


  );
}