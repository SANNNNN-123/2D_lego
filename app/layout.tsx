import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Press_Start_2P } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "nes.css/css/nes.min.css";
import "./nes-custom.css";
import { DesignProvider } from "./context/DesignContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
});

export const metadata: Metadata = {
  title: "2D LEGO",
  description: "Lego Builder",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script 
        src="https://cloud.umami.is/script.js" 
        data-website-id="476b1269-cf98-4402-bff6-b865b2ce2119"
        strategy="afterInteractive"
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.variable} antialiased nes-style custom-cursor`}
      >
        <DesignProvider>
          {children}
        </DesignProvider>
      </body>
    </html>
  );
}
