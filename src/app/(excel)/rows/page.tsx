"use client";

import ExcelTab from "@components/ExcelTab";

export default function HomeExcel() {
  return (
    <main className="p-1">
      <div className="bg-[#111]">
        <h3 className="text-xl px-1 mb-4">Financial Tracking</h3>
        <ExcelTab />
      </div>
    </main>
  );
}
