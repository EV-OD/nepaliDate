
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This API route (/api/data/:year/:month) is deprecated.
// Its logic has been moved to /api/calendar/:year/:month.
// This file (src/app/api/data/[year]/[month]/route.ts) should ideally be deleted.
// It now returns a deprecation message.

export async function GET(
  request: NextRequest,
  { params }: { params: { year: string; month: string } }
) {
  const newPath = `${request.nextUrl.origin}/api/calendar/${params.year}/${params.month}`;
  return NextResponse.json(
    {
      error: 'This API endpoint (/api/data/:year/:month) is deprecated and non-functional.',
      message: `All calendar data functionality has been moved to the new endpoint: ${newPath}`,
      suggestion: 'Please update any integrations to use the new endpoint. This old route file (src/app/api/data/[year]/[month]/route.ts) should be removed from your project to avoid confusion.',
    },
    { status: 410 } // HTTP 410 Gone
  );
}
