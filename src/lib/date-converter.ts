import { bsCalendarData } from './bsCalendarData';
import type { NepaliDate, EnglishDate, ConversionResult, BsMonthData, BsDayData } from '@/types';
import { NEPALI_MONTHS, ENGLISH_MONTHS } from '@/types';

function getAdDateForBsDay(bsDayEntry: BsDayData, monthMetadata: BsMonthData['metadata']): EnglishDate {
  let adDay = parseInt(bsDayEntry.e);
  let adMonth = monthMetadata.ad_month_start;
  let adYear = monthMetadata.ad_year_start;

  // Check if we crossed into the next AD month based on the start of the BS month
  // This simplified logic assumes bsDayEntry.e resets to 1 when AD month changes.
  // A more robust way is to track the previous AD day.
  // For this mock, we assume the bsCalendarData has AD days that correctly increment across month boundaries.

  // Example: BS month starts in May (5), ends in June (6).
  // If bsDayEntry.e is "30" and ad_month_start is 5, it's May 30.
  // If bsDayEntry.e is "1" and ad_month_start is 5, but the *previous* BS day's AD 'e' was "31", then this must be June 1.
  // This requires iterating through the days array up to the current one or having a pre-calculated AD month for each BS day.

  // Simplified: Iterate through days to determine AD month/year
  // This is not efficient for direct lookup but ensures correctness with current data structure.
  let currentAdDay = parseInt(bsCalendarData[`${monthMetadata.bs_year}/${monthMetadata.bs_month}`].days[0].e);
  let currentAdMonth = monthMetadata.ad_month_start;
  let currentAdYear = monthMetadata.ad_year_start;

  for (const day of bsCalendarData[`${monthMetadata.bs_year}/${monthMetadata.bs_month}`].days) {
    const parsedAdDay = parseInt(day.e);
    if (parsedAdDay < currentAdDay && currentAdMonth === monthMetadata.ad_month_start) { // month changed from start_month to end_month
        currentAdMonth = monthMetadata.ad_month_end;
        if (monthMetadata.ad_year_end > monthMetadata.ad_year_start) {
            currentAdYear = monthMetadata.ad_year_end;
        }
    }
    currentAdDay = parsedAdDay;
    if (day.n === bsDayEntry.n) {
        adDay = parsedAdDay;
        adMonth = currentAdMonth;
        adYear = currentAdYear;
        break;
    }
  }
  
  const dateObj = new Date(adYear, adMonth - 1, adDay);

  return {
    year: adYear,
    month: adMonth,
    day: adDay,
    monthName: ENGLISH_MONTHS[adMonth-1],
    dayOfWeek: dateObj.toLocaleDateString('en-US', { weekday: 'long' })
  };
}


export function convertBsToAd(bsDate: NepaliDate): ConversionResult {
  const { year, month, day } = bsDate;
  const monthData = bsCalendarData[`${year}/${month}`];

  if (!monthData) {
    return { error: `Data for BS ${year}/${month} not found in our records. Please try a year between 2076 and 2081.` };
  }

  const dayData = monthData.days.find(d => parseInt(d.n) === day);

  if (!dayData) {
    return { error: `Invalid day ${day} for BS ${NEPALI_MONTHS[month-1]} ${year}. This month has ${monthData.days.length} days.` };
  }
  
  const adFullDate = getAdDateForBsDay(dayData, {...monthData.metadata, bs_year: year, bs_month: month});

  return { 
    adDate: adFullDate,
    bsDate: {
      ...bsDate,
      monthName: NEPALI_MONTHS[month-1],
    }
  };
}

export function convertAdToBs(adDate: EnglishDate): ConversionResult {
  const { year, month, day } = adDate;

  for (const key in bsCalendarData) {
    const monthData = bsCalendarData[key];
    let currentAdDayTracker = parseInt(monthData.days[0].e);
    let currentAdMonthTracker = monthData.metadata.ad_month_start;
    let currentAdYearTracker = monthData.metadata.ad_year_start;

    for (const bsDayEntry of monthData.days) {
      const parsedEntryAdDay = parseInt(bsDayEntry.e);

      if (parsedEntryAdDay < currentAdDayTracker && currentAdMonthTracker === monthData.metadata.ad_month_start) {
        currentAdMonthTracker = monthData.metadata.ad_month_end;
        if (monthData.metadata.ad_year_end > monthData.metadata.ad_year_start) {
            currentAdYearTracker = monthData.metadata.ad_year_end;
        }
      }
      currentAdDayTracker = parsedEntryAdDay;

      if (currentAdYearTracker === year && currentAdMonthTracker === month && parseInt(bsDayEntry.e) === day) {
        const dateObj = new Date(year, month - 1, day);
        return {
          bsDate: {
            year: monthData.bs_year,
            month: monthData.bs_month,
            day: parseInt(bsDayEntry.n),
            monthName: NEPALI_MONTHS[monthData.bs_month-1],
            dayOfWeek: dateObj.toLocaleDateString('en-US', { weekday: 'long' }) // Day of week based on AD date
          },
          adDate: {
            ...adDate,
            monthName: ENGLISH_MONTHS[month-1],
            dayOfWeek: dateObj.toLocaleDateString('en-US', { weekday: 'long' })
          }
        };
      }
    }
  }

  return { error: `BS date for AD ${day}/${month}/${year} not found in our records. Data is limited to BS 2076-2081.` };
}

export function getBsMonthDataForAi(bsYear: number, bsMonth: number): BsMonthData | null {
  const monthData = bsCalendarData[`${bsYear}/${bsMonth}`];
  return monthData || null;
}

export function getBsYears(): number[] {
  const years = new Set<number>();
  for (const key in bsCalendarData) {
    years.add(parseInt(key.split('/')[0]));
  }
  return Array.from(years).sort((a,b) => a-b);
}
