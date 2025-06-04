
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getBsCalendarData } from '@/lib/bsCalendarData'; // Corrected import

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

  const bsCalendarData = getBsCalendarData(); // Correctly CALL the function
  const key = `${yearNum}/${monthNum}`;
  const monthData = bsCalendarData[key];

  if (monthData) {
    return NextResponse.json(monthData);
  } else {
    // Dynamically get available years to provide a more helpful error message
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
