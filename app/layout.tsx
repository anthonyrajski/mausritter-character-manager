import type { Metadata } from "next";
import { Geist, Geist_Mono, Permanent_Marker, Caveat, Staatliches } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const brokenscript = localFont({
  src: "../public/fonts/Brokenscript-BoldCond Regular.otf",
  variable: "--font-brokenscript",
  display: "swap",
});

// Hand-drawn fonts for stat blocks
const permanentMarker = Permanent_Marker({
  weight: "400",
  variable: "--font-permanent-marker",
  subsets: ["latin"],
});

const caveat = Caveat({
  weight: ["400", "700"],
  variable: "--font-caveat",
  subsets: ["latin"],
});

const staatliches = Staatliches({
  weight: "400",
  variable: "--font-staatliches",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MausRitter Character Manager",
  description: "Manage your MausRitter adventurers with an interactive character sheet, inventory management, and cloud saves.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${brokenscript.variable} ${permanentMarker.variable} ${caveat.variable} ${staatliches.variable} antialiased`}
      >
        {/* SVG filters for hand-drawn effects */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id="wobble">
              <feTurbulence baseFrequency="0.02" numOctaves="3" result="turbulence" seed="1" />
              <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Footer />
      </body>
    </html>
  );
}
