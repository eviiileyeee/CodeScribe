import { NextRequest, NextResponse } from 'next/server';
import { convertCodeWithGemini } from '@/services/geminiService';
import { checkRateLimit } from '@/lib/rateLimit';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { connectToDatabase } from '@/lib/mongo';
import { User } from '@/models/User';

export async function POST(req: NextRequest) {
  // Rate limiting (per-IP)
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ status: 'error', message: 'Rate limit exceeded' }, { status: 429 });
  }

  // Authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { sourceCode, sourceLanguage, targetLanguage, preserveComments, optimizeCode, userPrompt } = await req.json();
    if (!sourceCode || !sourceLanguage || !targetLanguage) {
      return NextResponse.json({ status: 'error', message: 'Missing required fields.' }, { status: 400 });
    }
    // Update user rate limit count
    const user = await User.findOne({ email: session.user.email });
    if (user) {
      const now = new Date();
      const lastReset = user.rateLimitLastReset || now;
      const isNewDay = now.toDateString() !== new Date(lastReset).toDateString();
      if (isNewDay) {
        user.rateLimitCount = 1;
        user.rateLimitLastReset = now;
      } else {
        user.rateLimitCount = (user.rateLimitCount || 0) + 1;
      }
      await user.save();
    }
    const result = await convertCodeWithGemini(
      sourceCode,
      sourceLanguage,
      targetLanguage,
      preserveComments,
      optimizeCode,
      userPrompt
    );
    return NextResponse.json({ status: 'success', data: result });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
    return NextResponse.json({ status: 'error', message: 'Unknown error' }, { status: 500 });
  }
} 