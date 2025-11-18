"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Laptop2 } from "lucide-react";
import { motion } from "framer-motion";
import { ForwardRefExoticComponent, JSX } from "react";
import {
  faGraduationCap,
  faLaptop,
  faLaptopCode,
  faList,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
const volunteeringDetails = [
  {
    title: "Operations Team Member",
    issuer: "SEES UNILAG",
    date: "Oct 2025 - Present",
    icon: faList,
  },
  {
    title: "Frontend Instructor",
    issuer: "Microsoft Learn Student Ambassadors (MLSA) UNILAG",
    date: "Oct 2025 - Present",
    icon: faGraduationCap,
  },
];
const VolunteeringCard = ({
  title,
  issuer,
  date,
  icon,
}: {
  title: string;
  issuer: string;
  date: string;
  icon: IconDefinition;
  certificate?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="border-1 border-gray-500/50 rounded-xl py-5 px-4 flex flex-col md:flex-row gap-4 items-start"
    >
      <div className="flex md:flex-row flex-row-reverse gap-4 items-start justofy-between w-full">
        <div className="w-5 h-5 md:mt-0 mt-auto">
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className="flex flex-col justify-between mr-auto">
          <span className="!m-0">{title}</span>
          <p className=" text-gray-400">{issuer}</p>
        </div>
      </div>
      <div className="text-gray-400/80 flex md:flex-col md:items-end justify-between flex-row w-full">
        <span>{date}</span>
      </div>
    </motion.div>
  );
};

const Volunteering = () => {
  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold">Volunteering</h1>
      <div className="space-y-4">
        {volunteeringDetails.map((e, idx) => (
          <VolunteeringCard {...e} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default Volunteering;
