"use client";
import Link from "next/link";
import React from "react";
import ThemeToggle from "./ThemeToggle";
import { MotionConfig, motion } from "framer-motion";
import { Hamburger, HamburgerIcon } from "lucide-react";

export default function NavBar() {
  return (
    <nav className="border-b py-4 bg-transparent">
      <div className="container flex items-center justify-between">
        <Link href="/" className="font-bold">
          Eyitayo
        </Link>
        <HamburgerIcon className="" />

        <div className="flex items-center gap-4">
          <Link href="/projects" className="hidden md:inline">
            Projects
          </Link>
          <Link href="/about" className="hidden md:inline">
            About
          </Link>
          <Link href="/contact" className="hidden md:inline">
            Contact
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
