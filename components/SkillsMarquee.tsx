"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiPostgresql,
  SiGraphql,
  SiTailwindcss,
  SiSupabase,
  SiAmazon,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiFigma,
  SiVercel,
  SiMongodb,
  SiTerraform,
  SiLinux,
  SiOpenai,
  SiPrisma,
} from "react-icons/si";

// Simple wrap function to loop values within a range
function wrap(min: number, max: number, v: number): number {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

interface ParallaxTextProps {
  children: React.ReactNode;
  baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxTextProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  // Reduced scroll influence (was [0, 5], now [0, 1])
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 1], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  const isPaused = useRef(false);

  useAnimationFrame((t, delta) => {
    if (isPaused.current) return;

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap"
      onMouseEnter={() => (isPaused.current = true)}
      onMouseLeave={() => (isPaused.current = false)}
    >
      <motion.div className="flex flex-nowrap gap-16" style={{ x }}>
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
}

const SkillItem = ({
  icon: Icon,
  name,
}: {
  icon: React.ElementType;
  name: string;
}) => (
  <div className="flex items-center gap-2 group">
    <Icon className="w-8 h-8 md:w-10 md:h-10 text-foreground group-hover:text-primary transition-colors duration-300" />
    <span className="text-xl md:text-2xl font-bold text-muted-foreground/30 uppercase tracking-tighter group-hover:text-muted-foreground transition-colors duration-300">
      {name}
    </span>
  </div>
);

export default function SkillsMarquee() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 2 }}
      viewport={{ once: true }}
      className="py-10 space-y-8 overflow-hidden"
    >
      {/* Strip 1: Frontend & Backend */}
      <ParallaxText baseVelocity={-0.5}>
        <div className="flex gap-16 px-8">
          <SkillItem icon={SiReact} name="React" />
          <SkillItem icon={SiNextdotjs} name="Next.js" />
          <SkillItem icon={SiTypescript} name="TypeScript" />
          <SkillItem icon={SiNodedotjs} name="Node.js" />
          <SkillItem icon={SiPython} name="Python" />
          <SkillItem icon={SiPostgresql} name="PostgreSQL" />
          <SkillItem icon={SiGraphql} name="GraphQL" />
          <SkillItem icon={SiTailwindcss} name="Tailwind" />
          <SkillItem icon={SiSupabase} name="Supabase" />
          <SkillItem icon={SiPrisma} name="Prisma" />
        </div>
      </ParallaxText>

      {/* Strip 2: Tools & DevOps */}
      <ParallaxText baseVelocity={0.5}>
        <div className="flex gap-16 px-8">
          <SkillItem icon={SiAmazon} name="AWS" />
          <SkillItem icon={SiDocker} name="Docker" />
          <SkillItem icon={SiKubernetes} name="Kubernetes" />
          <SkillItem icon={SiGit} name="Git" />
          <SkillItem icon={SiFigma} name="Figma" />
          <SkillItem icon={SiVercel} name="Vercel" />
          <SkillItem icon={SiMongodb} name="MongoDB" />
          <SkillItem icon={SiTerraform} name="Terraform" />
          <SkillItem icon={SiLinux} name="Linux" />
          <SkillItem icon={SiOpenai} name="OpenAI" />
        </div>
      </ParallaxText>
    </motion.section>
  );
}
