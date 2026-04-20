"use client";

import { DesignStudio } from "@/src/components/interior-studio";
import { RelatedToolsCards } from "@/components/RelatedToolsCards";

export default function AiInteriorDesignGenerator() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        <DesignStudio />
      </div>
      <div className="mt-auto">
        <RelatedToolsCards currentTool="ai-interior-design-generator" />
      </div>
    </div>
  );
}
