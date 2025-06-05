import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';

const APP_NAME = "Date Bliss";
const APP_DEFAULT_TITLE = "Date Bliss - BS to AD & AD to BS Nepali Calendar Converter";
const APP_TITLE_TEMPLATE = "%s | Date Bliss";
const APP_DESCRIPTION = "Convert Bikram Sambat (BS) dates to Gregorian (AD) and vice-versa. Get holiday and event information for BS months, plus API access.";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  keywords: ['Nepali Calendar', 'Bikram Sambat', 'BS to AD', 'AD to BS', 'Nepali Date Converter', 'Nepali Patro', 'Nepal Calendar API', 'Date Bliss'],
  manifest: "/manifest.json", // Assuming you might add a manifest later
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    locale: 'en_US',
    url: APP_URL,
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=Date+Bliss', // Replace with your actual OG image
        width: 1200,
        height: 630,
        alt: 'Date Bliss - Nepali Calendar Converter and API',
        type: 'image/png',
        'data-ai-hint': 'calendar date conversion logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=Date+Bliss', // Replace with your actual Twitter image
        alt: 'Date Bliss - Nepali Calendar Converter and API',
        'data-ai-hint': 'calendar date conversion social',
      }
    ],
  },
  robots: { // Basic robots configuration
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
};

export const viewport: Viewport = {
  themeColor: '#A7D1AB', // From your globals.css --primary (Light blue)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <AppFooter />
        <Toaster />
      </body>
    </html>
  );
}
