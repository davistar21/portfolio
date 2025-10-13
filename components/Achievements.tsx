"use client";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLaptop,
  faGraduationCap,
  faCertificate,
  IconDefinition,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { ArrowUpRight, Trophy, TrophyIcon } from "lucide-react";

const achievementDetails = [
  {
    title: "1st Place, AWS Cloud User Security Group Hackathon 2025",
    issuer: "AWS Cloud User Security Group",
    date: "October 11, 2025",
    icon: faTrophy,
    href: "https://www.linkedin.com/feed/update/urn:li:activity:7383116434765201408/",
  },
];

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
  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold">Achievements</h1>
      <div className="space-y-4">
        {achievementDetails.map((e, idx) => (
          <AchievementCard {...e} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default Achievements;
