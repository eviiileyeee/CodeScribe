"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import LanguageSelector from '@/components/LanguageSelector';
import CodeEditor from '@/components/CodeEditor';
import ConversionResult from '@/components/ConversionResult';
import { transformCode } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, Lock, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Skeleton } from "@/components/ui/skeleton"
import { BackButton } from '@/components/BackButton'

const Index = () => {
  const { status } = useSession();
  const [sourceCode, setSourceCode] = useState('');
  const [prompt, setPrompt] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('javascript');
  const [targetLanguage, setTargetLanguage] = useState('python');
  const [result, setResult] = useState({ code: '', explanations: [] as string[] });
  const [isTransforming, setIsTransforming] = useState(false);

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const MAX_CHARACTERS = 5000;

  const handleTransform = async () => {
    if (!isAuthenticated) {
      toast.error("Authentication required", {
        description: "Please log in to transform your code."
      });
      return;
    }

    if (!sourceCode.trim()) {
      toast.error("Missing source code", {
        description: "Please enter some code to transform."
      });
      return;
    }

    if (sourceCode.length > MAX_CHARACTERS) {
      toast.error("Code too long", {
        description: `Please keep your code under ${MAX_CHARACTERS} characters. Current: ${sourceCode.length}`
      });
      return;
    }



    try {
      setIsTransforming(true);
      const response = await transformCode({
        sourceCode,
        sourceLanguage,
        targetLanguage,
        userPrompt: prompt.trim() || undefined,
        preserveComments: true,
        optimizeCode: false,
      });



      setResult({
        code: response.data.convertedCode,
        explanations: response.data.explanations,
      });

      toast.success("Transformation complete!", {
        description: `Successfully converted ${sourceLanguage} to ${targetLanguage}`
      });
    } catch (error) {
      console.error('Error transforming code:', error);
      toast.error("Transformation failed", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setIsTransforming(false);
    }
  };

  const handleCodeChange = (newCode: string) => {
    if (newCode.length <= MAX_CHARACTERS) {
      setSourceCode(newCode);
    } else {
      toast.error("Character limit exceeded", {
        description: `Maximum ${MAX_CHARACTERS} characters allowed.`
      });
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      );
    }

    if (!isAuthenticated) {
      return (
        <>
          <Lock className="mr-2 h-4 w-4" />
          Login to Transform
        </>
      );
    }

    if (isTransforming) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Transforming...
        </>
      );
    }



    return (
      <>
        Transform <ArrowRight className="ml-2 h-4 w-4" />
      </>
    );
  };

  const isButtonDisabled = () => {
    return isLoading ||
      !isAuthenticated ||
      isTransforming ||
      !sourceCode.trim() ||
      sourceCode.length > MAX_CHARACTERS;
  };





  return (
    <div className="min-h-full flex flex-col">
      <main className="flex-grow container mx-0 p-0 md:px-4 md:py-8">
        <BackButton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="col-span-1">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Source Code</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LanguageSelector
                  value={sourceLanguage}
                  onChange={setSourceLanguage}
                  label="From Language"
                />
                <LanguageSelector
                  value={targetLanguage}
                  onChange={setTargetLanguage}
                  label="To Language"
                  disabled={isTransforming}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Custom Prompt (Optional)</label>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isTransforming}
                  placeholder="E.g., 'Make the code more functional' or 'Add detailed comments'"
                  className="w-full rounded-md px-4 py-2 border"
                />
              </div>

              {/* Character Count */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Character count: {sourceCode.length}/{MAX_CHARACTERS}
                </span>
                {sourceCode.length > MAX_CHARACTERS * 0.9 && (
                  <span className={sourceCode.length > MAX_CHARACTERS ? "text-red-500 font-medium" : "text-yellow-500 font-medium"}>
                    {sourceCode.length > MAX_CHARACTERS ? "Limit exceeded" : "Approaching limit"}
                  </span>
                )}
              </div>

              <CodeEditor
                value={sourceCode}
                onChange={handleCodeChange}
                language={sourceLanguage}
                placeholder="// Enter your source code here..."
                readOnly={isTransforming}
              />

              {/* Authentication Status Message */}
              {!isAuthenticated && !isLoading && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm text-amber-800 dark:text-amber-300">
                    Please log in to transform your code
                  </span>
                </div>
              )}

              {/* Rate Limit Info */}
              {isAuthenticated && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-800 dark:text-blue-300">
                    Rate limit: 20 requests per 24 hours
                  </span>
                </div>
              )}



              <Button
                onClick={handleTransform}
                className="w-full"
                disabled={isButtonDisabled()}
              >
                {getButtonContent()}
              </Button>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardContent className="p-6 space-y-4">
              {result.code ? (
                <ConversionResult
                  convertedCode={result.code}
                  explanations={result.explanations}
                  language={targetLanguage}
                />
              ) : isTransforming ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-muted-foreground">
                  <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[200px]" />
                    <span className="sr-only">it may take a while to transform the code</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-muted-foreground">
                  <div className="p-8">
                    <h3 className="font-medium mb-2 text-lg">Transform your code</h3>
                    <p>
                      {!isAuthenticated && !isLoading
                        ? "Please log in to start transforming your code"
                        : "Enter your source code and choose languages to convert between. Results will appear here."
                      }
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Powered by AI - Transform code between languages with ease.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;