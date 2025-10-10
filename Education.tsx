"use client";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLaptop,
  faGraduationCap,
  faCertificate,
} from "@fortawesome/free-solid-svg-icons";
import { ArrowUpRight } from "lucide-react";
import { JSX, ForwardRefExoticComponent } from "react";

const educationDetails = [
  {
    title: "Bachelor of Science in Computer Engineering",
    issuer: "University of Lagos",
    date: "Nov 2023 - Aug 2028",
    icon: <FontAwesomeIcon icon={faGraduationCap} />,
  },
  {
    title: "HatchDev 3.1 Full Stack Development Training",
    issuer: "Nithub",
    date: "May 2025 - Nov 2025",
    icon: <FontAwesomeIcon icon={faLaptop} />,
  },
  {
    title: "ECX Backend Web Development Beginner Track",
    issuer: "Engineering Career Expo",
    date: "Dec 2024 - Jan 2025",
    icon: <FontAwesomeIcon icon={faLaptop} />,
    certificate:
      "https://www.credly.com/badges/8f7f5b1e-6d3a-4e2e-9b1c-1d3f3c3e3c3e",
  },
  {
    title: "Basics of Artificial Intelligence: Learning Models",
    issuer: "UniAthena",
    date: "20 Sept 2025",
    icon: <FontAwesomeIcon icon={faCertificate} />,
    certificate: "fghj",
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
  icon:
    | ForwardRefExoticComponent<
        React.SVGProps<SVGSVGElement> & { title?: string | undefined }
      >
    | JSX.Element;
  certificate?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      viewport={{ once: true }}
      className="border-1 border-gray-500/50 rounded-xl py-5 px-4 flex flex-col md:flex-row gap-4 items-start"
    >
      <div className="flex md:flex-row flex-row-reverse gap-4 items-start justofy-between w-full">
        <div className="w-5 h-5 md:mt-0 mt-auto">{icon}</div>
        <div className="flex flex-col justify-between mr-auto">
          <span className="">{title}</span>
          <p className=" text-gray-400">{issuer}</p>
        </div>
      </div>
      <div className="text-gray-400/80 flex md:flex-col md:items-end justify-between flex-row w-full">
        <span>{date}</span>

        {certificate && (
          <a
            className="text-sm flex gap-[2px] items-center !text-gray-500  hover:text-gray-200 transition"
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
    <div>
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
