'use client'

import { useEffect } from 'react'

export default function ThemeScript() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "system";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (theme === "dark" || (theme === "system" && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return null;
}
