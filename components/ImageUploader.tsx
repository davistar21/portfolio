import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
// import formatSize from "@/utils/formatSize";
import Image from "next/image";
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
}

const ImageUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      onFileSelect?.(file);

      // Create a preview URL for the image
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: 2 * 1024 * 1024, // 20 MB
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
    <div {...getRootProps()} className="w-full gradient-border">
      <input {...getInputProps()} />
      <div className="space-y-4 cursor-pointer flex flex-col items-center text-center">
        {file && previewUrl ? (
          <div
            className="uploader-selected-file"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              width={100}
              height={100}
              src={previewUrl}
              alt="Preview"
              className="size-20 rounded border"
            />
            <div className="space-y-1 max-w-[60%]">
              <p className="truncate text-gray-700 font-medium max-w-xs text-sm">
                {file.name || "image"}
              </p>
              <p className="text-sm text-gray-500">{formatSize(file.size)}</p>
            </div>
            <button className="p-2 cursor-pointer" onClick={handleRemove}>
              <Image
                width={20}
                height={20}
                src="/icons/cross.svg"
                alt="Remove"
                className="w-4 h-4"
              />
            </button>
          </div>
        ) : (
          <div>
            <div className="mx-auto mb-2 w-16 h-16 flex items-center justify-center">
              <Image
                width={20}
                height={20}
                src="/icons/info.svg"
                alt="upload"
                className="size-20"
              />
            </div>
            <p className="text-lg text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-lg text-gray-500">PNG or JPG (max 2MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
