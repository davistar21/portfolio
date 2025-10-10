import "./globals.css";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "@/components/Providers";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Eyitayo Obembe | Frontend Web Developer & AI Enthusiast",

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
    title: "Eyitayo | Portfolio",
    description: "Crafting beautiful, performant web experiences.",
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
    title: "Eyitayo | Portfolio",
    description: "Frontend Developer & Engineer — Sleek, functional web apps.",
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
    <html lang="en">
      <head>
        <link rel="icon" href="/file.svg" />
        {/* <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Eyitayo",
  "url": "https://eyitayo.dev",
  "sameAs": [
    "https://github.com/eyitayo",
    "https://www.linkedin.com/in/eyitayo",
    "https://twitter.com/eyitayo"
  ],
  "jobTitle": "Frontend Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "Eyitayo Technologies"
  },
  "description": "A frontend developer specializing in React, Tailwind, and modern web apps."
}
</script> */}
      </head>
      <body>
        <Providers>
          <div className="md:w-[768px] w-full px-2 mx-auto">
            <main className="py-10">{children}</main>
            <Footer />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
