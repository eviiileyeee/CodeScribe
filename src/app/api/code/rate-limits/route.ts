import { NextResponse } from 'next/server';

export async function GET() {
  // Example static rate limit info
  return NextResponse.json({
    status: 'success',
    data: {
      limit: 20,
      window: '24h',
      note: 'Each user can convert up to 20 times per day.'
    }
  });
} 