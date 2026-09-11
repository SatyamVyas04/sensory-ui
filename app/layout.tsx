import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SensoryUIProvider } from "@/components/ui/sensory-ui/config/provider";
import { Toaster } from "@/components/ui/sonner";
import { PosthogInit } from "@/posthog";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://sensory-ui.com";
const siteTitle = "sensory-ui";
const siteDescription =
  "Add semantic sound to your shadcn/ui components with a single prop. 17 sound cues, 25 React components. Web Audio API powered, zero audio files.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s - ${siteTitle}`,
  },
  description: siteDescription,
  keywords: [
    "sensory-ui",
    "sensory ui",
    "shadcn sounds",
    "shadcn audio",
    "shadcn/ui sound",
    "sound react",
    "react sound",
    "sound ui",
    "ui sound",
    "audio feedback",
    "web audio api",
    "ui audio",
    "react audio components",
    "next.js sound",
    "sound design",
    "interaction design",
    "semantic sound",
    "accessibility",
    "coresensory",
    "sensory ux",
    "sensory audio",
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
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/sensory-ui-logo-small.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        url: "/sensory-ui-logo-large.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/sensory-ui-logo-large.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/sensory-ui-logo-small.png",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "sensory-ui - Semantic Sound for shadcn/ui",
    description: siteDescription,
    siteName: siteTitle,
    locale: "en_US",
    images: [
      {
        url: "/hero-background-dark.jpg",
        width: 1200,
        height: 630,
        alt: "sensory-ui - semantic audio feedback for shadcn/ui React components",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@SatyamVyas04",
    creator: "@SatyamVyas04",
    title: "sensory-ui - Semantic Sound for shadcn/ui",
    description: siteDescription,
    images: [
      {
        url: "/hero-background-dark.jpg",
        alt: "sensory-ui - semantic audio feedback for shadcn/ui React components",
      },
    ],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} bg-size-[10px_10px] bg-fixed font-sans antialiased`}
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg,var(--secondary) 0, var(--background) 1px,transparent 0,transparent 50%)",
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <SensoryUIProvider
            config={{
              theme: "arcade",
              volume: 0.75,
              categories: {
                interaction: true,
                navigation: true,
                notification: true,
                overlay: true,
                hero: true,
              },
            }}
          >
            <div className="mx-auto min-w-0 max-w-500 bg-background shadow-xl">
              {children}
            </div>
            <Analytics />
            <SpeedInsights />
            <Toaster position="bottom-right" />
            <PosthogInit />
          </SensoryUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
