import type { Metadata } from "next";
import "./globals.css";
import "./theme.css";
import tokens from "@/design-system/tokens.json";
import { googleFontUrls } from "@/lib/ds/fonts";
import { Inter, Fraunces, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const geistMono = Geist_Mono({subsets:['latin'],variable:'--font-mono'});

const frauncesHeading = Fraunces({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Medical design system",
  description: "Component showcase for the Medical design system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("h-full antialiased font-sans", "font-sans", inter.variable, frauncesHeading.variable, geistMono.variable)} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {googleFontUrls(tokens.fonts).map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
