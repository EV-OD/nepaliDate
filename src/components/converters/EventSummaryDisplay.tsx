
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks, Info, CalendarX2, Sparkles, Heart, Milestone, Loader2 } from 'lucide-react'; // Added more icons
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

function EventSection({ title, icon, events, itemSuffix }: { title: string; icon: React.ElementType; events?: string[]; itemSuffix?: string }) {
  if (!events || events.length === 0) {
    return null;
  }
  const IconComponent = icon;
  return (
    <div className="mt-4">
      <h4 className="flex items-center gap-2 text-lg font-semibold text-primary mb-2">
        <IconComponent className="h-5 w-5 text-accent" />
        {title}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {events.map((item, index) => (
          <div key={index} className="bg-background/70 p-3 rounded-md border border-border text-sm text-foreground/90 shadow-sm">
            {item.includes("गते") || itemSuffix === "" ? item : `${item}${itemSuffix}`}
          </div>
        ))}
      </div>
    </div>
  );
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
      <Card className="mt-6 bg-card shadow-lg border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-xl text-primary">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            Events & Holidays for {bsMonthName} {bsYear}
          </CardTitle>
          <CardDescription className="text-muted-foreground">Loading event details, please wait...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-6 bg-muted rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
             <div className="h-4 bg-muted rounded animate-pulse w-4/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (eventDataError) {
    return (
      <Card className="mt-6 border-destructive bg-destructive/10 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-destructive text-xl">
            <CalendarX2 className="h-6 w-6" />
            Error Loading Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground font-medium">{eventDataError}</p>
          <p className="text-sm text-destructive-foreground/80 mt-1">Data might be limited for the selected month or an issue occurred.</p>
        </CardContent>
      </Card>
    );
  }

  if (!bsYear || !bsMonthName) {
    return null;
  }
  
  return (
    <Card className="mt-6 bg-card shadow-lg border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-xl text-primary">
          <ListChecks className="h-6 w-6" />
          Events & Holidays: {bsMonthName} {bsYear}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          An overview of notable dates for the selected Bikram Sambat month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasAnyEventData && (
          <div className="flex flex-col items-center justify-center text-center p-6 bg-muted/50 rounded-md border border-dashed">
            <Info className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="font-semibold text-foreground">No Specific Events Found</p>
            <p className="text-sm text-muted-foreground mt-1">
              There are no specific holidays, marriage, or bratabandha dates listed for {bsMonthName} {bsYear} in our current dataset.
            </p>
          </div>
        )}
        <EventSection title="Holidays & Festivals" icon={Sparkles} events={holiFest} />
        <EventSection title="Auspicious Marriage Dates" icon={Heart} events={marriageEvents} itemSuffix=" गते" />
        <EventSection title="Auspicious Bratabandha Dates" icon={Milestone} events={bratabandhaEvents} itemSuffix=" गते" />
      </CardContent>
    </Card>
  );
}
