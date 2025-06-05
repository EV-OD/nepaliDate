
import fs from 'fs';
import path from 'path';
import type { BsCalendar, BsMonthData } from '@/types';

// Cache for the loaded calendar data
let loadedBsCalendarData: BsCalendar | null = null;

const MONTH_NAME_TO_NUMBER: { [key: string]: number } = {
  'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
  'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12,
};

function parseEnglishMeta(enMeta: string): Omit<BsMonthData['metadata'], 'np'> {
  // Examples: "Apr/May 2023", "Jan/Feb 2024", "Dec/Jan 2023/2024"
  const parts = enMeta.split(' ');
  const yearPart = parts.pop()!;
  const monthPart = parts.join(' ');

  const monthNames = monthPart.split('/');
  const ad_month_start_name = monthNames[0];
  const ad_month_end_name = monthNames.length > 1 ? monthNames[1] : ad_month_start_name;

  let ad_year_start: number;
  let ad_year_end: number;

  if (yearPart.includes('/')) {
    const [startYearStr, endYearStrSegment] = yearPart.split('/');
    ad_year_start = parseInt(startYearStr);
    // Handle cases like "2023/24" -> endYear should be 2024
    ad_year_end = parseInt(endYearStrSegment.length === 2 ? `${startYearStr.substring(0,2)}${endYearStrSegment}` : endYearStrSegment);
  } else {
    ad_year_start = parseInt(yearPart);
    ad_year_end = ad_year_start;
    // If month names span across year-end (e.g. Dec/Jan) but only one year is listed, adjust end year
    if (MONTH_NAME_TO_NUMBER[ad_month_start_name] === 12 && MONTH_NAME_TO_NUMBER[ad_month_end_name] === 1) {
      ad_year_end = ad_year_start + 1;
    }
  }

  return {
    en: enMeta,
    // np will be filled from JSON
    ad_year_start: ad_year_start,
    ad_month_start: MONTH_NAME_TO_NUMBER[ad_month_start_name],
    ad_year_end: ad_year_end,
    ad_month_end: MONTH_NAME_TO_NUMBER[ad_month_end_name],
  };
}

function loadCalendarDataFromFileSystem(): BsCalendar {
  const dataDir = path.join(process.cwd(), 'data');
  const calendar: BsCalendar = {};

  try {
    if (!fs.existsSync(dataDir)) {
      console.warn(`Data directory not found: ${dataDir}. Calendar will be empty.`);
      return {};
    }
    const yearDirs = fs.readdirSync(dataDir).filter(name => /^\d{4}$/.test(name) && fs.statSync(path.join(dataDir, name)).isDirectory());

    for (const yearStr of yearDirs) {
      const bsYear = parseInt(yearStr);
      const yearPath = path.join(dataDir, yearStr);
      const monthFiles = fs.readdirSync(yearPath).filter(file => file.endsWith('.json'));

      for (const monthFile of monthFiles) {
        const bsMonth = parseInt(path.basename(monthFile, '.json'));
        if (isNaN(bsMonth) || bsMonth < 1 || bsMonth > 12) {
            console.warn(`Skipping invalid month file: ${monthFile} in ${yearStr}`);
            continue;
        }
        const filePath = path.join(yearPath, monthFile);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);

        const parsedMetaBase = parseEnglishMeta(jsonData.metadata.en);

        const monthKey = `${bsYear}/${bsMonth}`;
        calendar[monthKey] = {
          bs_year: bsYear,
          bs_month: bsMonth,
          metadata: {
            ...parsedMetaBase,
            np: jsonData.metadata.np,
          },
          days: jsonData.days.map((d: any) => ({
              n: d.n,
              ne:d.ne,
              e: d.e,
              t: d.t,
              f: d.f,
              h: d.h,
              d: d.d
          })),
          holiFest: jsonData.holiFest || [],
          marriage: jsonData.marriage || [],
          bratabandha: jsonData.bratabandha || [],
        };
      }
    }
  } catch (error) {
    console.error("Error loading calendar data from file system:", error);
    return calendar;
  }
  // console.log(`Loaded ${Object.keys(calendar).length} months of data.`);
  return calendar;
}

export function getBsCalendarData(): BsCalendar {
  if (!loadedBsCalendarData) {
    loadedBsCalendarData = loadCalendarDataFromFileSystem();
  }
  return loadedBsCalendarData;
}

export function getDaysInBsMonth(year: number, month: number): number {
  const calendar = getBsCalendarData();
  const monthData = calendar[`${year}/${month}`];
  if (monthData && monthData.days) {
    return monthData.days.length;
  }

  console.warn(`Data not found for ${year}/${month} in getDaysInBsMonth. Using default fallback values.`);
  // Fallback for robustness (from src/types/index.ts - DAYS_IN_BS_MONTH logic)
  // This should ideally not be hit if data files are present for the queried range
  const genericDays: { [key: number]: number[] } = {
    2076: [31, 32, 31, 32, 31, 30, 29, 30, 29, 30, 29, 30],
    2080: [31, 32, 31, 32, 31, 30, 29, 30, 29, 30, 29, 30], // Example year 2080
    2081: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 30],
    2082: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 30], // Example year 2082
    // Add more years or a generic fallback
  };
  const yearDays = genericDays[year];
  if(yearDays && yearDays[month-1]){
    return yearDays[month-1];
  }

  if (month === 2 || month === 4 ) return 32;
  if ([1,3,5,7,8].includes(month)) return 31; // Common lengths
  return 30; // Default for others
}

export function getBsYears(): number[] {
  const calendar = getBsCalendarData();
  const years = new Set<number>();
  if (calendar) {
    for (const key in calendar) {
      years.add(parseInt(key.split('/')[0]));
    }
  }
  return Array.from(years).sort((a,b) => a-b);
}
