
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Code, Info, Server, ExternalLink, Database, AlertCircle } from "lucide-react";

async function getApiInfo() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
  const res = await fetch(`${baseUrl}/api/data/info`, { cache: 'no-store' });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("API Info Fetch Error:", res.status, errorText);
    throw new Error(`Failed to fetch API info. Status: ${res.status}. ${errorText.substring(0,100)}`);
  }
  try {
    return await res.json();
  } catch (e) {
    console.error("API Info JSON Parse Error:", e);
    throw new Error("Failed to parse API info JSON.");
  }
}

function JsonCodeBlock({ data }: { data: any }) {
  return (
    <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto max-h-80">
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}

export default async function ApiInfoPage() {
  let apiInfoData;
  let error = null;

  try {
    apiInfoData = await getApiInfo();
  } catch (e: any) {
    error = e.message;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-4xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Fetching API Information</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (!apiInfoData) {
    return (
        <div className="flex justify-center items-center h-64">
            <Server className="h-8 w-8 animate-spin mr-2" />
            <p className="text-lg text-muted-foreground">Loading API information...</p>
        </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      <header className="text-center py-8">
        <h1 className="text-5xl font-bold font-headline text-primary">{apiInfoData.apiName}</h1>
        <p className="text-xl text-muted-foreground mt-2">{apiInfoData.description}</p>
        <div className="mt-4 flex justify-center items-center space-x-4">
            <Badge variant="secondary">Version: {apiInfoData.version}</Badge>
            <Badge variant={apiInfoData.status === "Operational" ? "default" : "destructive"} className={apiInfoData.status === "Operational" ? "bg-green-500 text-white" : ""}>
                Status: {apiInfoData.status}
            </Badge>
        </div>
        {apiInfoData.contactEmail && <p className="text-sm text-muted-foreground mt-3">Contact: <a href={`mailto:${apiInfoData.contactEmail}`} className="text-primary hover:underline">{apiInfoData.contactEmail}</a></p>}
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-headline">
            <Server className="h-6 w-6 text-accent" />
            API Endpoints
          </CardTitle>
          <CardDescription>Detailed information about each available API endpoint.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {apiInfoData.endpoints.map((endpoint: any, index: number) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Badge variant={endpoint.method === "GET" ? "secondary" : "default"} className="w-20 justify-center">{endpoint.method}</Badge>
                    <span className="font-mono text-primary text-base">{endpoint.path}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pl-2 pt-3">
                  <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                  {endpoint.parameters && endpoint.parameters.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Parameters:</h4>
                      <ul className="list-disc list-inside pl-2 space-y-1 text-xs">
                        {endpoint.parameters.map((param: any, pIndex: number) => (
                          <li key={pIndex}>
                            <code className="bg-muted p-0.5 rounded-sm text-primary">{param.name}</code> ({param.type}, {param.in}): {param.description} {param.required && <span className="text-destructive font-medium">(required)</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Example Request:</h4>
                    <code className="text-xs bg-muted p-2 rounded-md block overflow-x-auto">{endpoint.exampleRequest}</code>
                  </div>
                   {endpoint.exampleResponse && (
                     <div>
                        <h4 className="font-semibold text-sm mb-1">Example Response:</h4>
                        {typeof endpoint.exampleResponse === 'string' ? (
                            <p className="text-xs bg-muted p-2 rounded-md">{endpoint.exampleResponse}</p>
                        ) : (
                            <JsonCodeBlock data={endpoint.exampleResponse} />
                        )}
                     </div>
                    )}
                    {endpoint.errorResponses && endpoint.errorResponses.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Possible Error Responses:</h4>
                        <ul className="list-disc list-inside pl-2 space-y-1 text-xs">
                          {endpoint.errorResponses.map((err: any, eIndex: number) => (
                            <li key={eIndex}>
                              <Badge variant="destructive" className="mr-1.5">{err.statusCode}</Badge> {err.description}
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
      
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                <Database className="h-6 w-6 text-accent"/>
                Data Coverage & Notes
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold mb-1">Available BS Years in Data:</h3>
                <p className="text-sm text-muted-foreground">{apiInfoData.dataCoverage.bsYears}</p>
            </div>
             <Alert variant="default" className="bg-secondary/30">
                <Info className="h-4 w-4 text-primary" />
                <AlertTitle>Data Source & Accuracy</AlertTitle>
                <AlertDescription>
                {apiInfoData.dataCoverage.note}
                </AlertDescription>
            </Alert>
            {apiInfoData.notes && apiInfoData.notes.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mt-4 mb-2">Important Notes:</h3>
                    <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                        {apiInfoData.notes.map((note: string, index: number) => (
                        <li key={index}>{note}</li>
                        ))}
                    </ul>
                </div>
            )}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">
                API Documentation last updated: {new Date().toLocaleDateString()}.
            </p>
        </CardFooter>
      </Card>

    </div>
  );
}
