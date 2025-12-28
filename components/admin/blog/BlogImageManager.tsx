import React from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";
import { supabase } from "@/lib/supabase";

interface BlogImageManagerProps {
  images: string[];
  onImagesChange: (images: string[]) => void; // Expects a function that takes the new array
}

export default function BlogImageManager({
  images,
  onImagesChange,
}: BlogImageManagerProps) {
  const handleDeleteImage = async (url: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this image? This cannot be undone."
      )
    )
      return;

    try {
      // Extract path from URL
      // URL format: .../storage/v1/object/public/portfolio-assets/blog/filename.ext
      const path = url.split("portfolio-assets/")[1];
      if (!path) {
        // If we can't parse it, just remove from list to be safe
        onImagesChange(images.filter((u) => u !== url));
        return;
      }

      const { error: storageError } = await supabase.storage
        .from("portfolio-assets")
        .remove([path]);

      if (storageError) throw storageError;

      // Also remove from blog_post_images table if it exists there
      const { error: dbError } = await supabase
        .from("blog_post_images")
        .delete()
        .eq("image_url", url);

      if (dbError) {
        console.error("Error deleting from DB:", dbError);
      }

      onImagesChange(images.filter((u) => u !== url));
      toast.success("Image deleted permanently");
    } catch (error: unknown) {
      console.error("Error deleting image:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete image";
      toast.error("Failed to delete image: " + errorMessage);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    const fileExt = file.name.split(".").pop();
    const fileName = `blog-${crypto.randomUUID().split("-")[1]}.${fileExt}`;
    const filePath = `blog/${fileName}`;
    const { error } = await supabase.storage
      .from("portfolio-assets")
      .upload(filePath, file);

    if (error) {
      toast.error("Error: " + error.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("portfolio-assets").getPublicUrl(filePath);

    onImagesChange([...images, publicUrl]);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        Cover Image (Thumbnail)
      </label>
      <p className="text-xs text-muted-foreground mb-2">
        The first image here will be used as the blog post thumbnail.
      </p>
      <div className="flex flex-wrap gap-2">
        {images.map((url, idx) => (
          <div
            key={idx}
            className="relative w-20 h-20 rounded-lg overflow-hidden border group"
          >
            <img src={url} alt="Blog" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => handleDeleteImage(url)}
              className="absolute top-0 right-0 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <ImageUploader
          onFileSelect={(file) => {
            if (file) handleImageUpload(file);
          }}
        />
      </div>
    </div>
  );
}
