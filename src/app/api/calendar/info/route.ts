
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { generateApiInfoObject } from '@/lib/apiInfoGenerator';

const VALID_API_KEY = process.env.API_KEY_NEPALIDATE;

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('X-API-Key');
  if (!VALID_API_KEY || apiKey !== VALID_API_KEY) {
    return NextResponse.json({ error: "Unauthorized: Invalid or missing API Key. Provide it in 'X-API-Key' header." }, { status: 401 });
  }

  const requestOrigin = request.nextUrl.origin;
  const apiInfo = generateApiInfoObject({ requestOrigin });
  
  return NextResponse.json(apiInfo);
}
