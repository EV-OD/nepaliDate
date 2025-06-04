
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
    en: string; // e.g., "May/Jun 2019"
    np: string; // e.g., "जेष्ठ २०७६"
    ad_year_start: number; // e.g. 2019
    ad_month_start: number; // e.g. 5 (May) for "May/Jun 2019"
    ad_year_end: number; // e.g. 2019
    ad_month_end: number; // e.g. 6 (Jun) for "May/Jun 2019"
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

export const DAYS_IN_BS_MONTH: { [key: string]: number[] } = {
  // Sample data, actual days vary per year. This is a rough guide.
  // Used for populating day dropdowns and basic validation if full calendar data isn't available for a year.
  "2076": [31, 32, 31, 32, 31, 30, 29, 30, 29, 30, 29, 30], 
  "2077": [31, 31, 32, 31, 31, 30, 30, 29, 30, 29, 30, 30],
  "2078": [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  "2079": [30, 31, 32, 32, 31, 30, 30, 30, 29, 29,30,30],
  "2080": [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  "2081": [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 30] 
};
