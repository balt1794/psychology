
"use client";
import { ChangeEvent, useState, useEffect, FormEvent } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import FreeRewritesLeft from "../components/FreeRewritesLeft";
import { ToolPageShell } from "@/components/ToolPageShell";
import { updateDoc, getDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import imageCompression from "browser-image-compression";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import { Camera } from "lucide-react";


export default function InstantListing() {
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
  const [freeRewritesLeft, setFreeRewritesLeft] = useState<number | null>(null);
  const [placeDescription, setPlaceDescription] = useState<string>("");
  const [numGuests, setNumGuests] = useState<string>("1");
  const [numBedrooms, setNumBedrooms] = useState<string>("1");
  const [numBeds, setNumBeds] = useState<string>("1");
  const [numBathrooms, setNumBathrooms] = useState<string>("1");
  const [contactInfo, setContactInfo] = useState<string>("");
  const [optionalAddress, setOptionalAddress] = useState<string>("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false); // New loading state for image uploads

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
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const newFreeRewritesLeft = userDoc.data().freeRewritesLeft - 1;
          await updateDoc(userDocRef, {
            freeRewritesLeft: newFreeRewritesLeft,
          });
          setFreeRewritesLeft(newFreeRewritesLeft);
        }
      } catch (e) {
        //console.error("Error updating freeRewritesLeft: ", e);
      }
    }
  };

  // Handle changes when files are selected
  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      alert("No images selected. Choose images.");
      return;
    }

    const files = Array.from(event.target.files);
    const uploadedURLs: string[] = [];
    setLoadingImages(true); // Start loading state

    try {
      for (const file of files) {
        // Log original file size
        console.log(`Original file: ${file.name}, Size: ${(file.size / 1024).toFixed(2)} KB`);

        // Compress the image
        const options = {
          maxSizeMB: 0.5, // Reduce max size to 0.2 MB (200 KB)
          maxWidthOrHeight: 800, // Reduce max width/height to 600px
          useWebWorker: true, // Use web worker for better performance
        };
        const compressedFile = await imageCompression(file, options);

        // Log compressed file size
        console.log(`Compressed file: ${compressedFile.name}, Size: ${(compressedFile.size / 1024).toFixed(2)} KB`);

        const storageRef = ref(storage, `uploads/${Date.now()}-${compressedFile.name}`);
        const snapshot = await uploadBytes(storageRef, compressedFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        uploadedURLs.push(downloadURL);
        console.log(`Uploaded ${compressedFile.name}: ${downloadURL}`);
      }
      setImages(uploadedURLs);
      toast.success("Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      setError("Error uploading images. Please try again.");
    } finally {
      setLoadingImages(false); // Stop loading state
    }
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
      const response = await fetch("/api/gpt4o", {
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
      console.log(formattedResponse)
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
        body: JSON.stringify({
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
      toast.error("Please sign up to generate a listing.", {
        icon: "🔐",
      });
    } 
  };

  const fieldClass =
    "mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-shadow focus:border-[#FF385C]/40 focus:ring-2 focus:ring-[#FF385C]/20";

  return (
    <>
      <Toaster />
      <ToolPageShell
        titleBefore="Airbnb Listing"
        titleAccent="Generator"
        subtitle="Create professional, high-converting Airbnb listings in seconds with AI"
        intro={
          <>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 sm:text-xl">
              Transform Your Property Photos Into Perfect Airbnb Listings
            </h2>
            <div className="mt-2 space-y-3">
              {[
                <>
                  <strong>SEO-optimized titles</strong> that increase visibility in Airbnb search results
                </>,
                <>
                  <strong>Compelling property descriptions</strong> that showcase your space&apos;s unique features
                </>,
                <>
                  <strong>Professional house rules</strong> and guest information sections
                </>,
                <>
                  <strong>Local area highlights</strong> to help guests discover nearby attractions
                </>,
                <>
                  <strong>Room-by-room descriptions</strong> with accurate details from your photos
                </>,
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="mt-0.5 h-5 w-5 shrink-0 text-[#FF385C]" aria-hidden>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700">{text}</p>
                </div>
              ))}
            </div>
          </>
        }
      >
        <div className="w-full flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Upload Images</h2>
              <p className="mt-1 text-sm text-gray-500">
                Please upload a minimum of 2 images and a maximum of 10 images for better results.
              </p>
            </div>
            <FreeRewritesLeft freeRewritesLeft={freeRewritesLeft} />
          </div>

          <div className="mb-4">
            <label htmlFor="placeDescription" className="text-sm font-medium text-gray-800">
              Which of these best describes your place?
            </label>
            <select
              id="placeDescription"
              value={placeDescription}
              onChange={(e) => setPlaceDescription(e.target.value)}
              className={fieldClass}
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

          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(
              [
                ["numGuests", "Guests", numGuests, setNumGuests] as const,
                ["numBedrooms", "Bedrooms", numBedrooms, setNumBedrooms] as const,
                ["numBeds", "Beds", numBeds, setNumBeds] as const,
                ["numBathrooms", "Bathrooms", numBathrooms, setNumBathrooms] as const,
              ] as const
            ).map(([id, label, value, setter]) => (
              <div key={id}>
                <label htmlFor={id} className="text-sm font-medium text-gray-800">
                  {label}
                </label>
                <select
                  id={id}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className={fieldClass}
                >
                  {Array.from({ length: 6 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                  <option value="6+">6+</option>
                </select>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label htmlFor="contactInfo" className="text-sm font-medium text-gray-800">
              Contact information
            </label>
            <input
              type="text"
              id="contactInfo"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="example@gmail.com, +1 973-757-4890, WhatsApp, Airbnb chat"
              className={fieldClass}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="optionalAddress" className="text-sm font-medium text-gray-800">
              Address
            </label>
            <input
              type="text"
              id="optionalAddress"
              value={optionalAddress}
              onChange={(e) => setOptionalAddress(e.target.value)}
              placeholder="573 Broadway Ave, New York"
              className={fieldClass}
            />
          </div>

          {loadingImages ? (
            <div className="mb-4 flex items-center justify-center gap-3 py-4 text-sm text-gray-600">
              <div
                className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-[#FF385C]"
                aria-hidden
              />
              Uploading images…
            </div>
          ) : null}

          {images.length > 0 ? (
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
                >
                  <img src={image} className="h-full w-full object-cover" alt={`Upload ${index + 1}`} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-4 rounded-xl border border-gray-100 bg-white px-4 py-6 text-center text-sm text-gray-500">
              <p>Once you upload images, you will see them here.</p>
              <p className="mt-1">You need to upload at least 2 images.</p>
            </div>
          )}

          <form onSubmit={(e) => handleSubmitDescription(e)} className="space-y-6">
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
                      disabled={submitting || loadingImages || images.length === 0}
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
              <h2 className="text-lg font-semibold text-gray-900">Property listing</h2>
              <p className="text-xs text-gray-500">Tap a section to copy that block</p>
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
            {loadingResponse && !openAIResponse ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-gray-500">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-[#FF385C]" />
                Generating listing…
              </div>
            ) : openAIResponse ? (
              <>
                <div>
                  {(() => {
                    const sections = openAIResponse.split("\n\n");
                    const filteredSections = sections.filter(
                      (section) => section.trim() !== "" && !section.trim().startsWith("---")
                    );

                    return (
                      <>
                        {filteredSections.map((section, index) => {
                          const titleMatch = section.match(
                            /^(###|\*\*)?\s*(Title|Description|House Rules|Image Descriptions|Contact Information|How to Get There|Sample Cancellation Policy|Amenities|Nearby Activities|Property Description|Number of Guests|Number of Bedrooms|Number of Beds|Number of Bathrooms|Activities Nearby):?/i
                          );
                          const title = titleMatch
                            ? titleMatch[0].replace(/#/g, "").replace(/\*/g, "").replace(/:/g, "").trim()
                            : null;
                          const content = titleMatch
                            ? section.replace(titleMatch[0], "").replace(/\*/g, "").trim()
                            : section.replace(/\*/g, "").trim();

                          if (title) {
                            return (
                              <div key={index} className="mb-5">
                                <h3 className="mb-2 text-base font-semibold text-gray-900">{title}</h3>
                                <button
                                  type="button"
                                  className="w-full rounded-xl border border-gray-200 bg-gray-50/80 p-4 text-left text-sm text-gray-700 transition hover:border-[#FF385C]/30 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20"
                                  onClick={() => {
                                    navigator.clipboard.writeText(content);
                                    toast.success(`Copied ${title} to clipboard!`, { icon: "✂️" });
                                  }}
                                >
                                  <pre className="whitespace-pre-wrap font-sans">{content}</pre>
                                </button>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </>
                    );
                  })()}
                </div>
                <button
                  type="button"
                  onClick={copyAIResponseToClipboard}
                  className="mt-6 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/30 sm:hidden"
                >
                  Copy listing
                </button>
              </>
            ) : (
              <p className="py-14 text-center text-sm leading-relaxed text-gray-500">
                Upload photos, fill in the details, and click{" "}
                <span className="font-medium text-gray-700">Generate Listing</span>—sections will appear here.
              </p>
            )}
          </div>
        </div>
      </ToolPageShell>
    </>
  );
}