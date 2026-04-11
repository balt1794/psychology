export type FaqItem = {
  question: string;
  answer: string;
};

/** Single source of truth for homepage + /faq */
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How does PropertyListingsAI work?",
    answer:
      "Upload your property photos and details, then PropertyListingsAI generates listing titles, descriptions, highlights, rules, and directions in seconds.",
  },
  {
    question: "What is included in the $9.99 plan?",
    answer:
      "The plan includes 15 credits for $9.99, ideal for creating listings across major real estate and vacation rental platforms.",
  },
  {
    question: "What are Airbnb title and description limits?",
    answer:
      "For Airbnb-friendly copy in PropertyListingsAI, use up to 50 characters for the title and up to 500 characters for the description.",
  },
  {
    question: "Can I generate property listing descriptions for Airbnb, Zillow, and Booking.com?",
    answer:
      "Yes. The generated descriptions are designed to be adapted for platforms like Airbnb, Zillow, RE/MAX, Booking.com, and Vrbo.",
  },
  {
    question: "Who is this tool best for?",
    answer:
      "Property managers, real estate agents, Airbnb hosts, and short-term rental operators who want faster listing creation and better marketing copy.",
  },
  {
    question: "What is a real estate listing?",
    answer:
      "A real estate listing is a description of a property for sale or rent. It includes details such as the location, size, number of bedrooms and bathrooms, and features of the property. PropertyListingsAI helps you turn those facts into polished titles, descriptions, and supporting copy for your marketing.",
  },
  {
    question: "How does PropertyListingsAI create listing content?",
    answer:
      "PropertyListingsAI uses AI to help you build compelling real estate and short-term rental listings. You enter property details such as type, location, size, and features—or upload photos—and our generators produce tailored copy for Airbnb-style listings, long-form property descriptions, house rules, and driving directions. The same workflow applies across all PropertyListingsAI tools so you can publish faster.",
  },
  {
    question: "How long should a real estate listing be?",
    answer:
      "The ideal length for a real estate listing can vary depending on the platform and target audience, but generally it should be concise yet informative. A good rule of thumb is to aim for 150-200 words for the main description so you can highlight key features without overwhelming buyers or renters. For online listings, use separate fields for square footage, bedrooms, and similar details where available. PropertyListingsAI is designed to help you stay clear and engaging while you adapt length to each site's limits.",
  },
  {
    question: "What websites can I use PropertyListingsAI for?",
    answer:
      "You can adapt PropertyListingsAI output for major real estate portals such as Zillow, Trulia, PropertyGuru, 99.co, and Realtor.com; Multiple Listing Service (MLS) listings; agency and agent websites; social media and classified sites; and short-term rental platforms like Airbnb and Vrbo.",
  },
];

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
} as const;
