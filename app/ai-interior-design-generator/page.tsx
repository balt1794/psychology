import type { Metadata } from "next";
import AiInteriorDesignGenerator from "@/components/AiInteriorDesignGenerator";
import "./styles.css";

export const metadata: Metadata = {
  title: "AI Interior Design Generator",
  description:
  "Upload a room photo, get intelligent AI design suggestions, select your favorite style, and generate a stunning redesigned interior image instantly. Free AI interior design tool for homeowners, decorators, and real estate professionals.",
};

export default function AiInteriorDesignGeneratorPage() {
  return <AiInteriorDesignGenerator />;
}

