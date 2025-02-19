"use client";

import { useState } from "react";
import Header from "@components/Header";
import Sidebar from "@components/Sidebar";

export default function Home() {
  const [sidebarState, setSidebarState] = useState<"open" | "closed">("closed");

  const toggleSidebar = () => {
    setSidebarState(prev => (prev === "open" ? "closed" : "open"));
  };
  return (
    <>
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}
