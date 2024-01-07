"use client";
import { Disclosure, Menu } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { usePathname } from "next/navigation";
import Link from 'next/link'
import { useAuth } from '../context/AuthContext';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from "../config/firebase"
import  { db } from "../config/firebase"
import { getDoc, setDoc, doc } from "firebase/firestore";

const navigation = [
 // { name: 'Blog', href: '/blog', current: false },
  { name: 'Pricing', href: '/pricing', current: false },
 // { name: 'FAQ', href: '/faq', current: false },
  //{ name: 'Calendar', href: '#', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
export default function Navbar() {
  const router = usePathname()

  const { user, logout } = useAuth()
  const googleAuth =  new GoogleAuthProvider();

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
            freeRewritesLeft: 1,
            paidUser: false
          });
        }
      }
      window.location.href = router; 
    } catch (err) {
      //console.log(err);
    }
  };
  return (
    <Disclosure as="nav" className="border border-gray-500">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 ">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
  <Link className="hover:scale-105" href="/" passHref>
    <img
      className="block h-12 lg:h-12 w-auto lg:hidden"
      src="/mobile.png"
      alt="Resume Boost AI Web"
    />
  </Link>
  <Link className="hover:scale-105" href="/" passHref>
    <img
      className="hidden h-12 lg:h-16 w-auto lg:block lg:h-14" 
      src="/plai.png" 
      alt="Resume Boost AI - Mobile"
    />
  </Link>
</div>
<div className="hidden sm:ml-6 sm:block">
  <div className="flex items-center space-x-4 h-full">
    {navigation.map((item) => (
      <Link
        key={item.name}
        href={item.href}
        className={classNames(
          item.current ? 'text-black' : 'text-black hover:underline hover:text-black',
          'flex items-center justify-center rounded-md px-3 py-2 text-base lg:text-lg font-medium h-full' // Adjusted classes
        )}
        aria-current={item.current ? 'page' : undefined}
      >
        
        {item.name}
      </Link>
    ))}
  </div>
</div>

              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
       
       
        <div className="relative ml-3">
          <div>

      
          {user ? (
          <button type="button" className="w-full sm:inline-block text-gray-100 px-3 text-md font-medium border-solid border-2 border-white-400 rounded-full bg-transparent p-1 text-black hover:border-4 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate">
            
            <Link className="text-black rounded-md py-2 text-md font-medium" href="/" onClick={() => {logout()}}>Log Out</Link>

          </button>
           ): (
            <>

<button
    type="button"
   
    className="sm:inline-block text-black px-3 text-md font-medium border-solid border-4 border-white-400 rounded-full bg-transparent p-1 text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 overflow-hidden whitespace-nowrap truncate"
    onClick={loginWithGoogle}
>
            
           Sign Up 
              
          </button>
       {/*   <button type="button" className="border-solid border-2 border-white rounded-full bg-transparent p-1 text-gray-400 hover:border-4 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 ml-1">
            
        <Link  className="text-gray-100 rounded-md px-3 py-2 text-md font-black" href="/signup" passHref>Sign Up</Link>

        </button>
           */}
        </>
        )}
          </div>


         
        </div>
        
      </div>
                  </div>
                
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-black text-black' : 'text-black hover:bg-white hover:text-black',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}