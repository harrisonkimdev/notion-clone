import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/session-provider";
import { FloatingExplorerProvider } from "@/components/providers/floating-explorer-provider";
import { GlobalFloatingExplorer } from "@/components/GlobalFloatingExplorer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pile Hive",
  description: "A pile-based document organization app built with Next.js, TypeScript, and Prisma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <FloatingExplorerProvider>
            {children}
            <GlobalFloatingExplorer />
          </FloatingExplorerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
