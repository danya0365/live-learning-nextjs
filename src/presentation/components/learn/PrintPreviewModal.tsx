"use client";

import { useCallback, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { LineOALabPrintView } from "./labs/LineOALabPrintView";

interface PrintPreviewModalProps {
  onClose: () => void;
}

export function PrintPreviewModal({ onClose }: PrintPreviewModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "LINE OA Training 2025",
  });

  const onConfirmPrint = useCallback(() => {
    handlePrint();
  }, [handlePrint]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/80 backdrop-blur-sm print:bg-white print:backdrop-blur-none">
      {/* Header toolbar — hidden on print */}
      <div className="print:hidden flex-shrink-0 flex items-center justify-between px-6 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-white text-lg font-bold">🖨️ Print Preview</span>
          <span className="text-gray-400 text-sm">ตรวจสอบเนื้อหาก่อนสั่งพิมพ์</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onConfirmPrint}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-lg shadow-green-900/30"
          >
            <span>🖨️</span> ยืนยัน Print
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors border border-slate-600 flex items-center gap-2"
          >
            <span>✕</span> ปิด
          </button>
        </div>
      </div>

      {/* Scrollable preview area */}
      <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible">
        <LineOALabPrintView ref={printRef} />
      </div>
    </div>
  );
}
