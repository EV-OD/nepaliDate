import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

async function getApiInfo() {
  // In a real app, this would be an absolute URL if calling from client-side or different domain.
  // For server components, can call directly or use relative path if on same deployment.
  // For simplicity, constructing a base URL.
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
  const res = await fetch(`${baseUrl}/api/data/info`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch API info');
  }
  return res.json();
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
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Could not load API Information: {error}</AlertDescription>
      </Alert>
    );
  }
  
  if (!apiInfoData) {
    return <p>Loading API information...</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold font-headline text-center">Date Bliss API Documentation</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{apiInfoData.message}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{apiInfoData.dataStructureNote}</p>
          <div>
            <h3 className="text-xl font-semibold mb-2 font-headline">Available Endpoints:</h3>
            <ul className="space-y-3">
              {apiInfoData.endpoints.map((endpoint: any, index: number) => (
                <li key={index} className="p-3 border rounded-md bg-secondary/30">
                  <p className="font-mono text-sm font-semibold text-primary">{endpoint.method} {endpoint.path}</p>
                  <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                  {endpoint.example && (
                    <p className="text-xs mt-1">Example: <code className="bg-muted p-1 rounded-sm">{endpoint.example}</code></p>
                  )}
                </li>
              ))}
            </ul>
          </div>
           <div>
            <h3 className="text-xl font-semibold mb-2 font-headline">Available BS Years in Mock Data:</h3>
            <p className="text-sm text-muted-foreground">{apiInfoData.availableYears.join(', ')}</p>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Note on Mock Data</AlertTitle>
        <AlertDescription>
          The current API serves mock data for illustrative purposes. The available BS years are limited.
          In a production environment, this API would connect to a comprehensive and accurate calendar database.
        </AlertDescription>
      </Alert>
    </div>
  );
}
