import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft, CalendarDays } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <div className="text-center mb-12">
        <CalendarDays className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-5xl font-bold mb-2 font-headline">Welcome to Date Bliss</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your one-stop solution for Bikram Sambat (BS) and Gregorian (AD) date conversions, enriched with holiday and event insights.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline">
              <ArrowRightLeft className="h-6 w-6 text-accent" />
              BS to AD Converter
            </CardTitle>
            <CardDescription>Convert Bikram Sambat dates to Gregorian dates and see relevant events.</CardDescription>
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
            <CardDescription>Convert Gregorian dates to Bikram Sambat dates and explore events.</CardDescription>
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
                    API Information
                </CardTitle>
                <CardDescription>Explore our API for Bikram Sambat calendar data.</CardDescription>
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
