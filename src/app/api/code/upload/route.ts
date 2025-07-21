import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { connectToDatabase } from '@/lib/mongo';
import { extractCodeFromFile } from '@/services/geminiService';

export async function POST(req: NextRequest) {
  // Authentication
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
  }

  // Parse multipart/form-data
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.startsWith('multipart/form-data')) {
    return NextResponse.json({ status: 'error', message: 'Content-Type must be multipart/form-data' }, { status: 400 });
  }

  // Use FormData API (Edge runtime)
  const formData = await req.formData();
  const file = formData.get('file');
  const filename = formData.get('filename');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ status: 'error', message: 'No file uploaded.' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    // Extract code from file using Gemini Flash 1.5
    const code = await extractCodeFromFile(file, typeof filename === 'string' ? filename : undefined);
    if (!code) {
      return NextResponse.json({ status: 'error', message: 'No code found in file.' }, { status: 400 });
    }
    // Return extracted code only
    return NextResponse.json({
      status: 'success',
      data: {
        convertedCode: code,
        explanations: []
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }
    return NextResponse.json({ status: 'error', message: 'Unknown error' }, { status: 500 });
  }
} 