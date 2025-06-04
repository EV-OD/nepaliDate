
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
import { convertBsToAdWithEvents } from '@/app/actions';
import { BsDateFormFields, ResultDisplay } from '@/components/converters/DateConverterFormFields';
import EventSummaryDisplay from '@/components/converters/EventSummaryDisplay';
import { Loader2 } from 'lucide-react';
import { getClientSafeDaysInBsMonth, CLIENT_SIDE_BS_YEARS } from '@/types'; // Updated import

const currentBsYear = new Date().getFullYear() + 56; // Rough estimate for default
const defaultBsYear = CLIENT_SIDE_BS_YEARS.includes(currentBsYear) ? currentBsYear : CLIENT_SIDE_BS_YEARS[CLIENT_SIDE_BS_YEARS.length -1] || 2080;


const formSchema = z.object({
  bsYear: z.number().min(CLIENT_SIDE_BS_YEARS[0]).max(CLIENT_SIDE_BS_YEARS[CLIENT_SIDE_BS_YEARS.length - 1]),
  bsMonth: z.number().min(1).max(12),
  bsDay: z.number().min(1).max(32),
}).refine(data => {
    const daysInMonth = getClientSafeDaysInBsMonth(data.bsYear, data.bsMonth); // Use client-safe function
    return data.bsDay <= daysInMonth;
}, {
    message: "Day is invalid for the selected month and year.",
    path: ["bsDay"],
});


export default function BsToAdPage() {
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
      bsYear: defaultBsYear,
      bsMonth: 1,
      bsDay: 1,
    },
  });

  const watchedBsYear = form.watch("bsYear");
  const watchedBsMonth = form.watch("bsMonth");

  React.useEffect(() => {
    // Reset day to 1 when year or month changes, if the current day is invalid for new selection
    const currentDay = form.getValues("bsDay");
    const daysInNewMonth = getClientSafeDaysInBsMonth(watchedBsYear, watchedBsMonth);
    if (currentDay > daysInNewMonth) {
      form.setValue("bsDay", 1); 
    }
  }, [watchedBsYear, watchedBsMonth, form]);


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
        const result = await convertBsToAdWithEvents({
          year: values.bsYear,
          month: values.bsMonth,
          day: values.bsDay,
        });
        setConversionResult(result.conversion);
        if (result.conversion.error) {
          toast({ variant: "destructive", title: "Conversion Error", description: result.conversion.error });
        } else {
           toast({ title: "Conversion Successful", description: `Converted BS ${values.bsDay}/${values.bsMonth}/${values.bsYear} to AD.` });
        }
        
        setHoliFestEvents(result.holiFest);
        setMarriageEvents(result.marriage);
        setBratabandhaEvents(result.bratabandha);
        if(result.eventDataError) setEventDataError(result.eventDataError);
        setEventsYear(result.bsYearForEvents);
        setEventsMonthName(result.bsMonthNameForEvents);

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
          <CardTitle className="text-3xl font-headline">Bikram Sambat (BS) to Gregorian (AD)</CardTitle>
          <CardDescription>Enter a BS date to convert it to AD and see relevant events.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BsDateFormFields 
                  control={form.control}
                  yearFieldName="bsYear"
                  monthFieldName="bsMonth"
                  dayFieldName="bsDay"
                  bsYearWatch={watchedBsYear}
                  bsMonthWatch={watchedBsMonth}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Convert to AD
              </Button>
            </form>
          </Form>

          {conversionResult?.adDate && (
             <ResultDisplay label="Gregorian (AD) Date" date={conversionResult.adDate} />
          )}
          {conversionResult?.error && !conversionResult.adDate && (
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
