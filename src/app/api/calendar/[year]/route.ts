
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getBsCalendarData, getBsYears } from '@/lib/bsCalendarData';
import type { BsMonthData } from '@/types';

const VALID_API_KEY = process.env.API_KEY_NEPALIDATE;

export async function GET(
  request: NextRequest,
  { params }: { params: { year: string } }
) {
  const apiKey = request.headers.get('X-API-Key');
  if (!VALID_API_KEY || apiKey !== VALID_API_KEY) {
    return NextResponse.json({ error: "Unauthorized: Invalid or missing API Key. Provide it in 'X-API-Key' header." }, { status: 401 });
  }

  const yearStr = params.year;
  const yearNum = parseInt(yearStr);

  if (isNaN(yearNum)) {
    return NextResponse.json({ error: "Invalid year format. Year must be numeric." }, { status: 400 });
  }

  const allCalendarData = getBsCalendarData();
  const yearData: BsMonthData[] = [];

  for (let month = 1; month <= 12; month++) {
    const key = `${yearNum}/${month}`;
    if (allCalendarData[key]) {
      yearData.push(allCalendarData[key]);
    }
  }

  if (yearData.length > 0) {
    return NextResponse.json(yearData);
  } else {
    const availableYears = getBsYears().join(', ');
    return NextResponse.json({ error: `Data not found for BS year ${yearNum}. Available mock data is limited. Loaded years: ${availableYears || 'None (or error loading data index)'}` }, { status: 404 });
  }
}
