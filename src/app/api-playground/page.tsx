'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CLIENT_SIDE_BS_YEARS, NEPALI_MONTHS } from '@/types';
import { Code, Info, Loader2, PlayCircle, ExternalLink, TestTube2 } from 'lucide-react';


const defaultBsYear = CLIENT_SIDE_BS_YEARS.includes(new Date().getFullYear() + 56) 
  ? new Date().getFullYear() + 56 
  : CLIENT_SIDE_BS_YEARS[CLIENT_SIDE_BS_YEARS.length - 1] || 2080;

const formSchema = z.object({
  year: z.number({ required_error: "Please select a year." }).min(CLIENT_SIDE_BS_YEARS[0]).max(CLIENT_SIDE_BS_YEARS[CLIENT_SIDE_BS_YEARS.length - 1]),
  month: z.number({ required_error: "Please select a month." }).min(1).max(12),
});

function JsonCodeBlock({ data, maxHeight = "30rem" }: { data: any, maxHeight?: string }) {
  if (data === null || data === undefined) return null;
  return (
    <pre className="bg-muted p-3 rounded-md text-xs overflow-auto" style={{ maxHeight }}>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}

export default function ApiPlaygroundPage() {
  const [isPending, startTransition] = useTransition();
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [requestUrl, setRequestUrl] = useState<string>('');

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: defaultBsYear,
      month: 1,
    },
  });

  const watchedYear = form.watch('year');
  const watchedMonth = form.watch('month');

  React.useEffect(() => {
    if (watchedYear && watchedMonth) {
      if (typeof window !== 'undefined') {
        const baseUrl = window.location.origin;
        setRequestUrl(`${baseUrl}/api/calendar/${watchedYear}/${watchedMonth}`);
      }
    } else {
      setRequestUrl('');
    }
  }, [watchedYear, watchedMonth]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setApiResponse(null);
    setError(null);
    setStatusCode(null);

    if (!requestUrl) {
        toast({ variant: "destructive", title: "Error", description: "Could not construct request URL." });
        return;
    }

    startTransition(async () => {
      try {
        const res = await fetch(requestUrl);
        setStatusCode(res.status);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || `Request failed with status ${res.status}`);
          setApiResponse(data); 
          toast({ variant: "destructive", title: `Error: ${res.status}`, description: data.error || "API request failed" });
        } else {
          setApiResponse(data);
          toast({ title: "Success", description: "API request successful." });
        }
      } catch (e) {
        const errMessage = e instanceof Error ? e.message : "An unknown error occurred during fetch.";
        setError(errMessage);
        setStatusCode(null); 
        toast({ variant: "destructive", title: "Fetch Error", description: errMessage });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline flex items-center gap-2">
            <TestTube2 className="h-8 w-8 text-primary" /> Nepali Calendar API Playground
          </CardTitle>
          <CardDescription>
            Test the Date Bliss <code className="bg-muted px-1 py-0.5 rounded-sm text-primary">/api/calendar/[YYYY]/[MM]</code> endpoint to fetch Bikram Sambat (BS) month data. 
            View the full <Link href="/api-info" className="text-primary hover:underline">Nepali Calendar API documentation here</Link>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bikram Sambat Year (YYYY)</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select BS Year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CLIENT_SIDE_BS_YEARS.map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bikram Sambat Month (MM)</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select BS Month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {NEPALI_MONTHS.map((month, index) => (
                            <SelectItem key={index} value={(index + 1).toString()}>{month} ({index + 1})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {requestUrl && (
                <div className="space-y-1.5">
                  <FormLabel>Request URL for Nepali Calendar API:</FormLabel>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-muted p-2 rounded-md block overflow-x-auto flex-grow break-all">{requestUrl}</code>
                    <Button variant="outline" size="sm" asChild>
                        <a href={requestUrl} target="_blank" rel="noopener noreferrer">
                            Open <ExternalLink className="ml-1.5 h-3.5 w-3.5"/>
                        </a>
                    </Button>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isPending || !requestUrl}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                Send API Request
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(apiResponse || error || statusCode) && (
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-headline flex items-center gap-2">
              <Code className="h-6 w-6 text-primary" /> Bikram Sambat API Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusCode && (
              <p className="mb-2 text-sm">
                <strong>Status:</strong> 
                <span className={`ml-1.5 font-semibold ${statusCode >= 200 && statusCode < 300 ? 'text-green-600' : 'text-red-600'}`}>
                  {statusCode}
                </span>
              </p>
            )}
            {error && (
              <div className="mt-4 p-3 border rounded-md bg-destructive/10 text-destructive text-sm">
                <p className="font-semibold mb-1">Error:</p>
                <p>{error}</p>
              </div>
            )}
            {apiResponse && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1 mt-2">Response Body (BS Calendar Data):</h3>
                <JsonCodeBlock data={apiResponse} />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
