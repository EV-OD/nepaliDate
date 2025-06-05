
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Mail, Send, Info, FileText, ShieldCheck, UserCircle } from "lucide-react";
import type { Metadata } from 'next';
import Link from "next/link";

export const metadata: Metadata = {
  title: "Request NepaliDate API Key | Bikram Sambat Calendar API Access",
  description: "Learn how to request an API key for the NepaliDate Bikram Sambat Calendar API. Integrate Nepali dates, holidays, and events into your applications.",
  keywords: ["get api key", "Nepali calendar api key", "request api key", "Bikram Sambat api access", "NepaliDate API key", "Nepal date API key"],
  openGraph: {
    title: "How to Get Your NepaliDate API Key for Calendar Data",
    description: "Step-by-step instructions to request an API key for NepaliDate's comprehensive Bikram Sambat calendar data service.",
    url: "/get-api-key",
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=Get+NepaliDate+API+Key',
        width: 1200,
        height: 630,
        alt: 'Requesting an API Key for NepaliDate',
        'data-ai-hint': 'api key request guide',
      }
    ]
  },
  twitter: {
    title: "NepaliDate API Key Request Guide",
    description: "Follow these steps to get your API key for accessing Nepali calendar data through the NepaliDate API.",
  },
};

const API_CONTACT_EMAIL = "contact@sevenx.com.np";
const API_EMAIL_SUBJECT = "API Key Request for NepaliDate";

export default function GetApiKeyPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <Mail className="mx-auto h-12 w-12 text-primary mb-3" />
          <CardTitle className="text-4xl font-headline">Request Your NepaliDate API Key</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-2">
            Unlock access to our comprehensive Bikram Sambat calendar data by requesting your personal API key.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 pt-2">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 font-headline text-primary">
              <Send className="h-6 w-6" /> How to Request an API Key
            </h2>
            <p className="text-muted-foreground mb-6">
              To obtain an API key for the NepaliDate service, please send an email to our support team with the following details. This helps us understand your needs and provide the best service.
            </p>
            <div className="space-y-5">
              <div className="p-4 border rounded-lg bg-background shadow-sm">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-1">
                  <Info className="h-5 w-5 text-accent" />
                  Step 1: Compose Your Email
                </h3>
                <p className="text-sm text-muted-foreground">
                  Open your preferred email client and start a new message.
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-background shadow-sm">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-1">
                  <Mail className="h-5 w-5 text-accent" />
                  Step 2: Recipient & Subject
                </h3>
                <p className="text-sm text-muted-foreground">
                  Address the email to: <strong className="text-primary">{API_CONTACT_EMAIL}</strong>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Use the subject line: <strong className="text-primary">{API_EMAIL_SUBJECT}</strong>
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-background shadow-sm">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-1">
                  <FileText className="h-5 w-5 text-accent" />
                  Step 3: Provide Required Information
                </h3>
                <p className="text-sm text-muted-foreground mb-2">Please include the following in the body of your email:</p>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground pl-2">
                  <li><strong className="text-foreground">Your Name / Company Name:</strong> For identification.</li>
                  <li><strong className="text-foreground">Contact Email:</strong> Where we should send the API key and updates.</li>
                  <li><strong className="text-foreground">Intended Use Case:</strong> Briefly describe how you plan to use the API (e.g., personal project, commercial application, research).</li>
                  <li><strong className="text-foreground">Application/Website URL (if applicable):</strong> Where the API will be integrated.</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2 font-headline text-primary">
              <ShieldCheck className="h-6 w-6" /> What to Expect
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
              <li>We aim to review API key requests and respond within <strong className="text-foreground">2-3 business days</strong>.</li>
              <li>Once approved, your unique API key and any relevant usage instructions will be sent to the contact email you provided.</li>
              <li>Please ensure our emails are not going to your spam folder.</li>
            </ul>
          </section>
          
          <div className="text-center pt-4">
            <Button asChild size="lg" className="min-w-[200px]">
              <a href={`mailto:${API_CONTACT_EMAIL}?subject=${encodeURIComponent(API_EMAIL_SUBJECT)}`} className="flex items-center gap-2">
                <Send className="h-5 w-5" /> Request API Key Now
              </a>
            </Button>
          </div>
        </CardContent>
         <CardFooter className="flex-col items-start text-xs text-muted-foreground pt-6 border-t">
            <p className="mb-1">
              If you have any questions about the API or the request process, feel free to include them in your email or contact us separately.
            </p>
            <p>
              Looking for technical details? Visit the <Link href="/api-info" className="text-primary hover:underline">API Documentation page</Link>.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
