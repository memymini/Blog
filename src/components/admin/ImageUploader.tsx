"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Upload } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ImageUploader({
  name,
  value,
  onChange,
  label = "Image URL",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: "POST",
        body: file,
      });
      const newBlob = await response.json();
      onChange(newBlob.url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <div className="flex gap-2">
        <Input
          type="text"
          name={name}
          placeholder="/images/blog/..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <label className="flex cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 whitespace-nowrap">
          {isUploading ? (
            "..."
          ) : (
            <>
              <Upload size={16} className="mr-2" />
              Upload
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            disabled={isUploading}
            onChange={handleUpload}
          />
        </label>
      </div>
      {value && (
        <div className="mt-2 relative h-40 w-full overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
          <Image
            src={value}
            alt="Preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
