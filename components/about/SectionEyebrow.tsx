"use client";

import { motion } from "framer-motion";

export default function SectionEyebrow({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className="mb-10 flex items-center gap-4 text-xs font-mono tracking-[0.25em] uppercase text-muted-foreground"
    >
      <motion.span
        variants={{
          hidden: { opacity: 0, y: 6 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        }}
        className="text-primary"
      >
        {index}
      </motion.span>
      <motion.span
        variants={{
          hidden: { scaleX: 0 },
          visible: { scaleX: 1, transition: { duration: 0.6, ease: "easeOut" } },
        }}
        style={{ originX: 0 }}
        className="h-px w-12 bg-border"
      />
      <motion.span
        variants={{
          hidden: { opacity: 0, x: -6 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
        }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}
