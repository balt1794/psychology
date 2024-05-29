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
            freeRewritesLeft: 0,
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
    <Disclosure as="nav" className="border border-[#00000078]">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-8xl px-2 sm:px-6 lg:px-8 ">
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
  <Link className="" href="/" passHref>
    

  </Link>
  <Link className=" text-black font-bold text-sm lg:text-xl mr-4 lg:mr-0" href="/" passHref>

    PropertyListingsAI
    
  </Link>
  <Link className=" text-black font-bold text-xl hidden lg:block" href="/" passHref>
  <svg className="ml-1 mb-1" width="30px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 21.0001V15.0001H10V21.0001M19 9.77818V16.2001C19 17.8802 19 18.7203 18.673 19.362C18.3854 19.9265 17.9265 20.3855 17.362 20.6731C16.7202 21.0001 15.8802 21.0001 14.2 21.0001H9.8C8.11984 21.0001 7.27976 21.0001 6.63803 20.6731C6.07354 20.3855 5.6146 19.9265 5.32698 19.362C5 18.7203 5 17.8802 5 16.2001V9.77753M21 12.0001L15.5668 5.96405C14.3311 4.59129 13.7133 3.9049 12.9856 3.65151C12.3466 3.42894 11.651 3.42899 11.0119 3.65165C10.2843 3.90516 9.66661 4.59163 8.43114 5.96458L3 12.0001" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
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