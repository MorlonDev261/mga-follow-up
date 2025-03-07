"use client";

import { useState } from "react";
import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const [SidebarStatus, setSidebarStatus] = useState(false);
  return (
    <div className="flex">
      <Header open={SidebarStatus} setOpen={setSidebarStatus} />
      <aside>
        <Sidebar open={SidebarStatus} setOpen={setSidebarStatus} />
      </aside>
      <main>
        {children}
      </main>
    </div>
  );
}
