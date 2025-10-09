"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Laptop2 } from "lucide-react";
import { motion } from "framer-motion";
import { JSX } from "react";
import { faLaptopCode } from "@fortawesome/free-solid-svg-icons";
const workExperienceDetails = [
  {
    title: "Frontend Developer Intern",
    issuer: "Sphiderass Web Ltd.",
    date: "Sep 2024 - Dec 2024",
    icon: <FontAwesomeIcon icon={faLaptopCode} />,
  },
];
const WorkExperienceCard = ({
  title,
  issuer,
  date,
  icon,
}: {
  title: string;
  issuer: string;
  date: string;
  icon: JSX.Element;
  certificate?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border-1 border-gray-500/50 rounded-xl py-5 px-4 flex flex-col md:flex-row gap-4 items-start"
    >
      <div className="flex md:flex-col flex-row-reverse gap-4 items-start flex-1 w-full">
        <div className="w-5 h-5 mt-auto">{icon}</div>
        <div className="flex-1 flex flex-col justify-between">
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

const WorkExperience = () => {
  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold">Work Experience</h1>
      <div className="space-y-4">
        {workExperienceDetails.map((e, idx) => (
          <WorkExperienceCard {...e} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default WorkExperience;
