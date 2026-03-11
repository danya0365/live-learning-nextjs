"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Import Prism for syntax highlighting
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism-tomorrow.css";

interface CodeEditorProps {
  initialCode: string;
  language?: string;
  title?: string;
  description?: string;
  expectedOutput?: string;
  hints?: string[];
  onComplete?: () => void;
  storageKey?: string; // For localStorage persistence
}

export type EditorTheme = "dark" | "monokai" | "github";

const themes: Record<EditorTheme, { bg: string; text: string; lineNumbers: string; border: string }> = {
  dark: {
    bg: "bg-slate-900",
    text: "text-gray-100",
    lineNumbers: "bg-slate-800/50 text-gray-500",
    border: "border-slate-700",
  },
  monokai: {
    bg: "bg-[#272822]",
    text: "text-[#f8f8f2]",
    lineNumbers: "bg-[#1e1f1a] text-[#75715e]",
    border: "border-[#49483e]",
  },
  github: {
    bg: "bg-[#f6f8fa]",
    text: "text-[#24292e]",
    lineNumbers: "bg-[#ebeef1] text-[#6a737d]",
    border: "border-[#e1e4e8]",
  },
};

export function CodeEditor({
  initialCode,
  language = "javascript",
  title,
  description,
  expectedOutput,
  hints = [],
  onComplete,
  storageKey,
}: CodeEditorProps) {
  // Load from localStorage if available
  const getInitialCode = () => {
    if (storageKey && typeof window !== "undefined") {
      const saved = localStorage.getItem(`playground_${storageKey}`);
      if (saved) return saved;
    }
    return initialCode;
  };

  const [code, setCode] = useState(getInitialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [theme] = useState<EditorTheme>("dark");
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Auto-save to localStorage
  useEffect(() => {
    if (storageKey && code !== initialCode) {
      localStorage.setItem(`playground_${storageKey}`, code);
    }
  }, [code, storageKey, initialCode]);

  // Sync scroll between textarea and highlight
  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current && highlightRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  // Calculate line numbers
  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Get highlighted HTML
  const getHighlightedCode = useCallback(() => {
    const grammar = Prism.languages[language] || Prism.languages.javascript;
    return Prism.highlight(code, grammar, language);
  }, [code, language]);

  // Run code safely
  const runCode = useCallback(() => {
    setIsRunning(true);
    setOutput([]);
    setIsCorrect(null);
    setErrorLine(null);

    const startTime = performance.now();
    const logs: string[] = [];

    // Override console
    const customConsole = {
      log: (...args: unknown[]) => {
        logs.push(args.map(arg => 
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(" "));
      },
      error: (...args: unknown[]) => {
        logs.push(`❌ Error: ${args.join(" ")}`);
      },
      warn: (...args: unknown[]) => {
        logs.push(`⚠️ Warning: ${args.join(" ")}`);
      },
    };

    try {
      // Create a safe execution context
      const executeCode = new Function(
        "console",
        `
        try {
          ${code}
        } catch (e) {
          console.error(e.message);
          throw e;
        }
        `
      );

      executeCode(customConsole);

      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      setOutput(logs);

      // Check if output matches expected
      if (expectedOutput) {
        const outputStr = logs.join("\n").trim();
        const isMatch = outputStr.includes(expectedOutput.trim());
        setIsCorrect(isMatch);
        if (isMatch && onComplete) {
          onComplete();
        }
      }
    } catch (error) {
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      
      const errorMessage = (error as Error).message;
      setOutput([`❌ Error: ${errorMessage}`]);
      setIsCorrect(false);
      
      // Try to extract line number from error
      const lineMatch = errorMessage.match(/line (\d+)/i);
      if (lineMatch) {
        setErrorLine(parseInt(lineMatch[1], 10));
      }
    } finally {
      setIsRunning(false);
    }
  }, [code, expectedOutput, onComplete]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runCode();
      return;
    }

    // Escape to clear output
    if (e.key === "Escape") {
      e.preventDefault();
      setOutput([]);
      setIsCorrect(null);
      setExecutionTime(null);
      return;
    }

    // Tab handling
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // Copy code to clipboard
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  // Reset code
  const resetCode = () => {
    setCode(initialCode);
    setOutput([]);
    setIsCorrect(null);
    setExecutionTime(null);
    setErrorLine(null);
    if (storageKey) {
      localStorage.removeItem(`playground_${storageKey}`);
    }
  };

  const currentTheme = themes[theme];

  return (
    <div className={`${currentTheme.bg} rounded-xl border ${currentTheme.border} overflow-hidden shadow-xl`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 bg-slate-800 border-b ${currentTheme.border}`}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm text-gray-400">
            {title || `${language} Editor`}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyCode}
            className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-gray-300 rounded transition-colors"
            title="Copy code"
          >
            {copied ? "✅ Copied!" : "📋 Copy"}
          </button>
          <button
            onClick={resetCode}
            className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-gray-300 rounded transition-colors"
          >
            🔄 Reset
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50 font-medium"
          >
            {isRunning ? "⏳ Running..." : "▶ Run (⌘↵)"}
          </button>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700">
          <p className="text-sm text-gray-300">{description}</p>
        </div>
      )}

      {/* Code Editor */}
      <div className="relative flex">
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          className={`flex-shrink-0 w-12 ${currentTheme.lineNumbers} text-right pr-3 py-4 text-sm font-mono select-none overflow-hidden`}
          style={{ height: "300px" }}
        >
          {lineNumbers.map((num) => (
            <div 
              key={num} 
              className={`leading-6 ${errorLine === num ? "bg-red-500/20 text-red-400" : ""}`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Editor container */}
        <div className="relative flex-1" style={{ height: "300px" }}>
          {/* Syntax highlighted layer */}
          <pre
            ref={highlightRef}
            className={`absolute inset-0 ${currentTheme.text} font-mono text-sm p-4 overflow-auto pointer-events-none leading-6 whitespace-pre-wrap break-words`}
            dangerouslySetInnerHTML={{ __html: getHighlightedCode() + "\n" }}
            aria-hidden="true"
          />
          
          {/* Textarea for editing */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white font-mono text-sm p-4 resize-none focus:outline-none leading-6"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </div>
      </div>

      {/* Output */}
      {output.length > 0 && (
        <div className={`border-t ${currentTheme.border}`}>
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">📤 Output</span>
              {executionTime !== null && (
                <span className="text-xs text-gray-500">
                  ⏱️ {executionTime.toFixed(1)}ms
                </span>
              )}
            </div>
            {isCorrect !== null && (
              <span className={`text-sm font-medium ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                {isCorrect ? "✅ Correct!" : "❌ Try again"}
              </span>
            )}
          </div>
          <div className="p-4 bg-black/30 font-mono text-sm max-h-48 overflow-auto">
            {output.map((line, i) => (
              <div key={i} className="text-gray-300 whitespace-pre-wrap">{line}</div>
            ))}
          </div>
        </div>
      )}

      {/* Hints */}
      {hints.length > 0 && (
        <div className={`border-t ${currentTheme.border}`}>
          <button
            onClick={() => setShowHints(!showHints)}
            className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-gray-300 bg-slate-800/50 transition-colors"
          >
            💡 {showHints ? "Hide Hints" : "Show Hints"} ({hints.length})
          </button>
          {showHints && (
            <div className="p-4 bg-slate-800/30">
              <ul className="space-y-2">
                {hints.map((hint, i) => (
                  <li key={i} className="text-sm text-gray-400 flex gap-2">
                    <span className="text-yellow-500">💡</span>
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Success message */}
      {isCorrect && (
        <div className={`px-4 py-3 bg-green-900/30 border-t border-green-500/30`}>
          <div className="flex items-center gap-2 text-green-400">
            <span className="text-xl">🎉</span>
            <span className="font-semibold">ยอดเยี่ยม! คุณทำถูกต้อง!</span>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="px-4 py-2 bg-slate-800/30 text-xs text-gray-500 flex gap-4">
        <span>⌘/Ctrl + Enter: Run</span>
        <span>Esc: Clear output</span>
        <span>Tab: Indent</span>
      </div>
    </div>
  );
}

// Quick code sandbox for simple examples
export function CodeSandbox({ code, language = "javascript" }: { code: string; language?: string }) {
  return (
    <CodeEditor
      initialCode={code}
      language={language}
      title="Try it yourself"
    />
  );
}
