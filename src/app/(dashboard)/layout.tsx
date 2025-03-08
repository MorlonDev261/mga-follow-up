"use client";

import { useState } from "react";
import Header from "@components/Header";
import Sidebar from "@components/Sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <aside role="navigation">
        <Sidebar open={open} setOpen={setOpen} />
      </aside>
      <div className="flex-1 flex flex-col">
        <Header open={open} setOpen={setOpen} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
