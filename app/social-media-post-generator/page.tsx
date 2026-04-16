import SocialMediaPostGenerator from "@/components/SocialMediaPostGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Media Post Generator",
  description:
    "Generate social media posts for any social media platform. Upload photos, fill in the details, pick a template, and download a polished post for any social media platform.",
};

export default function SocialMediaPostPage() {
  return <SocialMediaPostGenerator />;
}
