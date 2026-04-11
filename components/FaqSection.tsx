import { FAQ_ITEMS } from "@/lib/faq";

type FaqSectionProps = {
  className?: string;
};

export function FaqSection({ className = "mx-4 mt-10 mb-8 lg:mx-10" }: FaqSectionProps) {
  return (
    <section className={className} aria-labelledby="faq-heading">
      <div className="w-full rounded-2xl bg-white p-6 lg:p-8">
        <h2 id="faq-heading" className="text-center text-2xl font-bold text-gray-900 lg:text-4xl">
          Frequently Asked Questions (FAQ)
        </h2>

        <div className="mx-auto mt-8 max-w-4xl space-y-4">
          {FAQ_ITEMS.map((item) => (
            <div
              key={item.question}
              className="rounded-md border border-gray-200 bg-[#fafafa] p-4"
            >
              <h3 className="text-center text-lg font-semibold text-gray-900">{item.question}</h3>
              <p className="mt-2 text-base leading-relaxed text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
