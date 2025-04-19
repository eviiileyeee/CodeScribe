"use client";

import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import hljs from 'highlight.js';
import 'highlight.js/styles/night-owl.css';

interface CodeEditorProps {
  value: string;
  onChange: (code: string) => void;
  language: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  placeholder = 'Enter your code here...',
  readOnly = false,
  className = '',
}) => {
  const [highlightedCode, setHighlightedCode] = useState('');

  useEffect(() => {
    try {
      const highlighted = hljs.highlight(value || ' ', { language }).value;
      setHighlightedCode(highlighted);
    } catch {
      setHighlightedCode(value);
    }
  }, [value, language]);

  const handleValueChange = (code: string) => {
    if (!readOnly) {
      onChange(code);
    }
  };

  return (
    <div className={`border rounded-md overflow-hidden bg-code ${className}`}>
      {readOnly ? (
        <pre className="code-output p-4">
          <code 
            className={`language-${language}`} 
            dangerouslySetInnerHTML={{ __html: highlightedCode || placeholder }}
          />
        </pre>
      ) : (
        <Editor
          value={value}
          onValueChange={handleValueChange}
          highlight={code => {
            try {
              return hljs.highlight(code || ' ', { language }).value;
            } catch (error) {
              return code;
            }
          }}
          padding={16}
          className="code-editor"
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            minHeight: '200px',
          }}
          placeholder={placeholder}
          disabled={readOnly}
        />
      )}
    </div>
  );
};

export default CodeEditor;
