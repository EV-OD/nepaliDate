
'use server';

import { getBsMonthDataForAi, convertBsToAd, convertAdToBs } from '@/lib/date-converter';
import type { NepaliDate, EnglishDate, ConversionResult, BsMonthData } from '@/types';
import { NEPALI_MONTHS } from '@/types';

interface ConversionAndEventsResult {
  conversion: ConversionResult;
  holiFest?: string[];
  marriage?: string[];
  bratabandha?: string[];
  eventDataError?: string;
  bsYearForEvents?: number;
  bsMonthForEvents?: number;
  bsMonthNameForEvents?: string;
}

async function fetchEventData(bsYear: number, bsMonth: number): Promise<{ holiFest?: string[], marriage?: string[], bratabandha?: string[], eventDataError?: string }> {
  const monthData: BsMonthData | null = getBsMonthDataForAi(bsYear, bsMonth);
  if (!monthData) {
    return { eventDataError: `Could not retrieve event data for ${NEPALI_MONTHS[bsMonth-1]} ${bsYear}. Mock data might be limited for this month.` };
  }

  return { 
    holiFest: monthData.holiFest,
    marriage: monthData.marriage,
    bratabandha: monthData.bratabandha 
  };
}

export async function convertBsToAdWithEvents(bsDate: NepaliDate): Promise<ConversionAndEventsResult> {
  const conversionResult = convertBsToAd(bsDate);
  
  if (conversionResult.adDate) {
    const eventData = await fetchEventData(bsDate.year, bsDate.month);
    return { 
      conversion: conversionResult, 
      ...eventData,
      bsYearForEvents: bsDate.year,
      bsMonthForEvents: bsDate.month,
      bsMonthNameForEvents: NEPALI_MONTHS[bsDate.month-1]
    };
  }
  return { conversion: conversionResult };
}

export async function convertAdToBsWithEvents(adDate: EnglishDate): Promise<ConversionAndEventsResult> {
  const conversionResult = convertAdToBs(adDate);

  if (conversionResult.bsDate) {
    const eventData = await fetchEventData(conversionResult.bsDate.year, conversionResult.bsDate.month);
    return { 
      conversion: conversionResult, 
      ...eventData,
      bsYearForEvents: conversionResult.bsDate.year,
      bsMonthForEvents: conversionResult.bsDate.month,
      bsMonthNameForEvents: NEPALI_MONTHS[conversionResult.bsDate.month-1]
    };
  }
  return { conversion: conversionResult };
}
