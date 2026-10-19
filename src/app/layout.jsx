
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import {
  GoogleAnalytics,
  GoogleTagManagerBody,
  GoogleTagManagerHead,
} from '@/components/analytics/GoogleTagManager';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap'
});

export const metadata = {
  title: {
    default: 'Karmayogi Academy Nashik | Top MPSC Coaching Classes',
    template: '%s | Karmayogi Academy Nashik'
  },
  description:
  "Maharashtra's Premier MPSC Coaching Institute in Nashik. Learn from experienced post-holder faculty who cleared the very exams they teach. 52-week structured preparation system.",
  keywords: [
  'MPSC coaching Nashik',
  'MPSC classes Nashik',
  'PSI coaching Nashik',
  'Rajyaseva classes Nashik',
  'Talathi coaching',
  'ASO coaching Nashik',
  'Karmayogi Academy',
  'MPSC preparation'],

  authors: [{ name: 'Karmayogi Academy Nashik' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://karmayogiacademy.com',
    siteName: 'Karmayogi Academy Nashik',
    title: 'Karmayogi Academy Nashik | Top MPSC Coaching Classes',
    description:
    "Maharashtra's Premier MPSC Coaching Institute in Nashik. Expert post-holder faculty. Proven 52-week preparation system."
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://karmayogiacademy.com'
  ),
  alternates: {
    canonical: '/',
  }
};

export default function RootLayout({
  children


}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <GoogleTagManagerHead />
        <GoogleAnalytics />
        <GoogleTagManagerBody />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0B1B41',
              color: '#fff',
              fontSize: '0.9rem',
              borderRadius: '0.5rem'
            },
            success: {
              iconTheme: { primary: '#F5B51B', secondary: '#0B1B41' }
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' }
            }
          }} />
        
      </body>
    </html>);

}