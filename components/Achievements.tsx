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
      className="relative pl-8 pb-8 group"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] top-6 w-[2px] h-full bg-gradient-to-b from-accent/50 to-transparent" />
      )}

      {/* Timeline dot */}
      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
        <FontAwesomeIcon icon={faTrophy} className="w-3 h-3 text-accent" />
      </div>

      {/* Card content */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-5 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm">{issuer}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-mono text-muted-foreground/70 bg-muted/50 px-2 py-1 rounded-md">
              {date}
            </span>
            {href && (
              <a
                className="text-xs flex gap-1 items-center text-accent hover:text-accent/80 transition"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
                <ArrowUpRight size={12} />
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
