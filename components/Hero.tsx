"use client";
import AnimatedText from "./AnimatedText";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="flex flex-col ">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-xl font-semibold"
      >
        Eyitayo Obembe
      </motion.h1>
      <motion.h2
        className="mb-8 text-muted-foreground"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        viewport={{ once: true }}
      >
        Full Stack AI Engineer
      </motion.h2>
      <AnimatedText
        words={[
          "I build web experiences.",
          "I build scalable digital solutions",
        ]}
      />
      <motion.p
        className="mb-6 text-muted-foreground/80"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        viewport={{ once: true }}
      >
        I design and build fast, scalable web apps tailored to your goals. Using
        modern tech and best practices, I deliver solutions that perform
        smoothly and elevate your brand.
      </motion.p>
      <motion.p
        className="mb-6 text-muted-foreground/80"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        viewport={{ once: true }}
      >
        Whether you&#39;re starting fresh or growing an idea, I create seamless,
        user-focused experiences — from clean UI/UX to efficient backend
        systems.
      </motion.p>

      <motion.div
        className="flex flex-wrap gap-4 items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        viewport={{ once: true }}
      >
        <a
          href="#connect"
          className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-transform active:scale-95 shadow-lg shadow-primary/20"
        >
          Let&apos;s Connect
        </a>
        <a
          href="https://drive.google.com/file/d/1Nl31fOdSejI0qLFFHuIjWP18H7-7pLen/preview"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 border border-border bg-background hover:bg-muted text-foreground font-medium rounded-full transition-all active:scale-95 flex items-center gap-2 group"
        >
          View Resume
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
          >
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
          </svg>
        </a>
      </motion.div>
      {/* <div className="flex absolute overflow-hidden backdrop-blur-2xl right-0">
        <div className="h-[20rem] z-2 w-[1rem] bg-linear-18 from-transparent via-[#ffffff] via-[99%] to-[#ffffff30] opacity-30"></div>
        <div className="h-[20rem] z-2 w-[1rem] bg-linear-36 from-transparent via-[#ffffff] via-[99%] to-[#ffffff30] opacity-30"></div>
        <div className="h-[20rem] z-2 w-[1rem] bg-linear-54 from-transparent via-[#ffffff] via-[99%] to-[#ffffff30] opacity-30"></div>
        <div className="h-[20rem] z-2 w-[1rem] bg-linear-72 from-transparent via-[#ffffff] via-[99%] to-[#ffffff30] opacity-30"></div>
        <div className="h-[20rem] z-2 w-[1rem] bg-linear-80 from-transparent via-[#ffffff] via-[99%] to-[#ffffff30] opacity-30"></div>
      </div>{" "} */}
    </div>
  );
};

export default Hero;
