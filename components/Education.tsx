"use client";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLaptop,
  faGraduationCap,
  faCertificate,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { ArrowUpRight } from "lucide-react";

const educationDetails = [
  {
    title: "Bachelor of Science in Computer Engineering",
    issuer: "University of Lagos",
    date: "Nov 2023 - Aug 2028",
    icon: faGraduationCap,
  },
  {
    title: "HatchDev 3.1 Full Stack Development Training",
    issuer: "Nithub",
    date: "May 2025 - Nov 2025",
    icon: faLaptop,
  },
  {
    title: "ECX Backend Web Development Beginner Track",
    issuer: "Engineering Career Expo",
    date: "Dec 2024 - Jan 2025",
    icon: faLaptop,
    certificate:
      "https://www.credly.com/badges/8f7f5b1e-6d3a-4e2e-9b1c-1d3f3c3e3c3e",
  },
  {
    title: "Basics of Artificial Intelligence: Learning Models",
    issuer: "UniAthena",
    date: "20 Sept 2025",
    icon: faCertificate,
    certificate:
      "https://uniathena.com/verify/certificate?certID=7822-9232-3389",
  },
];

const EducationCard = ({
  title,
  issuer,
  date,
  icon,
  certificate,
}: {
  title: string;
  issuer: string;
  date: string;
  icon: IconDefinition;
  certificate?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      viewport={{ once: true }}
      className="border-1 border-border rounded-xl py-5 px-4 flex flex-col md:flex-row gap-4 "
    >
      <div className="flex md:flex-row flex-row-reverse gap-4 items-start justify-between w-full">
        <div className="w-5 h-5 md:mt-0 mt-auto">
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className="flex flex-col justify-between mr-auto">
          <span className="">{title}</span>
          <p className=" text-muted-foreground">{issuer}</p>
        </div>
      </div>
      <div className="text-muted-foreground/80 flex md:flex-col md:items-end justify-between flex-row w-full">
        <span>{date}</span>

        {certificate && (
          <a
            className="text-sm flex gap-[2px] items-center !text-muted-foreground  hover:text-foreground transition"
            href={certificate}
          >
            View Certificate
            <ArrowUpRight size={16} />
          </a>
        )}
      </div>
    </motion.div>
  );
};
const Education = () => {
  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none " />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none " />

      <h1 className="mb-4 text-lg font-semibold">Education</h1>
      <div className="space-y-4">
        {educationDetails.map((e, idx) => (
          <EducationCard {...e} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default Education;
