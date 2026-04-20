import { useState } from "react";

type SuggestionStepData = {
  status: "loading" | "streaming" | "completed";
  changes: string[];
};

type ImprovementStepData = {
  status: "in-progess" | "completed";
  url: string;
};

export const useInteriorWorkflow = () => {
  const [status, setStatus] = useState<"idle" | "submitted" | "streaming">("idle");
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [suggestionStep, setSuggestionStep] = useState<{ data: SuggestionStepData } | null>(null);
  const [improvementStep, setImprovementStep] = useState<{ data: ImprovementStepData } | null>(null);

  const sendInteriorImage = async (imageUrl: string) => {
    setActiveImageUrl(imageUrl);
    setStatus("submitted");
    setSuggestionStep({ data: { status: "loading", changes: [] } });
    setImprovementStep(null);

    try {
      const response = await fetch("/api/ai-interior-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      const data = await response.json();
      setSuggestionStep({
        data: {
          status: "completed",
          changes: data.suggestions ?? [],
        },
      });
    } catch {
      setSuggestionStep({
        data: {
          status: "completed",
          changes: [
            "Brighten the room with layered warm lighting.",
            "Add a larger area rug to anchor the seating zone.",
            "Introduce indoor plants and neutral textile accents.",
          ],
        },
      });
    } finally {
      setStatus("idle");
    }
  };

  const approveChanges = async (approvedChanges: string[]) => {
    if (!activeImageUrl) return;

    setStatus("streaming");
    setImprovementStep({ data: { status: "in-progess", url: "" } });
    try {
      const response = await fetch("/api/ai-interior-improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: activeImageUrl,
          approvedChanges,
        }),
      });
      const data = await response.json();
      setImprovementStep({ data: { status: "completed", url: data.url ?? activeImageUrl } });
    } catch {
      setImprovementStep({ data: { status: "completed", url: activeImageUrl } });
    } finally {
      setStatus("idle");
    }
  };

  return {
    sendInteriorImage,
    approveChanges,
    status,
    suspenseData: null,
    suggestionStep,
    improvementStep,
  };
};
