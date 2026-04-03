import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "HealthBot AI - Intelligent Healthcare Companion",
  description: "AI-powered healthcare assistant: analyze symptoms, upload prescriptions, understand medicines, and receive personalized health guidance.",
  icons: {
    icon: "/favicon.svg",
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ui/Toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen antialiased transition-colors duration-300" suppressHydrationWarning>
        <ThemeProvider defaultTheme="dark">
          <ToastProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
