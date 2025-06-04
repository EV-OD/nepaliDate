import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This API route (/api/data/[year]/[month]) is deprecated.
// Its logic has been moved to /api/calendar/[...params]/route.ts.
// This file (src/app/api/data/[year]/[month]/route.ts) should ideally be deleted.
// To prevent build errors, it now returns a deprecation message.

export async function GET(
  request: NextRequest,
  { params }: { params: { year: string; month: string } }
) {
  return NextResponse.json(
    {
      error: 'This API endpoint (/api/data/:year/:month) is deprecated.',
      message: 'Please use the new endpoint: /api/calendar/:year/:month.',
      suggestion: 'The file src/app/api/data/[year]/[month]/route.ts should be removed from the project.',
    },
    { status: 410 } // HTTP 410 Gone
  );
}
