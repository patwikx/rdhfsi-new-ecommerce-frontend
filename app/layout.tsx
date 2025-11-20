import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { SessionProvider } from "next-auth/react";
import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import { SessionValidator } from "@/components/auth/session-validator";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RDHFSI E-Commerce",
  description: "Trusted store for construction, industrial, DIY, fishing and office supplies for your business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SessionValidator />
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
            <Toaster position="bottom-center" richColors />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
