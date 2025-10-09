import "./globals.css";
import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "@/components/Providers";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Eyitayo Obembe | Frontend Web Developer & AI Enthusiast",
  description:
    "Portfolio of Eyitayo — frontend developer. Built with Next.js, TypeScript, TailwindCSS, Framer Motion and shadcn-inspired components.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
