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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

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

  const getEditorColors = () => {
    if (isDarkMode) {
      return {
        backgroundColor: '#0f172a', // slate-900
        color: '#e2e8f0', // slate-200
        headerBg: '#1e293b', // slate-800
        borderColor: '#374151', // gray-600
        lineNumberBg: '#1e293b', // slate-800
        lineNumberColor: '#64748b', // slate-500
      };
    } else {
      return {
        backgroundColor: '#ffffff', // white
        color: '#1e293b', // slate-800
        headerBg: '#f1f5f9', // slate-100
        borderColor: '#e2e8f0', // slate-200
        lineNumberBg: '#f8fafc', // slate-50
        lineNumberColor: '#64748b', // slate-500
      };
    }
  };

  const colors = getEditorColors();

  return (
    <div 
      ref={editorRef}
      className={`relative group ${className} ${isFullscreen ? 'fullscreen-editor' : ''}`}
    >
      {/* Fullscreen styles */}
      <style jsx>{`
        .fullscreen-editor {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 9999 !important;
          background: ${colors.backgroundColor} !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .fullscreen-editor .editor-container {
          height: calc(100vh - 48px) !important;
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: ${colors.lineNumberColor} ${colors.lineNumberBg};
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: ${colors.lineNumberBg};
          border-radius: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: ${colors.lineNumberColor};
          border-radius: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? '#64748b' : '#475569'};
        }
        
        .scrollbar-thin::-webkit-scrollbar-corner {
          background: ${colors.lineNumberBg};
        }
      `}</style>

      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-2 rounded-t-lg border-b"
        style={{
          backgroundColor: colors.headerBg,
          borderColor: colors.borderColor,
          color: colors.color,
        }}
      >
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4" style={{ color: colors.lineNumberColor }} />
          <span className="text-sm font-medium">
            {language}.{language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : language === 'python' ? 'py' : language}
          </span>
          {isFullscreen && (
            <span className="text-xs ml-2" style={{ color: colors.lineNumberColor }}>
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
            className="ml-2 p-1 rounded transition-colors"
            style={{
              color: colors.lineNumberColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
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
      <div
        className={`editor-container relative border-x border-b ${!isFullscreen ? 'rounded-b-lg' : ''} overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'h-[calc(100vh-48px)]' : 'h-64'
        }`}
        style={{
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
        }}
      >
        {/* Line Numbers */}
        <div 
          className="line-numbers absolute left-0 top-0 bottom-0 w-16 border-r flex flex-col overflow-hidden"
          style={{
            backgroundColor: colors.lineNumberBg,
            borderColor: colors.borderColor,
          }}
        >
          <div className="flex-1 overflow-y-hidden">
            {getLineNumbers().map((lineNumber) => (
              <div
                key={lineNumber}
                className="h-6 flex items-center justify-end pr-2 text-xs font-mono leading-6"
                style={{ 
                  minHeight: '24px',
                  color: colors.lineNumberColor,
                }}
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
                className={`language-${language} text-sm leading-6`}
                style={{ 
                  fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                  lineHeight: '24px',
                  color: colors.color,
                }}
                dangerouslySetInnerHTML={{ 
                  __html: highlightedCode || `<span style="color: ${colors.lineNumberColor}">${placeholder}</span>` 
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
              className="h-full min-h-full"
              style={{
                fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                fontSize: '14px',
                lineHeight: '24px',
                color: colors.color,
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
            <div 
              className="text-sm px-4 py-2 rounded-lg backdrop-blur-sm"
              style={{
                color: colors.lineNumberColor,
                backgroundColor: `${colors.lineNumberBg}CC`,
              }}
            >
              {placeholder}
            </div>
          </div>
        )}

        {/* Hover effect */}
        {!isFullscreen && (
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-b-lg transition-all duration-200 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default CodeEditor;