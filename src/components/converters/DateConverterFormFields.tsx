
'use client';

import { Control } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { NEPALI_MONTHS, ENGLISH_MONTHS, CLIENT_SIDE_BS_YEARS, getClientSafeDaysInBsMonth } from "@/types";
import React from "react";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"; // Import Combobox

interface BsDateFormFieldsProps {
  control: Control<any>;
  yearFieldName: string;
  monthFieldName: string;
  dayFieldName: string;
  bsYearWatch?: number; 
  bsMonthWatch?: number;
}

export function BsDateFormFields({ control, yearFieldName, monthFieldName, dayFieldName, bsYearWatch, bsMonthWatch }: BsDateFormFieldsProps) {
  const bsYearOptions: ComboboxOption[] = CLIENT_SIDE_BS_YEARS.map(year => ({
    value: year.toString(),
    label: year.toString()
  }));
  
  const daysInSelectedBsMonth = React.useMemo(() => {
    if (bsYearWatch && bsMonthWatch) {
      return getClientSafeDaysInBsMonth(bsYearWatch, bsMonthWatch);
    }
    return 32;
  }, [bsYearWatch, bsMonthWatch]);

  return (
    <>
      <FormField
        control={control}
        name={yearFieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>BS Year</FormLabel>
            <Combobox
              options={bsYearOptions}
              value={field.value?.toString()}
              onChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
              placeholder="Select BS Year"
              searchPlaceholder="Search BS Year..."
              emptyText="No year found."
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={monthFieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>BS Month</FormLabel>
            <Select
              onValueChange={(value) => field.onChange(parseInt(value))}
              defaultValue={field.value?.toString()}
              value={field.value?.toString()}
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
      <FormField
        control={control}
        name={dayFieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>BS Day</FormLabel>
             <Select
              onValueChange={(value) => field.onChange(parseInt(value))}
              defaultValue={field.value?.toString()}
              value={field.value?.toString()}
              disabled={!bsYearWatch || !bsMonthWatch}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select BS Day" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Array.from({ length: daysInSelectedBsMonth }, (_, i) => i + 1).map(day => (
                  <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!bsYearWatch || !bsMonthWatch && <p className="text-xs text-muted-foreground pt-1">Please select year and month first.</p>}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}


interface AdDateFormFieldProps {
  control: Control<any>;
  fieldName: string;
  label: string;
}

// This component is no longer used by ad-to-bs page but kept for potential other uses or reference.
export function AdDateFormField({ control, fieldName, label }: AdDateFormFieldProps) {
  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date("1930-01-01") 
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface ResultDisplayProps {
  label: string;
  date?: { year: number; month: number; day: number; monthName?: string; dayOfWeek?: string};
}
export function ResultDisplay({ label, date }: ResultDisplayProps) {
  if (!date) return null;
  return (
    <div className="mt-4 p-4 border rounded-md bg-primary/10">
      <p className="text-sm font-medium text-foreground">{label}:</p>
      <p className="text-xl font-semibold text-primary">
        {date.day} {date.monthName || ENGLISH_MONTHS[date.month-1] || NEPALI_MONTHS[date.month-1]} {date.year}
      </p>
      {date.dayOfWeek && <p className="text-sm text-muted-foreground">{date.dayOfWeek}</p>}
    </div>
  );
}
