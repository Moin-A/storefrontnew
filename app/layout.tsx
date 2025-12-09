'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toast } from "../components/ui/toast";
import Header from "../components/Header";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideHeader = pathname === '/auth' || pathname.startsWith('/password/');

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!hideHeader && <Header />}
        {children}
        <Toast />
      </body>
    </html>
  );
}
