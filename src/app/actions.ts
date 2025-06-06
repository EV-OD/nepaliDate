
'use server';

import { convertBsToAd, convertAdToBs } from '@/lib/date-converter';
import { getBsCalendarData } from '@/lib/bsCalendarData'; // Directly use this
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

// This function now fetches event data by directly accessing the calendar data source
async function fetchEventData(bsYear: number, bsMonth: number): Promise<{ holiFest?: string[], marriage?: string[], bratabandha?: string[], eventDataError?: string }> {
  try {
    const allCalendarData = getBsCalendarData();
    const monthKey = `${bsYear}/${bsMonth}`;
    const monthData: BsMonthData | undefined = allCalendarData[monthKey];

    if (!monthData) {
      const availableYearsArray: number[] = [];
      if (allCalendarData && Object.keys(allCalendarData).length > 0) {
          Object.keys(allCalendarData).forEach(k => {
              const y = parseInt(k.split('/')[0]);
              if (!availableYearsArray.includes(y)) {
                  availableYearsArray.push(y);
              }
          });
          availableYearsArray.sort((a, b) => a - b);
      }
      const availableYears = availableYearsArray.join(', ');
      return { eventDataError: `Event data not found for BS ${bsYear}/${bsMonth}. Available years: ${availableYears || 'None'}.` };
    }

    return {
      holiFest: monthData.holiFest,
      marriage: monthData.marriage,
      bratabandha: monthData.bratabandha
    };

  } catch (error) {
    console.error("Error in fetchEventData (direct access):", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error fetching event data.";
    return { eventDataError: `Failed to retrieve event data: ${errorMessage}` };
  }
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
