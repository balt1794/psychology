import Link from "next/link";

type ToolId =
  | "airbnb-listing"
  | "property-description-generator"
  | "airbnb-house-rules-generator"
  | "driving-directions-generator";

type RelatedToolsCardsProps = {
  currentTool: ToolId;
};

const TOOL_CARDS: Array<{
  id: ToolId;
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  buttonLabel: string;
}> = [
  {
    id: "airbnb-listing",
    title: "Airbnb Listing Generator",
    description:
      "Turn your property photos into compelling Airbnb listings that attract more bookings.",
    href: "/airbnb-listing",
    imageSrc: "/tool1.png",
    buttonLabel: "Generate listing",
  },
  {
    id: "property-description-generator",
    title: "Property Description Generator",
    description:
      "Generate eye-catching descriptions that attract more guests and highlight your property's best features.",
    href: "/property-description-generator",
    imageSrc: "/tool2.png",
    buttonLabel: "Write with AI",
  },
  {
    id: "airbnb-house-rules-generator",
    title: "Airbnb House Rules Generator",
    description:
      "Create clear, professional house rules based on your property photos and details.",
    href: "/airbnb-house-rules-generator",
    imageSrc: "/tool3.png",
    buttonLabel: "Generate rules",
  },
  {
    id: "driving-directions-generator",
    title: "Airbnb Driving Directions Generator",
    description:
      "Generate detailed driving directions so guests can find your property easily.",
    href: "/driving-directions-generator",
    imageSrc: "/tool4.webp",
    buttonLabel: "Get directions",
  },
];

export function RelatedToolsCards({ currentTool }: RelatedToolsCardsProps) {
  const relatedTools = TOOL_CARDS.filter((tool) => tool.id !== currentTool);

  return (
    <section className="mx-auto w-full max-w-screen-3xl px-5 py-10 sm:px-8 md:px-10 lg:px-14 xl:px-20 2xl:px-24">
      <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 lg:mb-10 lg:text-4xl">
        Explore More Tools
      </h2>

      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 sm:gap-x-7 lg:grid-cols-3 xl:gap-x-9">
        {relatedTools.map((card) => (
          <div
            key={card.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="flex flex-1 flex-col items-center px-6 pb-7 pt-6 text-center">
              <h3 className="text-lg font-bold text-gray-900 lg:text-xl">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black lg:text-[0.9375rem]">
                {card.description}
              </p>
              <Link
                href={card.href}
                className="mt-5 inline-flex w-full max-w-[min(100%,20rem)] items-center justify-center rounded-lg border-2 border-[#FF385C] px-4 py-2.5 text-sm font-semibold text-[#E31C5F] transition-colors hover:bg-[#FFECEF]"
              >
                {card.buttonLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
