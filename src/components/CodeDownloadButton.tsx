import React from 'react';
import { Download } from 'lucide-react';

interface CodeDownloadButtonProps {
  code: string;
  language: string;
  fileName?: string;
}

const extensionMap: Record<string, string> = {
  javascript: 'js',
  typescript: 'ts',
  python: 'py',
  java: 'java',
  'c#': 'cs',
  ruby: 'rb',
  go: 'go',
  rust: 'rs',
  'c++': 'cpp',
  php: 'php',
  kotlin: 'kt',
};

export const CodeDownloadButton: React.FC<CodeDownloadButtonProps> = ({
  code,
  language,
  fileName = 'my-code',
}) => {
  const downloadCode = () => {
    const fileExtension = extensionMap[language.toLowerCase()] || 'txt';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${fileExtension}`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadCode}
      className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded-md transition-all duration-200 hover:scale-105"
      >
      <Download size={15} />
    </button>
  );
};
