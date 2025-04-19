"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeEditor from '@/components/CodeEditor';

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
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-lg font-semibold">Transformation Result</h2>
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="code">Converted Code</TabsTrigger>
          <TabsTrigger value="explanation">Explanation</TabsTrigger>
        </TabsList>
        <TabsContent value="code">
          <CodeEditor
            value={convertedCode}
            onChange={() => {}}
            language={language}
            readOnly={true}
          />
        </TabsContent>
        <TabsContent value="explanation">
          <div className="border rounded-md p-4 bg-white">
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
