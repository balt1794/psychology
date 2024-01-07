import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {Nunito} from  'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { AuthContextProvider } from '@/context/AuthContext'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })
const nunito = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Property Listings AI',
  description: 'Generated Real State Listings using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
   <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-FQHMWF7HC9"/>
<Script
  id='google-analytics'
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
__html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-FQHMWF7HC9', {
  page_path: window.location.pathname,
 });
`,
}}
 />

<Script
  id="adsbygoogle-init"
  strategy="afterInteractive"
  crossOrigin="anonymous"
  src= "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4734978183379672"
/>
    <html lang="en">
   
      <body className={inter.className}>
      <AuthContextProvider>
        <Navbar/>
        {children}
        </AuthContextProvider></body>
      
    </html>
   
    </>
  )
}
