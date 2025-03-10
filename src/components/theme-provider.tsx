"use client";

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

type Props = {
  children: React.ReactNode;
} & ThemeProviderProps;

export function ThemeProvider({ children, ...props }: Props) {
  return (
    <NextThemesProvider defaultTheme="dark" enableSystem {...props}>
      {children}
    </NextThemesProvider>
  );
}
