"use client";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import { getDoc, setDoc, doc } from "firebase/firestore";

const navigation = [
  { name: "Pricing", href: "/pricing", current: false },
];

const tools = [
  { name: "Airbnb Listing Generator", href: "/airbnb-listing" },
  { name: "Property Description Generator", href: "/property-description-generator" },
  { name: "Driving Directions Generator", href: "/driving-directions-generator" },
  { name: "House Rules Generator", href: "/airbnb-house-rules-generator" },
  { name: "Social Media Post Generator", href: "/social-media-post-generator" },
  { name: "AI Interior Design Generator", href: "/ai-interior-design-generator" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const router = usePathname();
  const { user, logout } = useAuth();
  const googleAuth = new GoogleAuthProvider();

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuth);
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (!userDocSnapshot.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            freeRewritesLeft: 0,
            paidUser: false,
            userId: user.uid,
          });
        }
      }
      window.location.href = router;
    } catch (err) {
      // Handle error
    }
  };

  return (
    <Disclosure as="nav" className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-8xl px-2 sm:px-6 lg:px-8">
            <div className="flex h-16 w-full items-center gap-2 sm:gap-0">
              {/* Mobile menu button */}
              <div className="flex shrink-0 items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-200">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Logo & Links */}
              <div className="flex min-w-0 flex-1 items-center justify-center sm:min-w-0 sm:flex-1 sm:items-stretch sm:justify-start">
                <div className="flex min-w-0 max-w-full items-center justify-center sm:max-w-none sm:justify-start">
                  <Link
                    href="/"
                    className="flex min-w-0 max-w-full items-center gap-1 text-sm font-bold leading-tight text-black sm:max-w-none sm:text-sm lg:gap-1 lg:text-xl"
                    aria-label="PropertyListingsAI home"
                  >
                    <span className="truncate sm:whitespace-normal">PropertyListingsAI</span>
                    <svg
                      className="h-7 w-7 shrink-0 translate-y-[1px] sm:h-8 sm:w-8 sm:translate-y-0 sm:mb-1 lg:h-10 lg:w-10 lg:mb-1"
                      fill="#FF385C"
                      viewBox="-1 0 19 19"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M16.417 9.583A7.917 7.917 0 1 1 8.5 1.666a7.917 7.917 0 0 1 7.917 7.917zm-2.792-1.198a.396.396 0 0 0-.149-.54L8.661 5.104a.396.396 0 0 0-.393 0l-2.31 1.324v-.895a.318.318 0 0 0-.317-.317h-.968a.318.318 0 0 0-.317.317v1.813l-.872.5a.396.396 0 1 0 .393.686l4.589-2.629 4.619 2.63a.395.395 0 0 0 .54-.148zm-1.02.786L8.467 6.815l-4.11 2.356v4.465a.318.318 0 0 0 .316.317h7.615a.318.318 0 0 0 .317-.317zm-6.647.607h1.647v1.668H5.958zm5.045 1.668H9.356V9.778h1.647z"></path>
                    </svg>
                  </Link>
                </div>
                {/* Desktop Links */}
                <div className="hidden sm:ml-6 sm:flex items-center space-x-4 h-full">
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="inline-flex justify-center w-full rounded-md px-3 py-2 text-base lg:text-lg font-medium text-black hover:text-[#FF385C] focus:outline-none">
                        Real Estate Tools
                        <ChevronDownIcon className="ml-1 h-7 w-5" aria-hidden="true" />
                      </Menu.Button>
                    </div>
                    <Menu.Items className="absolute left-0 z-50 mt-3 w-80 origin-top-left overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl focus:outline-none">
                      <div className="p-2">
                        {tools.map((tool) => (
                          <Menu.Item key={tool.name}>
                            {({ active }) => (
                              <Link
                                href={tool.href}
                                className={classNames(
                                  active ? "bg-[#fff1f5] text-[#E31C5F]" : "text-gray-900",
                                  "block rounded-lg px-3 py-3 text-lg font-medium transition-colors"
                                )}
                              >
                                {tool.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Menu>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current ? "text-black" : "text-black hover:text-[#FF385C]",
                        "flex items-center justify-center rounded-md px-3 py-4 text-base lg:text-lg font-medium h-full"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {/* Tools Dropdown - Desktop */}
               
                </div>
              </div>

              {/* Right Side Buttons */}
              <div className="flex shrink-0 items-center sm:ml-6">
                <div className="relative">
                  {user ? (
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-[#FF385C] px-3.5 py-1.5 text-sm font-bold text-white transition-colors hover:bg-[#E31C5F] sm:px-6 sm:py-2 sm:text-base"
                    >
                      <Link className="rounded-md font-medium" href="/" onClick={() => logout()}>
                        Log Out
                      </Link>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-[#FF385C] px-3.5 py-1.5 text-sm font-bold text-white transition-colors hover:bg-[#E31C5F] sm:px-6 sm:py-2 sm:text-base"
                      onClick={loginWithGoogle}
                    >
                      Sign Up
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Panel */}
          <Disclosure.Panel className="sm:hidden border-t border-gray-100 bg-white">
            <div className="space-y-0.5 px-4 pb-4 pt-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? "bg-black text-black" : "text-black hover:bg-gray-50",
                    "block rounded-lg px-3 py-2.5 text-base font-semibold"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}

              <Disclosure.Button
                as="a"
                href="/tools"
                className="block rounded-lg px-3 py-2.5 text-base font-semibold text-black hover:bg-gray-50"
              >
                Tools
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
