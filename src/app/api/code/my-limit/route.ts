import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/User';
import { connectToDatabase } from '@/lib/mongo';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    // TODO: Replace with real authentication/session logic
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ status: 'error', message: 'Missing userId.' }, { status: 400 });
    }
    const user = await User.findOne({ email: userId });
    if (!user) {
      return NextResponse.json({ status: 'error', message: 'User not found.' }, { status: 404 });
    }
    const now = new Date();
    const lastReset = user.rateLimitLastReset || now;
    const isNewDay = now.toDateString() !== new Date(lastReset).toDateString();
    const remaining = 20 - (isNewDay ? 0 : user.rateLimitCount);
    let resetTime = new Date(lastReset);
    if (isNewDay) {
      resetTime = now;
    }
    resetTime.setDate(resetTime.getDate() + 1);
    return NextResponse.json({
      status: 'success',
      data: {
        remaining,
        limit: 20,
        resetTime: resetTime.toISOString(),
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
    return NextResponse.json({ status: 'error', message: 'Unknown error' }, { status: 500 });
  }
} 