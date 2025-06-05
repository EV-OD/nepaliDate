import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';

const APP_NAME = "NepaliDate";
const APP_DEFAULT_TITLE = "NepaliDate: Nepali Calendar BS to AD Converter & API";
const APP_TITLE_TEMPLATE = "%s | NepaliDate - Nepali Calendar Tools";
const APP_DESCRIPTION = "Your ultimate Nepali calendar tool: Convert Bikram Sambat (BS) to Gregorian (AD) dates and vice-versa. Access Nepali holidays, events, and a comprehensive BS calendar API with NepaliDate.";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  keywords: ['BS to AD converter', 'AD to BS converter', 'Nepali Calendar', 'Bikram Sambat', 'Nepali Date Converter', 'Nepali Patro', 'Nepal Calendar API', 'NepaliDate', 'Nepali holidays', 'date conversion Nepal'],
  manifest: "/manifest.json",
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
        url: 'https://placehold.co/1200x630.png?text=NepaliDate+Calendar',
        width: 1200,
        height: 630,
        alt: 'NepaliDate - Your Nepali Calendar BS to AD Converter and API',
        type: 'image/png',
        'data-ai-hint': 'nepali calendar logo',
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
        url: 'https://placehold.co/1200x630.png?text=NepaliDate+Social',
        alt: 'NepaliDate - Nepali Calendar Converter, Events, and API for Social Sharing',
        'data-ai-hint': 'calendar social media',
      }
    ],
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
};

export const viewport: Viewport = {
  themeColor: '#A7D1AB', 
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
