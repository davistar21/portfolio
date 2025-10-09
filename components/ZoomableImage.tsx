"use client";

import React, { useState, FC } from "react";
import ImageModal from "./ImageModal";
import { motion } from "framer-motion";
import { X } from "lucide-react";
interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

const ZoomableImage: FC<ZoomableImageProps> = ({ src, alt, className }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isOpens, setIsOpens] = useState(false);

  const openModal = () => setIsOpens(true);
  const closeModal = () => setIsOpens(false);

  return (
    <div
      onClick={openModal}
      className={`
          inline-block cursor-pointer transition-all min-w-[300px] w-full h-[180px]  duration-300 
          hover:scale-[1.01]
          shadow-md rounded-lg overflow-hidden 
          ${className || ""}
        `}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />

      {/* <div
          className={`relative h-[100vh] inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm  ${
            isOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
          onClick={closeModal}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            onClick={closeModal}
            aria-label="Close image modal"
          >
            <X className="h-8 w-8" />
          </button>
        </div> */}

      <motion.div
        // initial={{ opacity: 0, scale: 0.2, width: "368" }}
        // animate={{ opacity: 1, scale: 1 }}
        // transition={{ duration: 2 }}
        // className={isOpen ? "scale-125 absolute z-51" : ""}
        className="relative hover:absolute top-0 hover:w-[100px] left-0 hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* <motion.img
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          /> */}
      </motion.div>
    </div>
  );
};

export default ZoomableImage;
