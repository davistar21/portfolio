"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { faHandsHelping } from "@fortawesome/free-solid-svg-icons";
import { Database } from "@/types/supabase";

type Experience = Database["public"]["Tables"]["experience"]["Row"];

const VolunteeringCard = ({
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
        <div className="absolute left-[11px] top-6 w-[2px] h-full bg-gradient-to-b from-amber-500/50 to-transparent" />
      )}

      {/* Timeline dot */}
      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center">
        <FontAwesomeIcon
          icon={faHandsHelping}
          className="w-3 h-3 text-amber-500"
        />
      </div>

      {/* Card content */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-5 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-amber-500 transition-colors">
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

const Volunteering = ({ initialData }: { initialData: Experience[] }) => {
  if (initialData.length === 0) return null;

  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-amber-800/10 rounded-full blur-3xl pointer-events-none" />

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl font-bold mb-6 flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        Volunteering
      </motion.h2>
      <div className="ml-1">
        {initialData.map((item, index) => (
          <VolunteeringCard
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

export default Volunteering;
