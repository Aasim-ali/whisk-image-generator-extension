import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Whisk Image Generator',
  description: 'AI-Powered Image Generation Bot',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <div className="main-wrapper">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
