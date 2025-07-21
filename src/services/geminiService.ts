import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Supported language map for validation
export const SUPPORTED_LANGUAGES: Record<string, string[]> = {
  'javascript': ['Python', 'TypeScript', 'Java', 'C#', 'Ruby', 'Go', 'Rust', 'C++', 'PHP', 'Kotlin'],
  'python': ['JavaScript', 'TypeScript', 'Java', 'C#', 'Ruby', 'Go', 'Rust', 'C++', 'PHP', 'Kotlin'],
  'java': ['JavaScript', 'Python', 'TypeScript', 'C#', 'Ruby', 'Go', 'Rust', 'C++', 'PHP', 'Kotlin'],
  'c#': ['JavaScript', 'Python', 'TypeScript', 'Java', 'Ruby', 'Go', 'Rust', 'C++', 'PHP', 'Kotlin'],
  'typescript': ['JavaScript', 'Python', 'Java', 'C#', 'Ruby', 'Go', 'Rust', 'C++', 'PHP', 'Kotlin'],
  'ruby': ['JavaScript', 'Python', 'TypeScript', 'Java', 'C#', 'Go', 'Rust', 'C++', 'PHP', 'Kotlin'],
  'go': ['JavaScript', 'Python', 'TypeScript', 'Java', 'C#', 'Ruby', 'Rust', 'C++', 'PHP', 'Kotlin'],
  'rust': ['JavaScript', 'Python', 'TypeScript', 'Java', 'C#', 'Ruby', 'Go', 'C++', 'PHP', 'Kotlin'],
  'c++': ['JavaScript', 'Python', 'TypeScript', 'Java', 'C#', 'Ruby', 'Go', 'Rust', 'PHP', 'Kotlin'],
  'php': ['JavaScript', 'Python', 'TypeScript', 'Java', 'C#', 'Ruby', 'Go', 'Rust', 'C++', 'Kotlin'],
  'kotlin': ['JavaScript', 'Python', 'TypeScript', 'Java', 'C#', 'Ruby', 'Go', 'Rust', 'C++', 'PHP']
};

export function getSupportedLanguagesList() {
  return Object.entries(SUPPORTED_LANGUAGES).map(([source, targets]) => ({
    language: source,
    canConvertTo: targets
  }));
}

export async function convertCodeWithGemini(
  sourceCode: string,
  sourceLanguage: string,
  targetLanguage: string,
  preserveComments = true,
  optimizeCode = false,
  userPrompt = ''
) {
  const startTime = Date.now();
  try {
    sourceLanguage = sourceLanguage.toLowerCase();
    if (!Object.keys(SUPPORTED_LANGUAGES).includes(sourceLanguage)) {
      throw new Error(`Source language '${sourceLanguage}' is not supported`);
    }
    const normalizedTargetLang = targetLanguage.toLowerCase();
    const supportedTargets = SUPPORTED_LANGUAGES[sourceLanguage].map(lang => lang.toLowerCase());
    if (!supportedTargets.includes(normalizedTargetLang)) {
      throw new Error(`Conversion from '${sourceLanguage}' to '${targetLanguage}' is not supported`);
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    const prompt = `
    You are an expert code translator. 
    Convert the following ${sourceLanguage} code to ${targetLanguage}.
    ${preserveComments ? 'Preserve all comments and documentation.' : 'Only include essential comments in the output.'}
    ${optimizeCode ? 'Optimize the code for the target language, using language-specific idioms and best practices.' : 'Keep the code structure as close to the original as possible.'}
    ${userPrompt ? `Additionally, follow these specific instructions: ${userPrompt}` : ''}
    Return the result in this JSON format:
    {
      "convertedCode": "the full converted code here",
      "explanations": [
        "explanation of key conversion decisions or changes",
        "explanation of any idioms or patterns used"
      ],
      "warnings": [
        "any potential issues with the conversion",
        "functionality that might not translate directly"
      ]
    }
    Only return valid JSON without any explanations or additional text.
    SOURCE CODE (${sourceLanguage}):
    
    ${sourceCode}
    
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('Failed to get valid JSON response from Gemini');
    }
    const jsonText = text.substring(jsonStart, jsonEnd);
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(jsonText);
    } catch {
      throw new Error('Failed to parse the AI response');
    }
    if (!parsedResponse.convertedCode) {
      throw new Error('AI response missing converted code');
    }
    const conversionTime = Date.now() - startTime;
    return {
      convertedCode: parsedResponse.convertedCode,
      explanations: parsedResponse.explanations || [],
      warnings: parsedResponse.warnings || [],
      conversionTime
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Code conversion failed');
    }
    throw new Error('Code conversion failed');
  }
}

export async function convertCode(code: string, fromLanguage: string, toLanguage: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Convert the following ${fromLanguage} code to ${toLanguage}. Provide only the converted code without any explanations:\n\n${code}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const convertedCode = response.text();
    return convertedCode.trim();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Failed to convert code. Please try again.');
    }
    throw new Error('Failed to convert code. Please try again.');
  }
}

/**
 * Extract code snippets from an uploaded file using Gemini Flash 1.5.
 * Supports .txt, .pdf, and .docx files.
 * @param file File object from FormData
 * @returns Extracted code as a string
 */
export async function extractCodeFromFile(file: File, filename?: string): Promise<string> {
  let text = '';
  // Read file content based on type or extension
  const codeMimeTypes = [
    'application/javascript',
    'application/x-javascript',
    'text/javascript',
    'text/x-python',
    'text/x-java-source',
    'text/x-typescript',
    'text/x-c++src',
    'text/x-csrc',
    'text/x-csharp',
    'text/x-ruby',
    'text/x-go',
    'application/x-httpd-php',
    'text/x-rustsrc',
    'text/x-kotlin',
  ];
  if (
    file.type === 'text/plain' ||
    codeMimeTypes.includes(file.type) ||
    (filename && /\.(js|py|java|ts|cpp|c|cs|rb|go|php|rs|kt|txt)$/i.test(filename))
  ) {
    text = await file.text();
  } else {
    throw new Error('Unsupported file type for code extraction');
  }

  // Use Gemini Flash 1.5 to extract code blocks from the text
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
  const prompt = `Extract all code snippets from the following document. Only return the code, concatenated together, and nothing else. If there is no code, return an empty string.\n\nDOCUMENT:\n\n${text}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const code = response.text().trim();
  return code;
} 