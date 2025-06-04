import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const apiInfo = {
    message: "Welcome to the Date Bliss API!",
    endpoints: [
      {
        path: "/api/data/info",
        method: "GET",
        description: "Provides information about the API endpoints.",
      },
      {
        path: "/api/data/{YYYY}/{MM}",
        method: "GET",
        description: "Retrieves Bikram Sambat calendar data for a specific year (YYYY) and month (MM, 1-12).",
        example: "/api/data/2076/2",
      }
    ],
    dataStructureNote: "The data for YYYY/MM includes metadata, list of days with BS to AD mapping, holidays, marriage dates, and bratabandha dates.",
    availableYears: [2076, 2081], // Example, can be dynamically generated based on bsCalendarData.ts
  };
  return NextResponse.json(apiInfo);
}
