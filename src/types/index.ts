
export interface BsDayData {
  n: string; // nepali date
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

// This constant is now primarily a fallback. 
// The actual number of days should be derived from the loaded JSON data via getDaysInBsMonth in bsCalendarData.ts.
export const DAYS_IN_BS_MONTH: { [key: string]: number[] } = {
  // Sample data for years where JSON files might be missing or for extreme fallbacks.
  // It's recommended to have JSON files for all supported years.
  "1992": [30,31,31,32,31,31,30,30,29,30,29,30],
  "2076": [31, 32, 31, 32, 31, 30, 29, 30, 29, 30, 29, 30], 
  "2077": [31, 31, 32, 31, 31, 30, 30, 29, 30, 29, 30, 30],
  "2078": [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  "2079": [30, 31, 32, 32, 31, 30, 30, 30, 29, 29,30,30],
  "2080": [31, 32, 31, 32, 31, 30, 29, 30, 29, 30, 30, 30], // Updated based on provided 2080 data files
  "2081": [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 30],
  "2082": [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 30],
  "2083": [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]
};
