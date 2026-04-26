import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { OfflineIndicator } from "@/components/offline-indicator"
import { AppProviders } from "./providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "SaloneVest - Diaspora Investment Platform",
  description:
    "Invest in Sierra Leone opportunities with USDC on Solana. Zero remittance fees, transparent blockchain tracking, and vetted investment opportunities for diaspora investors.",
  keywords: ["diaspora", "investment", "Sierra Leone", "USDC", "Solana", "remittance", "blockchain"],
  authors: [{ name: "SaloneVest" }],
  creator: "SaloneVest",
  publisher: "SaloneVest",
  metadataBase: new URL("https://saloneVest.io"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://saloneVest.io",
    siteName: "SaloneVest",
    title: "SaloneVest - Diaspora Investment Platform",
    description: "Invest in Sierra Leone with USDC on Solana. Zero fees, blockchain transparency.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SaloneVest Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaloneVest - Diaspora Investment Platform",
    description: "Invest in Sierra Leone with USDC on Solana. Zero remittance fees.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
  colorScheme: "light dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
        <OfflineIndicator />
        <Analytics />
      </body>
    </html>
  )
}
