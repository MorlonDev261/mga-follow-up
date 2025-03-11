import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeScript from '@/components/ThemeScript';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  return {
    title: "MGA Follow UP | Simplify Your Finances",
    description: "Manage your moulaa easily 😎. Track your payments, customers, and more.",
    keywords: "finance, tracking, payments, MGA Follow UP",
    authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
    creator: "AZTEK DWC LLC",
    manifest: "/manifest.json",
    icons: { 
      icon: "/icon-512x512.png", // Icône par défaut
      shortcut: "/icon-192x192.png", // Icône pour les raccourcis
      apple: "/icon-512x512.png", // Icône pour les appareils Apple
    },
    themeColor: "#000000",
    openGraph: {
      title: "MGA Follow UP",
      description: "Manage your finances easily with MGA Follow UP.",
      url: "https://yourwebsite.com",
      siteName: "MGA Follow UP",
      type: "website",
      images: [
        {
          url: "https://yourwebsite.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "MGA Follow UP Dashboard",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@your_twitter_handle",
      creator: "@your_twitter_handle",
      images: ["https://yourwebsite.com/twitter-image.jpg"],
    },
    robots: "index, follow",
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ThemeScript />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
