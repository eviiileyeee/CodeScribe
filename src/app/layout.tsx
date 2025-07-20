import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Provider";
import { SpeedInsights } from '@vercel/speed-insights/next';
import InstallButton from "@/components/InstallPopup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://code-scribe-ai.vercel.app'),
  title: "Code Converter AI",
  description: "Your AI-powered code converter. Developed by @eviiileyeee.",
  keywords: [
    "code converter",
    "AI code translator",
    "convert JavaScript to Python",
    "code translator online",
    "code converter AI",
    "eviiileyeee",
  ],
  authors: [{ name: "eviiileyeee", url: "https://github.com/eviiileyeee" }],
  creator: "eviiileyeee",
  openGraph: {
    title: "Code Converter AI",
    description: "Instantly convert code between languages with AI.",
    url: "https://code-scribe-ai.vercel.app/",
    siteName: "Code Converter AI",
    images: [
      {
        url: "/images/process.png", // Should exist in your /public folder
        width: 1200,
        height: 630,
        alt: "Code Converter AI preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Converter AI",
    description: "Your AI-powered code converter. Built by @eviiileyeee.",
    creator: "@eviiileyeee", // Optional Twitter handle
    images: ["/images/process.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/images/process.png",
  },
  manifest: "/images/process.png",
  category: "technology",
  generator: "Next.js 14 + OpenAI + Tailwind",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  themeColor: '#0f172a', // Slate-900 for dark UI feel
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Header />
          <main className="container mx-auto p-0 md:px-4 md:py-8">
            {children}
            <SpeedInsights />
            <InstallButton />
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
