import { QAView } from "@/src/presentation/components/qa/QAView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'QA Checklist | Live Learning',
  description: 'Pre-production Quality Assurance Checklist for Live Learning platform',
};

export default function QAPage() {
  return <QAView />;
}
