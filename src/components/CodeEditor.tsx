"use client";

import React, { useState, useEffect, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import hljs from 'highlight.js';
import 'highlight.js/styles/night-owl.css';
import { FileCode, Maximize, X } from 'lucide-react';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorContentRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    try {
      const highlighted = hljs.highlight(value || ' ', { language }).value;
      setHighlightedCode(highlighted);
    } catch {
      setHighlightedCode(value);
    }
  }, [value, language]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  const handleValueChange = (code: string) => {
    if (!readOnly) {
      onChange(code);
    }
  };

  const enterFullscreen = async () => {
    if (editorRef.current && editorRef.current.requestFullscreen) {
      try {
        await editorRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        console.error('Failed to enter fullscreen:', error);
      }
    }
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (error) {
        console.error('Failed to exit fullscreen:', error);
      }
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  const getLineNumbers = () => {
    const lines = value.split('\n');
    return lines.map((_, index) => index + 1);
  };

  // Sync scroll between line numbers and editor
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const lineNumbers = editorRef.current?.querySelector('.line-numbers') as HTMLDivElement;
    if (lineNumbers) {
      lineNumbers.scrollTop = target.scrollTop;
    }
  };

  const getFileExtension = () => {
    switch (language) {
      case 'javascript': return 'js';
      case 'typescript': return 'ts';
      case 'python': return 'py';
      default: return language;
    }
  };

  return (
    <div 
      ref={editorRef}
      className={`
        relative group 
        ${className} 
        ${isFullscreen ? 'code-editor-fullscreen' : ''}
      `}
    >
      {/* Header */}
      <div className="
        flex items-center justify-between px-4 py-2 
        rounded-t-lg border-b border-slate-200 
        bg-slate-100 text-slate-800
        dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200
      ">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <span className="text-sm font-medium">
            {language}.{getFileExtension()}
          </span>
          {isFullscreen && (
            <span className="text-xs ml-2 text-slate-500 dark:text-slate-400">
              Press ESC to exit fullscreen
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <button
            onClick={toggleFullscreen}
            className="
              ml-2 p-1 rounded transition-colors
              text-slate-500 hover:text-slate-700 hover:bg-slate-200
              dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-600
            "
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <X className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Editor Container */}
      <div className={`
        editor-container relative 
        border-x border-b border-slate-200 
        bg-white text-slate-800
        dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200
        overflow-hidden transition-all duration-300
        ${!isFullscreen ? 'rounded-b-lg h-64' : 'h-screen-editor'}
      `}>
        {/* Line Numbers */}
        <div className="
          line-numbers absolute left-0 top-0 bottom-0 w-16 
          border-r border-slate-200 
          bg-slate-50 text-slate-500
          dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400
          flex flex-col overflow-hidden
        ">
          <div className="flex-1 overflow-y-hidden">
            {getLineNumbers().map((lineNumber) => (
              <div
                key={lineNumber}
                className="h-6 flex items-center justify-end pr-2 text-xs font-mono leading-6"
                style={{ minHeight: '24px' }}
              >
                {lineNumber}
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div 
          ref={editorContentRef}
          className="ml-16 h-full overflow-auto scrollbar-thin"
          onScroll={handleScroll}
        >
          {readOnly ? (
            <pre className="p-4 h-full min-h-full">
              <code
                className={`language-${language} text-sm leading-6 font-mono`}
                style={{ lineHeight: '24px' }}
                dangerouslySetInnerHTML={{ 
                  __html: highlightedCode || `<span class="text-slate-400 dark:text-slate-500">${placeholder}</span>` 
                }}
              />
            </pre>
          ) : (
            <Editor
              value={value}
              onValueChange={handleValueChange}
              highlight={(code) => {
                try {
                  return hljs.highlight(code || ' ', { language }).value;
                } catch {
                  return code;
                }
              }}
              padding={16}
              className="h-full min-h-full font-mono"
              style={{
                fontSize: '14px',
                lineHeight: '24px',
                backgroundColor: 'transparent',
                minHeight: '100%',
                resize: 'none',
                outline: 'none',
                border: 'none',
              }}
              placeholder={placeholder}
              disabled={readOnly}
            />
          )}
        </div>

        {/* Overlay for empty state */}
        {!value && !readOnly && (
          <div className="absolute inset-0 ml-16 flex items-center justify-center pointer-events-none">
            <div className="
              text-sm px-4 py-2 rounded-lg backdrop-blur-sm
              text-slate-500 bg-slate-100/80
              dark:text-slate-400 dark:bg-slate-800/80
            ">
            </div>
          </div>
        )}

        {/* Hover effect */}
        {!isFullscreen && (
          <div className="
            absolute inset-0 border-2 border-transparent 
            group-hover:border-primary/20 rounded-b-lg 
            transition-all duration-200 pointer-events-none
          " />
        )}
      </div>
    </div>
  );
};

export default CodeEditor;