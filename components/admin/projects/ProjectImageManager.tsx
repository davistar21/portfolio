import React, { useState } from "react";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { X, GripVertical, ArrowLeft, ArrowRight } from "lucide-react";
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDeleteImage = async (url: string) => {
    // 1. Check if image is in database
    const isSavedImage = editingProject?.project_images?.some(
      (img) => img.image_url === url,
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
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= currentImages.length) return;

    const newImages = [...currentImages];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    setCurrentImages(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    moveImage(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium mb-1">Project Images</label>
      <p className="text-xs text-muted-foreground mb-3">
        Drag images to reorder. The first image is used as the
        display/thumbnail.
      </p>
      <div className="space-y-4">
        <AnimatePresence mode="sync">
          {currentImages.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {currentImages.map((url, idx) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    boxShadow:
                      draggedIndex === idx
                        ? "0 8px 20px rgba(0,0,0,0.2)"
                        : "none",
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  key={url}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`relative rounded-lg overflow-hidden border-2 group cursor-grab active:cursor-grabbing ${
                    idx === 0
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border"
                  } ${draggedIndex === idx ? "opacity-50" : ""}`}
                >
                  {/* Display badge for first image */}
                  {idx === 0 && (
                    <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-br-md z-10">
                      DISPLAY
                    </div>
                  )}

                  {/* Drag handle indicator */}
                  <div className="absolute top-1/2 left-1 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <GripVertical className="w-4 h-4 text-white drop-shadow-lg" />
                  </div>

                  <img
                    src={url}
                    alt={`Project image ${idx + 1}`}
                    className="w-24 h-24 object-cover"
                    draggable={false}
                  />

                  {/* Controls overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    {/* Move left */}
                    <button
                      type="button"
                      onClick={() => moveImage(idx, idx - 1)}
                      disabled={idx === 0}
                      className="p-1.5 bg-white/90 rounded-full text-gray-700 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move left"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </button>

                    {/* Move right */}
                    <button
                      type="button"
                      onClick={() => moveImage(idx, idx + 1)}
                      disabled={idx === currentImages.length - 1}
                      className="p-1.5 bg-white/90 rounded-full text-gray-700 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move right"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(url)}
                      className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600"
                      title="Delete image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Index badge */}
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                    {idx + 1}
                  </div>
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
              (url): url is string => url !== null,
            );
            setCurrentImages((prev) => [...prev, ...successfulUploads]);
          }}
        />
      </div>
    </div>
  );
};

export default ProjectImageManager;
