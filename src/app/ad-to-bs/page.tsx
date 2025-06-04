'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import type { ConversionResult, EventSummaryType } from '@/types';
import { convertAdToBsWithSummary } from '@/app/actions';
import { AdDateFormField, ResultDisplay } from '@/components/converters/DateConverterFormFields';
import EventSummaryDisplay from '@/components/converters/EventSummaryDisplay';
import { Loader2 } from 'lucide-react';


const formSchema = z.object({
  adDate: z.date({ required_error: "Please select an AD date." }),
});

export default function AdToBsPage() {
  const [isPending, startTransition] = useTransition();
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [eventSummary, setEventSummary] = useState<EventSummaryType | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryYear, setSummaryYear] = useState<number | undefined>();
  const [summaryMonthName, setSummaryMonthName] = useState<string | undefined>();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adDate: new Date(),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setConversionResult(null);
    setEventSummary(null);
    setSummaryError(null);

    startTransition(async () => {
      try {
        const adDate = {
          year: values.adDate.getFullYear(),
          month: values.adDate.getMonth() + 1, // Date object month is 0-indexed
          day: values.adDate.getDate(),
        };
        const result = await convertAdToBsWithSummary(adDate);
        setConversionResult(result.conversion);

        if (result.conversion.error) {
          toast({ variant: "destructive", title: "Conversion Error", description: result.conversion.error });
        } else {
          toast({ title: "Conversion Successful" , description: `Converted AD ${adDate.day}/${adDate.month}/${adDate.year} to BS.`});
        }
        if(result.summary) setEventSummary(result.summary);
        if(result.summaryError) setSummaryError(result.summaryError);
        setSummaryYear(result.bsYearForSummary);
        setSummaryMonthName(result.bsMonthNameForSummary);

      } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: "destructive", title: "Error", description: errMessage });
        setConversionResult({ error: errMessage });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Gregorian (AD) to Bikram Sambat (BS)</CardTitle>
          <CardDescription>Enter an AD date to convert it to BS and see relevant events.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AdDateFormField control={form.control} fieldName="adDate" label="AD Date" />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Convert to BS
              </Button>
            </form>
          </Form>

          {conversionResult?.bsDate && (
            <ResultDisplay label="Bikram Sambat (BS) Date" date={conversionResult.bsDate} />
          )}
           {conversionResult?.error && !conversionResult.bsDate &&(
            <div className="mt-4 p-4 border rounded-md bg-destructive/10 text-destructive">
              <p className="font-semibold">Error:</p>
              <p>{conversionResult.error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <EventSummaryDisplay 
        summaryData={eventSummary} 
        isLoading={isPending && !conversionResult?.error && !!form.formState.isValid}
        error={summaryError}
        bsYear={summaryYear}
        bsMonthName={summaryMonthName}
      />
    </div>
  );
}
