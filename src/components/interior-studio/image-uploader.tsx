"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, ImagePlus, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
}

const MAX_UPLOAD_BYTES = 3.5 * 1024 * 1024; // Stay comfortably under common 4MB-ish limits.
const MAX_DIMENSION = 2048;
const JPEG_QUALITY = 0.82;

const readImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read image file"));
    };
    image.src = objectUrl;
  });

const blobToFile = (blob: Blob, originalFileName: string): File => {
  const normalizedName = originalFileName.replace(/\.[^/.]+$/, "");
  return new File([blob], `${normalizedName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
};

const resizeAndCompressImage = async (file: File): Promise<File> => {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please upload a valid image file");
  }

  if (file.size <= MAX_UPLOAD_BYTES) return file;

  const image = await readImage(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to process image for upload");
  }

  context.drawImage(image, 0, 0, width, height);

  let quality = JPEG_QUALITY;
  let compressedBlob: Blob | null = null;

  while (quality >= 0.55) {
    compressedBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", quality);
    });

    if (compressedBlob && compressedBlob.size <= MAX_UPLOAD_BYTES) {
      break;
    }
    quality -= 0.1;
  }

  if (!compressedBlob) {
    throw new Error("Unable to compress image for upload");
  }

  return blobToFile(compressedBlob, file.name);
};

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
        const processedFile = await resizeAndCompressImage(file);
        const formData = new FormData();
        formData.append("file", processedFile);

        const response = await fetch("/api/ai-interior-upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const responseText = await response.text();
          let message = "Failed to upload image";

          try {
            const parsed = JSON.parse(responseText) as { error?: string };
            if (parsed.error) message = parsed.error;
          } catch {
            if (response.status === 413) {
              message = "Image is too large. We compressed it, but please try a smaller image.";
            } else if (responseText.trim()) {
              message = responseText.trim();
            }
          }

          throw new Error(message);
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
                ? "Please wait while we optimize and upload your image"
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
