"use client";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold mt-8 mb-3 text-indigo-600 dark:text-indigo-400 border-b border-indigo-200 dark:border-indigo-800 pb-2">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-900 dark:text-white">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-base font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900 dark:text-white">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="italic text-gray-600 dark:text-gray-400">{children}</em>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 ml-1 space-y-1.5 list-disc list-inside">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-1 space-y-1.5 list-decimal list-inside">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-gray-700 dark:text-gray-300 leading-relaxed pl-1">
      <span className="inline">{children}</span>
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 pl-4 border-l-4 border-indigo-400 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-r-lg py-3 pr-4 text-gray-700 dark:text-gray-300 italic">
      {children}
    </blockquote>
  ),
  code: ({ className, children }) => {
    // If this code element has a language class, it's inside a <pre> block
    // and will be styled by the pre component — just render plain
    if (className?.includes("language-")) {
      return <code className="block text-sm font-mono">{children}</code>;
    }
    // Inline code styling (single backtick)
    return (
      <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-sm text-pink-600 dark:text-pink-400 font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }) => {
    return (
      <pre className="bg-gray-900 dark:bg-slate-950 text-gray-100 p-4 rounded-xl overflow-x-auto my-4 text-sm border border-gray-700 dark:border-slate-700 shadow-lg [&_code]:bg-transparent [&_code]:text-gray-100 [&_code]:p-0 [&_code]:text-sm [&_code]:rounded-none">
        {children}
      </pre>
    );
  },
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
      <table className="w-full text-sm text-left">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 text-gray-900 dark:text-gray-200 uppercase text-xs tracking-wider">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
      {children}
    </tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-indigo-200 dark:border-indigo-800">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
      {children}
    </td>
  ),
  hr: () => (
    <hr className="my-6 border-gray-200 dark:border-slate-700" />
  ),
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt || ""}
      className="my-4 rounded-xl shadow-md max-w-full h-auto border border-gray-200 dark:border-slate-700"
    />
  ),
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose-custom">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
