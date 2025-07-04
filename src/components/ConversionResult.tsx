"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeEditor from '@/components/CodeEditor';
import { useTheme } from 'next-themes';
import { Copy, Share } from 'lucide-react';
import { CodeDownloadButton } from '@/components/CodeDownloadButton';
import { useCodeSharer } from '@/hooks/useCodeSharer';
interface ConversionResultProps {
  convertedCode: string;
  explanations: string[];
  language: string;
}

const ConversionResult: React.FC<ConversionResultProps> = ({
  convertedCode,
  explanations,
  language,
}) => {
  const [copySuccess, setCopySuccess] = useState<string>("");
  const { theme } = useTheme();
  const { shareCode } = useCodeSharer();
  const handleCopy = () => {
    navigator.clipboard.writeText(convertedCode).then(() => {
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    }).catch(() => {
      setCopySuccess("Failed to copy");
      setTimeout(() => setCopySuccess(""), 2000);
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-lg font-semibold">Transformation Result</h2>
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="code">Converted Code</TabsTrigger>
          <TabsTrigger value="explanation">Explanation</TabsTrigger>
        </TabsList>
        <TabsContent value="code">
          <div className="flex items-center justify-between mb-2 ">
            <div className="flex items-center justify-end mb-2 border border-gray-200 rounded-md p-1 dark:border-gray-700">
              <span className="text-[10px]  text-green-500 dark:text-green-500 font-mono "> converted.{language.charAt(0).toUpperCase() + language.slice(1)}</span>
            </div>
            <div className="flex items-center justify-end mb-2">
              <CodeDownloadButton code={convertedCode} language={language} />
              <button
                onClick={() => shareCode(convertedCode, language, explanations)}
                className="rounded bg-white px-2 py-1 hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:hover:bg-gray-900 dark:text-white hover:text-white"
              >
                <Share className="w-3 h-3 text-gray-800 dark:text-white" />
              </button>
            <button
              onClick={handleCopy}
              className="rounded bg-white px-2 py-1 hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:hover:bg-gray-900 dark:text-white hover:text-white"
            >
              <Copy className="w-3 h-3 text-gray-800 dark:text-white" />
            </button>
              {copySuccess && (
                <span className="text-sm text-green-500 ml-2">{copySuccess}</span>
              )}
            </div>
           
            
          </div>

          <CodeEditor
            value={convertedCode}
            onChange={() => { }}
            language={language}
            readOnly={true}
          />

        </TabsContent>
        <TabsContent value="explanation">
          <div className={`border rounded-md p-4 ${theme === "light" ? "bg-white" : "bg-gray-900"}`}>
            <div className="prose prose-sm max-w-none">
              {explanations.map((explanation, index) => (
                <div key={index} className="mb-4">
                  {explanation.split('\n').map((line, lineIndex) => (
                    <p key={lineIndex}>{line}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConversionResult;
