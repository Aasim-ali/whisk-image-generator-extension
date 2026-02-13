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
    default: 'Whisk Automator - One-Click Bulk Google Whisk AI Image Generator',
    template: '%s | Whisk Automator'
  },
  description: 'The #1 professional bulk AI image generator for Google Whisk. Automate your creative workflow, generate thousands of professional product images instantly, and boost your e-commerce efficiency.',
  keywords: [
    'Whisk Image Generator',
    'Bulk AI Image Generator',
    'Google Whisk AI automation',
    'automated product photography',
    'Whisk Automator',
    'bulk AI image creation',
    'Google Whisk extension',
    'automated creative workflow',
    'AI image batch processing',
    'e-commerce image automation'
  ],
  authors: [{ name: 'Whisk Team', url: 'https://whisk-image-generator-extension.vercel.app' }],
  creator: 'Whisk Team',
  publisher: 'Whisk Automator',
  alternates: {
    canonical: '/',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Whisk Automator - #1 Bulk Google Whisk AI Automator',
    description: 'Generate hundreds of professional product images with one click. The ultimate automation tool for Google Whisk specialists.',
    url: 'https://whisk-image-generator-extension.vercel.app',
    siteName: 'Whisk Automator',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Whisk Automator - Bulk AI Product Photography Automation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Whisk Automator - One-Click Bulk AI Automation',
    description: 'Automate your creative workflow. Generate thousands of high-quality images for Google Whisk instantly.',
    creator: '@whisk_ai',
    images: ['/og-image.jpg'],
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
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Whisk Automator',
      url: 'https://whisk-image-generator-extension.vercel.app',
      logo: 'https://whisk-image-generator-extension.vercel.app/favicon.ico',
      sameAs: [
        'https://twitter.com/whisk_ai',
        'https://github.com/whisk-team'
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Whisk Automator',
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Chrome, Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description: 'Automate your creative workflow with the #1 Bulk AI Image Generator extension for Google Whisk.',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '150',
      },
      featureList: 'Batch Processing, Smart Templates, Live Monitoring, Auto-Download',
      screenshot: 'https://whisk-image-generator-extension.vercel.app/og-image.jpg',
      author: {
        '@type': 'Organization',
        name: 'Whisk Team',
      },
    }
  ];

  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
