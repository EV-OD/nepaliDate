
import { getBsCalendarData, getDaysInBsMonth as getDaysInMonthUtil, getBsYears } from './bsCalendarData';
import type { NepaliDate, EnglishDate, ConversionResult, BsMonthData, BsDayData } from '@/types';
import { NEPALI_MONTHS, ENGLISH_MONTHS } from '@/types';

function getAdDateForBsDay(bsDayEntry: BsDayData, monthDataRef: BsMonthData): EnglishDate {
  let adDay = parseInt(bsDayEntry.e);
  let adMonth = monthDataRef.metadata.ad_month_start;
  let adYear = monthDataRef.metadata.ad_year_start;

  // This logic determines the correct AD month/year for a given BS day's 'e' value
  // by checking if the 'e' value indicates a rollover into the next AD month.
  // It assumes bsDayEntry.e resets to 1 (or a low number) when the AD month changes within a BS month.

  // Find the index of the current bsDayEntry to compare its 'e' value
  // with the 'e' value of the first day of the BS month.
  const firstBsDayE = parseInt(monthDataRef.days[0].e);
  
  // If the bsDayEntry.e is numerically smaller than the first day's e,
  // AND the start AD month is not December wrapping to January (already handled by year_end),
  // it implies the AD month has advanced.
  if (parseInt(bsDayEntry.e) < firstBsDayE && 
      !(monthDataRef.metadata.ad_month_start === 12 && monthDataRef.metadata.ad_month_end === 1)) {
    adMonth = monthDataRef.metadata.ad_month_end;
    adYear = monthDataRef.metadata.ad_year_end; // Use ad_year_end if months span year
  }
  // If start is Dec and end is Jan, year_end is already correct.
  // If start is e.g. Apr and end is May in same year, year_end is same as year_start.
  // This simplified logic might need refinement if 'e' values don't strictly reset to 1.
  // The refined logic in the thought process was better:
  
  // More robust iteration to determine AD month/year
  let currentAdDayNumber = parseInt(monthDataRef.days[0].e);
  let currentAdMonthValue = monthDataRef.metadata.ad_month_start;
  let currentAdYearValue = monthDataRef.metadata.ad_year_start;

  for (const day of monthDataRef.days) {
    const parsedAdDayInLoop = parseInt(day.e);
    // Check if the English day number has reset (e.g., from 30 to 1),
    // and we haven't already switched to the end month.
    if (parsedAdDayInLoop < currentAdDayNumber && currentAdMonthValue === monthDataRef.metadata.ad_month_start) { 
        currentAdMonthValue = monthDataRef.metadata.ad_month_end;
        // Ensure year also updates if the AD month span crosses an AD year boundary
        if (monthDataRef.metadata.ad_year_end > monthDataRef.metadata.ad_year_start) {
            currentAdYearValue = monthDataRef.metadata.ad_year_end;
        }
    }
    currentAdDayNumber = parsedAdDayInLoop;
    if (day.n === bsDayEntry.n) { // Found the target BS day
        adDay = parsedAdDayInLoop;
        adMonth = currentAdMonthValue;
        adYear = currentAdYearValue;
        break;
    }
  }

  const dateObj = new Date(adYear, adMonth - 1, adDay);
  return {
    year: adYear,
    month: adMonth,
    day: adDay,
    monthName: ENGLISH_MONTHS[adMonth - 1],
    dayOfWeek: dateObj.toLocaleDateString('en-US', { weekday: 'long' })
  };
}


export function convertBsToAd(bsDate: NepaliDate): ConversionResult {
  const { year, month, day } = bsDate;
  const calendar = getBsCalendarData();
  const monthData = calendar[`${year}/${month}`];

  if (!monthData) {
    const availableYears = getBsYears().join(', ');
    const message = `Data for BS ${year}/${month} not found. Available years in data: ${availableYears || 'None loaded'}. Ensure data files exist in the 'data' directory and are correctly formatted.`;
    return { error: message };
  }

  const dayData = monthData.days.find(d => parseInt(d.n) === day);

  if (!dayData) {
    return { error: `Invalid day ${day} for BS ${NEPALI_MONTHS[month-1]} ${year}. This month has ${monthData.days.length} days.` };
  }
  
  const adFullDate = getAdDateForBsDay(dayData, monthData);

  return { 
    adDate: adFullDate,
    bsDate: {
      ...bsDate,
      monthName: NEPALI_MONTHS[month-1],
      dayOfWeek: adFullDate.dayOfWeek 
    }
  };
}

export function convertAdToBs(adDate: EnglishDate): ConversionResult {
  const { year, month, day } = adDate;
  const calendar = getBsCalendarData();

  for (const key in calendar) {
    const monthData = calendar[key];
    
    // Iterate through each day of the BS month to find a match for the AD date
    let currentAdDayNumber = parseInt(monthData.days[0].e);
    let currentAdMonthValue = monthData.metadata.ad_month_start;
    let currentAdYearValue = monthData.metadata.ad_year_start;

    for (const bsDayEntry of monthData.days) {
      const parsedEntryAdDay = parseInt(bsDayEntry.e);

      if (parsedEntryAdDay < currentAdDayNumber && currentAdMonthValue === monthData.metadata.ad_month_start) {
        currentAdMonthValue = monthData.metadata.ad_month_end;
        if (monthData.metadata.ad_year_end > monthData.metadata.ad_year_start) {
            currentAdYearValue = monthData.metadata.ad_year_end;
        }
      }
      currentAdDayNumber = parsedEntryAdDay;

      if (currentAdYearValue === year && currentAdMonthValue === month && parsedEntryAdDay === day) {
        const dateObj = new Date(year, month - 1, day);
        return {
          bsDate: {
            year: monthData.bs_year,
            month: monthData.bs_month,
            day: parseInt(bsDayEntry.n),
            monthName: NEPALI_MONTHS[monthData.bs_month-1],
            dayOfWeek: dateObj.toLocaleDateString('en-US', { weekday: 'long' })
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

  const availableYears = getBsYears().join(', ');
  return { error: `BS date for AD ${day}/${month}/${year} not found. Available BS years in loaded data: ${availableYears || 'None loaded'}.` };
}

// Exporting getDaysInMonthUtil as getDaysInBsMonth to maintain consistency for form validation.
export { getDaysInMonthUtil as getDaysInBsMonth };
// getBsMonthDataForAi and getBsYears are now imported directly from bsCalendarData.ts where needed
// or used via getBsCalendarData() if access to the whole calendar is required by other functions.
