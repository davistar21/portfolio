"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const links = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  {
    name: "Resume",
    href: "https://drive.google.com/file/d/1Nl31fOdSejI0qLFFHuIjWP18H7-7pLen/view?usp=sharing",
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isMainRoute = pathname === "/";
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          scrolled || isOpen
            ? "bg-background/80 backdrop-blur-md border-border shadow-sm py-3"
            : "!bg-transparent py-5"
        )}
      >
        <div className="container px-4 md:px-6 mx-auto flex items-center justify-between">
          {!isMainRoute ? <Logo /> : <div />}

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {links.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-sm font-medium transition-colors relative hover:text-primary",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="desktop-navbar-underline"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="w-px h-6 bg-border mx-2" />
            <ThemeToggle />
            <Link
              href="/#connect"
              className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition-transform active:scale-95"
            >
              Contact Me
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-background/80 pt-24 px-6 md:hidden overflow-hidden"
          >
            <nav className="flex flex-col gap-6 items-center">
              <motion.ul
                className="flex flex-col items-center gap-6 w-full"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                  hidden: {
                    transition: { staggerChildren: 0.05, staggerDirection: -1 },
                  },
                }}
              >
                {links.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href));

                  return (
                    <motion.li
                      key={link.href}
                      variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: 20 },
                      }}
                      className="w-full flex items-center justify-center"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "block text-2xl font-semibold py-2 hover:text-primary transition-colors relative w-fit",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {link.name}
                        {isActive && (
                          <motion.div
                            layoutId="mobile-navbar-underline"
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                          />
                        )}
                      </Link>
                    </motion.li>
                  );
                })}

                <motion.li
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: 20 },
                  }}
                  className="w-full flex justify-center pt-8"
                >
                  <Link
                    href="/#connect"
                    onClick={() => setIsOpen(false)}
                    className="px-8 py-4 bg-primary text-primary-foreground text-lg font-bold rounded-full w-full max-w-xs text-center shadow-lg active:scale-95 transition-transform"
                  >
                    Let&apos;s Talk
                  </Link>
                </motion.li>
              </motion.ul>
            </nav>

            {/* Background Decoration for Menu */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-2/3 left-2/3 -translate-y-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
