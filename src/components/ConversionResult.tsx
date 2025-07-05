"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeEditor from '@/components/CodeEditor';
import { useTheme } from 'next-themes';
import { Copy, Share, Download, CheckCircle, Info, FileText, Code2 } from 'lucide-react';
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
    <div className="space-y-6">
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg h-12">
          <TabsTrigger 
            value="code" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
          >
            <Code2 className="h-4 w-4" />
            <span className="hidden sm:inline">Converted Code</span>
            <span className="sm:hidden">Code</span>
          </TabsTrigger>
          <TabsTrigger 
            value="explanation" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm rounded-md transition-all duration-200"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Explanation</span>
            <span className="sm:hidden">Info</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="space-y-4">
          {/* Header with file info and actions */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                  converted.{language}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Info className="h-4 w-4" />
                <span>Ready to use</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CodeDownloadButton code={convertedCode} language={language} />
              
              <button
                onClick={() => shareCode(convertedCode, language, explanations)}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-md transition-all duration-200 hover:scale-105"
                title="Share code"
              >
                <Share className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                <span className="hidden sm:inline text-sm">Share</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-md transition-all duration-200 hover:scale-105"
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                <span className="hidden sm:inline text-sm">Copy</span>
              </button>

              {copySuccess && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-md">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    {copySuccess}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Code Editor */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <CodeEditor
              value={convertedCode}
              onChange={() => { }}
              language={language}
              readOnly={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="explanation" className="space-y-4">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 bg-white/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  Transformation Details
                </h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {explanations.map((explanation, index) => (
                  <div key={index} className="mb-6 p-4 bg-white/60 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-1">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        {explanation.split('\n').map((line, lineIndex) => (
                          <p key={lineIndex} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConversionResult;