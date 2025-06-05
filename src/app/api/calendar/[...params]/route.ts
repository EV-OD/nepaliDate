
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getBsCalendarData } from '@/lib/bsCalendarData';

const VALID_API_KEY = process.env.API_KEY_NEPALIDATE;

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  const apiKey = request.headers.get('X-API-Key');
  if (!VALID_API_KEY || apiKey !== VALID_API_KEY) {
    return NextResponse.json({ error: "Unauthorized: Invalid or missing API Key. Provide it in 'X-API-Key' header." }, { status: 401 });
  }

  const [year, month] = params.params || [];
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);

  if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return NextResponse.json({ error: "Invalid year or month format. Month must be 1-12." }, { status: 400 });
  }

  const bsCalendarData = getBsCalendarData();
  const key = `${yearNum}/${monthNum}`;
  const monthData = bsCalendarData[key];

  if (monthData) {
    return NextResponse.json(monthData);
  } else {
    const availableYearsArray: number[] = [];
    if (bsCalendarData && Object.keys(bsCalendarData).length > 0) {
        Object.keys(bsCalendarData).forEach(k => {
            const y = parseInt(k.split('/')[0]);
            if (!availableYearsArray.includes(y)) {
                availableYearsArray.push(y);
            }
        });
        availableYearsArray.sort((a, b) => a - b);
    }
    const availableYears = availableYearsArray.join(', ');
    return NextResponse.json({ error: `Data not found for BS ${yearNum}/${monthNum}. Available mock data is limited. Loaded years: ${availableYears || 'None (or error loading data index)'}` }, { status: 404 });
  }
}
