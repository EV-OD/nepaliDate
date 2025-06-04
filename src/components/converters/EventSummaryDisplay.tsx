'use client';

import type { EventSummaryType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PartyPopper } from 'lucide-react';

interface EventSummaryDisplayProps {
  summaryData: EventSummaryType | null;
  isLoading: boolean;
  error?: string | null;
  bsYear?: number;
  bsMonthName?: string;
}

export default function EventSummaryDisplay({ summaryData, isLoading, error, bsYear, bsMonthName }: EventSummaryDisplayProps) {
  if (isLoading) {
    return (
      <Card className="mt-6 bg-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <PartyPopper className="h-5 w-5 animate-pulse" />
            Events & Holidays for {bsMonthName} {bsYear}
          </CardTitle>
          <CardDescription>Analyzing events...</CardDescription>
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

  if (error) {
    return (
      <Card className="mt-6 border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-destructive">
            <PartyPopper className="h-5 w-5" />
            Event Summary Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!summaryData || !summaryData.summary) {
    return null; // Don't display anything if no summary or not loading/error
  }

  return (
    <Card className="mt-6 bg-accent/20 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-lg">
          <PartyPopper className="h-6 w-6 text-accent-foreground" />
          Events & Holidays Summary for {bsMonthName} {bsYear}
        </CardTitle>
        <CardDescription>AI-generated overview of important dates.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-wrap">{summaryData.summary}</p>
      </CardContent>
    </Card>
  );
}
