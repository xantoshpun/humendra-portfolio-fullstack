"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { requestUploadUrl } from "@/app/admin/_actions/upload";
import { Button } from "@/components/ui/button";

const MAX_SIZE = 5_000_000;

export function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFile(file: File) {
    if (file.size > MAX_SIZE) {
      toast.error("File exceeds 5 MB limit");
      return;
    }

    setIsUploading(true);
    try {
      const res = await requestUploadUrl({
        filename: file.name,
        contentType: file.type,
        size: file.size,
      });

      if (!res.ok) {
        toast.error(res.message);
        return;
      }

      const upload = await fetch(res.url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!upload.ok) {
        toast.error("Upload failed — try again");
        return;
      }

      onChange(res.publicUrl);
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed — try again");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      {value && (
        <div className="relative w-48 h-28 rounded-md overflow-hidden border bg-muted">
          <Image src={value} alt="Thumbnail preview" fill className="object-cover" />
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
        </Button>
        {value && !isUploading && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
          >
            Remove
          </Button>
        )}
      </div>
      {value && (
        <p className="text-xs text-muted-foreground break-all">{value}</p>
      )}
    </div>
  );
}
