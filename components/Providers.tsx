"use client";
import { ThemeProvider } from "next-themes";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
      enableSystem
    >
      {children}
    </ThemeProvider>
  );
}

export default Providers;
