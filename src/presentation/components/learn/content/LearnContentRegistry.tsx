"use client";

import React from "react";

/**
 * Registry for custom content components.
 * 
 * When a LearnLesson has `contentType: 'component'` and `contentComponent: 'SomeKey'`,
 * the system will look up this registry to find the matching React component.
 * 
 * Usage:
 *   1. Create your component in this directory (e.g., LineOaIntroContent.tsx)
 *   2. Import and register it here:
 *      ```
 *      import { LineOaIntroContent } from './LineOaIntroContent';
 *      ```
 *      Then add to the map:
 *      ```
 *      'LineOaIntro': LineOaIntroContent,
 *      ```
 *   3. In learnLessons.ts, set:
 *      ```
 *      contentType: 'component',
 *      contentComponent: 'LineOaIntro',
 *      ```
 */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ContentComponentProps {
  lessonId: string;
}

const contentComponents: Record<string, React.ComponentType<ContentComponentProps>> = {
  // Register custom content components here
  // Example:
  // 'LineOaIntro': LineOaIntroContent,
};

export function getContentComponent(key: string): React.ComponentType<ContentComponentProps> | null {
  return contentComponents[key] || null;
}

export function ContentComponentRenderer({ componentKey, lessonId }: { componentKey: string; lessonId: string }) {
  const Component = getContentComponent(componentKey);

  if (!Component) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl text-yellow-800 dark:text-yellow-300">
        <p className="font-semibold">⚠️ ไม่พบ Content Component: <code className="px-1 bg-yellow-100 dark:bg-yellow-800 rounded">{componentKey}</code></p>
        <p className="text-sm mt-1">กรุณาลงทะเบียน component ใน <code className="px-1 bg-yellow-100 dark:bg-yellow-800 rounded">LearnContentRegistry.tsx</code></p>
      </div>
    );
  }

  return <Component lessonId={lessonId} />;
}
