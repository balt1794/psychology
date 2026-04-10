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
import { ArrowRight, Camera } from "lucide-react"

const LISTING_TITLE_MAX_CHARS = 50;
const LISTING_DESCRIPTION_MAX_CHARS = 500;

/** Truncates title (after ###) and body to fixed limits so output always fits product rules. */
function enforceListingCharacterLimits(raw: string): string {
  const normalized = raw.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("###")) {
      const titleText = line
        .replace(/^#+\s*/, "")
        .trim()
        .slice(0, LISTING_TITLE_MAX_CHARS);
      let bodyStart = i + 1;
      while (bodyStart < lines.length && lines[bodyStart].trim() === "") {
        bodyStart += 1;
      }
      const body = lines
        .slice(bodyStart)
        .join("\n")
        .trim()
        .slice(0, LISTING_DESCRIPTION_MAX_CHARS);
      return `### ${titleText}\n\n${body}`;
    }
  }

  let first = 0;
  while (first < lines.length && lines[first].trim() === "") {
    first += 1;
  }
  if (first >= lines.length) {
    return "";
  }
  const titleText = lines[first].replace(/^#+\s*/, "").trim().slice(0, LISTING_TITLE_MAX_CHARS);
  const body = lines
    .slice(first + 1)
    .join("\n")
    .trim()
    .slice(0, LISTING_DESCRIPTION_MAX_CHARS);
  return `### ${titleText}\n\n${body}`;
}

export default function PropertyDescription () {

  //const [activeGenerator, setActiveGenerator] = useState<"location" | "houseRules" | "textNarrator">("houseRules");
  const [activeGenerator, setActiveGenerator] = useState<string | null>('location'); // Added state for active button

  const [showGenerator2, setShowGenerator2] = useState(false);
  // State to manage the uploaded images and OpenAI API response
  const [images, setImages] = useState<string[]>([]);
  const [openAIResponse, setOpenAIResponse] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [descriptionMode, setDescriptionMode] = useState<"simple" | "detailed">("simple");
  /** When true, title/description are capped (Airbnb-style) and the API uses short limits. */
  const [airbnbListing, setAirbnbListing] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState({
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    lotSize: "",
    yearBuilt: "",
    propertyType: "",
    parking: "",
    hoa: "",
    neighborhood: "",
    cityOrArea: "",
    additionalNotes: "",
  });

  const setDetail = (key: keyof typeof propertyDetails, value: string) => {
    setPropertyDetails((prev) => ({ ...prev, [key]: value }));
  };


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

    if (images.length === 0) {
      alert("Upload at least one image.");
      return;
    }
    setSubmitting(true);
    setOpenAIResponse("");

    try {
      const response = await fetch("/api/analyze-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          images,
          mode: descriptionMode,
          airbnbListing,
          propertyDetails: descriptionMode === "detailed" ? propertyDetails : undefined,
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
      setOpenAIResponse(
        airbnbListing ? enforceListingCharacterLimits(formattedResponse) : formattedResponse
      );
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

      <Toaster />

      <div className="mx-auto max-w-5xl px-4 pt-8 text-center sm:px-6 mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-6xl">
          Property Description{" "}
          <span className="text-[#FF385C]">Generator</span>
        </h1>
        <h2 className="mx-auto mt-4 max-w-5xl text-base text-black sm:text-lg mb-4">
        Turn your property photos into compelling property descriptions that attract more bookings and sales.     </h2>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6">
        <div className="rounded-2xl border border-gray-200 bg-gray-50/90 p-5 text-left text-sm leading-relaxed text-gray-800 sm:p-6 sm:text-base">
       
          <p className="mt-2">
         Property Description Generator analyzes your property photos and transforms them into engaging, detailed descriptions that highlight your space's best features and unique selling points.
</p>
<p className="mt-2">
Stop struggling with writer's block or generic descriptions. Our tool identifies specific details in your photos—from architectural features to decor elements—and crafts a professional description that makes your property listing stand out from the competition.          </p>
        </div>
      </div>

      <div className="border-t border-gray-200/80 bg-[#f6f6f7] pb-16 pt-8" id="generator">
        <div className="mx-auto flex max-w-8xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-start lg:gap-8">
          <div className="w-full flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Generate your property description</h2>
                <p className="mt-1 text-sm text-gray-500">Photos required · at least one image</p>
              </div>
              <FreeRewritesLeft freeRewritesLeft={freeRewritesLeft} />
            </div>

            <div className="mb-4 flex rounded-xl bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setDescriptionMode("simple")}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                  descriptionMode === "simple"
                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/[0.06]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Simple
              </button>
              <button
                type="button"
                onClick={() => setDescriptionMode("detailed")}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
                  descriptionMode === "detailed"
                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/[0.06]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Detailed
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              {descriptionMode === "simple"
                ? "Title plus a shorter description—no bullet lists or extra sections."
                : "Title plus a longer narrative; add beds, baths, sq ft, etc. so facts are woven into the prose."}
            </p>

            <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Image
                    src="/airbnb.png"
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 shrink-0 object-contain"
                    aria-hidden
                  />
                  <p className="text-sm font-medium text-gray-900">Activate for Airbnb Listing</p>
                </div>
                <p className="mt-1 text-xs text-gray-500">
      A title and description will be generated that will fit within the character limits for an Airbnb listing. Title ≤ {LISTING_TITLE_MAX_CHARS} characters. Description ≤ {LISTING_DESCRIPTION_MAX_CHARS} characters.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={airbnbListing}
                aria-label="Toggle Airbnb listing character limits"
                onClick={() => setAirbnbListing((v) => !v)}
                className={`relative h-7 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:ring-offset-2 ${
                  airbnbListing ? "bg-[#FF385C]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ease-out ${
                    airbnbListing ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <form onSubmit={(e) => handleSubmitDescription(e)} className="space-y-6">
              <div>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-8 transition-colors hover:border-gray-300 hover:bg-gray-100/60">
                  <Camera className="mb-2 h-8 w-8 text-gray-400" aria-hidden />
                  <span className="text-sm font-medium text-gray-800">Click to upload photos</span>
                  <span className="mt-1 text-xs text-gray-500">JPG or PNG</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handleFileChange(e)}
                    multiple
                  />
                </label>
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
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
                <div className="rounded-xl border border-gray-100 bg-white px-4 py-6 text-center text-sm text-gray-500">
                  Thumbnails appear here after you choose files.
                </div>
              )}

              {descriptionMode === "detailed" && (
                <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-gray-50/80 p-4 text-left text-sm sm:grid-cols-2 sm:p-5">
                  <p className="col-span-full text-xs font-medium uppercase tracking-wide text-gray-500">
                    Property details (optional)
                  </p>
                  <label className="flex flex-col gap-1">
                    <span className="font-medium text-gray-800">Bedrooms</span>
                    <input
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none transition-shadow focus:border-[#FF385C]/40 focus:ring-2 focus:ring-[#FF385C]/20"
                      value={propertyDetails.bedrooms}
                      onChange={(e) => setDetail("bedrooms", e.target.value)}
                      placeholder="e.g. 3"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="font-medium text-gray-800">Bathrooms</span>
                    <input
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none transition-shadow focus:border-[#FF385C]/40 focus:ring-2 focus:ring-[#FF385C]/20"
                      value={propertyDetails.bathrooms}
                      onChange={(e) => setDetail("bathrooms", e.target.value)}
                      placeholder="e.g. 2.5"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="font-medium text-gray-800">Square Feet</span>
                    <input
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none transition-shadow focus:border-[#FF385C]/40 focus:ring-2 focus:ring-[#FF385C]/20"
                      value={propertyDetails.squareFeet}
                      onChange={(e) => setDetail("squareFeet", e.target.value)}
                      placeholder="e.g. 1,850"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="font-medium text-gray-800">Lot Size</span>
                    <input
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none transition-shadow focus:border-[#FF385C]/40 focus:ring-2 focus:ring-[#FF385C]/20"
                      value={propertyDetails.lotSize}
                      onChange={(e) => setDetail("lotSize", e.target.value)}
                      placeholder="e.g. 0.25 acres"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="font-medium text-gray-800">Year Built</span>
                    <input
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none transition-shadow focus:border-[#FF385C]/40 focus:ring-2 focus:ring-[#FF385C]/20"
                      value={propertyDetails.yearBuilt}
                      onChange={(e) => setDetail("yearBuilt", e.target.value)}
                      placeholder="e.g. 1998"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="font-medium text-gray-800">Property Type</span>
                    <input
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none transition-shadow focus:border-[#FF385C]/40 focus:ring-2 focus:ring-[#FF385C]/20"
                      value={propertyDetails.propertyType}
                      onChange={(e) => setDetail("propertyType", e.target.value)}
                      placeholder="House, condo, townhome…"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="font-medium text-gray-800">Parking</span>
                    <input
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none transition-shadow focus:border-[#FF385C]/40 focus:ring-2 focus:ring-[#FF385C]/20"
                      value={propertyDetails.parking}
                      onChange={(e) => setDetail("parking", e.target.value)}
                      placeholder="2-car garage, carport…"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="font-medium text-gray-800">HOA / Fees</span>
                    <input
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none transition-shadow focus:border-[#FF385C]/40 focus:ring-2 focus:ring-[#FF385C]/20"
                      value={propertyDetails.hoa}
                      onChange={(e) => setDetail("hoa", e.target.value)}
                      placeholder="Optional"
                    />
                  </label>
                  <label className="flex flex-col gap-1 sm:col-span-2">
                    <span className="font-medium text-gray-800">Neighborhood</span>
                    <input
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none transition-shadow focus:border-[#FF385C]/40 focus:ring-2 focus:ring-[#FF385C]/20"
                      value={propertyDetails.neighborhood}
                      onChange={(e) => setDetail("neighborhood", e.target.value)}
                      placeholder="e.g. River District"
                    />
                  </label>
                  <label className="flex flex-col gap-1 sm:col-span-2">
                    <span className="font-medium text-gray-800">City / Area</span>
                    <input
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none transition-shadow focus:border-[#FF385C]/40 focus:ring-2 focus:ring-[#FF385C]/20"
                      value={propertyDetails.cityOrArea}
                      onChange={(e) => setDetail("cityOrArea", e.target.value)}
                      placeholder="City or region (no need for full street address)"
                    />
                  </label>
                  <label className="flex flex-col gap-1 sm:col-span-2">
                    <span className="font-medium text-gray-800">Extra Notes</span>
                    <textarea
                      rows={3}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none transition-shadow focus:border-[#FF385C]/40 focus:ring-2 focus:ring-[#FF385C]/20"
                      value={propertyDetails.additionalNotes}
                      onChange={(e) => setDetail("additionalNotes", e.target.value)}
                      placeholder="Renovations, appliances, schools, anything buyers should know"
                    />
                  </label>
                </div>
              )}

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
                        className="w-full rounded-md bg-[#FF385C] px-6 py-3.5 text-md font-semibold text-white shadow-sm transition hover:bg-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:ring-offset-2 disabled:opacity-60 sm:w-auto sm:min-w-[220px]"
                      >
                        Generate Description
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
                    className="w-full rounded-md bg-[#FF385C] px-6 py-3.5 text-lg font-semibold text-white shadow-sm transition hover:bg-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#FF385C] focus:ring-offset-2 sm:w-auto sm:min-w-[220px]"
                  >
                    Generate Description
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="w-full flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:p-8">
            <div className="flex flex-col gap-1 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Generated Description</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {airbnbListing
                    ? `Airbnb limits: title ≤ ${LISTING_TITLE_MAX_CHARS} · description ≤ ${LISTING_DESCRIPTION_MAX_CHARS}`
                    : "Full-length title and description"}
                </p>
              </div>
              {openAIResponse ? (
                <button
                  type="button"
                  onClick={copyAIResponseToClipboard}
                  className="text-sm font-semibold bg-[#FF385C] text-white px-4 py-2 rounded-md hover:bg-[#E31C5F] hover:text-white"
                >
                  Copy Description
                </button>
              ) : null}
            </div>

            <div className="pt-5">
              {submitting && !openAIResponse ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-gray-500">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-[#FF385C]" />
                  Generating your listing…
                </div>
              ) : openAIResponse ? (
                <>
                  <div className="space-y-3">
                    {openAIResponse.split("\n").map((line, index) => {
                      const t = line.trimEnd();
                      if (!t.trim()) {
                        return <div key={index} className="h-1" />;
                      }
                      if (t.startsWith("###")) {
                        return (
                          <h3
                            key={index}
                            className="text-xl font-bold leading-snug tracking-tight text-gray-900 sm:text-2xl"
                          >
                            {t.replace(/^#+\s*/, "").trim()}
                          </h3>
                        );
                      }
                      if (t.startsWith("**")) {
                        return (
                          <p key={index} className="text-sm font-semibold text-gray-900">
                            {t.replace(/\*/g, "").trim()}
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
                    Copy Listing
                  </button>
                </>
              ) : (
                <p className="py-14 text-center text-sm leading-relaxed text-gray-500">
                  Upload photos and click <span className="font-medium text-gray-700">Generate Description</span>—your title
                  and description will appear here.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}