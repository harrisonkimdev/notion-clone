import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/contexts/ThemeContext";
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 transition-colors duration-200`}
      >
        <ThemeProvider>
          <AuthProvider>
            <FloatingExplorerProvider>
              {children}
              <GlobalFloatingExplorer />
            </FloatingExplorerProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
