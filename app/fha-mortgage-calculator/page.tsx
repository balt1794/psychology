import type { Metadata } from "next";
import FhaMortgageCalculator from "@/components/FhaMortgageCalculator";
import { RelatedToolsCards } from "@/components/RelatedToolsCards";

export const metadata: Metadata = {
  title: "FHA Mortgage Loan Calculator",
  description:
    "Estimate your FHA mortgage payment with principal, interest, taxes, insurance, HOA dues, and FHA MIP.",
};

export default function FhaMortgageCalculatorPage() {
  return (
    <>
      <FhaMortgageCalculator />
      <RelatedToolsCards currentTool="fha-mortgage-calculator" />
    </>
  );
}
