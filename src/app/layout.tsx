import type { Metadata } from "next";
import Image from "next/image";
import { ThemeProvider } from "@/components/theme-provider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeScript from "@/components/ThemeScript";
import PWA from "@/components/PWA";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export function generateMetadata(): Metadata {
  return {
    title: "MGA Follow UP | Simplify Your Finances",
    description: "Manage your moulaa easily 😎. Track your payments, customers, and more.",
    keywords: ["finance", "tracking", "payments", "MGA Follow UP"],
    authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
    creator: "AZTEK DWC LLC",
    manifest: "/manifest.json",
    icons: {
      icon: "/logo/icon-512x512.png",
      shortcut: "/logo/icon-192x192.png",
      apple: "/logo/icon-180x180.png",
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
          type: "image/jpeg",
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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <ThemeScript />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen">{children}</div>
          <div className="absolute bottom-5 right-3 z-50 h-4 w-4 rounded-full p-2 bg-green-500 dark:bg-orange-500">
            <Image src="/assistant.png" width="45" height="45" alt="Assistant MGA Follow UP" />
          </div>
          <PWA />
        </ThemeProvider>
      </body>
    </html>
  );
}
