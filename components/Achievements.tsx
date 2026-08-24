"use client";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { ArrowUpRight } from "lucide-react";
import { Database } from "@/types/supabase";

type Experience = Database["public"]["Tables"]["experience"]["Row"];

const AchievementCard = ({
  title,
  issuer,
  date,
  href,
  isLast,
}: {
  title: string;
  issuer: string;
  date: string;
  href?: string;
  isLast: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative pl-10 pb-10 group"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[14px] top-8 w-[2px] h-full bg-gradient-to-b from-primary/30 via-border to-transparent" />
      )}

      {/* Timeline dot */}
      <div className="absolute left-[3px] top-6 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
        <FontAwesomeIcon icon={faTrophy} className="w-3 h-3 text-primary" />
      </div>

      {/* Card content */}
      <div className="relative overflow-hidden bg-card/30 backdrop-blur-md border border-border/40 rounded-xl p-6 transition-all duration-500 hover:border-primary/40 hover:bg-card/80 hover:shadow-2xl hover:-translate-y-1 z-10 group-hover:ring-1 group-hover:ring-primary/20">
        {/* Subtle hover gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">{issuer}</p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2 mt-2 md:mt-0">
            <span className="text-xs font-mono text-muted-foreground/80 bg-muted/40 px-2.5 py-1 rounded-md border border-border/50">
              {date}
            </span>
            {href && (
              <a
                className="text-xs flex gap-1.5 items-center text-muted-foreground hover:text-primary group-hover:text-primary transition-colors font-medium mt-1"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
                <ArrowUpRight
                  size={14}
                  className="group-hover:-translate-y-[1px] group-hover:translate-x-[1px] transition-transform duration-300"
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Achievements = ({ initialData }: { initialData: Experience[] }) => {
  if (initialData.length === 0) return null;

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold mb-6 flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-accent" />
        Achievements
      </motion.h2>
      <div className="ml-1">
        {initialData.map((item, index) => (
          <AchievementCard
            key={item.id}
            title={item.title}
            issuer={item.organization}
            date={new Date(item.start_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            href={item.organization_url || undefined}
            isLast={index === initialData.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Achievements;
