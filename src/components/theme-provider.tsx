"use client";

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

type Props = {
  children: React.ReactNode;
} & ThemeProviderProps;

export function ThemeProvider({ children, ...props }: Props) {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}
