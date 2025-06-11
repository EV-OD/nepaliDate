
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

export const DAYS_IN_BS_MONTH: { [key: string]: number[] } = {
  "1992": [30,31,31,32,31,31,30,30,29,30,29,30],
  "2076": [31, 32, 31, 32, 31, 30, 29, 30, 29, 30, 29, 30], 
  "2077": [31, 31, 32, 31, 31, 30, 30, 29, 30, 29, 30, 30],
  "2078": [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  "2079": [31, 31, 32, 32, 31, 30, 30, 30, 29, 29,30,30], // Corrected for 2079
  "2080": [31, 32, 31, 32, 31, 30, 29, 30, 29, 30, 30, 30],
  "2081": [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 30],
  "2082": [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 30],
  "2083": [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]
};


const MIN_BS_YEAR_CLIENT = 1992;
const MAX_BS_YEAR_CLIENT = 2083; 
export const CLIENT_SIDE_BS_YEARS: number[] = Array.from(
  { length: MAX_BS_YEAR_CLIENT - MIN_BS_YEAR_CLIENT + 1 },
  (_, i) => MIN_BS_YEAR_CLIENT + i
);


export function getClientSafeDaysInBsMonth(year: number, month: number): number {
  const yearStr = year.toString();
  if (DAYS_IN_BS_MONTH[yearStr] && DAYS_IN_BS_MONTH[yearStr][month - 1]) {
    return DAYS_IN_BS_MONTH[yearStr][month - 1];
  }
  
  if (month === 2 || month === 4 ) return 32; 
  if ([1,3,5].includes(month)) return 31; 
  return 30; 
}

// Types for API Info (can be expanded)
export interface ApiParameter {
  name: string;
  type: string;
  in: 'path' | 'query' | 'header' | 'body';
  required: boolean;
  description: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  description: string;
}

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  parameters: ApiParameter[];
  exampleRequest: string;
  exampleResponse?: any;
  exampleResponseSummary?: string;
  detailedFieldDescriptionsUrl?: string;
  errorResponses?: ApiErrorResponse[];
}

export interface DataStructureFieldType {
  name: string;
  type: string;
  description: string;
  fields?: DataStructureFieldType[]; 
}
export interface DataStructure {
  description: string;
  fields: DataStructureFieldType[];
}

export interface DataCoverage {
  bsYears: string;
  note: string;
}

export type ApiNote = string;

export interface ApiInfo {
  apiName: string;
  version: string;
  status: string;
  description: string;
  contactEmail: string;
  documentationUrl: string;
  authentication: {
    type: string;
    headerName: string;
    description: string;
  };
  endpoints: ApiEndpoint[];
  dataStructures: {
    [key: string]: DataStructure;
  };
  dataCoverage: DataCoverage;
  notes: ApiNote[];
}

