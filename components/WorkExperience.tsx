"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { faLaptopCode } from "@fortawesome/free-solid-svg-icons";
import { Database } from "@/types/supabase";

type Experience = Database["public"]["Tables"]["experience"]["Row"];

const WorkExperienceCard = ({
  title,
  issuer,
  date,
  isLast,
}: {
  title: string;
  issuer: string;
  date: string;
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
        <div className="absolute left-[11px] top-6 w-[2px] h-full bg-gradient-to-b from-primary/50 to-transparent" />
      )}

      {/* Timeline dot */}
      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
        <FontAwesomeIcon icon={faLaptopCode} className="w-3 h-3 text-primary" />
      </div>

      {/* Card content */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm">{issuer}</p>
          </div>
          <span className="text-xs font-mono text-muted-foreground/70 bg-muted/50 px-2 py-1 rounded-md w-fit">
            {date}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const WorkExperience = ({ initialData }: { initialData: Experience[] }) => {
  if (initialData.length === 0) return null;

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold mb-6 flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-primary" />
        Work Experience
      </motion.h2>
      <div className="ml-1">
        {initialData.map((item, index) => (
          <WorkExperienceCard
            key={item.id}
            title={item.title}
            issuer={item.organization}
            date={`${new Date(item.start_date).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })} - ${
              item.end_date
                ? new Date(item.end_date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : "Present"
            }`}
            isLast={index === initialData.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkExperience;
