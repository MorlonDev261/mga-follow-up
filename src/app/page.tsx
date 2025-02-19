"use client";

import { useState } from "react";
import Header from "@components/Header";
import Sidebar from "@components/Sidebar";

export default function Home() {
  const [sidebarState, setSidebarState] = useState(false);

  return (
    <>
      <Header sidebarState={sidebarState} setSidebarState={setSidebarState} />
      <Sidebar sidebarState={sidebarState} setSidebarState={setSidebarState} />
    </>
  );
}
