
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks, Info, CalendarX2 } from 'lucide-react'; // Replaced PartyPopper
import React from 'react';

interface EventDisplayProps {
  holiFest?: string[];
  marriageEvents?: string[];
  bratabandhaEvents?: string[];
  isLoading: boolean;
  eventDataError?: string | null;
  bsYear?: number;
  bsMonthName?: string;
}

export default function EventSummaryDisplay({ 
  holiFest, 
  marriageEvents, 
  bratabandhaEvents, 
  isLoading, 
  eventDataError, 
  bsYear, 
  bsMonthName 
}: EventDisplayProps) {

  const hasHoliFest = holiFest && holiFest.length > 0;
  const hasMarriage = marriageEvents && marriageEvents.length > 0;
  const hasBratabandha = bratabandhaEvents && bratabandhaEvents.length > 0;
  const hasAnyEventData = hasHoliFest || hasMarriage || hasBratabandha;

  if (isLoading) {
    return (
      <Card className="mt-6 bg-secondary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <ListChecks className="h-5 w-5 animate-pulse text-primary" />
            Events & Holidays for {bsMonthName} {bsYear}
          </CardTitle>
          <CardDescription>Loading event details...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (eventDataError) {
    return (
      <Card className="mt-6 border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-destructive">
            <CalendarX2 className="h-5 w-5" />
            Error Loading Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground">{eventDataError}</p>
        </CardContent>
      </Card>
    );
  }

  // Only show the card if there's a year and month, even if no events or error yet
  // This avoids showing an empty card before a conversion happens
  if (!bsYear || !bsMonthName) {
    return null;
  }
  
  const renderEventList = (items: string[] | undefined, typeLabel: string, itemSuffix: string = "") => {
    if (!items || items.length === 0) {
      return null; // Don't render section if no items
    }
    return (
      <div>
        <h4 className="font-semibold text-md mt-3 mb-1 text-primary">{typeLabel}:</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/90">
          {items.map((item, index) => (
            <li key={index}>
              {item.includes("गते") || itemSuffix === "" ? item : `${item}${itemSuffix}`}
            </li>
          ))}
        </ul>
      </div>
    );
  };


  return (
    <Card className="mt-6 bg-secondary/30 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-lg">
          <ListChecks className="h-6 w-6 text-primary" />
          Events & Holidays for {bsMonthName} {bsYear}
        </CardTitle>
        <CardDescription>Overview of notable dates for the selected month.</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasAnyEventData && (
          <div className="flex items-center gap-2 text-muted-foreground py-2">
            <Info className="h-5 w-5"/>
            <p>No specific events listed for this month in our current data.</p>
          </div>
        )}
        {renderEventList(holiFest, "Holidays & Festivals")}
        {renderEventList(marriageEvents, "Auspicious Marriage Dates", " गते")}
        {renderEventList(bratabandhaEvents, "Auspicious Bratabandha Dates", " गते")}
      </CardContent>
    </Card>
  );
}
