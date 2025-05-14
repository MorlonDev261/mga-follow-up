import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ReactQueryProvider } from "@/components/react-query";
import { ToastContainer } from "react-toastify";
import { Toaster } from 'sonner';
import "react-toastify/dist/ReactToastify.css";

import SessionProvider from "@/components/SessionProvider";
import { ToastManager } from "@/components/toast-provider";
import { auth } from "@/lib/auth";
import VirtualAssistant from "@components/Ai/assistant";
import { ThemeProvider } from "@/components/theme-provider";
import ThemeScript from "@/components/ThemeScript";
import PWA from "@/components/PWA";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "MGA Follow UP | Simplify Your Finances",
  description: "Manage your moulaa easily 😎. Track your payments, customers, and more.",
  keywords: ["finance", "tracking", "payments", "MGA Follow UP"],
  authors: [{ name: "AZTEK DWC LLC", url: "https://yourwebsite.com" }],
  creator: "AZTEK DWC LLC",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo/icon-512x512.png",
    shortcut: "/logo/icon-192x192.png",
    apple: "/logo/icon-180x180.png",
  },
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
export const viewport = {
  themeColor: '#000000',
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <ThemeScript />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <SessionProvider session={session}>
              <ToastManager>
                <main className="min-h-screen">{children}</main>

                <Toaster />
                {/* Assistant flottant */}
                <VirtualAssistant />

                <PWA />
                <SpeedInsights />
              </ToastManager>
              <ToastContainer />
            </SessionProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
