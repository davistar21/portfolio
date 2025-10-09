"use client";
import React, { useEffect, useState } from "react";

export default function AnimatedText({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [forward, setForward] = useState(true);

  useEffect(() => {
    let timeout: any;
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
    <h1 className="text-gray-300/80 leading-tight">
      <span>{display}</span>
      <span
        className="inline-block w-1 bg-black dark:bg-white ml-2 animate-pulse"
        style={{ height: "1.1em" }}
      />
    </h1>
  );
}
