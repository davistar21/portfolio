"use client";

import { motion } from "framer-motion";
import { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiPython,
  SiGraphql,
  SiPrisma,
  SiOpenai,
  SiPostgresql,
  SiSupabase,
  SiMongodb,
  SiAmazon,
  SiDocker,
  SiKubernetes,
  SiTerraform,
  SiVercel,
  SiLinux,
  SiGit,
  SiFigma,
} from "react-icons/si";
import SectionEyebrow from "./SectionEyebrow";

type Skill = { name: string; icon: IconType };
type Category = { name: string; skills: Skill[] };

const CATALOG: Category[] = [
  {
    name: "Frontend",
    skills: [
      { name: "React", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "TypeScript", icon: SiTypescript },
      { name: "Tailwind", icon: SiTailwindcss },
    ],
  },
  {
    name: "Backend",
    skills: [
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Python", icon: SiPython },
      { name: "GraphQL", icon: SiGraphql },
      { name: "Prisma", icon: SiPrisma },
      { name: "OpenAI", icon: SiOpenai },
    ],
  },
  {
    name: "Databases",
    skills: [
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Supabase", icon: SiSupabase },
      { name: "MongoDB", icon: SiMongodb },
    ],
  },
  {
    name: "DevOps",
    skills: [
      { name: "AWS", icon: SiAmazon },
      { name: "Docker", icon: SiDocker },
      { name: "Kubernetes", icon: SiKubernetes },
      { name: "Terraform", icon: SiTerraform },
      { name: "Vercel", icon: SiVercel },
      { name: "Linux", icon: SiLinux },
    ],
  },
  {
    name: "Tooling",
    skills: [
      { name: "Git", icon: SiGit },
      { name: "Figma", icon: SiFigma },
    ],
  },
];

export default function TechnicalSkills() {
  return (
    <section aria-labelledby="skills-heading">
      <h2 id="skills-heading" className="sr-only">
        Technical Skills
      </h2>
      <SectionEyebrow index="02" label="Technical Skills" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid gap-5 md:grid-cols-2"
      >
        {CATALOG.map((category) => (
          <motion.article
            key={category.name}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: "easeOut" },
              },
            }}
            className="rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm"
          >
            <h3 className="mb-5 font-serif text-xl md:text-2xl text-foreground">
              {category.name}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {category.skills.map((skill, i) => {
                const Icon = skill.icon;
                return (
                  <motion.li
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.3,
                      delay: 0.03 * i,
                      ease: "easeOut",
                    }}
                    className="group inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/40 px-3 py-1.5 text-sm text-foreground/85 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground/80 transition-colors group-hover:text-primary" />
                    {skill.name}
                  </motion.li>
                );
              })}
            </ul>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
