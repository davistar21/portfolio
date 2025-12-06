"use client";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

type Experience = Database["public"]["Tables"]["experience"]["Row"];

const AchievementCard = ({
  title,
  issuer,
  date,
  icon,
  href,
}: {
  title: string;
  issuer: string;
  date: string;
  icon: IconDefinition;
  href?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      viewport={{ once: true }}
      className="border-1 border-gray-500/50 rounded-xl py-5 px-4 flex flex-col md:flex-row gap-4"
    >
      <div className="flex md:flex-row flex-row-reverse gap-4 items-start justofy-between w-full">
        <div className="w-5 h-5 md:mt-0 mt-auto">
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className="flex flex-col justify-between mr-auto">
          <span className="">{title}</span>
          <p className=" text-gray-400">{issuer}</p>
        </div>
      </div>
      <div className="text-gray-400/80 flex md:flex-col md:items-end justify-between flex-row w-full">
        <span>{date}</span>

        {href && (
          <a
            className="text-sm flex gap-[2px] items-center !text-gray-500 hover:text-gray-200 transition"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            View
            <ArrowUpRight size={16} />
          </a>
        )}
      </div>
    </motion.div>
  );
};
const Achievements = () => {
  const [achievements, setAchievements] = useState<Experience[]>([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      const { data } = await supabase
        .from("experience")
        .select("*")
        .eq("type", "achievement")
        .order("order_index", { ascending: true });

      if (data) {
        setAchievements(data);
      }
    };
    fetchAchievements();
  }, []);

  if (achievements.length === 0) return null;

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold">Achievements</h1>
      <div className="space-y-4">
        {achievements.map((item) => (
          <AchievementCard
            key={item.id}
            title={item.title}
            issuer={item.organization}
            date={new Date(item.start_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            icon={faTrophy}
            href={item.organization_url || undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default Achievements;
