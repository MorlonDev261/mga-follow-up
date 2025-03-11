import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    creator: "Your Company",
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
        {/* Favicon */}
        <link rel="icon" href="/logo.jpg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />

        {/* Script pour éviter le flash blanc */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem("theme") || "system";
              const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
              if (theme === "dark" || (theme === "system" && prefersDark)) {
                document.documentElement.classList.add("dark");
              }
            })();
          `
        }} />
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
