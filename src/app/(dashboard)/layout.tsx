"use client";

import { useState } from "react";
import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex">
      <Header open={open} setOpen={setOpen} />
      <aside>
        <Sidebar open={open} setOpen={setOpen} />
      </aside>
      <main>
        {children}
      </main>
    </div>
  );
}
