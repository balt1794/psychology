import type { Metadata } from "next";
import MortgageCalculator from "@/components/MortgageCalculator";
import { RelatedToolsCards } from "@/components/RelatedToolsCards";

export const metadata: Metadata = {
  title: "Mortgage Calculator",
  description:
    "Estimate your monthly mortgage payment with principal, interest, PMI, taxes, insurance, and HOA. View breakdown and amortization schedule.",
};

export default function MortgageCalculatorPage() {
  return (
    <>
      <MortgageCalculator />
      <RelatedToolsCards currentTool="mortgage-calculator" />
    </>
  );
}
