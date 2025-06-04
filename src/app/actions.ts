'use server';

import { summarizeRelevantBsEvents } from '@/ai/flows/holiday-event-analyzer';
import { convertBsToAd, convertAdToBs, getBsMonthDataForAi } from '@/lib/date-converter';
import type { NepaliDate, EnglishDate, ConversionResult, EventSummaryType } from '@/types';
import { NEPALI_MONTHS } from '@/types';

interface ConversionAndSummaryResult {
  conversion: ConversionResult;
  summary?: EventSummaryType;
  summaryError?: string;
  bsYearForSummary?: number;
  bsMonthForSummary?: number;
  bsMonthNameForSummary?: string;
}

async function fetchEventSummary(bsYear: number, bsMonth: number): Promise<{ summary?: EventSummaryType, summaryError?: string }> {
  const monthData = getBsMonthDataForAi(bsYear, bsMonth);
  if (!monthData) {
    return { summaryError: `Could not retrieve event data for ${NEPALI_MONTHS[bsMonth-1]} ${bsYear}.` };
  }

  try {
    const aiInput = {
      year: bsYear.toString(),
      month: NEPALI_MONTHS[bsMonth - 1],
      holiFest: monthData.holiFest,
      marriage: monthData.marriage,
      bratabandha: monthData.bratabandha,
    };
    const summaryResult = await summarizeRelevantBsEvents(aiInput);
    return { summary: summaryResult };
  } catch (e: any) {
    console.error("AI Summary Error:", e);
    return { summaryError: `Failed to generate event summary: ${e.message}` };
  }
}

export async function convertBsToAdWithSummary(bsDate: NepaliDate): Promise<ConversionAndSummaryResult> {
  const conversionResult = convertBsToAd(bsDate);
  
  if (conversionResult.adDate) {
    const summaryData = await fetchEventSummary(bsDate.year, bsDate.month);
    return { 
      conversion: conversionResult, 
      ...summaryData,
      bsYearForSummary: bsDate.year,
      bsMonthForSummary: bsDate.month,
      bsMonthNameForSummary: NEPALI_MONTHS[bsDate.month-1]
    };
  }
  return { conversion: conversionResult };
}

export async function convertAdToBsWithSummary(adDate: EnglishDate): Promise<ConversionAndSummaryResult> {
  const conversionResult = convertAdToBs(adDate);

  if (conversionResult.bsDate) {
    const summaryData = await fetchEventSummary(conversionResult.bsDate.year, conversionResult.bsDate.month);
    return { 
      conversion: conversionResult, 
      ...summaryData,
      bsYearForSummary: conversionResult.bsDate.year,
      bsMonthForSummary: conversionResult.bsDate.month,
      bsMonthNameForSummary: NEPALI_MONTHS[conversionResult.bsDate.month-1]
    };
  }
  return { conversion: conversionResult };
}
