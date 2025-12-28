"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
export default function AnimatedText({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [forward, setForward] = useState(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const word = words[index];
    if (forward) {
      if (display.length < word.length) {
        timeout = setTimeout(
          () => setDisplay(word.slice(0, display.length + 1)),
          80
        );
      } else {
        timeout = setTimeout(() => setForward(false), 1200);
      }
    } else {
      if (display.length > 0) {
        timeout = setTimeout(() => setDisplay(display.slice(0, -1)), 40);
      } else {
        setForward(true);
        setIndex((i) => (i + 1) % words.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [display, forward, index, words]);

  return (
    <motion.h1
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 2, duration: 0.6, ease: "easeInOut" }}
      className="text-muted-foreground leading-tight"
    >
      <span>{display}</span>
      <span
        className="inline-block w-[2px] bg-foreground ml-2 animate-spin"
        style={{ height: "1.1em" }}
      />
    </motion.h1>
  );
}
