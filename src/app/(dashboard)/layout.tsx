"use client";

import { useState } from "react";
import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const [sidebarStatus, setSidebarStatus] = useState(false);
  return (
    <div className="flex">
      <Header open={sidebarStatus} setOpen={setSidebarStatus} />
      <aside>
        <Sidebar open={sidebarStatus} setOpen={setSidebarStatus} />
      </aside>
      <main>
        {children}
      </main>
    </div>
  );
}
