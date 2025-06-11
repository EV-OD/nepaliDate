
'use client';

import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { ConversionResult } from '@/types';
import { convertAdToBsWithEvents } from '@/app/actions';
import { ResultDisplay } from '@/components/converters/DateConverterFormFields';
import EventSummaryDisplay from '@/components/converters/EventSummaryDisplay';
import { Loader2 } from 'lucide-react';
import { NEPALI_MONTHS, ENGLISH_MONTHS } from '@/types';
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";

const MIN_AD_YEAR = 1930;
const MAX_AD_YEAR = new Date().getFullYear() + 10; // Current year + 10

const adYearOptions: ComboboxOption[] = Array.from(
  { length: MAX_AD_YEAR - MIN_AD_YEAR + 1 },
  (_, i) => MIN_AD_YEAR + i
).map(year => ({ value: year.toString(), label: year.toString() }));

const adDayOptions = Array.from({ length: 31 }, (_, i) => ({
  value: (i + 1).toString(),
  label: (i + 1).toString(),
}));

const formSchema = z.object({
  adYear: z.number({ required_error: "AD Year is required." }).min(MIN_AD_YEAR).max(MAX_AD_YEAR),
  adMonth: z.number({ required_error: "AD Month is required." }).min(1).max(12),
  adDay: z.number({ required_error: "AD Day is required." }).min(1).max(31),
}).refine(data => {
  if (!data.adYear || !data.adMonth) return true; // Validation handled by individual fields if not present
  try {
    const daysInMonth = new Date(data.adYear, data.adMonth, 0).getDate(); // Month is 1-indexed for new Date() when day is 0
    return data.adDay <= daysInMonth;
  } catch (e) {
    return false; // Invalid date components
  }
}, {
  message: "Day is invalid for the selected AD month and year.",
  path: ["adDay"],
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
      adYear: new Date().getFullYear(),
      adMonth: new Date().getMonth() + 1,
      adDay: new Date().getDate(),
    },
  });

  const watchedAdYear = form.watch("adYear");
  const watchedAdMonth = form.watch("adMonth");

  const daysInSelectedAdMonth = React.useMemo(() => {
    if (watchedAdYear && watchedAdMonth) {
      try {
        return new Date(watchedAdYear, watchedAdMonth, 0).getDate();
      } catch {
        return 31; // Fallback
      }
    }
    return 31; // Default max if year/month not selected
  }, [watchedAdYear, watchedAdMonth]);

  React.useEffect(() => {
    const currentDay = form.getValues("adDay");
    if (currentDay > daysInSelectedAdMonth) {
      form.setValue("adDay", 1, { shouldValidate: true });
    }
  }, [watchedAdYear, watchedAdMonth, daysInSelectedAdMonth, form]);


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
        // Ensure month is 0-indexed for Date constructor if using it, but actions.ts expects 1-indexed
        const adDateForAction = {
          year: values.adYear,
          month: values.adMonth, // Pass 1-indexed month to action
          day: values.adDay,
        };
        const result = await convertAdToBsWithEvents(adDateForAction);
        setConversionResult(result.conversion);

        if (result.conversion.error) {
          toast({ variant: "destructive", title: "Conversion Error", description: result.conversion.error });
        } else {
          toast({ title: "Conversion Successful" , description: `Converted AD ${values.adDay}/${values.adMonth}/${values.adYear} to BS.`});
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="adYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AD Year</FormLabel>
                      <Combobox
                        options={adYearOptions}
                        value={field.value?.toString()}
                        onChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                        placeholder="Select AD Year"
                        searchPlaceholder="Search AD Year..."
                        emptyText="No year found."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="adMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AD Month</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select AD Month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ENGLISH_MONTHS.map((month, index) => (
                            <SelectItem key={index} value={(index + 1).toString()}>{month} ({index + 1})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="adDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AD Day</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                        value={field.value?.toString()}
                        disabled={!watchedAdYear || !watchedAdMonth}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select AD Day" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: daysInSelectedAdMonth }, (_, i) => i + 1).map(day => (
                            <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!watchedAdYear || !watchedAdMonth && <p className="text-xs text-muted-foreground pt-1">Select year & month first.</p>}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
