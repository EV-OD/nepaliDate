
export interface BsDayData {
  n: string; // nepali date
  ne: string; // nepali date in english numerals
  e: string; // english date
  t: string; // tithi
  f: string; // festival
  h: boolean; // holiday
  d: number; // day: 1->sunday, 2-> monday ...
}

export interface BsMonthData {
  metadata: {
    en: string; // e.g., "May/Jun 2019" or "Dec/Jan 2023/2024"
    np: string; // e.g., "जेष्ठ २०७६"
    ad_year_start: number; // e.g. 2019
    ad_month_start: number; // e.g. 5 (May)
    ad_year_end: number; // e.g. 2019 (or 2024 for "Dec/Jan 2023/2024")
    ad_month_end: number; // e.g. 6 (Jun)
  };
  days: BsDayData[];
  holiFest: string[];
  marriage: string[];
  bratabandha: string[];
  bs_year: number;
  bs_month: number;
}

export interface BsCalendar {
  [yearMonth: string]: BsMonthData; // "YYYY/M" e.g. "2076/1"
}

export interface NepaliDate {
  year: number;
  month: number;
  day: number;
  monthName?: string;
  dayOfWeek?: string;
}

export interface EnglishDate {
  year: number;
  month: number;
  day: number;
  monthName?: string;
  dayOfWeek?: string;
}

export type ConversionResult = {
  bsDate?: NepaliDate;
  adDate?: EnglishDate;
  error?: string;
};

export const NEPALI_MONTHS = [
  "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin", 
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

export const ENGLISH_MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

// This constant is now primarily a fallback for client-side estimations.
// The actual number of days should be derived from the loaded JSON data server-side.
export const DAYS_IN_BS_MONTH: { [key: string]: number[] } = {
  "1992": [30,31,31,32,31,31,30,30,29,30,29,30],
  "2076": [31, 32, 31, 32, 31, 30, 29, 30, 29, 30, 29, 30], 
  "2077": [31, 31, 32, 31, 31, 30, 30, 29, 30, 29, 30, 30],
  "2078": [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  "2079": [30, 31, 32, 32, 31, 30, 30, 30, 29, 29,30,30],
  "2080": [31, 32, 31, 32, 31, 30, 29, 30, 29, 30, 30, 30],
  "2081": [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 30],
  "2082": [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 30],
  "2083": [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]
};

// Static list of BS years for client-side dropdowns, based on scraped data range
const MIN_BS_YEAR_CLIENT = 1992;
const MAX_BS_YEAR_CLIENT = 2083; // Based on scraper end year
export const CLIENT_SIDE_BS_YEARS: number[] = Array.from(
  { length: MAX_BS_YEAR_CLIENT - MIN_BS_YEAR_CLIENT + 1 },
  (_, i) => MIN_BS_YEAR_CLIENT + i
);

// Client-safe function to get days in a BS month
export function getClientSafeDaysInBsMonth(year: number, month: number): number {
  const yearStr = year.toString();
  if (DAYS_IN_BS_MONTH[yearStr] && DAYS_IN_BS_MONTH[yearStr][month - 1]) {
    return DAYS_IN_BS_MONTH[yearStr][month - 1];
  }
  // Fallback logic if year/month not in the detailed DAYS_IN_BS_MONTH map
  // This is a general pattern for BS months
  if (month >= 1 && month <= 6) { // Baishakh to Ashwin
    return 31; // Or 32 for some, 30 for Ashwin in some years
  } else if (month >= 7 && month <= 11) { // Kartik to Falgun
    return 30; // Or 29
  } else if (month === 12) { // Chaitra
    return 30; // Or 29
  }
  // A more generic fallback (less accurate but prevents errors)
  if (month === 2 || month === 4 ) return 32; // Jestha, Shrawan often 32
  if ([1,3,5].includes(month)) return 31; // Baishakh, Ashadh, Bhadra often 31
  return 30; // Default for others
}
