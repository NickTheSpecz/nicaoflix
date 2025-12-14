import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ServiceWorkerProvider } from "@/components/layout/ServiceWorkerProvider";
import { SkipLink } from "@/components/ui/SkipLink";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NicãoFlix - Streaming Platform",
  description: "Plataforma de streaming pessoal para filmes, séries, animes e doramas",
  manifest: "/manifest.json",
  themeColor: "#e50914",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://superflixapi.run" />
      </head>
      <body className="bg-background font-primary text-text-primary antialiased">
        <SkipLink />
        <ServiceWorkerProvider>{children}</ServiceWorkerProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

