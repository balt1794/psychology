"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, ImagePlus, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setUploadError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/ai-interior-upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to upload");
        }

        const data = await response.json();
        onImageUpload(data.url);
      } catch (error) {
        console.error("Upload error:", error);
        setUploadError(
          error instanceof Error ? error.message : "Failed to upload image",
        );
      } finally {
        setIsUploading(false);
      }
    },
    [onImageUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files?.[0]) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          uploadFile(file);
        }
      }
    },
    [uploadFile],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files?.[0]) {
        const file = files[0];
        uploadFile(file);
      }
    },
    [uploadFile],
  );

  return (
    <div className="relative z-10 mx-auto w-full max-w-2xl animate-fade-in-up text-black">
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={`
            dropzone relative cursor-pointer p-8 md:p-12 block min-h-[420px] md:min-h-[500px]
            ${isDragOver ? "dragover" : ""}
            ${isHovering || isDragOver ? "animate-border-glow" : ""}
            ${isUploading ? "pointer-events-none opacity-70" : ""}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="sr-only"
          />

          <div className="relative flex min-h-[340px] md:min-h-[410px] flex-col items-center justify-center">
            <div
              className={`
              relative w-40 h-40 mb-8 transition-transform duration-500
              ${isHovering || isDragOver ? "scale-110" : ""}
              ${isDragOver ? "" : "animate-float"}
            `}
            >
            
              {(isHovering || isDragOver) && (
                <>
                  <div
                    className="absolute top-2 right-8 w-2 h-2 rounded-full bg-[#5E7361] animate-pulse-subtle"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="absolute top-10 left-4 w-1.5 h-1.5 rounded-full bg-[#b8965c] animate-pulse-subtle"
                    style={{ animationDelay: "300ms" }}
                  />
                  <div
                    className="absolute bottom-12 right-4 w-2 h-2 rounded-full bg-[#6b705c] animate-pulse-subtle"
                    style={{ animationDelay: "600ms" }}
                  />
                </>
              )}
            </div>

            <div
              className={`
              w-14 h-14 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-600
              transition-all duration-300
              ${
                isUploading
                  ? "bg-[#5E7361] text-black"
                  : isDragOver
                    ? "scale-110 bg-[#4f6052] text-black"
                    : "bg-[#EAE6E1] text-[#5E7361]"
              }
            `}
            >
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : isDragOver ? (
                <ImagePlus className="w-6 h-6" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            <h3
              className={`
              text-xl font-medium mb-2 transition-colors duration-300
              ${isDragOver ? "text-[#5E7361]" : "text-gray-900"}
            `}
            >
              {isUploading
                ? "Uploading..."
                : isDragOver
                  ? "Release to upload"
                  : "Drop your room photo here"}
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {isUploading
                ? "Please wait while we process your image"
                : "or click to browse from your device"}
            </p>

            {uploadError && (
              <p className="mb-4 text-center text-sm font-medium text-red-800">
                {uploadError}
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-2">
              {["JPG", "PNG", "WEBP"].map((format) => (
                <span
                  key={format}
                  className="px-3 py-1 text-xs font-medium rounded-full border border-gray-300 bg-white mb-4 text-gray-700"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>

        </label>
    </div>
  );
}
