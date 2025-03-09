"use client";

import * as React from "react";
import { BsMoonStarsFill } from "react-icons/bs";
import { MdWbSunny } from "react-icons/md";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ToggleTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [currentTheme, setCurrentTheme] = React.useState<"light" | "dark">("light");

  // Vérifier si le composant est monté pour éviter les erreurs SSR
  React.useEffect(() => {
    setMounted(true);
    if (resolvedTheme) {
      setCurrentTheme(resolvedTheme as "light" | "dark");
    }
  }, [resolvedTheme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span
          role="button"
          tabIndex={0}
          className="relative flex items-center justify-center p-3 rounded-full cursor-pointer transition-all duration-300 
                     hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600"
        >
          {mounted ? (
            currentTheme === "dark" ? (
              <BsMoonStarsFill className="text-xl text-gray-800 dark:text-gray-200" />
            ) : (
              <MdWbSunny className="text-xl text-yellow-400" />
            )
          ) : (
            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
          )}
          <span className="sr-only">Toggle theme</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
