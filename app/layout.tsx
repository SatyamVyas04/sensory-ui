import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { SensoryUIProvider } from "@/components/ui/sensory-ui/config/provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "sensory-ui",
    template: "%s — sensory-ui",
  },
  description:
    "A semantic, opt-in sound layer for React and Next.js apps. Add meaningful audio feedback to UI interactions — built for shadcn/ui.",
  keywords: [
    "sensory-ui",
    "shadcn",
    "sound",
    "audio",
    "react",
    "nextjs",
    "ui",
    "accessibility",
    "web audio",
  ],
  authors: [{ name: "Satyam Vyas" }],
  creator: "Satyam Vyas",
  openGraph: {
    type: "website",
    title: "sensory-ui",
    description:
      "A semantic, opt-in sound layer for React and Next.js apps. Add meaningful audio feedback to UI interactions — built for shadcn/ui.",
    siteName: "sensory-ui",
  },
  twitter: {
    card: "summary_large_image",
    title: "sensory-ui",
    description:
      "A semantic, opt-in sound layer for React and Next.js apps. Add meaningful audio feedback to UI interactions — built for shadcn/ui.",
  },
  metadataBase: new URL("https://sensory-ui.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={inter.variable} lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SensoryUIProvider>{children}</SensoryUIProvider>
      </body>
    </html>
  );
}
