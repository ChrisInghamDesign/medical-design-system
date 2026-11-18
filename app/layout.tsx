import type { Metadata } from "next";
import "./globals.css";
import "./theme.css";
import tokens from "@/design-system/tokens.json";
import { googleFontUrls } from "@/lib/ds/fonts";

export const metadata: Metadata = {
  title: "Medical design system",
  description: "Component showcase for the Medical design system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased font-sans" suppressHydrationWarning>
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
