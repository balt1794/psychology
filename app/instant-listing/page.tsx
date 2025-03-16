"use client"
import Navbar from "@/components/Navbar";
import { ChangeEvent, useState, useEffect, FormEvent } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { loadStripe } from '@stripe/stripe-js';
import FreeRewritesLeft from "../../components/FreeRewritesLeft";
import { updateDoc, getDoc, doc } from "firebase/firestore"; 
import { db } from "../../config/firebase";
import axios from "axios"
import Image from "next/image";
import { Carousel, Typography, Button } from "@material-tailwind/react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import imageCompression from "browser-image-compression"; // Import the compression library

export default function InstantListing() {

  //const [activeGenerator, setActiveGenerator] = useState<"location" | "houseRules" | "textNarrator">("houseRules");
  // State to manage the uploaded images and OpenAI API response
  const [images, setImages] = useState<string[]>([]);
  const [openAIResponse, setOpenAIResponse] = useState<string>("");
  const [error, setError] = useState<string | null>(null);


  const [submitting, setSubmitting] = useState(false);

  const auth = useAuth();

  const [fact, setFact] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [factType, setFactType] = useState("");

 
  const [inputText, setInputText] = useState('');
  const [openAIResponseAddress, setOpenAIResponseAddress] = useState('');

   //const { user } = useAuth();
   const [freeRewritesLeft, setFreeRewritesLeft] = useState<number | null>(null);
   const [placeDescription, setPlaceDescription] = useState<string>("");
   const [numGuests, setNumGuests] = useState<string>("1");
   const [numBedrooms, setNumBedrooms] = useState<string>("1");
   const [numBeds, setNumBeds] = useState<string>("1");
   const [numBathrooms, setNumBathrooms] = useState<string>("1");
   const [contactInfo, setContactInfo] = useState<string>("");
   const [optionalAddress, setOptionalAddress] = useState<string>("");
   const [nearbyPlaces, setNearbyPlaces] = useState<string>("");

   const [loadingResponse, setLoadingResponse] = useState(false);

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

    // Compress images before converting to base64
   // Handle changes when files are selected
async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
  if (!event.target.files) {
    window.alert("No images selected. Choose images.");
    return;
  }

  const files = Array.from(event.target.files);

  // Log original file sizes
  files.forEach((file) => {
    console.log(`Original file: ${file.name}, Size: ${(file.size / 1024).toFixed(2)} KB`);
  });

  const compressedFiles = await Promise.all(
    files.map(async (file) => {
      const options = {
        maxSizeMB: 0.5, // Reduce max size to 0.5 MB
        maxWidthOrHeight: 800, // Reduce max width/height to 800px
        useWebWorker: true, // Use web worker for better performance
      };
      const compressedFile = await imageCompression(file, options);

      // Log compressed file sizes
      console.log(`Compressed file: ${compressedFile.name}, Size: ${(compressedFile.size / 1024).toFixed(2)} KB`);

      return compressedFile;
    })
  );

  const readers = compressedFiles.map((file) => {
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
  async function handleSubmitDescription(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (images.length === 0) {
        alert("Upload one or more images.");
        return;
    }
    setSubmitting(true);
    setLoadingResponse(true); // Start loading

    try {
        const response = await fetch("api/gpt4o", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                images: images,
                placeDescription: placeDescription,
                numGuests: numGuests,
                numBedrooms: numBedrooms,
                numBeds: numBeds,
                numBathrooms: numBathrooms,
                contactInfo: contactInfo,
                optionalAddress: optionalAddress,
            }),
        });

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        let chunks: string[] = [];

        while (true) {
            const { done, value } = await reader?.read() || {};
            if (done) {
                break;
            }
            if (value) {
                const currentChunk = new TextDecoder().decode(value);
                chunks.push(currentChunk);
            }
        }

        const formattedResponse = chunks.join("").replace(/(?:\r\n|\r|\n)/g, "\n");
        setOpenAIResponse(formattedResponse);
    } catch (error) {
        console.error("Error during API request:", error);
        alert("An unexpected error occurred. Please try again.");
    } finally {
        setSubmitting(false);
        setLoadingResponse(false); // Stop loading
        await updateFreeRewritesLeft();
    }
  }




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
   

      <Toaster />



      <>
 
      







<div className="h-screen">


        <>
          {/* Content for House Rules Generator */}
          <div className="flex items-center justify-center text-md " id="generator">
        
        <div className="flex flex-wrap justify-between w-full max-w-8xl p-4 lg:p-10   ">
          {/* Left Side: Uploaded Images and Form */}
          <div className="w-full md:w-1/2 shadow-lg p-8 text-black mb-8 rounded-lg md:mb-0 border border-gray-300 bg-white">
            <h2 className="text-xl font-bold mb-4">Upload Images</h2>
            <p className="text-sm text-gray-600 mb-4">Please upload a minimum of 2 images and a maximum of 10 images for better results.</p>

            <FreeRewritesLeft freeRewritesLeft={freeRewritesLeft} />
          
            {/* Dropdown for place description */}
            <div className="mb-4 mt-4">
                <label htmlFor="placeDescription" className="block text-md font-medium text-gray-700">Which of these best describes your place?</label>
                <select
                    id="placeDescription"
                    value={placeDescription}
                    onChange={(e) => setPlaceDescription(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 p-1 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:border-blue-500"
                >
                    <option value="">Select a description</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Barn">Barn</option>
                    <option value="Cabin">Cabin</option>
                    <option value="Farm">Farm</option>
                    <option value="Hotel">Hotel</option>
                </select>
            </div>

            {/* Inputs for number of guests, bedrooms, beds, and bathrooms */}
            <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                    <label htmlFor="numGuests" className="block text-md font-medium text-gray-700">Guests</label>
                    <select
                        id="numGuests"
                        value={numGuests}
                        onChange={(e) => setNumGuests(e.target.value)}
                        className="mt-1 block w-full border p-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:border-blue-500"
                    >
                        {Array.from({ length: 6 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                        <option value="6+">6+</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="numBedrooms" className="block text-md font-medium text-gray-700">Bedrooms</label>
                    <select
                        id="numBedrooms"
                        value={numBedrooms}
                        onChange={(e) => setNumBedrooms(e.target.value)}
                        className="mt-1 block w-full border p-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:border-blue-500"
                    >
                        {Array.from({ length: 6 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                        <option value="6+">6+</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="numBeds" className="block text-md font-medium text-gray-700">Beds</label>
                    <select
                        id="numBeds"
                        value={numBeds}
                        onChange={(e) => setNumBeds(e.target.value)}
                        className="mt-1 block w-full border p-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:border-blue-500"
                    >
                        {Array.from({ length: 6 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                        <option value="6+">6+</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="numBathrooms" className="block text-md font-medium text-gray-700">Bathrooms</label>
                    <select
                        id="numBathrooms"
                        value={numBathrooms}
                        onChange={(e) => setNumBathrooms(e.target.value)}
                        className="mt-1 block w-full border p-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:border-blue-500"
                    >
                        {Array.from({ length: 6 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                        <option value="6+">6+</option>
                    </select>
                </div>
            </div>

            {/* Input for contact information */}
            <div className="mb-4">
                <label htmlFor="contactInfo" className="block text-md font-medium text-gray-700">Contact Information</label>
                <input
                    type="text"
                    id="contactInfo"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="example@gmail.com, +1 973-757-4890, WhatsApp, Airbnb chat"
                    className="mt-1 block w-full border p-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:border-blue-500"
                />
            </div>

            {/* Input for optional address */}
            <div className="mb-4">
                <label htmlFor="optionalAddress" className="block text-md font-medium text-gray-700">Address</label>
                <input
                    type="text"
                    id="optionalAddress"
                    value={optionalAddress}
                    onChange={(e) => setOptionalAddress(e.target.value)}
                    placeholder="573 Broadway Ave, New York"
                    className="mt-1 block w-full border p-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:border-blue-500"
                />
            </div>

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
          {loadingResponse ? (
            <div className="flex justify-center items-center">
                <style jsx>{`
                    .loader {
                        border: 8px solid #f3f3f3; /* Light grey */
                        border-top: 8px solid black; /* Black */
                        border-radius: 50%;
                        width: 45px;
                        height: 45px;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
                <div className="loader mr-1"></div>
                <span className="text-black font-semibold mr-40">Generating Listing...</span>
            </div>
        ) : (
            openAIResponse !== "" && (
                <div className="w-full md:w-1/2 border border-gray-300 rounded-lg shadow-md p-8 bg-[#F7F7F7]">
                    <div className="border-t border-gray-300 pt-4">
                        <h2 className="text-xl text-black font-bold mb-4">Property Listing:</h2>
                        {submitting ? "Generating..." : ""}
                        <div>
                            {/* Split the response into sections */}
                            {(() => {
                                const sections = openAIResponse.split("\n\n");

                                // Filter out empty sections and rows with only "---"
                                const filteredSections = sections.filter(
                                    (section) =>
                                        section.trim() !== "" && // Remove empty sections
                                        !section.trim().startsWith("---") // Remove rows with only "---"
                                );

                                return (
                                    <>
                                        {/* Render all fields uniformly */}
                                        {filteredSections.map((section, index) => {
                                            const titleMatch = section.match(/^(###|\*\*)?\s*(Title|Description|House Rules|Image Descriptions|Contact Information|How to Get There|Sample Cancellation Policy|Amenities|Nearby Activities|Property Description|Number of Guests|Number of Bedrooms|Number of Beds|Number of Bathrooms|Activities Nearby):?/i);
                                            const title = titleMatch ? titleMatch[0].replace(/#/g, "").replace(/\*/g, "").replace(/:/g, "").trim() : null; // Set to null if not found
                                            const content = titleMatch ? section.replace(titleMatch[0], "").replace(/\*/g, "").trim() : section.replace(/\*/g, "").trim();

                                            // Only render if title is not null and not "Untitled"
                                            if (title) {
                                                return (
                                                    <div key={index} className="mb-6">
                                                        {/* Display the section title if it exists */}
                                                        <h3 className="text-lg font-semibold mb-2 text-[#484848]">
                                                            <strong>{title}</strong>
                                                        </h3>
                                                        {/* Display the section content (copiable) */}
                                                        <div
                                                            className="p-4 bg-white rounded-lg border border-[#FF5A5F] hover:bg-[#F7F7F7] hover:text-white transition-colors cursor-pointer"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(content); // Copy only the content
                                                                toast.success(`Copied ${title || "section"} content to clipboard!`, {
                                                                    icon: "✂️",
                                                                });
                                                            }}
                                                        >
                                                            <pre className="whitespace-pre-wrap text-gray-700 font-sans">{content}</pre>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null; // Skip rendering if title is null
                                        })}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )
        )}
        </div>
      </div>
        </>
 

      {/* Your existing code <Footer/> */}</div>
      
    </>
    </>
  );
}