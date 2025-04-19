"use client";

import React, { useState } from 'react';
import LanguageSelector from '@/components/LanguageSelector';
import CodeEditor from '@/components/CodeEditor';
import ConversionResult from '@/components/ConversionResult';
import { transformCode } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Skeleton } from "@/components/ui/skeleton"

const Index = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [prompt, setPrompt] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('javascript');
  const [targetLanguage, setTargetLanguage] = useState('python');
  const [result, setResult] = useState({ code: '', explanations: [] as string[] });
  const [isTransforming, setIsTransforming] = useState(false);

  const handleTransform = async () => {
    if (!sourceCode.trim()) {
      toast.error("Missing source code", {
        description: "Please enter some code to transform."
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

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Transform your code between programming languages
        </h1>

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

              <CodeEditor
                value={sourceCode}
                onChange={setSourceCode}
                language={sourceLanguage}
                placeholder="// Enter your source code here..."
                readOnly={isTransforming}
              />

              <Button
                onClick={handleTransform}
                className="w-full"
                disabled={isTransforming || !sourceCode.trim()}
              >
                {isTransforming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Transforming...
                  </>
                ) : (
                  <>
                    Transform <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
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
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-muted-foreground">
                  <div className="p-8">
                    <h3 className="font-medium mb-2 text-lg">Transform your code</h3>
                    <p>
                      Enter your source code and choose languages to convert between.
                      Results will appear here.
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
