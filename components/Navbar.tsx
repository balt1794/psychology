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
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-8xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-black" aria-label="Psychology App home">
          Psychology App
        </Link>

        {user ? (
          <button
            type="button"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
            onClick={() => logout()}
          >
            Log Out
          </button>
        ) : (
          <button
            type="button"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
            onClick={loginWithGoogle}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
