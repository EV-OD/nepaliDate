
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getBsYears } from '@/lib/bsCalendarData';
import { NEPALI_MONTHS } from '@/types';

export async function GET(request: NextRequest) {
  const availableYears = getBsYears();
  const exampleYear = availableYears.length > 0 ? availableYears[Math.floor(availableYears.length / 2)] : 2080; // Pick a mid-range year
  const exampleMonth = 1; // Baishakh
  const exampleBsMonthName = NEPALI_MONTHS[exampleMonth -1];

  const apiInfo = {
    apiName: "Date Bliss Calendar API",
    version: "1.1.0", // Updated version
    status: "Operational",
    description: "A comprehensive API for Bikram Sambat (BS) to Gregorian (AD) date conversions and Nepali calendar event data. Provides detailed daily information, including holidays, festivals, tithis, and auspicious dates for marriage and bratabandha for a given BS month.",
    contactEmail: "api-support@datebliss.example.com",
    documentationUrl: request.nextUrl.origin + "/api-info",
    endpoints: [
      {
        path: "/api/calendar/info",
        method: "GET",
        description: "Provides detailed information about the API, including available endpoints, data structures, data coverage, and usage notes.",
        parameters: [],
        exampleRequest: `${request.nextUrl.origin}/api/calendar/info`,
        exampleResponseSummary: "The current JSON response you are viewing, detailing API capabilities.",
      },
      {
        path: "/api/calendar/{YYYY}/{MM}",
        method: "GET",
        description: "Retrieves Bikram Sambat calendar data for a specific BS year (YYYY) and month (MM, 1-12).",
        parameters: [
          { name: "YYYY", type: "integer", in: "path", required: true, description: `The Bikram Sambat year (e.g., ${exampleYear}). Currently, data is available for years: ${availableYears.join(', ')}.` },
          { name: "MM", type: "integer", in: "path", required: true, description: "The Bikram Sambat month (1 for Baishakh, 2 for Jestha, ..., 12 for Chaitra)." }
        ],
        exampleRequest: `${request.nextUrl.origin}/api/calendar/${exampleYear}/${exampleMonth}`,
        exampleResponse: {
          bs_year: exampleYear,
          bs_month: exampleMonth,
          metadata: {
            en: `Apr/May ${exampleYear - 57}`, // Approximate AD representation
            np: `${exampleBsMonthName} ${exampleYear}`,
            ad_year_start: exampleYear - 57, // Example, actual will vary
            ad_month_start: 4,          // Example, actual will vary
            ad_year_end: exampleYear - 57,  // Example, actual will vary
            ad_month_end: 5            // Example, actual will vary
          },
          days: [
            { 
              n: "१", 
              ne: "1",
              e: "14", 
              t: "नवमी", 
              f: `नव वर्ष ${exampleYear} आरम्भ`, 
              h: true, 
              d: 2 // Example: Monday
            },
            { 
              n: "२", 
              ne: "2",
              e: "15", 
              t: "दशमी", 
              f: "Event X, Event Y", 
              h: false, 
              d: 3 // Example: Tuesday
            },
            {
              n: "•", 
              ne: "•", // Special marker, not a numerical day
              e: "", // English date might be empty or not applicable
              t: "", // Tithi might be empty
              f: "Special Unscheduled Event Note", 
              h: false, 
              d: 0 // Day of week might be 0 or not applicable
            }
          ],
          holiFest: [
            `१_::_नव वर्ष ${exampleYear} आरम्भ, विश्वध्वजपातन (विस्काजात्रा)`,
            `२_::_Festival A, Festival B`,
            `•_::_Some general festival note for the month`
          ],
          marriage: [
            `२, ४, १५, १६ र १७ गते`
          ],
          bratabandha: [
            `यो महिना को लागी ब्रतबन्ध मुर्हुत छैन ।`
          ]
        },
        detailedFieldDescriptionsUrl: `${request.nextUrl.origin}/api-info#data-structures`, // Link to frontend section
        errorResponses: [
          { statusCode: 400, description: "Invalid year or month format (e.g., month not 1-12, year not numeric)." },
          { statusCode: 404, description: `Data not found for the specified BS year/month. Available mock data years: ${availableYears.join(', ')}.` }
        ]
      }
    ],
    dataStructures: {
      BsMonthData: {
        description: "Represents all data for a specific Bikram Sambat month.",
        fields: [
          { name: "bs_year", type: "integer", description: "The Bikram Sambat year." },
          { name: "bs_month", type: "integer", description: "The Bikram Sambat month (1-12)." },
          { name: "metadata", type: "object", description: "Metadata about the month.", fields: [
            { name: "en", type: "string", description: "English representation of the AD month(s) and year(s) this BS month spans (e.g., 'Apr/May 2023')." },
            { name: "np", type: "string", description: "Nepali representation of the BS month and year (e.g., 'बैशाख २०८०')." },
            { name: "ad_year_start", type: "integer", description: "The Gregorian year in which the BS month begins." },
            { name: "ad_month_start", type: "integer", description: "The Gregorian month (1-12) in which the BS month begins." },
            { name: "ad_year_end", type: "integer", description: "The Gregorian year in which the BS month ends." },
            { name: "ad_month_end", type: "integer", description: "The Gregorian month (1-12) in which the BS month ends." },
          ]},
          { name: "days", type: "array<BsDayData>", description: "An array of day objects for the month." },
          { name: "holiFest", type: "array<string>", description: "List of holidays and festivals. Each string typically starts with the BS day (Nepali numeral or '•') followed by '::_::' and then the event description. Multiple events on the same day might be comma-separated after the delimiter." },
          { name: "marriage", type: "array<string>", description: "List of auspicious marriage dates or a message indicating no dates." },
          { name: "bratabandha", type: "array<string>", description: "List of auspicious bratabandha dates or a message indicating no dates." }
        ]
      },
      BsDayData: {
        description: "Represents data for a single day in the Bikram Sambat calendar.",
        fields: [
          { name: "n", type: "string", description: "Nepali date numeral (e.g., '१', '३२')." },
          { name: "ne", type: "string", description: "Nepali date in English numerals (e.g., '1', '32'). Could be '•' for special entries." },
          { name: "e", type: "string", description: "Corresponding Gregorian day of the month (e.g., '14'). Can be empty." },
          { name: "t", type: "string", description: "Tithi (lunar day, e.g., 'नवमी'). Can be empty." },
          { name: "f", type: "string", description: "Festivals or events occurring on this day. Multiple events may be comma-separated. Can be empty." },
          { name: "h", type: "boolean", description: "Indicates if the day is a public holiday (true) or not (false)." },
          { name: "d", type: "integer", description: "Day of the week (1 for Sunday, 2 for Monday, ..., 7 for Saturday). Can be 0 if not applicable." }
        ]
      }
    },
    dataCoverage: {
      bsYears: availableYears.length > 0 ? availableYears.join(', ') : "No data loaded or error fetching years. Ensure data files are present.",
      note: "The data is sourced from publicly available Nepali calendar information scraped from nepalicalendar.rat32.com. While efforts are made for accuracy, data should be verified for critical applications. Not all historical or future years may be available."
    },
    notes: [
      "The API serves data based on pre-scraped JSON files from the 'data' directory within the project.",
      "The `holiFest` array uses 'Day_::_Description' format. Multiple descriptions for the same day are comma-separated after the delimiter.",
      "The `ne` field in `BsDayData` provides the Nepali day as an English numeral string, useful for programmatic access.",
      "Always check the `h` field in `BsDayData` to determine if a specific day is a holiday."
    ]
  };
  return NextResponse.json(apiInfo);
}

