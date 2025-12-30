import "./globals.css";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "@/components/Providers";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { CustomToaster } from "@/components/CustomToaster";
import ThemeToggle from "@/components/ThemeToggle";
import Header from "@/components/Header";
import MainLayout from "@/components/MainLayout";
import Script from "next/script";

export const metadata = {
  title: {
    template: "%s | Eyitayo Obembe",
    default: "Eyitayo Obembe | Frontend Web Developer & AI Enthusiast",
  },

  description:
    "Frontend Developer & Engineer — Building sleek, functional experiences with Next.js, TypeScript, and Tailwind.",
  keywords: [
    "Eyitayo",
    "Frontend Developer",
    "Portfolio",
    "Next.js",
    "React",
    "TypeScript",
    "AWS Services",
  ],
  openGraph: {
    title: "Eyitayo Obembe | Frontend Web Developer & AI Enthusiast",
    description:
      "Frontend Developer & Engineer — Building sleek, functional experiences with Next.js, TypeScript, and Tailwind.",
    url: "https://eyitayobembe.vercel.app",
    siteName: "Eyitayo Obembe Portfolio",
    images: [
      {
        url: "https://eyitayobembe.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Eyitayo Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eyitayo Obembe | Frontend Web Developer & AI Enthusiast",
    description:
      "Frontend Developer & Engineer — Building sleek, functional experiences with Next.js, TypeScript, and Tailwind.",
    creator: "@yourTwitterHandle",
    images: ["https://eyitayobembe.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="BOj-Y0MozoW4Rh9GLYuRmofJmLXW32SIz16D7h8DC9E"
        />
        <link rel="icon" href="/globe.svg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Eyitayo Obembe",
              url: "https://eyitayobembe.vercel.app",
              sameAs: [
                "https://github.com/davistar21", // Update with actual
                "https://www.linkedin.com/in/eyitayo-obembe", // Update with actual
                "https://x.com/davistar21", // Update with actual
              ],
              jobTitle: "Frontend Developer",
              worksFor: {
                "@type": "Organization",
                name: "Freelance / Open to Work",
              },
              description:
                "A frontend developer specializing in React, Next.js, Tailwind, and modern web experiences.",
            }),
          }}
        />
      </head>
      <body>
        <MainLayout>
          <main>{children}</main>
        </MainLayout>
        <Script src="https://js.puter.com/v2/"></Script>
        <Analytics />
      </body>
    </html>
  );
}
