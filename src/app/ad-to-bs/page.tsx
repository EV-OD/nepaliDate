'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { ConversionResult } from '@/types';
import { convertAdToBsWithEvents } from '@/app/actions';
import { AdDateFormField, ResultDisplay } from '@/components/converters/DateConverterFormFields';
import EventSummaryDisplay from '@/components/converters/EventSummaryDisplay';
import { Loader2 } from 'lucide-react';
import { NEPALI_MONTHS } from '@/types';

const formSchema = z.object({
  adDate: z.date({ required_error: "Please select an AD date." }),
});

export default function AdToBsPage() {
  const [isPending, startTransition] = useTransition();
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [holiFestEvents, setHoliFestEvents] = useState<string[] | undefined>(undefined);
  const [marriageEvents, setMarriageEvents] = useState<string[] | undefined>(undefined);
  const [bratabandhaEvents, setBratabandhaEvents] = useState<string[] | undefined>(undefined);
  const [eventDataError, setEventDataError] = useState<string | null>(null);
  const [eventsYear, setEventsYear] = useState<number | undefined>();
  const [eventsMonthName, setEventsMonthName] = useState<string | undefined>();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adDate: new Date(),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setConversionResult(null);
    setHoliFestEvents(undefined);
    setMarriageEvents(undefined);
    setBratabandhaEvents(undefined);
    setEventDataError(null);
    setEventsYear(undefined);
    setEventsMonthName(undefined);

    startTransition(async () => {
      try {
        const adDate = {
          year: values.adDate.getFullYear(),
          month: values.adDate.getMonth() + 1, 
          day: values.adDate.getDate(),
        };
        const result = await convertAdToBsWithEvents(adDate);
        setConversionResult(result.conversion);

        if (result.conversion.error) {
          toast({ variant: "destructive", title: "Conversion Error", description: result.conversion.error });
        } else {
          toast({ title: "Conversion Successful" , description: `Converted AD ${adDate.day}/${adDate.month}/${adDate.year} to BS.`});
        }
        
        setHoliFestEvents(result.holiFest);
        setMarriageEvents(result.marriage);
        setBratabandhaEvents(result.bratabandha);
        if(result.eventDataError) setEventDataError(result.eventDataError);
        setEventsYear(result.bsYearForEvents);
        setEventsMonthName(result.bsYearForEvents && result.bsMonthForEvents ? NEPALI_MONTHS[result.bsMonthForEvents - 1] : undefined);

      } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({ variant: "destructive", title: "Error", description: errMessage });
        setConversionResult({ error: errMessage });
        setEventDataError("Failed to process request.");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Gregorian (AD) to Bikram Sambat (BS) Converter</CardTitle>
          <CardDescription>Use our AD to BS converter to easily change Gregorian dates to Bikram Sambat (BS). This tool also displays relevant Nepali holidays and events from the Nepali Patro for the converted BS month.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AdDateFormField control={form.control} fieldName="adDate" label="AD Date" />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Convert AD to BS
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
        holiFest={holiFestEvents}
        marriageEvents={marriageEvents}
        bratabandhaEvents={bratabandhaEvents}
        isLoading={isPending && !conversionResult?.error && !!form.formState.isValid && !eventDataError && (!holiFestEvents && !marriageEvents && !bratabandhaEvents)}
        eventDataError={eventDataError}
        bsYear={eventsYear}
        bsMonthName={eventsMonthName}
      />
    </div>
  );
}
