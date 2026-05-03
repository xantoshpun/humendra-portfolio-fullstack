import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ScrollReveal";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Humendra Pun — Data Analyst Portfolio",
  description: "Data Analyst portfolio — Power BI, Python, ML",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, jetbrainsMono.variable, "font-sans", geist.variable)}>
      <body>
        {children}
        <ScrollReveal />
      </body>
    </html>
  );
}
