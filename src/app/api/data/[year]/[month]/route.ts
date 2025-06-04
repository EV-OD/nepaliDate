
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getBsCalendarData } from '@/lib/bsCalendarData';

export async function GET(
  request: NextRequest,
  { params }: { params: { year: string; month: string } }
) {
  const { year, month } = params;
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);

  if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return NextResponse.json({ error: "Invalid year or month format. Month must be 1-12." }, { status: 400 });
  }

  const bsCalendarData = getBsCalendarData(); // Call the function to get data
  const key = `${yearNum}/${monthNum}`;
  const monthData = bsCalendarData[key];

  if (monthData) {
    return NextResponse.json(monthData);
  } else {
    return NextResponse.json({ error: `Data not found for BS ${yearNum}/${monthNum}. Available mock data is limited.` }, { status: 404 });
  }
}
