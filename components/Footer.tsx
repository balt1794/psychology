import Link from "next/link";


export const Footer = () => {
  return (

<footer className="border-t border-gray-200 bg-white">
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 lg:py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-0.5 text-lg font-bold leading-none text-black lg:gap-1 lg:text-xl"
          aria-label="PropertyListingsAI home"
        >
          <span className="translate-y-[0.5px]">PropertyListingsAI</span>
          <svg
            className="mb-1 h-8 w-8 shrink-0 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
            fill="#FF385C"
            viewBox="-1 0 19 19"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M16.417 9.583A7.917 7.917 0 1 1 8.5 1.666a7.917 7.917 0 0 1 7.917 7.917zm-2.792-1.198a.396.396 0 0 0-.149-.54L8.661 5.104a.396.396 0 0 0-.393 0l-2.31 1.324v-.895a.318.318 0 0 0-.317-.317h-.968a.318.318 0 0 0-.317.317v1.813l-.872.5a.396.396 0 1 0 .393.686l4.589-2.629 4.619 2.63a.395.395 0 0 0 .54-.148zm-1.02.786L8.467 6.815l-4.11 2.356v4.465a.318.318 0 0 0 .316.317h7.615a.318.318 0 0 0 .317-.317zm-6.647.607h1.647v1.668H5.958zm5.045 1.668H9.356V9.778h1.647z"></path>
          </svg>
        </Link>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Link href="/terms-of-use" className="text-gray-700 hover:text-[#FF385C]">
            Terms of Use
          </Link>
          <Link href="/faq" className="text-gray-700 hover:text-[#FF385C]">
            FAQ
          </Link>
          <Link href="/airbnb-listing" className="text-gray-700 hover:text-[#FF385C]">
            Airbnb Listing
          </Link>
          <Link href="/property-description-generator" className="text-gray-700 hover:text-[#FF385C]">
            Property Description
          </Link>
          <Link href="/airbnb-house-rules-generator" className="text-gray-700 hover:text-[#FF385C]">
            House Rules
          </Link>
          <Link href="/driving-directions-generator" className="text-gray-700 hover:text-[#FF385C]">
            Driving Directions
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">© 2026 PropertyListingsAI. All Rights Reserved.</span>
          <a
            href="https://twitter.com/balt1794"
            target="_blank"
            rel="noreferrer"
            className="text-black transition-colors hover:text-[#FF385C]"
            aria-label="Twitter page"
          >
            <svg className="h-6 w-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
              <path fillRule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
</footer>

  );
}