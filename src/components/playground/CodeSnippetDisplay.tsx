
'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, CodeXml } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeSnippetDisplayProps {
  requestUrl: string;
  apiKey: string;
}

const CodeSnippetDisplay: React.FC<CodeSnippetDisplayProps> = ({ requestUrl, apiKey }) => {
  const { toast } = useToast();

  const snippets = {
    javascript: `
fetch('${requestUrl}', {
  method: 'GET',
  headers: {
    'X-API-Key': '${apiKey || 'YOUR_API_KEY'}'
  }
})
.then(response => {
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  return response.json();
})
.then(data => console.log(data))
.catch(error => console.error('Error fetching data:', error));
    `.trim(),
    python: `
import requests

url = '${requestUrl}'
headers = {
    'X-API-Key': '${apiKey || 'YOUR_API_KEY'}'
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    data = response.json()
    print(data)
else:
    print(f"Error: {response.status_code}")
    print(response.text)
    `.trim(),
    nodejs: `
// Using axios (npm install axios)
const axios = require('axios');

const url = '${requestUrl}';
const apiKey = '${apiKey || 'YOUR_API_KEY'}';

axios.get(url, {
  headers: {
    'X-API-Key': apiKey
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  if (error.response) {
    console.error('Error fetching data:', error.response.status, error.response.data);
  } else if (error.request) {
    console.error('Error fetching data: No response received', error.request);
  } else {
    console.error('Error fetching data:', error.message);
  }
});
    `.trim(),
  };

  const handleCopy = async (text: string, lang: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied!", description: `${lang} code snippet copied to clipboard.` });
    } catch (err) {
      toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy to clipboard." });
      console.error('Failed to copy text: ', err);
    }
  };
  
  if (!requestUrl) {
    return (
        <Card className="mt-6 shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center gap-2">
                    <CodeXml className="h-6 w-6 text-primary" /> Code Snippets
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Select an endpoint and parameters to generate code snippets.</p>
            </CardContent>
        </Card>
    );
  }


  return (
    <Card className="mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center gap-2">
            <CodeXml className="h-6 w-6 text-primary" /> Code Snippets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="javascript" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-3">
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="nodejs">Node.js</TabsTrigger>
          </TabsList>
          {Object.entries(snippets).map(([lang, code]) => (
            <TabsContent key={lang} value={lang}>
              <div className="relative bg-muted p-3 rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => handleCopy(code, lang.charAt(0).toUpperCase() + lang.slice(1))}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy {lang} code</span>
                </Button>
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-all">
                  <code>{code}</code>
                </pre>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeSnippetDisplay;

