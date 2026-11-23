import type { Metadata } from "next";
import { Lora, Fraunces, JetBrains_Mono } from "next/font/google";
import Clouds from "@/components/Clouds";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const body = Lora({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ollie Moreland",
    template: "%s · Ollie Moreland",
  },
  description: "Ollie Moreland's personal site: writing, papers, and cats.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} ${mono.variable}`}>
      <body>
        <Clouds />
        <div className="site">
          <Header />
          <main className="paper">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
