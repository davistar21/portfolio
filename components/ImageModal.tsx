import React, { FC } from "react";
import { X } from "lucide-react"; // You'll need to install lucide-react: npm install lucide-react
import { motion } from "framer-motion";
interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
  isOpen: boolean;
}

const ImageModal: FC<ImageModalProps> = ({ src, alt, onClose, isOpen }) => {
  return (
    // Fullscreen Overlay (The 'Modal')
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm  ${
        isOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
      onClick={() => {}} // Closes modal when clicking outside the image
    >
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
        onClick={onClose}
        aria-label="Close image modal"
      >
        <X className="h-8 w-8" />
      </button>

      {/* Image Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
        className="w-[30vh] h-[30vh] sm:w-[60vh] sm:h-[60vh] md:w-[80vh] md:h-[80vh] lg:w-[90vh] lg:h-[90vh] p-4 items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Prevents clicking the image from closing the modal
      >
        <motion.img
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: 1, scale: 1 }}
          src={src}
          alt={alt}
          // Object-contain ensures the whole image is visible within the screen limits
          className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
        />
      </motion.div>
    </div>
  );
};

export default ImageModal;
