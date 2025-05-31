import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./navigation/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>{/* Add any head elements here */}</head>
      <body className="h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <header>
              <Navbar />
            </header>
            <main className="flex-grow overflow-auto">{children}</main>
            <footer className="flex-shrink-0">
              <div>
                <h1>This is the footer</h1>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
