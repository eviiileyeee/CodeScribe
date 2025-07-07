import { useState } from 'react';

interface ConversionResult {
  convertedCode: string;
  explanations: string[];
  warnings?: string[];
  conversionTime?: number;
}

export function useCodeConversion() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convertCode = async ({
    sourceCode,
    sourceLanguage,
    targetLanguage,
    preserveComments = true,
    optimizeCode = false,
    userPrompt = ''
  }: {
    sourceCode: string;
    sourceLanguage: string;
    targetLanguage: string;
    preserveComments?: boolean;
    optimizeCode?: boolean;
    userPrompt?: string;
  }) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/code/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceCode,
          sourceLanguage,
          targetLanguage,
          preserveComments,
          optimizeCode,
          userPrompt
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setResult(data.data);
      } else {
        setError(data.message || 'Conversion failed');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Network error');
      } else {
        setError('Network error');
      }
    } finally {
      setLoading(false);
    }
  };

  return { convertCode, loading, result, error };
} 