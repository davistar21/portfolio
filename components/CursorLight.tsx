"use client";

/**
 * Cursor Light
 *
 * A soft glow that follows the cursor, illuminating the auth scene.
 * Creates depth and atmosphere on the auth pages.
 */

import { useEffect, useState } from "react";

interface CursorLightProps {
  color?: string;
  size?: number;
  intensity?: number;
}

export function CursorLight({
  color = "rgba(138, 43, 226, 0.15)",
  size = 300,
  intensity = 1,
}: CursorLightProps) {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  return (
    <div
      className="fixed pointer-events-none z-0 transition-opacity duration-300"
      style={{
        left: position.x - size / 2,
        top: position.y - size / 2,
        width: size,
        height: size,
        opacity: isVisible ? intensity : 0,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(20px)",
      }}
    />
  );
}
