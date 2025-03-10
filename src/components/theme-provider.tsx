'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children, ...props }) {
  return (
    <NextThemesProvider
      {...props}
      cookie="theme" // Assurez-vous que ce nom correspond à celui utilisé
    >
      {children}
    </NextThemesProvider>
  );
}
