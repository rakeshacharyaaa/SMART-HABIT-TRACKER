import type React from "react"
import type { Metadata, Viewport } from "next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Smart Habit Tracker",
  description: "Build better habits with a clean, minimalist interface",
  generator: "Next.js",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Habit Tracker",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Smart Habit Tracker",
    title: "Smart Habit Tracker",
    description: "Build better habits with a clean, minimalist interface",
  },
  twitter: {
    card: "summary",
    title: "Smart Habit Tracker",
    description: "Build better habits with a clean, minimalist interface",
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{__html: `
          (function(){
            try {
              var t = localStorage.getItem('app-theme') || 'dark';
              document.documentElement.setAttribute('data-theme', t);
            } catch (e) {}
          })();
        `}} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Habit Tracker" />
        <link rel="apple-touch-icon" href="/placeholder-logo.png" />
        <link rel="icon" href="/placeholder-logo.png" />
      </head>
      <body className="bg-black text-white min-h-screen">
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
