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
        systems. Let&rsquo;s{" "}
        <a
          className="underline cursor-pointer hover:text-primary transition-colors"
          href="#connect"
        >
          connect
        </a>{" "}
        and build something great together.
      </motion.p>
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
