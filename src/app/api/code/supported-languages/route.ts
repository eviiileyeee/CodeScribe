import { NextResponse } from 'next/server';
import { getSupportedLanguagesList } from '@/services/geminiService';

export async function GET() {
  const languages = getSupportedLanguagesList();
  return NextResponse.json({ status: 'success', data: languages });
} 