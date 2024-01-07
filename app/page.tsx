"use client"
import Navbar from "@/components/Navbar";
// Import necessary dependencies
// Import necessary dependencies
import { ChangeEvent, useState, useEffect, FormEvent } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { loadStripe } from '@stripe/stripe-js';
import FreeRewritesLeft from "../components/FreeRewritesLeft";
import { updateDoc, getDoc, doc } from "firebase/firestore"; 
import { db } from "../config/firebase";
import axios from "axios"

export default function Home() {
  // State to manage the uploaded images and OpenAI API response
  const [images, setImages] = useState<string[]>([]);
  const [openAIResponse, setOpenAIResponse] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const auth = useAuth();

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
    await updateFreeRewritesLeft();
  }

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
    <section className="relative  md:mx-20 pt-24 lg:pt-32 rounded-2xl lg:rounded-[3rem] mb-20 lg:mb-36">
  <div className="flex flex-col items-center justify-center max-w-4xl gap-8 mx-auto">
    <h1 className="text-4xl font-bold text-center text-black md:text-6xl">
      Fast and Efficient Listings using AI  ⚡
    </h1>
    
    <p className="text-2xl text-center text-black text-muted-foreground">Create stunning property listings in seconds. Say goodbye to the manual time-consuming listings and let AI take care of it 🏠</p>
    
    <div className="grid items-center justify-center gap-3 text-center">
    
  <button type="button"
   onClick={() => {
    const generatorSection = document.getElementById("generator");
    if (generatorSection) {
      generatorSection.scrollIntoView({ behavior: 'smooth' });
    }
  }}
   className="w-full sm:inline-block text-black px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate">


  Create Listings Now!
</button>

      <span className="text-black">Get 1 free credit upon signup</span>
    </div>
  
  </div>
</section>


      <Toaster />
      <div className="flex items-center justify-center text-md " id="generator">
        
        <div className="flex flex-wrap justify-between w-full max-w-8xl p-4 lg:p-10  ">
          {/* Left Side: Uploaded Images and Form */}
          <div className="w-full md:w-1/2  shadow-lg p-8 text-black mb-8 rounded-lg md:mb-0 border-solid border-4 border-white-400 ">
            <h2 className="text-xl font-bold mb-4">Upload Images</h2>
            <FreeRewritesLeft freeRewritesLeft={freeRewritesLeft} />
            {images.length > 0 ? (
              <div className="mb-4">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={`data:image/jpeg;base64,${image}`}
                    className="w-full object-contain max-h-36 mb-2"
                    alt={`Uploaded Image ${index}`}
                  />
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
                <button
                  type="submit"
                  className="sm:inline-block text-black px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate"
                >
                 Generate Listing
                </button>
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
                <h2 className="text-xl font-bold mb-2">AI-Generated Listing:</h2>
                <p dangerouslySetInnerHTML={{ __html: openAIResponse.replace(/(?:\r\n|\r|\n)/g, "<br/>") }} />
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
  );
}