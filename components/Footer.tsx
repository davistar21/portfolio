"use client";
import React, { useRef } from "react";
import { Mail, Github, ArrowUpRight, Mouse } from "lucide-react";

export default function Footer() {
  const links: { name: string; href: string }[] = [
    {
      name: "GitHub",
      href: "https://github.com/davistar21",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/eyitayo-obembe/",
    },
    {
      name: "Whatsapp",
      href:
        "https:/wa.me/2348085716180?text=" +
        "Hello, I'd like to know about Studently.",
    },
    {
      name: "Mail",
      href: "mailto:eyitayobembe@gmail.com",
    },
  ];
  return (
    <footer id="connect" className="pt-8 mt-8 space-y-4 px-4 md:px-8">
      <h1 className="text-lg font-semibold">Connect</h1>
      <p className="text-gray-400">
        Feel free to contact me at{" "}
        <a
          href="mailto:eyitayobembe@gmail.com"
          className="text-gray-200 underline"
        >
          eyitayobembe@gmail.com
        </a>
      </p>
      <div className="flex gap-2 md:gap-4 mb-16">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MouseFollowButton className="items-center  flex gap-[2px] bg-gray-800 shadow-md rounded-full px-2 md:px-3 py-[6px] text-sm text-gray-400  hover:bg-gray-800/90  hover:text-gray-200 transition-colors">
              {link.name} <ArrowUpRight size={16} className="rotate-5" />
            </MouseFollowButton>
          </a>
        ))}
      </div>
      <ContactForm />
      <div className="text-sm text-gray-500 mt-4 border-t pt-4 pb-6 text-center flex gap-4 justify-around items-center">
        <div>
          &copy; {new Date().getFullYear()} Obembe Eyitayo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import ContactForm from "./ContactForm";

export function MouseFollowButton({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [transform, setTransform] = useState("translate(0, 0) scale(1)");

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    button;
    const y = e.clientY - rect.top;
    button;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const offsetX = (x - centerX) / 8;
    const offsetY = (y - centerY) / 8;

    setTransform(`translate(${offsetX}px, ${offsetY}px) scale(1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform("translate(0, 0) scale(1)");
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out cursor-pointer ${className}`}
      style={{ transform }}
    >
      {children || "Hover Me"}
    </button>
  );
}
