"use client";
import AnimatedText from "./AnimatedText";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="flex flex-col">
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

      {/* <div>
        
        <p className="mt-4 text-muted">
          Frontend developer focusing on beautiful UI, performance, and
          accessibility.
        </p>
        
        <div className="mt-6 flex gap-4">
          <a
            className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white"
            href="/projects"
          >
            See projects
          </a>
          <a
            className="inline-flex items-center px-4 py-2 rounded-md border"
            href="/about"
          >
            About
          </a>
        </div>
      </div> */}
    </div>
  );
};

export default Hero;
