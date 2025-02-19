"use client";

import { useState } from "react";
import Header from "@components/Header";
import Sidebar from "@components/Sidebar";

export default function Home() {
  const [sidebarState, setSidebarState] = useState(false);

  const toggleSidebar = () => {
    setSidebarState(prev => !prev);
  };
  return (
    <>
      <Header sidebarState={sidebarState} toggleSidebar={toggleSidebar} />
      <Sidebar sidebarState={sidebarState} toggleSidebar={toggleSidebar} />
    </>
  );
}
