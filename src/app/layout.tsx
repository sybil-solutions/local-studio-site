import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://localstudio.ai"),
  applicationName: "Local Studio",
  title: {
    default: "Local Studio",
    template: "%s — Local Studio",
  },
  description: "AI workspace built to help you go local.",
  openGraph: {
    title: "Local Studio — Run your intelligence at home.",
    description: "AI workspace built to help you go local.",
    url: "/",
    siteName: "Local Studio",
    locale: "en_US",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Local Studio — Run your intelligence at home.",
    description: "AI workspace built to help you go local.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
