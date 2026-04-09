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
  { name: "Terms of Use", href: "/terms-of-use", current: false },
];

const tools = [
  { name: "Airbnb Listing Generator", href: "/airbnb-listing" },
  { name: "Property Description Generator", href: "/property-description-generator" },
  { name: "Driving Directions Generator", href: "/driving-directions-generator" },
  { name: "House Rules Generator", href: "/airbnb-house-rules-generator" },
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
    <Disclosure as="nav" className="border-2 border-white-400">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-8xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-14 items-center justify-between">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Logo & Links */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link className="text-black font-bold text-sm lg:text-xl mr-4 lg:mr-0" href="/" passHref>
                    PropertyListingsAI
                  </Link>
                  <Link className="text-black font-bold text-xl mt-2 hidden lg:block" href="/" passHref>
                  <svg fill="#FF385C" width="50px" height="42px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M16.417 9.583A7.917 7.917 0 1 1 8.5 1.666a7.917 7.917 0 0 1 7.917 7.917zm-2.792-1.198a.396.396 0 0 0-.149-.54L8.661 5.104a.396.396 0 0 0-.393 0l-2.31 1.324v-.895a.318.318 0 0 0-.317-.317h-.968a.318.318 0 0 0-.317.317v1.813l-.872.5a.396.396 0 1 0 .393.686l4.589-2.629 4.619 2.63a.395.395 0 0 0 .54-.148zm-1.02.786L8.467 6.815l-4.11 2.356v4.465a.318.318 0 0 0 .316.317h7.615a.318.318 0 0 0 .317-.317zm-6.647.607h1.647v1.668H5.958zm5.045 1.668H9.356V9.778h1.647z"></path></g></svg>
                  </Link>
                  <svg fill="#FF385C" viewBox="-1 0 19 19" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M16.417 9.583A7.917 7.917 0 1 1 8.5 1.666a7.917 7.917 0 0 1 7.917 7.917zm-2.792-1.198a.396.396 0 0 0-.149-.54L8.661 5.104a.396.396 0 0 0-.393 0l-2.31 1.324v-.895a.318.318 0 0 0-.317-.317h-.968a.318.318 0 0 0-.317.317v1.813l-.872.5a.396.396 0 1 0 .393.686l4.589-2.629 4.619 2.63a.395.395 0 0 0 .54-.148zm-1.02.786L8.467 6.815l-4.11 2.356v4.465a.318.318 0 0 0 .316.317h7.615a.318.318 0 0 0 .317-.317zm-6.647.607h1.647v1.668H5.958zm5.045 1.668H9.356V9.778h1.647z"></path></g></svg>
                </div>
                {/* Desktop Links */}
                <div className="hidden sm:ml-6 sm:flex items-center space-x-4 h-full">
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="inline-flex justify-center w-full rounded-md px-3 py-2 text-base lg:text-lg font-medium text-black hover:underline focus:outline-none">
                        Real Estate Tools
                        <ChevronDownIcon className="ml-1 h-7 w-5" aria-hidden="true" />
                      </Menu.Button>
                    </div>
                    <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="py-1">
                        {tools.map((tool) => (
                          <Menu.Item key={tool.name}>
                            {({ active }) => (
                              <Link
                                href={tool.href}
                                className={classNames(
                                  active ? "bg-gray-100 text-black" : "text-black",
                                  "block px-4 py-2 text-md"
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
                        item.current ? "text-black" : "text-black hover:underline hover:text-black",
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
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="relative ml-3">
                  {user ? (
                    <button
                      type="button"
                      className="inline-flex items-center bg-[#FF385C] hover:bg-[#E31C5F] text-white font-bold py-2 px-6 rounded-md transition-colors"
                      >
                      <Link className=" rounded-md  text-md font-medium" href="/" onClick={() => logout()}>
                        Log Out
                      </Link>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center bg-[#FF385C] hover:bg-[#E31C5F] text-white font-bold py-2 px-6 rounded-md transition-colors"
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
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? "bg-black text-black" : "text-black hover:bg-white hover:text-black",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}

              {/* Single Tools link for Mobile */}
              <Disclosure.Button
                as="a"
                href="/tools"
                className="block rounded-md px-3 py-2 text-base font-medium text-black hover:bg-white hover:text-black"
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
