"use client";
import React from "react";
import { motion } from "framer-motion";
import ZoomableImage from "./ZoomableImage";
import { Tag } from "lucide-react";

type Image = {
  src: string;
  alt: string;
};
export default function ProjectCard({
  title,
  description,
  tags,
  img,
  link,
}: {
  title: string;
  description: string;
  tags?: string[];
  img: Image;
  link: string;
}) {
  return (
    <motion.a
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=" w-[330px] flex flex-col mx-auto snap-center"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <ZoomableImage
        src={img.src} // Use your image path
        alt={img.alt}
      />
      <div className="mt-2 flex flex-col gap-4">
        <div>
          <h3 className="font-semibold">{title}</h3>

          <p className="text-sm text-gray-300/80 mt-1">{description}</p>
        </div>

        <div className="overflow-x-auto scrollbar-hide md:scrollbar-custom whitespace-nowrap w-full mt-full pb-2 flex gap-2 min-w-full ">
          {tags?.map((tag, index) => (
            <span
              key={index}
              className="text-gray-400 text-xs px-2 py-1 border rounded-full flex gap-2 items-center"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}
