import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft, CalendarDays, ServerIcon } from "lucide-react";
import Link from "next/link";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "BS to AD Converter & Nepali Calendar API | NepaliDate",
  description: "Welcome to NepaliDate, your primary resource for BS to AD and AD to BS date conversions. Explore our Nepali calendar for holidays, events, and utilize our powerful Bikram Sambat API.",
  keywords: ["BS to AD converter", "AD to BS converter", "Nepali Calendar", "Bikram Sambat", "Nepali Date Converter", "NepaliDate Home", "Nepali Patro", "Nepali holidays", "Calendar API Nepal"],
  openGraph: {
    title: "NepaliDate: BS to AD Converter, Nepali Calendar & Events API",
    description: "Easily convert Bikram Sambat (BS) to Gregorian (AD) dates. NepaliDate also offers detailed Nepali calendar event information and a robust API for developers.",
    url: "/",
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=NepaliDate+Home',
        width: 1200,
        height: 630,
        alt: 'NepaliDate Homepage - BS to AD converter and Nepali Calendar tool.',
        'data-ai-hint': 'calendar conversion homepage',
      }
    ]
  },
  twitter: {
    title: "NepaliDate | BS to AD Converter, AD to BS, Nepali Events & API",
    description: "Seamlessly convert Nepali dates (BS to AD, AD to BS), find Nepali holidays, and access our Bikram Sambat API with NepaliDate.",
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <div className="text-center mb-12">
        <CalendarDays className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-5xl font-bold mb-2 font-headline">Welcome to NepaliDate</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your one-stop solution for Bikram Sambat (BS) and Gregorian (AD) date conversions, enriched with holiday and event insights for the Nepali calendar. Use our BS to AD converter, AD to BS converter, or explore the Nepali Calendar API.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline">
              <ArrowRightLeft className="h-6 w-6 text-accent" />
              BS to AD Converter
            </CardTitle>
            <CardDescription>Convert Bikram Sambat (BS) dates to Gregorian (AD) dates and see relevant Nepali calendar events using our accurate converter.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/bs-to-ad" passHref>
              <Button className="w-full" size="lg">Go to BS to AD Converter</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline">
              <ArrowRightLeft className="h-6 w-6 text-accent" />
              AD to BS Converter
            </CardTitle>
            <CardDescription>Convert Gregorian (AD) dates to Bikram Sambat (BS) dates and explore Nepali Patro events with our reliable tool.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/ad-to-bs" passHref>
              <Button className="w-full" size="lg">Go to AD to BS Converter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
       <div className="mt-12 w-full max-w-4xl">
         <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                    <ServerIcon className="h-6 w-6 text-accent" />
                    Nepali Calendar API
                </CardTitle>
                <CardDescription>Explore our comprehensive API for Bikram Sambat calendar data, including Nepali holidays, festivals, and events. Perfect for developers.</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/api-info" passHref>
                    <Button variant="outline" className="w-full" size="lg">View API Details</Button>
                </Link>
            </CardContent>
         </Card>
       </div>
    </div>
  );
}
