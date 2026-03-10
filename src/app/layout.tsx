import type { Metadata } from "next";
import localFont from "next/font/local";
import { Nav } from "@/components/nav";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "WJP Studio",
  description: "A creative studio that automates everything.",
  metadataBase: new URL("https://wjp.studio"),
  openGraph: {
    title: "WJP Studio",
    description: "A creative studio that automates everything.",
    url: "https://wjp.studio",
    siteName: "WJP Studio",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "WJP Studio",
    description: "A creative studio that automates everything.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-bg text-foreground`}
      >
        <Nav />
        <main className="pt-14">{children}</main>
      </body>
    </html>
  );
}
