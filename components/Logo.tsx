import Link from "next/link";
import React from "react";
import { motion, useAnimation } from "framer-motion";

const Logo = () => {
  const text = "Eyitayo";
  const letters = text.split("");

  return (
    <Link href="/" className="relative flex items-center gap-1 group py-2">
      <motion.div
        className="relative flex items-end"
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        {/* Bouncing Ball */}
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-green-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] z-10"
          initial={{ x: 0, y: -20, opacity: 0 }}
          animate={{
            x: ["0%", "100%", "0%"], // Loop back and forth or reset? User said "continuously bounces... from left to right". Usually implies loop.
            y: [0, -12, 0, -8, 0, -12, 0, -5, 0], // irregular bounce pattern matching "Eyitayo" length somewhat?
            opacity: 1,
          }}
          transition={{
            x: {
              duration: 4, // Slower travel
              repeat: Infinity,
              ease: "linear",
            },
            y: {
              duration: 4, // Sync with x
              repeat: Infinity,
              times: [0, 0.1, 0.2, 0.3, 0.45, 0.6, 0.75, 0.9, 1], // Timing the bounces
              ease: "easeInOut",
            },
          }}
          style={{ left: 0 }}
        />

        {letters.map((letter, i) => (
          <Letter key={i} letter={letter} index={i} total={letters.length} />
        ))}
        <motion.span
          className="text-primary font-bold text-2xl"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          {/* . */}
        </motion.span>
      </motion.div>
    </Link>
  );
};

const Letter = ({
  letter,
  index,
  total,
}: {
  letter: string;
  index: number;
  total: number;
}) => {
  // Staggered Entrance
  const variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
        delay: index * 0.1,
      },
    },
    hover: {
      y: -3,
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 0.3,
          ease: "easeInOut",
          delay: index * 0.05, // Wavelike hover
        },
      },
    },
  };

  // Gradient Text
  // We can't easily animate gradient on text AND transform independently without nesting or complex hacks.
  // Best approach: Use `bg-clip-text` on the span.

  return (
    <motion.span
      // @ts-expect-error next/line
      variants={variants}
      className="font-bold text-2xl md:text-3xl tracking-tight relative cursor-pointer"
      style={{
        display: "inline-block",
      }}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-fast opacity-0 select-none pointer-events-none" />

      {/* Main Text with Subtle Gradient */}
      <motion.span
        className="bg-clip-text text-transparent bg-gradient-to-br from-blue-600 via-teal-500 to-green-500"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          filter: [
            "drop-shadow(0 0 0px rgba(56,189,248,0))",
            "drop-shadow(0 0 5px rgba(45,212,191,0.3))",
            "drop-shadow(0 0 0px rgba(56,189,248,0))",
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundSize: "200% auto",
        }}
      >
        {letter}
      </motion.span>

      {/* Impact Reaction Helper (Invisible usually, but we animate the main span) 
          To do "bounce on impact", we need timed keyframes on the letter itself matching the ball.
          Since the ball is global loop 4s, we can try to keyframe scale based on index.
      */}
      <motion.span
        className="absolute inset-0"
        animate={{
          scaleY: [1, 0.8, 1, 1, 1], // Squash
          scaleX: [1, 1.2, 1, 1, 1], // Stretch
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: (index / total) * 2, // Sync rough impact? This is hard to perfect without JS hook.
          // Ball does 0-100% in 4s? No, x duration is 4s.
          // If x is linear, it passes index `i` at `(i/total)*4` roughly.
          times: [
            (index / total) * 0.5, // 0-50% is forward pass?
            (index / total) * 0.5 + 0.02,
            (index / total) * 0.5 + 0.05,
            1,
          ],
        }}
      ></motion.span>
    </motion.span>
  );
};

export default Logo;
