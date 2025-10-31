import type { Metadata } from 'next'
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Header } from '@/components/navigation/header'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'NATI - Native Art and Textile India',
    template: '%s | NATI',
  },
  description:
    'Reviving Indian folk art through natural fabrics and classical textile techniques. Sustainable fashion meets cultural heritage.',
  keywords: [
    'Indian folk art',
    'sustainable fashion',
    'natural fabrics',
    'hemp clothing',
    'Kalamkari',
    'handloom',
    'artisan fashion',
    'ethical fashion India',
  ],
  authors: [{ name: 'NATI Commerce' }],
  creator: 'NATI Commerce',
  publisher: 'NATI Commerce',
  metadataBase: new URL('https://nati.com'), // Replace with your actual domain
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://nati.com',
    title: 'NATI - Native Art and Textile India',
    description:
      'Reviving Indian folk art through natural fabrics and classical textile techniques.',
    siteName: 'NATI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NATI - Native Art and Textile India',
    description:
      'Reviving Indian folk art through natural fabrics and classical textile techniques.',
    creator: '@nati_india', // Replace with actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add after Google Search Console setup
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}
      >
        <body className={inter.className}>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
