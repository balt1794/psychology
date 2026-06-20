import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {Nunito} from  'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AuthContextProvider } from '@/context/AuthContext'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })
const nunito = Nunito({ subsets: ['latin'] })

const SITE_URL = 'https://propertylistingsai.com'

const siteStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'PropertyListingsAI',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/opengraph-image.png`,
      },
      sameAs: ['https://twitter.com/balt1794'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'PropertyListingsAI',
      url: SITE_URL,
      description:
        'Generate captivating real estate descriptions for your property listings instantly with AI to boost visibility, bookings and sales.',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-US',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#softwareapplication`,
      name: 'PropertyListingsAI',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires JavaScript. Any modern web browser.',
      url: SITE_URL,
      description:
        'Generate captivating real estate descriptions for your property listings instantly with AI to boost visibility, bookings and sales.',
      offers: {
        '@type': 'Offer',
        price: '9.99',
        priceCurrency: 'USD',
        description: 'Starter plan with 15 credits',
        url: `${SITE_URL}/pricing`,
      },
    },
  ],
}

export const metadata: Metadata = {
  alternates: {
    canonical: './', 
  },
  metadataBase: new URL('https://propertylistingsai.com'), 

    twitter: {
      card: 'summary_large_image',
      site: 'PropertyListingsAI.com',
      creator: '@balt1794',
      title: 'PropertyListingsAI - Real Estate Listing Description Generator',
      description: 'Generate captivating real estate descriptions for your property listings instantly with AI to boost visibility, bookings and sales.',
      images: ['https://propertylistingsai.com/featured.png'],  
    },
    openGraph: {
      images: ['https://propertylistingsai.com/opengraph-image.png'],  
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
      <Script
        id="schema-org-site"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteStructuredData) }}
      />
      <AuthContextProvider>
        <Navbar/>
        {children}
        {/* Footer hidden while the psychology app is in progress. */}
        {/* <Footer /> */}
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
