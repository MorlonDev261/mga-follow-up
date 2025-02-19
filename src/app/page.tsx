"use client";

import { useState } from "react";
import Header from "@components/Header";
import Sidebar from "@components/Sidebar";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
    </>
  );
}
