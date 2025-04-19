interface TransformRequest {
  sourceCode: string;
  sourceLanguage: string;
  targetLanguage: string;
  preserveComments?: boolean;
  optimizeCode?: boolean;
  userPrompt?: string;
}

interface TransformResponse {
  status: string;
  data: {
    convertedCode: string;
    explanations: string[];
    warnings: string[];
    metadata: {
      sourceLanguage: string;
      targetLanguage: string;
      preserveComments: boolean;
      optimizeCode: boolean;
      userPrompt: string;
      codeLength: number;
      conversionTime: number;
    };
  };
}

// Replace with your actual API URL
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/code/convert`;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL environment variable is not defined');
}

export const transformCode = async (request: TransformRequest): Promise<TransformResponse> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: TransformResponse = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to transform code. Please try again later.');
  }
};

export const supportedLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
];
