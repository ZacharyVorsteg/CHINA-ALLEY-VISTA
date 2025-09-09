import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "China Alley Vista – Financial Analysis",
  description: "Factory-built mixed-use feasibility analysis with underwriting compliance review. Professional financial analysis for affordable housing development in Fresno, CA.",
  keywords: "affordable housing, financial analysis, pro forma, underwriting, Fresno, mixed-use development",
  authors: [{ name: "Zachary Vorsteg" }],
  creator: "Zachary Vorsteg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {children}
      </body>
    </html>
  );
}