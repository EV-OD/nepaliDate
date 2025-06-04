
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This API route (/api/data/info) is deprecated.
// Its logic has been moved to /api/calendar/info.
// This file (src/app/api/data/info/route.ts) should ideally be deleted.
// It now returns a deprecation message.

export async function GET(request: NextRequest) {
  const newInfoPath = `${request.nextUrl.origin}/api/calendar/info`;
  return NextResponse.json(
    {
      error: 'This API endpoint (/api/data/info) is deprecated.',
      message: `API information has been moved to: ${newInfoPath}`,
      suggestion: `Please update any requests to use the new endpoint. This old route file (src/app/api/data/info/route.ts) should be removed from your project.`,
    },
    { status: 410 } // HTTP 410 Gone
  );
}
