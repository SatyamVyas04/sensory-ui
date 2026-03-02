import { GeistPixelCircle } from "geist/font/pixel";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SensoryUIProvider } from "@/components/ui/sensory-ui/config/provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://sensory-ui.com";
const siteTitle = "sensory-ui";
const siteDescription =
  "A semantic, opt-in sound layer for React and Next.js apps. Add meaningful audio feedback to UI interactions with 19 sound roles across 24 components - built for shadcn/ui.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s - ${siteTitle}`,
  },
  description: siteDescription,
  keywords: [
    "sensory-ui",
    "shadcn",
    "shadcn/ui",
    "sound",
    "audio feedback",
    "web audio",
    "react",
    "next.js",
    "ui components",
    "accessibility",
    "sound design",
    "interaction design",
    "semantic sound",
  ],
  authors: [{ name: "Satyam Vyas", url: "https://x.com/SatyamVyas04" }],
  creator: "Satyam Vyas",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/icon-256.png", sizes: "256x256", type: "image/png" },
    ],
    apple: [{ url: "/icon-256.png", sizes: "256x256", type: "image/png" }],
    shortcut: "/icon-64.png",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: siteTitle,
    locale: "en_US",
    images: [
      {
        url: "/hero-background.jpg",
        width: 1200,
        height: 630,
        alt: "sensory-ui - semantic sound for React & Next.js",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@SatyamVyas04",
    creator: "@SatyamVyas04",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/hero-background.jpg",
        alt: "sensory-ui - semantic sound for React & Next.js",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${GeistPixelCircle.variable} bg-secondary font-sans antialiased`}
      >
        <SensoryUIProvider
          config={{
            theme: "arcade",
            volume: 0.4,
            categories: {
              interaction: true,
              navigation: true,
              notification: true,
              overlay: true,
              hero: true,
            },
          }}
        >
          <div className="mx-auto min-w-0 max-w-400 border-border border-x bg-background shadow-xl">
            {children}
          </div>
          <Toaster position="bottom-right" />
        </SensoryUIProvider>
      </body>
    </html>
  );
}
