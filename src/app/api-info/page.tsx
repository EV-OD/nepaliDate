import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Code, Info, Server, ExternalLink, Database, AlertCircle, Network, BookOpen, Pilcrow, ListTree, PlayCircle } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Nepali Calendar API Documentation | Date Bliss Bikram Sambat API",
  description: "Explore the Date Bliss API for Bikram Sambat (BS) calendar data, including date conversions, Nepali holidays, festivals, and auspicious dates. Detailed endpoint and data structure information for your application.",
  keywords: ["Nepali Calendar API", "Bikram Sambat API", "Date Bliss API", "Nepali Patro API", "API Documentation", "Nepal Date API", "BS Calendar Data", "Nepali event API"],
  openGraph: {
    title: "Date Bliss Nepali Calendar API: Documentation & Integration",
    description: "Access comprehensive Bikram Sambat (BS) calendar data via the Date Bliss API. Details on endpoints, data structures, and examples for integrating Nepali dates and events.",
    url: "/api-info",
    images: [
      {
        url: 'https://placehold.co/1200x630.png?text=Date+Bliss+API+Docs',
        width: 1200,
        height: 630,
        alt: 'Date Bliss API Documentation - Nepali Calendar and Bikram Sambat Data',
        'data-ai-hint': 'api documentation code',
      }
    ]
  },
  twitter: {
    title: "Date Bliss API Documentation: Integrate Nepali Calendar Data",
    description: "Full documentation for the Date Bliss Nepali Calendar API. Learn how to integrate BS date conversions, Nepali holidays, and event data into your applications.",
  },
};


async function getApiInfo() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'; 
  const res = await fetch(`${baseUrl}/api/calendar/info`, { cache: 'no-store' }); 
  if (!res.ok) {
    const errorText = await res.text();
    console.error("API Info Fetch Error:", res.status, errorText);
    throw new Error(`Failed to fetch API info. Status: ${res.status}. Response: ${errorText.substring(0,200)}...`);
  }
  try {
    return await res.json();
  } catch (e) {
    console.error("API Info JSON Parse Error:", e);
    const responseText = await res.text();
    console.error("Response text that failed to parse:", responseText.substring(0, 500));
    throw new Error(`Failed to parse API info JSON. Error: ${(e as Error).message}`);
  }
}

function JsonCodeBlock({ data, maxHeight = "20rem" }: { data: any, maxHeight?: string }) {
  return (
    <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto" style={{ maxHeight }}>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}

interface DataStructureField {
  name: string;
  type: string;
  in?: string; 
  required?: boolean; 
  description: string;
  fields?: DataStructureField[]; 
}

function DataStructureTable({ fields }: { fields: DataStructureField[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border text-xs">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-2 text-left font-semibold text-foreground">Field Name</th>
            <th className="px-3 py-2 text-left font-semibold text-foreground">Type</th>
            <th className="px-3 py-2 text-left font-semibold text-foreground">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-background">
          {fields.map((field, index) => (
            <React.Fragment key={index}>
              <tr>
                <td className="px-3 py-2 font-mono text-primary align-top">{field.name}</td>
                <td className="px-3 py-2 text-muted-foreground align-top whitespace-nowrap">{field.type}</td>
                <td className="px-3 py-2 text-foreground/80 align-top">{field.description}</td>
              </tr>
              {field.fields && field.fields.length > 0 && (
                <tr>
                  <td colSpan={3} className="py-0 pl-6 pr-2 bg-muted/30">
                    <div className="my-1.5">
                       <p className="text-xs font-semibold text-muted-foreground mb-1">Nested fields for <code className="text-primary">{field.name}</code>:</p>
                       <DataStructureTable fields={field.fields} />
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default async function ApiInfoPage() {
  let apiInfoData: any;
  let error = null;

  try {
    apiInfoData = await getApiInfo();
  } catch (e: any) {
    error = e.message;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-4xl mx-auto my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Fetching API Information</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (!apiInfoData) {
    return (
        <div className="flex justify-center items-center h-64">
            <Server className="h-8 w-8 animate-spin mr-2 text-primary" />
            <p className="text-lg text-muted-foreground">Loading API information...</p>
        </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-8 px-4">
      <header className="text-center pb-8 border-b border-border">
        <h1 className="text-5xl font-bold font-headline text-primary">{apiInfoData.apiName}</h1>
        <p className="text-xl text-muted-foreground mt-3 max-w-3xl mx-auto">{apiInfoData.description}</p>
        <div className="mt-6 flex justify-center items-center space-x-4">
            <Badge variant="secondary" className="text-sm px-3 py-1">Version: {apiInfoData.version}</Badge>
            <Badge variant={apiInfoData.status === "Operational" ? "default" : "destructive"} className={`text-sm px-3 py-1 ${apiInfoData.status === "Operational" ? "bg-green-600 text-white" : ""}`}>
                Status: {apiInfoData.status}
            </Badge>
        </div>
        {apiInfoData.contactEmail && <p className="text-sm text-muted-foreground mt-4">Contact: <a href={`mailto:${apiInfoData.contactEmail}`} className="text-primary hover:underline">{apiInfoData.contactEmail}</a></p>}
         <div className="mt-6">
            <Button asChild size="lg">
                <Link href="/api-playground" className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5" /> Go to API Playground
                </Link>
            </Button>
        </div>
      </header>

      <section id="endpoints">
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-headline">
              <Network className="h-7 w-7 text-accent" />
              Nepali Calendar API Endpoints
            </CardTitle>
            <CardDescription>Detailed information about each available API endpoint for accessing Bikram Sambat (BS) calendar data, Nepali holidays, and events.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {apiInfoData.endpoints.map((endpoint: any, index: number) => (
                <AccordionItem value={`item-${index}`} key={index} className="border-border">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3 w-full">
                      <Badge variant={endpoint.method === "GET" ? "secondary" : "default"} className="w-20 justify-center py-1">{endpoint.method}</Badge>
                      <span className="font-mono text-primary text-base flex-grow text-left">{endpoint.path}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-5 pl-2 pt-3 pb-4 bg-background/50 rounded-b-md">
                    <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                    {endpoint.parameters && endpoint.parameters.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-foreground">Parameters:</h4>
                        <ul className="list-none pl-2 space-y-2 text-xs">
                          {endpoint.parameters.map((param: any, pIndex: number) => (
                            <li key={pIndex} className="border-l-2 border-accent pl-3 py-1">
                              <code className="bg-muted p-1 rounded-sm text-primary font-semibold">{param.name}</code>
                              <span className="text-muted-foreground ml-1">({param.type}, in {param.in})</span>: {param.description} {param.required && <span className="text-destructive font-medium ml-1">(required)</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-foreground">Example Request:</h4>
                      <code className="text-xs bg-muted p-2 rounded-md block overflow-x-auto">{endpoint.exampleRequest}</code>
                    </div>
                    {endpoint.exampleResponse && (
                       <div>
                          <h4 className="font-semibold text-sm mb-2 text-foreground">Example Response:</h4>
                          {typeof endpoint.exampleResponse === 'string' ? (
                              <p className="text-xs bg-muted p-2 rounded-md">{endpoint.exampleResponse}</p>
                          ) : (
                              <JsonCodeBlock data={endpoint.exampleResponse} />
                          )}
                       </div>
                      )}
                      {endpoint.exampleResponseSummary && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-foreground">Example Response Summary:</h4>
                          <p className="text-xs bg-muted p-2 rounded-md">{endpoint.exampleResponseSummary}</p>
                        </div>
                      )}
                      {endpoint.detailedFieldDescriptionsUrl && (
                        <p className="text-xs text-muted-foreground">
                            For detailed field descriptions, see the <a href={endpoint.detailedFieldDescriptionsUrl} className="text-primary hover:underline">Data Structures section</a>.
                        </p>
                      )}
                      {endpoint.errorResponses && endpoint.errorResponses.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mt-3 mb-2 text-foreground">Possible Error Responses:</h4>
                          <ul className="list-none pl-2 space-y-1.5 text-xs">
                            {endpoint.errorResponses.map((err: any, eIndex: number) => (
                              <li key={eIndex} className="flex items-center">
                                <Badge variant="destructive" className="mr-2 py-0.5 px-1.5">{err.statusCode}</Badge> <span className="text-foreground/90">{err.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>
      
      <section id="data-structures">
        <Card className="shadow-lg border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-headline">
              <ListTree className="h-7 w-7 text-accent" />
              API Data Structures (BS Calendar)
            </CardTitle>
            <CardDescription>Explanation of the JSON data structures, such as `BsMonthData` and `BsDayData`, returned by the Bikram Sambat Calendar API.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {apiInfoData.dataStructures && Object.entries(apiInfoData.dataStructures).map(([key, structure]: [string, any]) => (
              <div key={key}>
                <h3 className="text-lg font-semibold text-primary mb-1.5 font-mono">{key}</h3>
                <p className="text-sm text-muted-foreground mb-3">{structure.description}</p>
                <DataStructureTable fields={structure.fields} />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section id="data-coverage">
        <Card className="shadow-lg border-muted/50">
          <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-headline">
                  <Database className="h-7 w-7 text-accent"/>
                  Data Coverage & Notes (Nepali Patro)
              </CardTitle>
              <CardDescription>Information about the Bikram Sambat data coverage for our Nepali Patro API, including available years and data sourcing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
              <div>
                  <h3 className="text-lg font-semibold mb-1.5 text-foreground">Available Bikram Sambat Years in Data:</h3>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">{apiInfoData.dataCoverage.bsYears}</p>
              </div>
              <Alert variant="default" className="bg-secondary/30 border-secondary">
                  <Info className="h-5 w-5 text-primary" />
                  <AlertTitle className="font-semibold text-foreground">Data Source & Accuracy</AlertTitle>
                  <AlertDescription className="text-foreground/80">
                  {apiInfoData.dataCoverage.note}
                  </AlertDescription>
              </Alert>
              {apiInfoData.notes && apiInfoData.notes.length > 0 && (
                  <div>
                      <h3 className="text-lg font-semibold mt-5 mb-2.5 text-foreground">Important Notes for API Users:</h3>
                      <ul className="list-disc space-y-2.5 pl-5 text-sm text-muted-foreground">
                          {apiInfoData.notes.map((note: string, index: number) => (
                          <li key={index}>{note}</li>
                          ))}
                      </ul>
                  </div>
              )}
          </CardContent>
          <CardFooter>
              <p className="text-xs text-muted-foreground">
                  Nepali Calendar API Documentation last updated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}.
              </p>
          </CardFooter>
        </Card>
      </section>

    </div>
  );
}
