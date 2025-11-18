"use client";
import React from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react"; // Import Lucide React icon

const NotFound = () => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex justify-center items-center min-h-screen text-white">
      <motion.div
        className="text-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 100 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.3, duration: 1 },
          },
        }}
      >
        {/* Staggered animation for the icon */}
        <motion.div
          className="text-6xl text-center mb-4 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Search className="w-20 h-20 text-gray-500" />
        </motion.div>

        {/* Staggered animation for the title */}
        <motion.h1
          className="text-4xl font-bold mb-2"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          Oops! Page Not Found
        </motion.h1>

        {/* Staggered animation for the description */}
        <motion.p
          className="text-lg mb-4"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          The page you are looking for doesn&apos;t exist or has been moved.
        </motion.p>

        {/* Staggered animation for the button */}
        <motion.button
          onClick={handleGoHome}
          className="bg-gray-700 text-white px-6 py-2 rounded-lg shadow-lg transition transform hover:scale-105 cursor-pointer"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Go Back Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;
