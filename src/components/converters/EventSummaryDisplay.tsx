
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ListChecks, Info, CalendarX2, Sparkles, Heart, Milestone, Loader2 } from 'lucide-react';
import React from 'react';

interface EventSectionProps {
  title: string;
  icon: React.ElementType;
  events?: string[];
  itemSuffix?: string;
}

function EventSection({ title, icon, events, itemSuffix }: EventSectionProps) {
  if (!events || events.length === 0) {
    return null;
  }
  const IconComponent = icon;
  return (
    <div className="mt-5">
      <h4 className="flex items-center gap-2 text-lg font-semibold text-primary mb-3">
        <IconComponent className="h-5 w-5 text-accent" />
        {title}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {events.map((item, index) => {
          if (title === "Holidays & Festivals") {
            const match = item.match(/^(\d+)\s+(.*)/);
            if (match) {
              const day = match[1];
              const description = match[2];
              return (
                <div key={index} className="bg-background/80 p-3.5 rounded-lg border border-border shadow-md flex items-start gap-2.5 transition-all hover:shadow-lg">
                  <Badge variant="default" className="text-xs bg-primary text-primary-foreground px-2.5 py-1 h-fit whitespace-nowrap shadow">
                    {day}
                  </Badge>
                  <p className="text-sm text-foreground/90 flex-grow pt-0.5">{description}</p>
                </div>
              );
            } else {
              // Fallback for holiday items that don't match the pattern (e.g., general notes)
              return (
                <div key={index} className="bg-background/80 p-3.5 rounded-lg border border-border text-sm text-foreground/90 shadow-md transition-all hover:shadow-lg">
                  {item}
                </div>
              );
            }
          } else {
            // For Marriage and Bratabandha dates
            return (
              <div key={index} className="bg-background/80 p-3.5 rounded-lg border border-border text-sm text-foreground/90 shadow-md transition-all hover:shadow-lg">
                {/* Original logic for marriage/bratabandha: if 'गते' is already present or suffix is empty, use item, else append suffix */}
                {(item.includes("गते") || item.includes("मुर्हुत छैन") || itemSuffix === "") ? item : `${item}${itemSuffix}`}
              </div>
            );
          }
        })}
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
}: {
  holiFest?: string[];
  marriageEvents?: string[];
  bratabandhaEvents?: string[];
  isLoading: boolean;
  eventDataError?: string | null;
  bsYear?: number;
  bsMonthName?: string;
}) {

  const hasHoliFest = holiFest && holiFest.length > 0;
  const hasMarriage = marriageEvents && marriageEvents.length > 0 && !marriageEvents.some(e => e.includes("मुर्हुत छैन"));
  const hasBratabandha = bratabandhaEvents && bratabandhaEvents.length > 0 && !bratabandhaEvents.some(e => e.includes("मुर्हुत छैन"));
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
          <div className="space-y-3 pt-2">
            <div className="h-6 bg-muted/70 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-muted/70 rounded animate-pulse w-1/2"></div>
            <div className="h-4 bg-muted/70 rounded animate-pulse w-5/6"></div>
             <div className="h-4 bg-muted/70 rounded animate-pulse w-4/6"></div>
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

  // Only render the card if we have a year and month, and there's data to show or it's not loading/error
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
          <div className="flex flex-col items-center justify-center text-center p-6 bg-muted/30 rounded-md border border-dashed border-border">
            <Info className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="font-semibold text-foreground">No Specific Events Found</p>
            <p className="text-sm text-muted-foreground mt-1">
              There are no specific holidays, marriage, or bratabandha dates listed for {bsMonthName} {bsYear} in our current dataset.
            </p>
          </div>
        )}
        <EventSection title="Holidays & Festivals" icon={Sparkles} events={holiFest} />
        {/* Only show marriage/bratabandha sections if there are actual dates, not just "no events" messages */}
        {hasMarriage && <EventSection title="Auspicious Marriage Dates" icon={Heart} events={marriageEvents} itemSuffix=" गते" />}
        {hasBratabandha && <EventSection title="Auspicious Bratabandha Dates" icon={Milestone} events={bratabandhaEvents} itemSuffix=" गते" />}
        
        {/* Handle cases where there are "no event" messages specifically for marriage/bratabandha but other events exist */}
        {marriageEvents && marriageEvents.length === 1 && marriageEvents[0].includes("मुर्हुत छैन") && !hasMarriage && hasAnyEventData && (
           <div className="mt-5">
            <h4 className="flex items-center gap-2 text-lg font-semibold text-primary mb-3">
              <Heart className="h-5 w-5 text-accent" />
              Auspicious Marriage Dates
            </h4>
            <div className="bg-muted/50 p-3.5 rounded-lg border border-border text-sm text-muted-foreground shadow-sm">
              {marriageEvents[0]}
            </div>
          </div>
        )}
        {bratabandhaEvents && bratabandhaEvents.length === 1 && bratabandhaEvents[0].includes("मुर्हुत छैन") && !hasBratabandha && hasAnyEventData && (
           <div className="mt-5">
            <h4 className="flex items-center gap-2 text-lg font-semibold text-primary mb-3">
              <Milestone className="h-5 w-5 text-accent" />
              Auspicious Bratabandha Dates
            </h4>
             <div className="bg-muted/50 p-3.5 rounded-lg border border-border text-sm text-muted-foreground shadow-sm">
              {bratabandhaEvents[0]}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}

