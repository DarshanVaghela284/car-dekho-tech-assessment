import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CarMatch — Find Your Perfect Car",
  description: "Go from confused to confident with a smart car shortlist builder",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans min-h-screen`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
