
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getBsYears } from '@/lib/bsCalendarData'; // Import to get available years dynamically

export async function GET(request: NextRequest) {
  const availableYears = getBsYears();
  const exampleYear = availableYears.length > 0 ? availableYears[0] : 2080; // Use a dynamic year for example if available
  const exampleMonth = 1;

  const apiInfo = {
    apiName: "Date Bliss Calendar API",
    version: "1.0.0",
    status: "Operational",
    description: "A comprehensive API for Bikram Sambat (BS) to Gregorian (AD) date conversions and Nepali calendar event data, including holidays, festivals, marriage, and bratabandha dates.",
    contactEmail: "api-support@datebliss.example.com", // Example contact
    documentationUrl: request.nextUrl.origin + "/api-info", // Dynamic URL to this page
    endpoints: [
      {
        path: "/api/data/info",
        method: "GET",
        description: "Provides detailed information about the API, including available endpoints, data coverage, and usage notes.",
        parameters: [],
        exampleRequest: `${request.nextUrl.origin}/api/data/info`,
        exampleResponse: "The current JSON response you are viewing.",
      },
      {
        path: "/api/data/{YYYY}/{MM}",
        method: "GET",
        description: "Retrieves Bikram Sambat calendar data for a specific BS year (YYYY) and month (MM, 1-12). The data includes day-by-day details (Nepali date, English date, tithi, festivals, holiday status) and monthly lists of holidays, marriage dates, and bratabandha dates.",
        parameters: [
          { name: "YYYY", type: "integer", in: "path", required: true, description: "The Bikram Sambat year (e.g., 2081)." },
          { name: "MM", type: "integer", in: "path", required: true, description: "The Bikram Sambat month (1 for Baishakh, 12 for Chaitra)." }
        ],
        exampleRequest: `${request.nextUrl.origin}/api/data/${exampleYear}/${exampleMonth}`,
        exampleResponse: {
          metadata: {
            en: "Apr/May XXXX",
            np: `बैशाख ${exampleYear}`,
            ad_year_start: "XXXX",
            ad_month_start: "X",
            ad_year_end: "XXXX",
            ad_month_end: "X"
          },
          days: [
            { n: "१", e: "14", t: "नवमी", f: "नव वर्ष XXXX आरम्भ", h: true, d: 2 },
            { n: "२", e: "15", t: "दशमी", f: "Event X", h: false, d: 3 },
            "...more days..."
          ],
          holiFest: [`१ गते नव वर्ष ${exampleYear} आरम्भ, विश्वध्वजपातन (विस्काजात्रा)`, "...more events..."],
          marriage: ["२, ३, ४ र ५ गते", "...more dates..."],
          bratabandha: ["९ र १० गते", "...more dates..."],
          bs_year: exampleYear,
          bs_month: exampleMonth
        },
        errorResponses: [
          { statusCode: 400, description: "Invalid year or month format." },
          { statusCode: 404, description: "Data not found for the specified BS year/month. Mock data is limited." }
        ]
      }
    ],
    dataCoverage: {
      bsYears: availableYears.length > 0 ? availableYears.join(', ') : "No data loaded or error fetching years. Ensure data files are present.",
      note: "The data is sourced from publicly available Nepali calendar information. While efforts are made for accuracy, data should be verified for critical applications."
    },
    notes: [
      "The API currently serves data based on pre-scraped JSON files.",
      "Dates are provided in Bikram Sambat (BS) and corresponding Gregorian (AD) where applicable.",
      "For the /api/data/{YYYY}/{MM} endpoint, 'h: true' indicates a holiday.",
      "Day of the week ('d') in the 'days' array: 1 for Sunday, 2 for Monday, ..., 7 for Saturday."
    ]
  };
  return NextResponse.json(apiInfo);
}

