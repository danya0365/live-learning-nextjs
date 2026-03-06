import { LearnLandingView } from "@/src/presentation/components/learn/LearnLandingView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn JavaScript & TypeScript | Play Stack",
  description: "เรียน JavaScript และ TypeScript จากพื้นฐานถึงขั้นสูง พร้อม Interactive Code Editor",
  keywords: ["javascript", "typescript", "learn", "tutorial", "programming"],
};

export default function LearnPage() {
  return <LearnLandingView />;
}
