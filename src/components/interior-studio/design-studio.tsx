"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useInteriorWorkflow } from "@/src/hooks/use-interior-workflow";
import BeforeAfterSlider from "./before-after-slider";
import ImagePreview from "./image-preview";
import ImageUploader from "./image-uploader";
import ProcessingView from "./processing-view";
import { Suggestion } from "./suggestion-card";
import SuggestionPanel from "./suggestion-panel";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/config/firebase";
import { ToolPageShell } from "@/components/ToolPageShell";

type WorkflowStep = "upload" | "analyzing" | "suggestions" | "processing" | "reveal";

export default function DesignStudio() {
  const auth = useAuth();
  const {
    sendInteriorImage,
    approveChanges,
    status,
    suggestionStep,
    improvementStep,
  } = useInteriorWorkflow();

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [userModifiedSuggestions, setUserModifiedSuggestions] = useState<Suggestion[] | null>(null);
  const [highlightedZone, setHighlightedZone] = useState<string | null>(null);
  const [hasApprovedChanges, setHasApprovedChanges] = useState(false);
  const [freeRewritesLeft, setFreeRewritesLeft] = useState<number | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  /** True from click until credits check + improvement request kick off (covers Firestore latency before `status === "streaming"`). */
  const [isGenerateStarting, setIsGenerateStarting] = useState(false);

  useEffect(() => {
    if (!auth.user) {
      setFreeRewritesLeft(null);
      return;
    }

    const fetchCredits = async () => {
      const userDocRef = doc(db, "users", auth.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        setFreeRewritesLeft(0);
        return;
      }
      setFreeRewritesLeft(userDoc.data().freeRewritesLeft ?? 0);
    };

    void fetchCredits();
  }, [auth.user]);

  const updateFreeRewritesLeft = useCallback(async (): Promise<boolean> => {
    if (!auth.user) return false;
    const userDocRef = doc(db, "users", auth.user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) return false;
    const current = userDoc.data().freeRewritesLeft ?? 0;
    if (current <= 0) return false;
    const next = current - 1;
    await updateDoc(userDocRef, { freeRewritesLeft: next });
    setFreeRewritesLeft(next);
    return true;
  }, [auth.user]);

  const handleCheckout = useCallback(async () => {
    if (!auth.user) {
      toast.error("Please sign up to buy credits.", { icon: "🔐" });
      return;
    }
    if (!auth.user.email) {
      toast.error("Missing account email. Please re-login.");
      return;
    }

    setCheckoutLoading(true);
    try {
      const response = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: auth.user.uid,
          email: auth.user.email,
          purchaseType: "payment",
        }),
      });
      const { sessionId } = await response.json();
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");
      if (!stripe) return;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to start checkout right now.");
    } finally {
      setCheckoutLoading(false);
    }
  }, [auth.user]);

  const suggestions = useMemo((): Suggestion[] => {
    if (userModifiedSuggestions !== null) return userModifiedSuggestions;

    if (suggestionStep?.data?.changes?.length) {
      return suggestionStep.data.changes.map((text, index) => ({
        id: `suggestion-${index}`,
        text,
        selected: false,
      }));
    }

    return [];
  }, [suggestionStep, userModifiedSuggestions]);

  const currentStep = useMemo((): WorkflowStep => {
    if (!uploadedImage) return "upload";
    if (improvementStep?.data?.status === "completed" && improvementStep?.data?.url) return "reveal";
    if (improvementStep?.data?.status === "in-progess" || hasApprovedChanges) return "processing";
    if (suggestions.length > 0 || suggestionStep?.data) return "suggestions";
    if (status === "streaming" || status === "submitted") return "analyzing";
    return "analyzing";
  }, [uploadedImage, improvementStep, hasApprovedChanges, suggestions.length, suggestionStep, status]);

  const handleImageUpload = useCallback((imageUrl: string) => {
    setUploadedImage(imageUrl);
    setUserModifiedSuggestions(null);
    setHasApprovedChanges(false);
    setIsGenerateStarting(false);
    sendInteriorImage(imageUrl);
  }, [sendInteriorImage]);

  const handleGenerate = useCallback(() => {
    const selectedChanges = suggestions.filter((s) => s.selected).map((s) => s.text);
    if (!selectedChanges.length) return;
    if (!auth.user) {
      toast.error("Please sign up to generate improvements.", { icon: "🔐" });
      return;
    }
    if (!freeRewritesLeft || freeRewritesLeft <= 0) {
      void handleCheckout();
      return;
    }

    setIsGenerateStarting(true);
    void (async () => {
      try {
        const charged = await updateFreeRewritesLeft();
        if (!charged) {
          void handleCheckout();
          return;
        }
        setHasApprovedChanges(true);
        await approveChanges(selectedChanges);
      } finally {
        setIsGenerateStarting(false);
      }
    })();
  }, [suggestions, approveChanges, auth.user, freeRewritesLeft, updateFreeRewritesLeft, handleCheckout]);

  const handleStartOver = useCallback(() => {
    setUploadedImage(null);
    setUserModifiedSuggestions(null);
    setHighlightedZone(null);
    setHasApprovedChanges(false);
    setIsGenerateStarting(false);
  }, []);

  const isImprovementComplete = improvementStep?.data?.status === "completed";
  const improvedImageUrl = improvementStep?.data?.url || uploadedImage || "";
  const hasCredits = (freeRewritesLeft ?? 0) > 0;
  const canUpload = Boolean(auth.user) && hasCredits;
  const handleDownload = useCallback(async () => {
    if (!improvedImageUrl) return;
    if (!auth.user) {
      toast.error("Please sign up to download your image.", { icon: "🔐" });
      return;
    }
    if (!freeRewritesLeft || freeRewritesLeft <= 0) {
      await handleCheckout();
      return;
    }

    const charged = await updateFreeRewritesLeft();
    if (!charged) {
      await handleCheckout();
      return;
    }

    try {
      const response = await fetch(improvedImageUrl, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const extension =
        blob.type.includes("jpeg") || blob.type.includes("jpg") ? "jpg" : "png";

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `ai-interior-redesign.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback if the browser blocks cross-origin blob fetches.
      const link = document.createElement("a");
      link.href = improvedImageUrl;
      link.download = "ai-interior-redesign.png";
      link.rel = "noopener noreferrer";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }, [improvedImageUrl, auth.user, freeRewritesLeft, updateFreeRewritesLeft, handleCheckout]);

  return (
    <>
      <Toaster />

      {currentStep === "upload" && (
        <ToolPageShell
          titleBefore="AI Interior Design"
          titleAccent="Generator"
          subtitle="Create professional, high-converting interior redesigns in seconds with AI."
        >
          <div className="mx-auto flex w-full max-w-8xl flex-col gap-6 py-4 md:py-8 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1">
              {canUpload ? (
                <ImageUploader onImageUpload={handleImageUpload} />
              ) : (
                <div className="mx-auto my-4 w-full max-w-2xl rounded-2xl border border-stone-200 bg-white px-8 py-12 text-center shadow-sm">
                  <h3 className="text-xl font-semibold text-black mt-6">
                    {auth.user ? "Credits required to upload" : "Sign in to upload"}
                  </h3>
                  <p className="mt-4 mb-6 text-sm text-gray-700">
                    {auth.user
                      ? freeRewritesLeft === null
                        ? "Checking your available credits..."
                        : "You need at least 1 credit before uploading a room photo."
                      : "Please sign in and add credits to start uploading interior photos."}
                  </p>

                  {auth.user && (
                    <div className="mt-8 flex items-center justify-center gap-2 mb-6">
                      <div className="rounded-lg border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-medium text-black">
                        Credits: {freeRewritesLeft === null ? "-" : freeRewritesLeft}
                      </div>
                      <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={checkoutLoading || freeRewritesLeft === null}
                        className="rounded-lg bg-[#FF385C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#e03150] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {checkoutLoading ? "Loading..." : "Buy Credits"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </ToolPageShell>
      )}

      {currentStep === "analyzing" && uploadedImage && (
        <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6] p-6 text-neutral-800">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#E3E8DE]">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#5E7361] border-t-transparent" />
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Analyzing your room...</h2>
          </div>
        </div>
      )}

      {currentStep === "suggestions" && uploadedImage && (
        <div className="min-h-screen bg-[#FAF9F6] text-neutral-800">
          <main className="max-w-7xl mx-auto p-4 md:p-6">
            <div className="mb-4 rounded-2xl  px-4 py-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold text-black md:text-3xl">
                  AI Interior Design Generator
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  {(!freeRewritesLeft || freeRewritesLeft <= 0) && (
                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                      className="rounded-xl bg-[#5E7361] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#4f6052] disabled:opacity-60"
                    >
                      {checkoutLoading ? "Loading..." : "Buy Credits"}
                    </button>
                  )}
                  <div className="flex items-center gap-1 rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-black">
                    <span>Credits:</span>
                    <span className="font-semibold text-black">
                      {freeRewritesLeft === null ? "-" : freeRewritesLeft > 75 ? "♾️" : freeRewritesLeft}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartOver}
                    className="flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:border-[#5E7361]/50 hover:bg-[#E3E8DE]"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Start Over
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
              <div className="h-full min-h-[400px]">
                <ImagePreview imageUrl={uploadedImage} highlightedZone={highlightedZone} />
              </div>
              <div className="h-full min-h-[400px]">
                <SuggestionPanel
                  suggestions={suggestions}
                  onToggle={(id) =>
                    setUserModifiedSuggestions((prev) => {
                      const base = prev ?? suggestions;
                      return base.map((s) =>
                        s.id === id ? { ...s, selected: !s.selected } : s,
                      );
                    })
                  }
                  onEdit={(id, newText) =>
                    setUserModifiedSuggestions((prev) => {
                      const base = prev ?? suggestions;
                      return base.map((s) =>
                        s.id === id ? { ...s, text: newText } : s,
                      );
                    })
                  }
                  onDelete={(id) =>
                    setUserModifiedSuggestions((prev) => {
                      const base = prev ?? suggestions;
                      return base.filter((s) => s.id !== id);
                    })
                  }
                  onAdd={(text) =>
                    setUserModifiedSuggestions((prev) => {
                      const base = prev ?? suggestions;
                      return [
                        ...base,
                        {
                          id: `custom-${Date.now()}`,
                          text,
                          selected: false,
                        },
                      ];
                    })
                  }
                  onHoverZone={setHighlightedZone}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerateStarting || status === "streaming"}
                  isLoading={suggestionStep?.data?.status === "loading"}
                  isOutOfCredits={!freeRewritesLeft || freeRewritesLeft <= 0}
                  isBuyingCredits={checkoutLoading}
                  onBuyCredits={handleCheckout}
                />
              </div>
            </div>
          </main>
        </div>
      )}

      {currentStep === "processing" && uploadedImage && (
        <div className="min-h-screen bg-[#FAF9F6] text-neutral-800">
          <ProcessingView
            imageUrl={uploadedImage}
            suggestions={suggestions.filter((s) => s.selected).map((s) => s.text)}
            onComplete={() => {}}
            isComplete={isImprovementComplete}
          />
        </div>
      )}

      {currentStep === "reveal" && uploadedImage && (
        <div className="min-h-screen bg-[#FAF9F6] text-neutral-800">
          <BeforeAfterSlider
            beforeImage={uploadedImage}
            afterImage={improvedImageUrl}
            appliedChanges={suggestions.filter((s) => s.selected).map((s) => ({ id: s.id, text: s.text }))}
            onRedo={handleStartOver}
            onTryDifferent={() => {
              setHasApprovedChanges(false);
              setUserModifiedSuggestions(null);
            }}
            onDownload={handleDownload}
            downloadLabel={!freeRewritesLeft || freeRewritesLeft <= 0 ? "Buy Credits" : "Download"}
            creditsLeft={freeRewritesLeft}
            onBuyCredits={handleCheckout}
            isBuyingCredits={checkoutLoading}
            onShare={() => {
              if (navigator.share && improvedImageUrl) {
                navigator.share({ title: "AI Interior Design", text: "Check out my redesign!", url: improvedImageUrl });
              }
            }}
          />
        </div>
      )}
    </>
  );
}
