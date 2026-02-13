import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { Providers } from './providers';
import { ToastProvider } from '../components/Toast';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap'
});

export const metadata = {
  metadataBase: new URL('https://whisk-image-generator-extension.vercel.app'),
  title: {
    default: 'Whisk Image Generator - One-Click Bulk Google Whisk AI automation',
    template: '%s | Whisk Image Generator'
  },
  description: 'The #1 Bulk AI Image Generator for Google Whisk. Automate your creative workflow, process thousands of product images in minutes, and auto-download instantly.',
  keywords: [
    'Whisk Image Generator',
    'Bulk AI Image Generator',
    'Google Whisk AI automation',
    'automated product photography',
    'Whisk Automator',
    'bulk AI image creation',
    'Google Whisk extension',
    'automated creative workflow'
  ],
  authors: [{ name: 'Whisk Team', url: 'https://whisk-image-generator-extension.vercel.app' }],
  creator: 'Whisk Team',
  publisher: 'Whisk Image Generator',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Whisk Image Generator - #1 Bulk Google Whisk AI Automator',
    description: 'Generate hundreds of professional product images with one click. The ultimate automation tool for Google Whisk.',
    url: 'https://whisk-image-generator-extension.vercel.app',
    siteName: 'Whisk Image Generator',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Whisk Image Generator - Bulk AI Product Photography',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Whisk Image Generator - One-Click Bulk AI Automation',
    description: 'Automate your creative workflow. Generate thousands of images for Google Whisk instantly.',
    creator: '@whisk_ai',
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
    google: 'your-google-verification-code',
  },
};

export const viewport = {
  themeColor: '#FFDD00',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Whisk Image Generator',
              applicationCategory: 'DesignApplication',
              operatingSystem: 'Chrome, Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              description: 'Automate your creative workflow with the #1 Bulk AI Image Generator for Google Whisk.',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                ratingCount: '150',
              },
              featureList: 'Batch Processing, Smart Templates, Auto-Download, History Tracking',
              screenshot: 'https://whisk-image-generator-extension.vercel.app/og-image.jpg',
              author: {
                '@type': 'Organization',
                name: 'Whisk Team',
                url: 'https://whisk-image-generator-extension.vercel.app',
              },
            }),
          }}
        />
        <Providers>
          <ToastProvider>
            <Navbar />
            <main className="main-wrapper min-h-screen">
              {children}
            </main>
            <Footer />
            <ScrollToTop />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
