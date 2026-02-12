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
  title: 'Whisk Image Generator - AI-Powered Batch Image Creation',
  description: 'Automate your creative workflow with AI-powered image generation. Process thousands of images in minutes with smart templates and batch processing.',
  keywords: ['AI image generation', 'batch processing', 'Whisk', 'automated workflow', 'product photography'],
  authors: [{ name: 'Whisk Team' }],
  openGraph: {
    title: 'Whisk Image Generator',
    description: 'Automate your creative workflow with AI-powered batch image generation',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
