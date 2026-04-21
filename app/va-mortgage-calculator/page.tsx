import type { Metadata } from "next";
import VaMortgageCalculator from "@/components/VaMortgageCalculator";
import { RelatedToolsCards } from "@/components/RelatedToolsCards";

export const metadata: Metadata = {
  title: "VA Mortgage Calculator",
  description:
    "Estimate VA loan monthly payments with principal, interest, taxes, insurance, HOA dues, and VA funding fee scenarios.",
};

export default function VaMortgageCalculatorPage() {
  return (
    <>
      <VaMortgageCalculator />
      <RelatedToolsCards currentTool="va-mortgage-calculator" />
    </>
  );
}
