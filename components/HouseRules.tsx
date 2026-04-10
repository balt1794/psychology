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
import { Clock, CheckCircle, ClipboardCheck, ArrowRight, Camera } from "lucide-react";
import { ToolPageShell } from "@/components/ToolPageShell";

export default function HouseRules() {

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
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          images: images,
          mode: "house_rules",
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
      const response = await fetch("/api/analyze-description", {
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
      <Toaster />
      <ToolPageShell
        titleBefore="Airbnb House Rules"
        titleAccent="Generator"
        subtitle="Create clear, professional house rules for your Airbnb listing in seconds"
        intro={
          <>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">
              Set Clear Expectations with AI-Generated House Rules
            </h2>
            <p className="mt-2 text-gray-700">
              Our Airbnb House Rules Generator analyzes your property photos to create customized, professional guidelines
              that protect your space while maintaining a welcoming tone for guests.
            </p>
            <p className="mt-2 text-gray-700">
              Stop struggling with what to include in your Airbnb listing&apos;s house rules. Our AI tool identifies important
              elements in your property and generates appropriate rules that help prevent misunderstandings and property
              damage.
            </p>
            <div className="mt-4 space-y-3">
              {[
                <>
                  <strong>Property-specific rules</strong> based on your unique space and amenities
                </>,
                <>
                  <strong>Professional, friendly tone</strong> that sets boundaries without sounding harsh
                </>,
                <>
                  <strong>Comprehensive coverage</strong> of noise policies, pet rules, smoking, and more
                </>,
                <>
                  <strong>Copy-and-paste ready</strong> for immediate use in your Airbnb listing
                </>,
              ].map((bullet, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#FF385C]" aria-hidden />
                  <p className="text-gray-700">{bullet}</p>
                </div>
              ))}
            </div>
          </>
        }
      >
        <div className="w-full flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">House Rules - Upload Images</h2>
            </div>
            <FreeRewritesLeft freeRewritesLeft={freeRewritesLeft} />
          </div>

          {images.length > 0 ? (
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                >
                  <img
                    src={`data:image/jpeg;base64,${image}`}
                    className="h-full w-full object-cover"
                    alt={`Upload ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-4 rounded-xl border border-gray-100 bg-white px-4 py-6 text-center text-sm text-gray-500">
              <p>Once you upload images, you will see them here.</p>
              <p className="mt-1">You need to upload at least 2 images.</p>
            </div>
          )}

          <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
            <div>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-8 transition-colors hover:border-gray-300 hover:bg-gray-100/60">
                <Camera className="mb-2 h-8 w-8 text-gray-400" aria-hidden />
                <span className="text-sm font-medium text-gray-800">Click to upload photos</span>
                <span className="mt-1 text-xs text-gray-500">JPG or PNG · multiple files OK</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => handleFileChange(e)}
                  multiple
                />
              </label>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:items-center">
              {auth.user ? (
                freeRewritesLeft && freeRewritesLeft > 0 ? (
                  submitting ? (
                    <div
                      className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-[#FF385C]"
                      aria-label="Generating"
                    />
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full rounded-xl bg-[#FF385C] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:ring-offset-2 disabled:opacity-60 sm:w-auto sm:min-w-[220px]"
                    >
                      Generate Listing
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full rounded-xl bg-[#FF385C] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:ring-offset-2 sm:w-auto sm:min-w-[220px]"
                  >
                    Buy Credits
                  </button>
                )
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateListingClick}
                  className="w-full rounded-xl bg-[#FF385C] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:ring-offset-2 sm:w-auto sm:min-w-[220px]"
                >
                  Generate Listing
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="w-full flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:p-8">
          <div className="flex flex-col gap-1 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">House rules</h2>
              <p className="text-xs text-gray-500">Generated copy appears below</p>
            </div>
            {openAIResponse ? (
              <button
                type="button"
                onClick={copyAIResponseToClipboard}
                className="text-sm font-semibold text-[#E31C5F] hover:text-[#FF385C] hover:underline"
              >
                Copy all
              </button>
            ) : null}
          </div>

          <div className="pt-5">
            {submitting && !openAIResponse ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-gray-500">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-[#FF385C]" />
                Writing your house rules…
              </div>
            ) : openAIResponse ? (
              <>
                <div className="space-y-2">
                  {openAIResponse.split("\n").map((line, index) => {
                    const t = line.trimEnd();
                    const trimmed = t.trim();
                    if (!trimmed) {
                      return <div key={index} className="h-2" aria-hidden />;
                    }
                    if (trimmed === "---") {
                      return <hr key={index} className="my-6 border-gray-200" />;
                    }
                    const sectionTitles = [
                      "House Rules:",
                      "Instructions to Check In:",
                      "Standard Cancellation:",
                    ];
                    if (sectionTitles.some((title) => trimmed === title || trimmed.startsWith(title))) {
                      const label = sectionTitles.find((title) => trimmed === title || trimmed.startsWith(title)) ?? trimmed;
                      const rest = trimmed.slice(label.length).trim();
                      return (
                        <h3
                          key={index}
                          className="mb-2 mt-6 border-b border-gray-100 pb-1 text-base font-bold tracking-tight text-gray-900 first:mt-0 sm:text-lg"
                        >
                          {label}
                          {rest ? ` ${rest}` : ""}
                        </h3>
                      );
                    }
                    if (trimmed.startsWith("###")) {
                      return (
                        <h3
                          key={index}
                          className="text-base font-bold leading-snug text-gray-900 sm:text-lg"
                        >
                          {trimmed.replace(/^#+\s*/, "").replace(/\*+/g, "").trim()}
                        </h3>
                      );
                    }
                    if (trimmed.startsWith("**")) {
                      return (
                        <p key={index} className="text-sm font-semibold text-gray-900">
                          {trimmed.replace(/\*+/g, "").trim()}
                        </p>
                      );
                    }
                    if (/^-\s+/.test(trimmed)) {
                      return (
                        <p key={index} className="border-l-2 border-[#FF385C]/35 pl-3 text-base leading-relaxed text-gray-800">
                          {trimmed.replace(/^-\s+/, "")}
                        </p>
                      );
                    }
                    return (
                      <p key={index} className="text-base leading-relaxed text-gray-700">
                        {t}
                      </p>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={copyAIResponseToClipboard}
                  className="mt-8 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 sm:hidden"
                >
                  Copy listing
                </button>
              </>
            ) : (
              <p className="py-14 text-center text-sm leading-relaxed text-gray-500">
                Upload photos and click <span className="font-medium text-gray-700">Generate Listing</span>—your house
                rules will appear here.
              </p>
            )}
          </div>
        </div>
      </ToolPageShell>
    </>
  );
}