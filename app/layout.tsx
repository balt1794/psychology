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
  alternates: {
    canonical: './', 
  },
  metadataBase: new URL('https://propertylistingsai.com'), 

    twitter: {
      card: 'summary_large_image',
      site: 'PropertyListingsAI.com',
      creator: '@balt1794',
      title: 'PropertyListingsAI - AI Real Estate Listing Generator',
      description: 'Generate perfect, optimized AI real estate listings instantly to boost visibility and bookings.',
      images: ['https://propertylistingsai.com/featured-new.png'],  
    },
    openGraph: {
      images: ['https://propertylistingsai.com/opengraph-image-new.png'],  
    },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    <html lang="en">
      <body className={inter.className}>
      <AuthContextProvider>
        <Navbar/>
        {children}
        </AuthContextProvider>
      </body>
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
      
    </html>
   
    </>
  )
}
