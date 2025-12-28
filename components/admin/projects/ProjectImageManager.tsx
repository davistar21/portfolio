import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Database } from "@/types/supabase";

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  project_images?: Database["public"]["Tables"]["project_images"]["Row"][];
};

interface ProjectImageManagerProps {
  currentImages: string[];
  setCurrentImages: React.Dispatch<React.SetStateAction<string[]>>;
  editingProject: Project | null;
}

const ProjectImageManager = ({
  currentImages,
  setCurrentImages,
  editingProject,
}: ProjectImageManagerProps) => {
  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium mb-3">Project Images</label>
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {currentImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {currentImages.map((url, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  key={idx}
                  className="relative w-24 h-24 rounded-lg overflow-hidden border group"
                >
                  <img
                    src={url}
                    alt="Project"
                    className="w-full h-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={async () => {
                      // 1. Check if image is in database
                      const isSavedImage = editingProject?.project_images?.some(
                        (img) => img.image_url === url
                      );

                      if (isSavedImage) {
                        const { error: dbError } = await supabase
                          .from("project_images")
                          .delete()
                          .eq("image_url", url);

                        if (dbError) {
                          toast.error("Failed to delete image record");
                          console.error(dbError);
                          return;
                        }
                      }

                      // 2. Delete from storage if it's a hosted asset
                      if (url.includes("portfolio-assets")) {
                        const path = url.split("portfolio-assets/")[1];
                        if (path) {
                          const { error } = await supabase.storage
                            .from("portfolio-assets")
                            .remove([path]);
                          if (error) {
                            toast.error("Failed to delete image file");
                            return;
                          }
                        }
                      }
                      setCurrentImages((prev) => prev.filter((u) => u !== url));
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
        <ImageUploader
          multiple={true}
          onFilesSelect={async (files) => {
            if (!files || files.length === 0) return;

            const uploads = files.map(async (file) => {
              const fileExt = file.name.split(".").pop();
              const fileName = `project-${
                crypto.randomUUID().split("-")[1]
              }.${fileExt}`;
              const filePath = `projects/${fileName}`;

              const { error: uploadError } = await supabase.storage
                .from("portfolio-assets")
                .upload(filePath, file);

              if (uploadError) {
                toast.error("Error uploading image: " + uploadError.message);
                return null;
              }

              const {
                data: { publicUrl },
              } = supabase.storage
                .from("portfolio-assets")
                .getPublicUrl(filePath);

              return publicUrl;
            });

            const results = await Promise.all(uploads);
            const successfulUploads = results.filter(
              (url): url is string => url !== null
            );
            setCurrentImages((prev) => [...prev, ...successfulUploads]);
          }}
        />
      </div>
    </div>
  );
};

export default ProjectImageManager;
