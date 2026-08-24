"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionEyebrow from "./SectionEyebrow";
import { Database } from "@/types/supabase";

type Bio = Database["public"]["Tables"]["bio"]["Row"];

export default function AboutMe({ bio }: { bio: Bio | null }) {
  if (!bio) return null;

  return (
    <section aria-labelledby="about-me-heading">
      <h2 id="about-me-heading" className="sr-only">
        About Me
      </h2>
      <SectionEyebrow index="01" label="About Me" />

      <div className="grid gap-8 md:gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] items-start">
        {bio.profile_image_url ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-lg"
          >
            <Image
              src={bio.profile_image_url}
              alt={bio.name}
              fill
              sizes="(min-width: 768px) 38vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        ) : null}

        <div>
          {bio.tagline ? (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="font-serif text-2xl md:text-3xl leading-snug text-foreground"
            >
              {bio.tagline}
            </motion.p>
          ) : null}
          {bio.description ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
              className="mt-6 space-y-4 text-foreground/75 leading-relaxed"
            >
              {bio.description.split(/\n+/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
