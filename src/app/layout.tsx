import "./globals.css";
import Navbar from "./navigation/navbar";
import { ThemeProvider } from "@/components/theme-provider";
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
          enableSystem={true}
          disableTransitionOnChange={true}
        >
          <div className="flex flex-col min-h-screen">
            <header
              style={{ paddingTop: 5, paddingBottom: 5 }}
              className="bg-background"
            >
              <Navbar />
            </header>
            <main className="flex flex-col flex-grow overflow-auto">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
