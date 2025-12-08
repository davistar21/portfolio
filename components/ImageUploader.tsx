import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
// import formatSize from "@/utils/formatSize";
import Image from "next/image";
import { Upload, UploadCloud, X } from "lucide-react";
export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const k = 1024;

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);

  return `${size.toFixed(2)} ${sizes[i]}`;
}

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
  onFilesSelect?: (files: File[]) => void;
  multiple?: boolean;
}

const ImageUploader = ({
  onFileSelect,
  onFilesSelect,
  multiple = false,
}: FileUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (multiple) {
        onFilesSelect?.(acceptedFiles);
        return;
      }

      const file = acceptedFiles[0] || null;
      onFileSelect?.(file);

      // Create a preview URL for the image
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    },
    [onFileSelect, onFilesSelect, multiple]
  );

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
    multiple: multiple,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: 5 * 1024 * 1024, // 5 MB
  });

  const file = acceptedFiles[0] || null;

  // Cleanup preview URL on unmount or when file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect?.(null);
    setPreviewUrl(null);
  };

  return (
    <div
      {...getRootProps()}
      className="w-full bg-gradient-to-br from-secondary/10 to-secondary/40 rounded-lg "
    >
      <input {...getInputProps()} />
      <div className="space-y-4 cursor-pointer flex flex-col items-center text-center border-2 border-gray-500 rounded-lg py-6">
        {!multiple && file && previewUrl ? (
          <div
            className="flex w-full justify-center items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* @ts-expect-error Next.js Image type mismatch */}
            <Image
              width={100}
              height={100}
              src={previewUrl}
              alt="Preview"
              className="size-20 rounded border"
            />
            <div className="space-y-1 max-w-[60%]">
              <p className="truncate text-gray-200 font-medium max-w-xs text-sm flex-1">
                {file.name || "image"}
              </p>
              <p className="text-sm text-gray-300">{formatSize(file.size)}</p>
            </div>
            <button className="p-2 cursor-pointer" onClick={handleRemove}>
              <X size={20} />
            </button>
          </div>
        ) : (
          <div>
            <div className="mx-auto mb-2 w-16 h-16 flex items-center justify-center">
              <Upload size={35} />
            </div>
            <p className="text-lg text-gray-300">
              <span className="font-semibold">
                Click to upload {multiple ? "files" : "file"}
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-lg text-gray-300">PNG or JPG (max 5MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
