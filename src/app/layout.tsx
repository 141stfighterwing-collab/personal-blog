import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Blog | AI, Geopolitics & Cybersecurity News",
  description: "A modern personal blog featuring multi-category news ticker with AI, Geopolitics, and Cybersecurity news. Built with Next.js, TypeScript, and Tailwind CSS.",
  keywords: ["blog", "news", "AI", "cybersecurity", "geopolitics", "Next.js", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "Shootre21" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Personal Blog",
    description: "Multi-category news and blog with AI, Geopolitics & Cybersecurity",
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
