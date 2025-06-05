
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getBsYears } from '@/lib/bsCalendarData';
import { NEPALI_MONTHS } from '@/types';

const VALID_API_KEY = process.env.API_KEY_NEPALIDATE;

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key');
  if (!VALID_API_KEY || apiKey !== VALID_API_KEY) {
    return NextResponse.json({ error: "Unauthorized: Invalid or missing API Key. Provide it in 'X-API-Key' header." }, { status: 401 });
  }

  const availableYears = getBsYears();
  const exampleYear = availableYears.length > 0 ? availableYears[Math.floor(availableYears.length / 2)] : 2080; 
  const exampleMonth = 1; 
  const exampleBsMonthName = NEPALI_MONTHS[exampleMonth -1];

  const apiInfo = {
    apiName: "NepaliDate: Nepali Calendar & Bikram Sambat API",
    version: "1.3.0", // Incremented version
    status: "Operational",
    description: "A comprehensive API for Bikram Sambat (BS) to Gregorian (AD) date conversions and Nepali calendar event data. Provides detailed daily information, including Nepali holidays, festivals, tithis (lunar days), and auspicious dates for marriage (vivah) and bratabandha for a given BS month or entire BS year. Ideal for integrating Nepali Patro data into your applications. Requires API Key authentication via 'X-API-Key' header.",
    contactEmail: "contact@sevenx.com.np",
    documentationUrl: request.nextUrl.origin + "/api-info",
    authentication: {
        type: "API Key",
        headerName: "X-API-Key",
        description: "A valid API key must be provided in the 'X-API-Key' request header for all /api/calendar/* endpoints."
    },
    endpoints: [
      {
        path: "/api/calendar/info",
        method: "GET",
        description: "Provides detailed information about the Nepali Calendar API, including available endpoints, data structures, data coverage for Bikram Sambat years, and usage notes. Requires API Key.",
        parameters: [],
        exampleRequest: `${request.nextUrl.origin}/api/calendar/info`,
        exampleResponseSummary: "The current JSON response you are viewing, detailing the Bikram Sambat API capabilities.",
      },
      {
        path: "/api/calendar/{YYYY}",
        method: "GET",
        description: "Retrieves all Bikram Sambat (BS) calendar data for a specific BS year (YYYY), including all 12 months. Each month's data includes daily details, Nepali holidays, festivals, and other events. Requires API Key.",
        parameters: [
          { name: "YYYY", type: "integer", in: "path", required: true, description: `The Bikram Sambat year (e.g., ${exampleYear}). Currently, data is available for years: ${availableYears.join(', ')}.` }
        ],
        exampleRequest: `${request.nextUrl.origin}/api/calendar/${exampleYear}`,
        exampleResponse: [ 
          {
            bs_year: exampleYear,
            bs_month: 1, 
            metadata: {
              en: `Apr/May ${exampleYear - 57}`, 
              np: `${NEPALI_MONTHS[0]} ${exampleYear}`,
              ad_year_start: exampleYear - 57, 
              ad_month_start: 4,          
              ad_year_end: exampleYear - 57,  
              ad_month_end: 5            
            },
            days: [
              { n: "१", ne: "1", e: "14", t: "नवमी", f: `नव वर्ष ${exampleYear} आरम्भ`, h: true, d: 2 },
            ],
            holiFest: [`१_::_नव वर्ष ${exampleYear} आरम्भ`],
            marriage: [`२, ४, ५ गते`],
            bratabandha: [`यो महिना को लागी ब्रतबन्ध मुर्हुत छैन ।`]
          },
        ],
        detailedFieldDescriptionsUrl: `${request.nextUrl.origin}/api-info#data-structures`, 
        errorResponses: [
          { statusCode: 400, description: "Invalid year format (e.g., year not numeric) for Bikram Sambat query." },
          { statusCode: 401, description: "Unauthorized: Invalid or missing API Key." },
          { statusCode: 404, description: `Data not found for the specified Bikram Sambat (BS) year. Available mock data years for Nepali Calendar: ${availableYears.join(', ')}.` }
        ]
      },
      {
        path: "/api/calendar/{YYYY}/{MM}",
        method: "GET",
        description: "Retrieves Bikram Sambat (BS) calendar data for a specific BS year (YYYY) and month (MM, 1-12). Includes daily details, Nepali holidays, festivals, and other events. Requires API Key.",
        parameters: [
          { name: "YYYY", type: "integer", in: "path", required: true, description: `The Bikram Sambat year (e.g., ${exampleYear}). Currently, data is available for years: ${availableYears.join(', ')}.` },
          { name: "MM", type: "integer", in: "path", required: true, description: "The Bikram Sambat month (1 for Baishakh, 2 for Jestha, ..., 12 for Chaitra)." }
        ],
        exampleRequest: `${request.nextUrl.origin}/api/calendar/${exampleYear}/${exampleMonth}`,
        exampleResponse: {
          bs_year: exampleYear,
          bs_month: exampleMonth,
          metadata: {
            en: `Apr/May ${exampleYear - 57}`, 
            np: `${exampleBsMonthName} ${exampleYear}`,
            ad_year_start: exampleYear - 57, 
            ad_month_start: 4,          
            ad_year_end: exampleYear - 57,  
            ad_month_end: 5            
          },
          days: [
            { 
              n: "१", 
              ne: "1",
              e: "14", 
              t: "नवमी", 
              f: `नव वर्ष ${exampleYear} आरम्भ`, 
              h: true, 
              d: 2 
            },
            { 
              n: "२", 
              ne: "2",
              e: "15", 
              t: "दशमी", 
              f: "Event X, Event Y", 
              h: false, 
              d: 3 
            },
            {
              n: "•", 
              ne: "•", 
              e: "", 
              t: "", 
              f: "Special Unscheduled Event Note", 
              h: false, 
              d: 0 
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
        detailedFieldDescriptionsUrl: `${request.nextUrl.origin}/api-info#data-structures`, 
        errorResponses: [
          { statusCode: 400, description: "Invalid year or month format (e.g., month not 1-12, year not numeric) for Bikram Sambat query." },
          { statusCode: 401, description: "Unauthorized: Invalid or missing API Key." },
          { statusCode: 404, description: `Data not found for the specified Bikram Sambat (BS) year/month. Available mock data years for Nepali Calendar: ${availableYears.join(', ')}.` }
        ]
      }
    ],
    dataStructures: {
      BsMonthData: {
        description: "Represents all calendar data for a specific Bikram Sambat (BS) month, including metadata, daily entries, Nepali holidays, and other events.",
        fields: [
          { name: "bs_year", type: "integer", description: "The Bikram Sambat year." },
          { name: "bs_month", type: "integer", description: "The Bikram Sambat month (1 for Baishakh to 12 for Chaitra)." },
          { name: "metadata", type: "object", description: "Metadata about the BS month, including its Gregorian (AD) equivalent.", fields: [
            { name: "en", type: "string", description: "English representation of the AD month(s) and year(s) this BS month spans (e.g., 'Apr/May 2023')." },
            { name: "np", type: "string", description: "Nepali representation of the BS month and year (e.g., 'बैशाख २०८०')." },
            { name: "ad_year_start", type: "integer", description: "The Gregorian year in which the BS month begins." },
            { name: "ad_month_start", type: "integer", description: "The Gregorian month (1-12) in which the BS month begins." },
            { name: "ad_year_end", type: "integer", description: "The Gregorian year in which the BS month ends." },
            { name: "ad_month_end", type: "integer", description: "The Gregorian month (1-12) in which the BS month ends." },
          ]},
          { name: "days", type: "array<BsDayData>", description: "An array of day objects for the month, detailing daily Nepali calendar information." },
          { name: "holiFest", type: "array<string>", description: "List of Nepali holidays and festivals. Format: 'Day_::_Description'. 'Day' is BS day (Nepali numeral or '•'). Multiple events comma-separated after '::_::'." },
          { name: "marriage", type: "array<string>", description: "List of auspicious marriage (vivah) dates in the Bikram Sambat month or a message if none." },
          { name: "bratabandha", type: "array<string>", description: "List of auspicious bratabandha dates in the BS month or a message if none." }
        ]
      },
      BsDayData: {
        description: "Represents data for a single day in the Bikram Sambat calendar, including AD equivalent and event details.",
        fields: [
          { name: "n", type: "string", description: "Nepali date numeral (e.g., '१', '३२')." },
          { name: "ne", type: "string", description: "Nepali date in English numerals (e.g., '1', '32'). Can be '•' for special, non-day-specific entries in `holiFest`." },
          { name: "e", type: "string", description: "Corresponding Gregorian day of the month (e.g., '14'). May be empty for special '•' entries." },
          { name: "t", type: "string", description: "Tithi (lunar day, e.g., 'नवमी'). May be empty." },
          { name: "f", type: "string", description: "Festivals or events occurring on this day for the Nepali Patro. Multiple events may be comma-separated. Can be empty." },
          { name: "h", type: "boolean", description: "Indicates if the day is a public holiday (true) or not (false) in the Nepali calendar." },
          { name: "d", type: "integer", description: "Day of the week (1 for Sunday, 2 for Monday, ..., 7 for Saturday). Can be 0 if not applicable (e.g., special '•' entries)." }
        ]
      }
    },
    dataCoverage: {
      bsYears: availableYears.length > 0 ? availableYears.join(', ') : "No data loaded or error fetching years. Ensure data files are present for Bikram Sambat calendar.",
      note: "The data for this Nepali Calendar API is sourced from publicly available Nepali calendar information scraped from nepalicalendar.rat32.com. While efforts are made for accuracy, data should be verified for critical applications. Not all historical or future Bikram Sambat years may be available."
    },
    notes: [
      "The API serves data based on pre-scraped JSON files from the 'data' directory within the project. This forms the basis of our Bikram Sambat data.",
      "The `holiFest` array uses 'Day_::_Description' format. Multiple descriptions for the same day are comma-separated after the delimiter. 'Day' can be '•' for month-wide notes.",
      "The `ne` field in `BsDayData` provides the Nepali day as an English numeral string, useful for programmatic access to BS dates.",
      "Always check the `h` field in `BsDayData` to determine if a specific day is a Nepali holiday."
    ]
  };
  return NextResponse.json(apiInfo);
}
