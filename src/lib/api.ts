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
    metadata?: {
      sourceLanguage: string;
      targetLanguage: string;
      preserveComments: boolean;
      optimizeCode: boolean;
      userPrompt: string;
      codeLength: number;
      conversionTime: number;
    };
  };
  rateLimit?: {
    remaining: number;  // Number of requests remaining in current window
    limit: number;      // Total requests allowed in the window
    resetTime: string;  // ISO timestamp when rate limit resets
  };
}

// Use the local Next.js API endpoint
const API_URL = '/api/code/convert';

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
      if (response.status === 404) {
        throw new Error('Backend service is not available. Please check if the service is running.');
      }
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data: TransformResponse = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the backend service. Please check your internet connection and ensure the service is running.');
    }
    throw new Error('Failed to transform code. Please try again later.');
  }
};

export const supportedLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c#', label: 'C#' },         // ✅ matches server key 'c#'
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'c++', label: 'C++' },       // ✅ matches server key 'c++'
  { value: 'kotlin', label: 'Kotlin' },
];

// Get rate limit information from backend
export const getRateLimitInfo = async (userId: string) => {
  try {
    const response = await fetch('/api/code/my-limit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching rate limit info:', error);
    throw new Error('Failed to fetch rate limit information.');
  }
};

