"use client";

import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <header className="pt-12 md:pt-16 pb-2">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-5 text-xs font-mono tracking-[0.3em] uppercase text-muted-foreground"
      >
        A long-form portrait
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="font-serif text-6xl sm:text-7xl md:text-[8rem] leading-[0.9] tracking-tight text-foreground"
      >
        About.
      </motion.h1>
    </header>
  );
}
