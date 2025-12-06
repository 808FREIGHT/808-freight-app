import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "808 FREIGHT - Compare Hawaii Shipping Quotes",
  description: "Hawaii's ONLY quote app for inter-island and West Coast shipping. Compare side-by-side quotes FOR FREE!",
  metadataBase: new URL('https://808freight.com'),
  openGraph: {
    title: "808 FREIGHT - Compare Hawaii Shipping Quotes",
    description: "Hawaii's ONLY quote app for inter-island and West Coast shipping. Compare side-by-side quotes FOR FREE!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "808 FREIGHT - Compare Hawaii Shipping Quotes",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "808 FREIGHT - Compare Hawaii Shipping Quotes",
    description: "Hawaii's ONLY quote app for inter-island and West Coast shipping. Compare side-by-side quotes FOR FREE!",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
