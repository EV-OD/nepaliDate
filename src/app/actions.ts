
'use server';

import { convertBsToAd, convertAdToBs } from '@/lib/date-converter';
// getBsCalendarData is no longer directly used by fetchEventData
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

// This function now fetches event data from the app's own API endpoint
async function fetchEventData(bsYear: number, bsMonth: number): Promise<{ holiFest?: string[], marriage?: string[], bratabandha?: string[], eventDataError?: string }> {
  const apiKey = process.env.API_KEY_NEPALIDATE;
  if (!apiKey) {
    console.error("API_KEY_NEPALIDATE is not set in environment variables.");
    return { eventDataError: "Server configuration error: API key for internal data fetching is missing." };
  }

  // Determine the base URL for the API call
  // For server-side calls to its own API, localhost is often preferred in dev.
  // In production, NEXT_PUBLIC_APP_URL should be the externally accessible URL.
  // However, for server-to-server internal calls, if the app runs in a containerized env,
  // localhost might refer to the container itself. Using NEXT_PUBLIC_APP_URL if available.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${process.env.PORT || 9002}`;
  const apiUrl = `${appUrl}/api/calendar/${bsYear}/${bsMonth}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'X-API-Key': apiKey,
      },
      cache: 'no-store', // Ensure fresh data for each conversion context
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `API request failed with status ${response.status}` }));
      console.error(`Error fetching event data from ${apiUrl}: ${response.status}`, errorData);
      return { eventDataError: `Could not retrieve event data (status ${response.status}): ${errorData.error || 'Unknown API error'}.` };
    }

    const monthData: BsMonthData = await response.json();

    return {
      holiFest: monthData.holiFest,
      marriage: monthData.marriage,
      bratabandha: monthData.bratabandha
    };

  } catch (error) {
    console.error("Error in fetchEventData (calling internal API):", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error during internal API call.";
    return { eventDataError: `Failed to connect to internal event data API: ${errorMessage}` };
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
